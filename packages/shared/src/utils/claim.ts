import type { Ref } from 'vue'
import { baseClaimRewardsPABI } from 'shared/src/partial-abis/base-claim-reward'
import { prepareForTransaction, TWeb3Libs, checkNetwork } from 'shared/src/utils/evmTxs'
import { fetchWAuth } from './auth';
import type { IMainStore } from '../types/store';
import type { TClaim } from 'shared/src/types/claim'

const CHAIN_ID = 8453
const CLIAM_CONTRACT_ADDRESS = '0xC2263b9E4EceF018E78b48FC632DDffEE0c0FE51'
const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const onReward = async ({
    stackAlertWarning,
    Web3Libs,
    stackAlertSuccess,
    reward,
    rewardLoading
}: {
    stackAlertWarning?: (msg: string) => void
    Web3Libs: Ref<TWeb3Libs>
    stackAlertSuccess?: (msg: string) => void
        reward: TClaim
    rewardLoading: Ref<boolean>
}) => {
    rewardLoading.value = true
    const wgamiLib = (await prepareForTransaction({
        localWeb3Libs: Web3Libs.value,
        stackAlertWarning,
    }))

    if (!(wgamiLib)) {
        rewardLoading.value = false
        return false
    }

    const ethersPromise = import('ethers')

    try {
        if (!await checkNetwork({ wgamiLib, stackAlertWarning, switchTo: CHAIN_ID })) {
            rewardLoading.value = false
            return
        }

        const args = [reward.recipient, reward.value, reward.deadline, reward.signature]

        await wgamiLib.wgamiCore.writeContract(wgamiLib.wgConfig.wagmiConfig, {
            abi: baseClaimRewardsPABI,
            address: CLIAM_CONTRACT_ADDRESS as '0x',
            functionName: 'redeemAllocation',
            args,
        })

        if (stackAlertSuccess) {

            const etheres = await ethersPromise
            const amount = etheres.formatEther(BigInt(reward.value))

            stackAlertSuccess('Claimed ' + amount + ' tokens')
        }

    } catch (e) {
        stackAlertWarning && stackAlertWarning('User rejected the transaction')
        console.error('Failed to claim reward', e)
        return false
    }
    rewardLoading.value = false
    return true
}


export const fetchUnclaimedReward = async (apiBase: string = API_BASE, store: IMainStore): Promise<TClaim> => {

    const result = {
        value: '0',
        deadline: '',
        nonce: '',
        recipient: '',
        signature: ''
    } as TClaim

    try {
        const res = await fetchWAuth(store, `${apiBase}/rewards`)
        const req = await res.json()
        return req as TClaim
    } catch (error) {
        console.error('Failed to fetch rewards', error)
        return result
    }
}

