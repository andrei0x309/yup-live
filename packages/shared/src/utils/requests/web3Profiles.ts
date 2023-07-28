import type { IWeb3Profile } from '../../types/web3Profile'
import { fetchWAuth } from '../auth'
import type { IMainStore } from 'shared/src/types/store'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export const fetchWeb3Profile = async (apiBase: string = API_BASE, address: string): Promise<IWeb3Profile | null> => {
    try {
        const res = await fetch(`${apiBase}/web3-profiles/${address}`)
        const req = await res.json()
        if (res.ok) {
            req.evmAddress = address
            return req
        } else {
            return null
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return null
    }
}

export const fetchRecommendedWeb3Profiles = async (apiBase: string = API_BASE, store: IMainStore | null = null, limit = 28):
    Promise<IWeb3Profile[] | null> => {
    try {
        let res
        if (store?.userData?.authToken) {
            res = await fetchWAuth(store, `${apiBase}/web3-profiles/recommended?limit=${limit}`)
        } else {
            res = await fetch(`${apiBase}/web3-profiles/recommended?limit=${limit}`)
        }
        const req = await res.json()
        if (res.ok) {
            return req
        } else {
            return []
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return []
    }
}

export const getProfilesData = async (accounts: string[]) => {
    return (await Promise.all(
        accounts.map(async (a) => {
            return await fetchWeb3Profile(API_BASE, a)
        })
    )).filter((p) => p) as IWeb3Profile[]
}
