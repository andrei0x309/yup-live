import { fetchWAuth } from '../auth'
import type { IMainStore } from 'shared/src/types/store'
import { ref, Ref } from 'vue'
import { prepareForTransaction, TWeb3Libs } from '../evmTxs'
import { getFidByToken, getFidByAddress } from 'shared/src/utils/farcaster';
// import { FCSendCast } from "shared/src/utils/farcaster";
// import { digestSha256 } from "shared/src/utils/misc";
import { wait } from '../time'
import { walletDisconnect } from '../login-signup'
import { TChannel } from 'shared/src/types/web3-posting';

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const EIP_712_FARCASTER_DOMAIN = {
    name: 'Farcaster Verify Ethereum Address',
    version: '2.0.0',
    // fixed salt to minimize collisions
    salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
};

export const EIP_712_FARCASTER_MESSAGE_DATA = [
    {
        name: 'hash',
        type: 'bytes',
    },
];


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

export const makeAddSignerRequest = async (store: IMainStore, apiBase: string = API_BASE) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/farcaster/signer-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        if (req.ok) {
            const result = await req.json()
            return result
        }
        return null
    }
    catch (error) {
        console.error('Failed to make signer request', error)
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
        return true;
    } else {
        const res = await fetchWAuth(store, `${apiBase}/web3-auth`);
                try {
                    const req = await res.json();
                    if (res.ok) {
                        if (req?.auth?.farcaster) {
                            store.farcaster = req.auth.farcaster.appToken;
                            localStorage.setItem("farcaster", req.auth.farcaster.appToken);
                            getFidByToken(req.auth.farcaster.appToken, API_BASE).then((fid) => {
                                if (fid) {
                                    store.fid = fid as string;
                                    localStorage.setItem("fid", fid as string);
                                }
                            });
                            return true;
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse farcaster", error);
                }
        return false;
    }
}

const poolTokenInfo = async ({
    reqToken,
    store,
    apiBase = API_BASE
}: {
    reqToken: string
    store: IMainStore
    apiBase?: string
}) => {
    try {
        const reqInfo = await fetchWAuth(store, `${apiBase}/farcaster/signer-request/${reqToken}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        if (reqInfo.ok) {
            const result = await reqInfo.json()
            return result
        }
        return null
    } catch (error) {
        console.error('Failed to make signer request', error)
        return null
    }
}

export const connectToFarcaster = async ({
    isConnectToFarcaster,
    web3Libs,
    stackAlertError,
    stackAlertSuccess,
    store,
    isConnectedToFarcaster,
    apiBase = API_BASE,
    withWarpCast = true,
    deepLink = ref(''),
    showQr = false,
    timeout = ref(600000),
    isCancel = ref(false),
}: {
    isConnectToFarcaster: Ref<boolean>
        web3Libs: TWeb3Libs,
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    store: IMainStore
    isConnectedToFarcaster: Ref<boolean>
    apiBase?: string
    withWarpCast?: boolean
    deepLink: Ref<string>
    showQr?: boolean
    timeout?: Ref<number>
    isCancel?: Ref<boolean>
}) => {
    try {
        isConnectToFarcaster.value = true;
        if (withWarpCast) {
            isCancel.value = false;
            const addSignerRequest = await makeAddSignerRequest(store, apiBase);
            if (!addSignerRequest) {
                stackAlertError("Failed to make signer request");
                isConnectToFarcaster.value = false;
                return false;
            }
            const reqToken = addSignerRequest._id
            const deeplinkUrl = addSignerRequest.deeplinkUrl
            let signerInfo
            let signerInfoRetries = 0
            while (!signerInfo && signerInfoRetries < 20) {
                signerInfo = await poolTokenInfo({ reqToken, store, apiBase })
                if (!signerInfo?.result?.signerRequest) {
                    await wait(500)
                    signerInfoRetries++
                }
            }
            if (!signerInfo) {
                stackAlertError("Failed to pool add signer request info info");
                isConnectToFarcaster.value = false;
                return false;
            }
            deepLink.value = deeplinkUrl

            if (!showQr) {
                window.open(deepLink.value, '_blank')
            }
            signerInfo = undefined
            signerInfoRetries = 0
            let failed = true
            while (failed && signerInfoRetries < 600) {
                signerInfo = await poolTokenInfo({ reqToken, store, apiBase })
                if (signerInfo?.result?.signerRequest?.base64SignedMessage) {
                    failed = false
                } else {
                    await wait(500)
                    signerInfoRetries++
                    timeout.value -= 500
                }
                if (isCancel.value) {
                    return false
                }
            }
            if (failed) {
                stackAlertError("User did not approve in WarpCast app in time");
                isConnectToFarcaster.value = false;
                return false;
            }
            stackAlertSuccess("Connected to farcaster successfully");
            isConnectedToFarcaster.value = true;
            isConnectToFarcaster.value = false;
            return true;
        } else {
            const wgamiLib = (await prepareForTransaction({
                localWeb3Libs: web3Libs,
                stackAlertWarning: stackAlertError
            }))
            if (!(wgamiLib)) {
                return null
            }
            const wgamiCore = wgamiLib.wgamiCore
            const address = (await wgamiCore.getAccount(wgamiLib.wgConfig.wagmiConfig)).address ?? ''
            const fidNo = await getFidByAddress(store, address, apiBase);
            if (!fidNo) {
                walletDisconnect()
                stackAlertError("This address does not have a Farcaster account use the farcaster address to sign");
                isConnectToFarcaster.value = false;
                return false;
            }

            const reqAddSignerData = await fetchWAuth(store, `${apiBase}/farcaster/hub/signer-add-msg-create/${fidNo}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })


            const { hashToSign, dataBytes } = await reqAddSignerData.json()

            const binaryString = atob(hashToSign);
            const len = binaryString.length;
            const hash = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                hash[i] = binaryString.charCodeAt(i);
            }
            const signature = await wgamiCore.signTypedData(wgamiLib.wgConfig.wagmiConfig, {
                domain: EIP_712_FARCASTER_DOMAIN,
                types: { MessageData: EIP_712_FARCASTER_MESSAGE_DATA },
                message: { hash },
            } as any)
            // await signer._signTypedData(EIP_712_FARCASTER_DOMAIN, { MessageData: EIP_712_FARCASTER_MESSAGE_DATA }, { hash })
            if (!signature) {
                walletDisconnect()
                stackAlertError("User rejected signature")
                isConnectToFarcaster.value = false;
                return false
            }


            const reqAddSignerSubmit = await fetchWAuth(store, `${apiBase}/farcaster/hub/signer-add-msg-broadcast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: dataBytes,
                    signature,
                    hash: hashToSign,
                    pubKey: address
                })
            })

            if (!reqAddSignerSubmit.ok || (await reqAddSignerSubmit.json()).error) {
                stackAlertError("Error broadcasting signer add message to farcaster hubs");
                isConnectToFarcaster.value = false;
                return false;
            }
            stackAlertSuccess("Connected to farcaster successfully");
            isConnectedToFarcaster.value = true;
            if (store.userData.connected) store.userData.connected.farcaster = true
            isConnectToFarcaster.value = false;
            return true;
        }

    } catch (err) {
        console.error(err);
        isConnectToFarcaster.value = false;
        walletDisconnect()
        stackAlertError(
            "Error while connecting to farcaster: User rejected connect request"
        );
        return false;
    }
};


export const disconnectFromFarcaster = async ({
    isDisconnectFromFarcaster,
    farcasterToken,
    stackAlertError,
    isConnectedToFarcaster,
    store,
    stackAlertSuccess,
    apiBase = API_BASE
}: {
    isDisconnectFromFarcaster: Ref<boolean>;
    farcasterToken: Ref<string>;
    stackAlertError: (msg: string) => void
    isConnectedToFarcaster: Ref<boolean>
    store: IMainStore
    stackAlertSuccess: (msg: string) => void
    apiBase?: string
    }): Promise<boolean> => {
    try {
        if (!isConnectedToFarcaster.value) {
            stackAlertError("You are not connected to farcaster");
            return false;
        }
        isDisconnectFromFarcaster.value = true;
        const payload = {
            method: "revokeToken",
            params: {
                timestamp: Date.now(),
            }
        }
        try {
            const req = await fetch(`${apiBase}/proxy/farcaster/v2/auth`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${farcasterToken.value}`,
                },
                body: JSON.stringify(payload),
            });
            if (!req.ok) {
                console.warn("Failed to revoke farcaster token", await req.text());
            }
        } catch (e) {
            // ignore
        }
        const delBody = {
            platforms: ['farcaster']
        }
        const reqDel = await fetchWAuth(store, `${apiBase}/web3-auth`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(delBody),
        });
        if (reqDel.ok) {
            localStorage.removeItem("farcaster");
            localStorage.removeItem("fid");
            store.farcaster = "";
            store.fid = "";
            stackAlertSuccess("Disconnected from farcaster successfully");
            isConnectedToFarcaster.value = false;
            if (store.userData.connected) store.userData.connected.farcaster = false
            return true;
        } else {
            // stackAlertError("Error while disconnecting from farcaster: " + (await req.text()));
        }
        isDisconnectFromFarcaster.value = false;
        return false;
    } catch (e) {
        stackAlertError(
            "Error while disconnecting from farcaster: User rejected connect request"
        );
        isDisconnectFromFarcaster.value = false;
        return false;
    }
};

export const getFarcasterYupThread = async ({ postId, apiBase = API_BASE }: { postId: string, apiBase: string }) => {
    const empty = {
        comments: [],
        numComments: 0,
    }
    if (!postId) return empty;
    const req = await fetch(`${apiBase}/farcaster/thread?postId=${postId}`);
    if (req.ok) {
        const data = await req.json();
        if (data) {
            return {
                comments: data ?? [],
                numComments: data?.length ?? 0,
            }
        }
    }
    return empty;
}

export const getFavoriteChannels = async (store: IMainStore) => {

    const res = await fetchWAuth(store, `${API_BASE}/farcaster/channels/favorites`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    return data;
};


export const favAddChannel = (store: IMainStore, channel: TChannel) => {
    fetchWAuth(store, `${API_BASE}/farcaster/channels/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            channels: [channel.parent_url]
        }),
    });
};

export const favChannelDelete = (store: IMainStore, channel: TChannel) => {
    fetchWAuth(store, `${API_BASE}/farcaster/channels/favorites`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            channels: [channel.parent_url]
        }),
    });
};