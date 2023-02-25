import { config } from '../config'

const API_BASE = config.API_BASE || ''

export const utilsAFGetCreated = async (apiBase = API_BASE, start = 0, evmAddress: string) => {
    const res = await fetch(
        `${apiBase}/profile/posts/${evmAddress}?start=${start}&limit=10`
    );
    return await res.json();
};
