import { fetchWAuth } from '../auth'
import type { IFollowersResponse } from '../../types/web3Profile'
import type { IMainStore } from 'shared/src/types/store'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const getFollowers = async (apiBase = API_BASE, address: string, start = 0, limit = 10) => {
    try {
        const res = await fetch(`${apiBase}/web3-follows/followers/${address}?start=${start}&limit=${limit}`)
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

export const getFollowing = async (apiBase = API_BASE, address: string): Promise<null | IFollowersResponse> => {
    try {
        const res = await fetch(`${apiBase}/web3-follows/following/${address}`)
        const req = await res.json()
        if (res.ok) {
            return req as IFollowersResponse
        } else {
            return null
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return null
    }
}

export const isFollowing = async (apiBase = API_BASE, address: string, followerAddress: string): Promise<boolean> => {
    try {
        const res = await fetch(`${apiBase}/web3-follows/is-following/${followerAddress}?address=${address}`)
        const req = await res.json()
        if (res.ok) {
            return req.isFollowing
        } else {
            return false
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return false
    }
}

export const follow = async (apiBase = API_BASE, store: IMainStore, address: string): Promise<boolean> => {
    try {
        const res = await fetchWAuth(store, `${apiBase}/web3-follows?address=${address}`, {
            method: 'POST',
        })
        const req = await res.json()
        if (res.ok) {
            return req
        } else {
            return false
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return false
    }
}

export const unfollow = async (apiBase = API_BASE, store: IMainStore, address: string): Promise<boolean> => {
    try {
        const res = await fetchWAuth(store, `${apiBase}/web3-follows?address=${address}`, {
            method: 'DELETE',
        })
        const req = await res.json()
        if (res.ok) {
            return req
        } else {
            return false
        }
    } catch (error) {
        console.error('Failed to fetch web3 profiles', error)
        return false
    }
}
