import { fetchWAuth } from './auth'
import { wait } from './time'
import type { IMainStore } from '../types/store'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const notificationTypes = ['reward', 'vote', 'follow', 'repost', 'comment', 'mention']
export const notificationPlatforms = ["lens", "farcaster", "yup", "bsky"] as const;

export const getNotifications = async (
    { type, limit, start, address } = { type: null, limit: '10', start: '0' } as { address: string, type: null | string[]; limit?: string; start?: string }
) => {
    let req
    let queryType = ''
    if (!address) {
        return false
    }

    if (!type) {
        type = notificationTypes
    }

    if (type) {
        queryType = `&eventTypes=${type.join(',')}`
    }
    if (!limit) {
        limit = '10'
    }

    if (!start) {
        start = '0'
    }

    req = await fetch(`${API_BASE}/web3-notifications/${address}?start=${start}&limit=${limit}${queryType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })

    if (!req.ok) {
        return false
    }
    const data = await req.json()
    return data
}

export const getNotificationsCount = async (address: string) => {
    const req = await fetch(`${API_BASE}/web3-notifications/${address}`)

    if (req.status === 200) {
        const data = await req.json()
        const notNum = data.filter((not: { seen: boolean }) => not.seen === false).length
        const hasNewNot = notNum > 0
        let notDisplay
        if (notNum > 9) {
            notDisplay = '9+'
        } else {
            notDisplay = notNum.toString()
        }
        return { notNum, hasNewNot, notDisplay }
    }
    return { notNum: 0, hasNewNot: false, notDisplay: '0' }
}

export const clearNotifications = async (store: IMainStore) => {
    let req
    let failed = true
    let retry = 0
    do {
        try {
            failed = false
            req = await fetchWAuth(store, `${API_BASE}/web3-notifications/seen/all`, {
                method: 'POST',
            })
        } catch {
            failed = true
            retry++
            if (retry > 3) {
                return
            }
            await wait(1500)
        }
    } while (failed)

    if (!req) {
        return
    }
    if (!req.ok) {
        return
    }
    return await req.json()
}
