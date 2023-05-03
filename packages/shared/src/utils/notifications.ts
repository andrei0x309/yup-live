import { fetchWAuth } from './auth'
import { wait } from './time'
import type { IMainStore } from '../types/store'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const notificationTypes = ['vote', 'reward', 'all-followers', 'follow', 'unfollow']

export const getNotifications = async (
    { type, limit, skip, userId } = { type: null, limit: '10', skip: '0' } as { userId: string, type: null | string[]; limit?: string; skip?: string }
) => {
    let req
    let queryType = ''
    if (type) {
        queryType = `&inType=${type.join(',')}`
    }
    if (!limit) {
        limit = '10'
    }

    if (!skip) {
        skip = '0'
    }

    req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}${queryType}`, {
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

export const getNotificationsCount = async (userId: string) => {
    const req = await fetch(`https://api.yup.io/notifications/${userId}`)

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
            req = await fetchWAuth(store, `${API_BASE}/notifications/${store.userData.account}`)
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

    retry = 0

    if (req.ok) {
        const notif = await req.json()

        for (const n of notif) {
            if (!n.seen) {
                const data = {
                    id: n['_id']
                }
                failed = true
                do {
                    try {
                        failed = false
                        await fetchWAuth(store, `${API_BASE}/notifications/seen`, {
                            method: 'POST',
                            body: JSON.stringify(data)
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
            }
        }
    }
}
