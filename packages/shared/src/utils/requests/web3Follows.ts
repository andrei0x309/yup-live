import { config } from '../config'
import { fetchWAuth } from '../auth'
import type { IFollowersResponse } from '../../types/web3Profile'

const API_BASE = config.API_BASE || ''

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