import { fetchWAuth } from '../auth'
import type { IMainStore } from '../../types/store'

const API_BASE = (import.meta.env.VITE_YUP_API_BASE).replace('api.', 'dev.api.')

export const addAdmin = async ({
    store,
    address,
}: {
    store: IMainStore
    address: string
}): Promise<boolean> => {
    try {

        const res = await fetchWAuth(store, `${API_BASE}/accounts/add-admin`, {
            method: 'POST',
            body: JSON.stringify({ address }),
        })
        if (!res.ok) {
            console.error('addAdmin: not 200', res)
            return false
        }
        return true
    } catch (e) {
        console.error('addAdmin exception', e)
        return false
    }
}


export const removeAdmin = async ({
    store,
    address,
}: {
    store: IMainStore
    address: string
}): Promise<boolean> => {
    try {

        const res = await fetchWAuth(store, `${API_BASE}/accounts/remove-admin`, {
            method: 'DELETE',
            body: JSON.stringify({ address }),
        })
        if (!res.ok) {
            console.error('addAdmin: not 200', res)
            return false
        }
        return true
    } catch (e) {
        console.error('addAdmin exception', e)
        return false
    }
}


export const getAdmins = async ({
    store
}: {
    store: IMainStore
}): Promise<string[]> => {
    try {

        const res = await fetchWAuth(store, `${API_BASE}/accounts/admins`, {
            method: 'GET',
        })
        if (!res.ok) {
            console.error('addAdmin: not 200', res)
            return [] as string[]
        }
        return (await res.json()).admins as string[]
    } catch (e) {
        console.error('addAdmin exception', e)
        return [] as string[]
    }
}

