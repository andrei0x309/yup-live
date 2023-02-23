import { config } from '../config'
import { getFidByToken } from '../farcaster'
import { fetchWAuth } from '../auth'
import type { IMainStore } from 'shared/src/types/store'

const { API_BASE } = config


export const farcasterAuthCheck = async (store: IMainStore) => {
    const farcaster = localStorage.getItem("farcaster");
    if (farcaster) {
        store.farcaster = farcaster;
        const fid = localStorage.getItem("fid");
        if (fid) {
            store.fid = fid;
        } else {
            getFidByToken(farcaster, API_BASE).then((fid) => {
                if (fid) {
                    store.fid = fid as string;
                    localStorage.setItem("fid", fid as string);
                }
            });
        }
    } else {
        fetchWAuth(store, `${API_BASE}/accounts/social/list`).then(
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
