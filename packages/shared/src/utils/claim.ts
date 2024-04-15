import type { Ref } from 'vue'
import { baseClaimRewardsPABI } from 'shared/src/partial-abis/base-claim-reward'
import { prepareForTransaction, TWeb3Libs, checkNetwork } from 'shared/src/utils/evmTxs'
import { fetchWAuth } from './auth';
import type { IMainStore } from '../types/store';

const SEPOLIA_BASE_RPC = 'https://sepolia.base.org'
const CHAIN_ID = 84532
const CLIAM_CONTRACT_ADDRESS = '0x5ed34cE35B93606D20175187E909F19aB6a93f50'
const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const onReward = async ({
    stackAlertWarning,
    Web3Libs,
    stackAlertSuccess,
    claimString,
    rewardLoading
}: {
    stackAlertWarning?: (msg: string) => void
    Web3Libs: Ref<TWeb3Libs>
    stackAlertSuccess?: (msg: string) => void
    claimString: string
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

        await wgamiLib.wgamiCore.writeContract(wgamiLib.wgConfig.wagmiConfig, {
            abi: baseClaimRewardsPABI,
            address: CLIAM_CONTRACT_ADDRESS as '0x',
            functionName: 'claimTokens',
            args: [claimString],
        })

        if (stackAlertSuccess) {

            const etheres = await ethersPromise
            const amountStr = claimString.split('|')[0]
            const amount = etheres.formatEther(BigInt(amountStr))

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


export const fetchUnclaimedReward = async (apiBase: string = API_BASE, address: string): Promise<{
    unclaimedYUP: number
    lastRewardClaim: Date
    lastRewardClaimString: string
}> => {

    const result = {
        unclaimedYUP: 0,
        lastRewardClaim: new Date(0),
        lastRewardClaimString: '',
    }

    try {
        const res = await fetch(`${apiBase.replace('api.', 'dev.api.')}/rewards/unclaimed/${address}`)
        const req = await res.json()
        if (res.ok) {
            result.unclaimedYUP = req.unclaimedYUP
            result.lastRewardClaim = new Date(req.lastRewardClaim)
            result.lastRewardClaimString = req.lastRewardClaimString
            return result
        } else {
            return result
        }
    } catch (error) {
        console.error('Failed to fetch rewards', error)
        return result
    }
}


export const fetchClaimString = async (apiBase: string = API_BASE, store: IMainStore): Promise<string> => {
    try {
        const res = await fetchWAuth(store, `${apiBase.replace('api.', 'dev.api.')}/rewards/claim`)
        const req = await res.json()
        return req.claimString
    } catch (error) {
        console.error('Failed to fetch claim string', error)
        return ''
    }
}
