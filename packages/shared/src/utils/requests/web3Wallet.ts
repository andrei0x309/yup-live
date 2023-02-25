import { config } from '../config'
const API_BASE = config.API_BASE || ''

export const resources = ['nfts', 'poaps', 'tokens']
export const chains = ['ethereum', 'polygon']

export const fetchFromWallet = async ({
    apiBase = API_BASE,
    address,
    resource = resources[0],
    chain = chains[0],
    start = 0,
    limit = 10,
}: {
    apiBase?: string
    address: string
    resource?: string
    chain?: string
    start?: number
    limit?: number
}) => {
    try {
        const res = await fetch(`${apiBase}/web3-profiles/${resource}/${address}?chain=${chain}&start=${start}&limit=${limit}`)
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
