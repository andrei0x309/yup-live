import { config } from './config'

const { API_BASE } = config

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

export const FCSendCast = async (fcToken: string, text: string, base?: string): Promise<
    {
        error: boolean,
        message: string
    }> => {
    return new Promise(async (resolve) => {
        try {
            const req = await fetch(`${base ? base : API_BASE}/proxy/farcaster/v2/cast`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + fcToken
                },
                body: JSON.stringify({
                    text
                })
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

