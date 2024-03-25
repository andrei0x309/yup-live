
import { prepareForTransaction, signCanonChallenge, TWeb3Libs } from '../evmTxs'
import { arrayify } from '@ethersproject/bytes'
import type { IMainStore } from 'shared/src/types/store'


const buffer = import("buffer/");
const EIP_191_PREFIX = "eip191:";
const WARPCAST_API = 'https://client.warpcast.com/v2'

export const generateApiToken = async ({
    web3Libs,
    store,
    timestamp
}: {
    web3Libs: TWeb3Libs
    store: IMainStore
    apiBase?: string
    timestamp?: number
}) => {
    try {
        const wgamiLib = (await prepareForTransaction({
            localWeb3Libs: web3Libs,
        }))
        if (!(wgamiLib)) {
            return null
        }
        const wgamiCore = wgamiLib.wgamiCore
        timestamp = Date.now();
        const payload = {
            method: "generateToken",
            params: {
                timestamp,
                expiresAt: 1777046287381
            },
        };
        const sig = await signCanonChallenge(payload, wgamiLib.wgConfig.wagmiConfig, wgamiCore.signMessage);
        if (!sig) {
            return false;
        }

        const bufferLib = (await buffer).Buffer;
        const signatureString = bufferLib
            .from(arrayify(sig)).toString('base64');
        const cusAuth = EIP_191_PREFIX + signatureString;

        const req = await fetch(`${WARPCAST_API}/auth`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cusAuth}`,
            },
            body: JSON.stringify(payload),
        });
        if (req.ok) {
            const data = await req.json();
            const token = data?.result?.token?.secret;
            let fid: Promise<string | null> | null = null;
            if (token) {
                const dataTosend = {
                    auth: {
                        farcaster: {
                            appToken: token,
                        },
                    },
                };
                // fid = getFidByToken(token, API_BASE) as Promise<string | null>;
                // fid.then(fid => {
                //     if (fid) {
                //         store.fid = fid as string;
                //         localStorage.setItem("fid", fid as string);
                //     }
                // })
                return dataTosend;
            }
            return null;
        }
        return null;
    } catch (error) {
        console.error('Failed to generate api token', error)
        return null
    }
}
