import { config } from '../config'
import { getFidByToken } from '../farcaster'
import { fetchWAuth } from '../auth'
import type { IMainStore } from 'shared/src/types/store'

const API_BASE = config.API_BASE || ''

export const getComments = async (apiBase: string = API_BASE, thread: string) => {
    try {
        const req = await fetch(`${apiBase}/farcaster/v2/thread-casts?castHash=${thread}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if (req.ok) {
            const result = await req.json()
            return {
                comments: result?.result?.casts ?? [],
                numComments: result?.result?.casts.length ?? 0,
            }
        } else {
            null
        }
    } catch (error) {
        console.error('Failed to fetch comments', error)
        return null
    }
}

export const farcasterAuthCheck = async (store: IMainStore, apiBase: string = API_BASE) => {
    const farcaster = localStorage.getItem("farcaster");
    if (farcaster) {
        store.farcaster = farcaster;
        const fid = localStorage.getItem("fid");
        if (fid) {
            store.fid = fid;
        } else {
            getFidByToken(farcaster, apiBase).then((fid) => {
                if (fid) {
                    store.fid = fid as string;
                    localStorage.setItem("fid", fid as string);
                }
            });
        }
    } else {
        fetchWAuth(store, `${apiBase}/accounts/social/list`).then(
            async (res) => {
                try {
                    const req = await res.json();
                    if (res.ok) {
                        if (req?.social?.farcaster) {
                            store.farcaster = req.social.farcaster;
                            localStorage.setItem("farcaster", req.social.farcaster);
                            getFidByToken(req.social.farcaster, API_BASE).then((fid) => {
                                if (fid) {
                                    store.fid = fid as string;
                                    localStorage.setItem("fid", fid as string);
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse farcaster", error);
                }
            }
        );
    }
}
