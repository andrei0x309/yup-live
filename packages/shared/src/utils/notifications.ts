import { fetchWAuth } from './auth'
import { wait } from './time'
import type { IMainStore } from '../types/store'
import type { Ref } from 'vue'
import type { NotifType } from '../types/notification'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const types = {
    "0": null,
    "1": "vote",
    "2": "reward",
    "3": "follow",
}

export const notificationTypes = ['reward', 'vote', 'follow', 'repost', 'comment', 'mention', 'unfollow']
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
    try {
        if (!address) return { notNum: 0, hasNewNot: false, notDisplay: '0' }
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
    } catch {
        return { notNum: 0, hasNewNot: false, notDisplay: '0' }
    }
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

export const loadMore = async ({
    loadingMore,
    hasMore,
    notifications,
    address,
    activeTab,
}: {
    loadingMore: Ref<boolean>;
    hasMore: Ref<boolean>;
    notifications: Ref<NotifType[]>;
    address: string;
    activeTab: Ref<string>;
}) => {
    loadingMore.value = true;
    const notifs = await getNotifications({
        address,
        type: activeTab.value === "0" ? null : [types[activeTab.value as "1" | "2" | "3"] as string],
        start: String(notifications.value.length),
    })
    if (notifs.length < 10) {
        hasMore.value = false;
    }

    notifications.value = notifications.value.concat(
        notifs
    );
    loadingMore.value = false;
};