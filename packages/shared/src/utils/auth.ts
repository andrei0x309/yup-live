import type { IMainStore } from '../types/store'

export const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// export const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWAuth = (store: IMainStore, endpoint: string, options?: any, noHeader = false) => {
    if (!options) options = {}
    if (!options.headers) options.headers = {}
    if (!options.headers['Content-Type'] && !noHeader) options.headers['Content-Type'] = 'application/json'
    const token = store.userData.authToken
    if (!options.headers['Authorization']) options.headers['Authorization'] = 'Bearer ' + token
    return fetch(endpoint, options)
}

export const requestLoginCode = async ({ store }: { store: IMainStore }) => {
    const req = await fetchWAuth(store, `${API_BASE}/mobile/login-code/create`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if (req.ok) {
        const res = await req.json()
        return {
            code: res.code,
            expiresAt: Date.now() + 600000
        }
    }
    return null
}

export const verifyLoginCode = async ({ store, code }: { store: IMainStore, code: string }) => {
    const req = await fetchWAuth(store, `${API_BASE}/mobile/login-code/verify/${code}`)
    if (req.ok) {
        const res = await req.json()
        return res
    }
    return null
}

export const getWeb3Auth = async ({ store }: { store: IMainStore }) => {
    const req = await fetchWAuth(store, `${API_BASE}/web3-auth`)
    if (req.ok) {
        const res = await req.json()
        return res
    }
    return null
}