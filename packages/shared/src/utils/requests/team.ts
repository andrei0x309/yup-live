import { fetchWAuth } from '../auth'
import type { IMainStore } from '../../types/store'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// const API_BASE = (import.meta.env.VITE_YUP_API_BASE).replace('api.', 'dev.api.')
// const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');


type T_FAIL = {
    failed: number,
    attempts: number,
    failRate: number,
}

export type T_CrossPostEvent = {
    _id: string,
    type: 'attempt' | 'success' | 'failure'
    fullStatus?: string
    platforms: string[]
    platformsFailed: string[]
    owner: string
    createdAt: Date
    updatedAt: Date
}

export const getStats = async ({
    store,
    dateStart,
    dateEnd,
}: {
    store: IMainStore
    dateStart: string
    dateEnd: string
}): Promise<false | T_FAIL> => {
    try {
        const res = await fetchWAuth(store, `${API_BASE}/crosspost-events/stats?startDate=${dateStart}&endDate=${dateEnd}`, {
            method: 'GET'
        })
        if (!res.ok) {
            console.error('crosspost-events/stats', res)
            return false
        }
        return await res.json() as T_FAIL
    } catch (e) {
        console.error('crosspost-events/stats', e)
        return false
    }
}

export const listFailed = async ({
    store,
    offset,
}: {
    store: IMainStore
    offset?: number
}): Promise<false | T_CrossPostEvent[]> => {
    try {
        if (!offset) offset = 0
        const res = await fetchWAuth(store, `${API_BASE}/crosspost-events/list-failed?offset=${offset}&limit=10`, {
            method: 'GET',
        })
        if (!res.ok) {
            console.error('crosspost-events/list-failed: not 200', res)
            return false
        }
        return await res.json() as T_CrossPostEvent[]
    } catch (e) {
        console.error('crosspost-events/list-failed', e)
        return false
    }
}
