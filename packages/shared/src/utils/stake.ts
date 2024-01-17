import type { Ref } from 'vue'
const RW_API_BASE = 'https://rewards-manager.yup.io'
import { getPolyContractAddresses } from '@yupio/contract-addresses'
import { uniPoolPABI } from 'shared/src/partial-abis/uni-pool'
import { yupRewardsPABI } from 'shared/src/partial-abis/yup-rewards'
import { prepareForTransaction, tryToGetAddressWithoutPrompt, TWeb3Libs } from 'shared/src/utils/evmTxs'
const POLY_RPC = import.meta.env.VITE_POLYGON_RPC
// const HISTORIC_REWARDS_ENDPOINT = 'https://yup-lp-historic-rewards.deno.dev'

const ethers = import('ethers')

type ethersType = Awaited<typeof ethers>['ethers']
type JsonRpcProvider = InstanceType<ethersType['JsonRpcProvider']>

const { POLY_LIQUIDITY_REWARDS, POLY_UNI_LP_TOKEN } = getPolyContractAddresses(137)

let rewardRatePoly = 0
let totalStakePoly = 0
let rewardsPoly = 0
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ethersLib: ethersType
let ethersProvider: JsonRpcProvider
let startNumberTimeout = 0
let rewardsRate = 0


export const getAprs = async ({
    stackAlertWarning
}: {
    stackAlertWarning?: (msg: string) => void
}) => {
    const req1 = fetch(`${RW_API_BASE}/aprs/eth`);
    const req2 = fetch(`${RW_API_BASE}/aprs/poly`);
    const [eth, poly] = await Promise.allSettled([req1, req2]);
    const aprs = {} as Record<string, string>;
    aprs.eth = "0";
    aprs.poly = "0";
    if (eth.status === 'fulfilled') {
        aprs.eth = Number(await eth.value.text()).toFixed(3);
    }
    if (poly.status === 'fulfilled') {
        aprs.poly = Number(await poly.value.text()).toFixed(3);
    }
    if (eth.status === 'rejected' || poly.status === 'rejected') {
        stackAlertWarning && stackAlertWarning('APRs APIs are down right now.')
    }
    return aprs;
};

const startNumber = async ({
    rate,
    rewards
}: {
    rate: number
    rewards: Ref<number>
}) => {
    startNumberTimeout = setTimeout(() => {
        rewards.value += rate
        startNumber({ rate, rewards })
    }, 400) as unknown as number
}

const clearStartNumber = () => {
    if (startNumberTimeout && rewardsRate) {
        clearTimeout(startNumberTimeout)
    }
}

export const fetchContractsData = ({
    address,
    polyStaked,
    polyUnstaked,
    rewards,
    poolShare,
    Web3Libs
}: {
    address: Ref<string>
    polyStaked: Ref<number>
    polyUnstaked: Ref<number>
    rewards: Ref<number>
    poolShare: Ref<number>
    Web3Libs: Ref<TWeb3Libs>
}) => {
    ethers.then(async (lib) => {
        ethersLib = lib.ethers
        ethersProvider = new ethersLib.JsonRpcProvider(POLY_RPC)
        const UNIContractPoly = new ethersLib.Contract(POLY_UNI_LP_TOKEN, uniPoolPABI, ethersProvider)
        const YUPRewardsPoly = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, ethersProvider)

        if (!address.value) {
            address.value = await tryToGetAddressWithoutPrompt({ localWeb3Libs: Web3Libs.value }) as string
            if (!address.value) {
                return
            }
        }
        // if (address.value) {
        //   getHistoricRewards(address.value)
        // }

        const arrProm = [
            UNIContractPoly.balanceOf(address.value),
            YUPRewardsPoly.balanceOf(address.value),
            YUPRewardsPoly.earned(address.value),
            YUPRewardsPoly.rewardRate(),
            UNIContractPoly.balanceOf(POLY_LIQUIDITY_REWARDS)
        ]

        Promise.all(arrProm).then((res) => {
            polyUnstaked.value = Number(ethersLib.formatEther(res[0]))
            polyStaked.value = Number(ethersLib.formatEther(res[1]))
            rewardsPoly = Number(ethersLib.formatEther(res[2]))
            rewards.value = rewardsPoly
            rewardRatePoly = Number(ethersLib.formatEther(res[3]))
            totalStakePoly = Number(ethersLib.formatEther(res[4]))
            rewardsRate = (rewardRatePoly * polyStaked.value) / totalStakePoly
            startNumber({
                rate: rewardsRate,
                rewards
            })
            if (polyStaked.value && totalStakePoly) {
                poolShare.value = (100 * polyStaked.value) / totalStakePoly
            }
        })
    })
}

export const onStake = async ({
    stackAlertWarning,
    inputValue,
    Web3Libs,
    stackAlertSuccess,
    address,
    polyStaked,
    polyUnstaked,
    rewards,
    poolShare,
}: {
    stackAlertWarning?: (msg: string) => void
    inputValue: Ref<string>
    Web3Libs: Ref<TWeb3Libs>
    stackAlertSuccess?: (msg: string) => void
    address: Ref<string>
    polyStaked: Ref<number>
    polyUnstaked: Ref<number>
    rewards: Ref<number>
    poolShare: Ref<number>
}) => {
    const wgamiLib = (await prepareForTransaction({
        localWeb3Libs: Web3Libs.value,
        stackAlertWarning,
    }))
    if (!(wgamiLib)) {
        return null
    }
    try {
        const amount = ethersLib.parseEther(inputValue.value.toString())

        await wgamiLib.wgamiCore.writeContract({
            abi: uniPoolPABI,
            address: POLY_UNI_LP_TOKEN as '0x',
            functionName: 'approve',
            args: [POLY_LIQUIDITY_REWARDS, amount]
        })

        await wgamiLib.wgamiCore.writeContract({
            abi: yupRewardsPABI,
            address: POLY_LIQUIDITY_REWARDS as '0x',
            functionName: 'stake',
            args: [amount]
        })

        stackAlertSuccess && stackAlertSuccess(`You staked ${inputValue.value} LPT successfuly`)
        fetchContractsData({
            address,
            polyStaked,
            polyUnstaked,
            rewards,
            poolShare,
            Web3Libs
        })
    } catch (e) {
        console.log(e)
        stackAlertWarning && stackAlertWarning('User rejected or tx failed')
    }
}

export const onUnstake = async ({
    stackAlertWarning,
    inputValue,
    Web3Libs,
    stackAlertSuccess,
    address,
    polyStaked,
    polyUnstaked,
    rewards,
    poolShare,
}: {
    stackAlertWarning?: (msg: string) => void
    inputValue: Ref<string>
    Web3Libs: Ref<TWeb3Libs>
    stackAlertSuccess?: (msg: string) => void
    address: Ref<string>
    polyStaked: Ref<number>
    polyUnstaked: Ref<number>
    rewards: Ref<number>
    poolShare: Ref<number>
}) => {
    const wgamiLib = (await prepareForTransaction({
        localWeb3Libs: Web3Libs.value,
        stackAlertWarning,
    }))
    if (!(wgamiLib)) {
        return null
    }

    try {
        const willSusbstractPoly = Number(inputValue.value)
        await wgamiLib.wgamiCore.writeContract({
            abi: yupRewardsPABI,
            address: POLY_LIQUIDITY_REWARDS as '0x',
            functionName: 'unstake',
            args: [ethersLib.parseEther(inputValue.value.toString())]
        })
        if (willSusbstractPoly > 0) {
            polyStaked.value -= willSusbstractPoly
        }
        stackAlertSuccess && stackAlertSuccess(`You unstaked ${inputValue.value} LPT successfuly`)
        fetchContractsData({
            address,
            polyStaked,
            polyUnstaked,
            rewards,
            poolShare,
            Web3Libs
        })
    } catch {
        stackAlertWarning && stackAlertWarning('User rejected or tx failed')
    }
}

export const onReward = async ({
    stackAlertWarning,
    Web3Libs,
    stackAlertSuccess,
    address,
    polyStaked,
    polyUnstaked,
    rewards,
    poolShare,
}: {
    stackAlertWarning?: (msg: string) => void
    Web3Libs: Ref<TWeb3Libs>
    stackAlertSuccess?: (msg: string) => void
    address: Ref<string>
    polyStaked: Ref<number>
    polyUnstaked: Ref<number>
    rewards: Ref<number>
    poolShare: Ref<number>
}) => {
    const wgamiLib = (await prepareForTransaction({
        localWeb3Libs: Web3Libs.value,
        stackAlertWarning,
    }))
    if (!(wgamiLib)) {
        return null
    }

    try {
        if (rewardsPoly > 0) {
            await wgamiLib.wgamiCore.writeContract({
                abi: yupRewardsPABI,
                address: POLY_LIQUIDITY_REWARDS as '0x',
                functionName: 'getReward',
            })

        }
        if (rewardsPoly > 0) {
            stackAlertSuccess && stackAlertSuccess(`You collected a reward of ${rewardsPoly}`)
            if (rewardsPoly > 0) {
                // historicPolyReward.value += rewardsPoly
                clearStartNumber()
                rewards.value = 0
                rewardsPoly = 0
                startNumber({
                    rate: rewardsRate,
                    rewards
                })
            }
            fetchContractsData({
                address,
                polyStaked,
                polyUnstaked,
                rewards,
                poolShare,
                Web3Libs
            })
        } else {
            stackAlertWarning && stackAlertWarning("You don't have anything to collect")
        }
    } catch {
        stackAlertWarning && stackAlertWarning('User rejected the transaction')
    }
}



export const connect = async ({
    stackAlertWarning,
    Web3Libs,
    address,
    polyStaked,
    polyUnstaked,
    rewards,
    poolShare,
    loading
}: {
    stackAlertWarning?: (msg: string) => void
    Web3Libs: Ref<TWeb3Libs>
    address: Ref<string>
    polyStaked: Ref<number>
    polyUnstaked: Ref<number>
    rewards: Ref<number>
    poolShare: Ref<number>
    loading: Ref<boolean>
}) => {
    const wgamiLib = (await prepareForTransaction({
        localWeb3Libs: Web3Libs.value,
        stackAlertWarning,

    }))
    if (!(wgamiLib)) {
        return null
    }
    const wgamiCore = wgamiLib.wgamiCore
    address.value = (await wgamiCore.getAccount()).address || ''
    loading.value = true
    await fetchContractsData({
        address,
        polyStaked,
        polyUnstaked,
        rewards,
        poolShare,
        Web3Libs
    })
    loading.value = false
}