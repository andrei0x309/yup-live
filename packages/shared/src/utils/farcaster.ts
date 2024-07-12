import { IMainStore } from '../types/store'
import { fetchWAuth } from './auth';

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const FCReq = async (fcToken: string, endpoint: string, options?: any) => {
    if (!options) options = {}
    if (!options.headers) options.headers = {}
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
    if (!options.headers['Authorization']) options.headers['Authorization'] = 'Bearer ' + fcToken
    return fetch(endpoint, options)
}

export const getFidByToken = async (fcToken: string, base?: string) => {
    return new Promise(async (resolve) => {
        try {
            const req = await fetch(`${base ? base : API_BASE}/proxy/farcaster/v2/me`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + fcToken
                }
            })
            if (req.ok) {
                const data = await req.json()
                resolve(data?.result?.user?.fid)
            } else {
                resolve(false)
            }
        } catch {
            resolve(false)
        }
    })
}

export const getFidByAddress = (store: IMainStore, address: string, base?: string) => {
    return new Promise(async (resolve) => {
        try {
            const req = await fetchWAuth(store, `${base ? base : API_BASE}/farcaster/hub/get-register-by-address/${address}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (req.ok) {
                const data = await req.json()
                resolve(data?.message?.fid)
            } else {
                resolve(false)
            }
        } catch {
            resolve(false)
        }
    })
}

export const FCSendCast = async (fcToken: string, text: string, base?: string, replayTo: { fid: string, hash: string } | null = null): Promise<
    {
        error: boolean,
        message: string
    }> => {
    return new Promise(async (resolve) => {
        try {
            if (!text) {
                resolve({
                    error: true,
                    message: "Cast cannot be empty"
                })
                return
            }
            const body = {
                text
            } as {
                text: string,
                parent: {
                    hash: string,
                    fid: string
                }
            }
            if (replayTo) {
                body.parent = {} as any
                body.parent.hash = replayTo.hash
                body.parent.fid = replayTo.fid
            }
            const req = await fetch(`${base ? base : API_BASE}/proxy/farcaster/v2/casts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + fcToken
                },
                body: JSON.stringify(body)
            })
            if (req.ok) {
                resolve({
                    error: false,
                    message: "Cast sent successfully"
                })
            } else {
                resolve({
                    error: true,
                    message: "Error sending cast: " + await req.text()
                })
            }
        } catch (e) {
            resolve({
                error: true,
                message: "Error sending cast: " + String(e)
            })
        }
    })
}