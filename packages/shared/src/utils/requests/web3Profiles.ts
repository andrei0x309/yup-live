import { config } from '../config'
const API_BASE = config.API_BASE || ''
import type { IWeb3Profile } from '../../types/web3Profile'
import { fetchWAuth } from '../auth'
import type { IMainStore } from 'shared/src/types/store'


export const fetchWeb3Profile = async (apiBase: string = API_BASE, address: string): Promise<IWeb3Profile | null> => {
    try {
        const res = await fetch(`${apiBase}/web3-profiles/${address}`)
        const req = await res.json()
        if (res.ok) {
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
            return null
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return null
    }
}
