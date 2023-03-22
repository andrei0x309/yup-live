import { config } from '../config'
import { fetchWAuth } from '../auth'
import type { IMainStore } from 'shared/src/types/store'
import type { Ref } from 'vue'
import { signCanonChallenge } from '../evmTxs'
import { getFidByToken } from 'shared/src/utils/farcaster';
import { FCSendCast } from "shared/src/utils/farcaster";
import { digestSha256 } from "shared/src/utils/misc";
import type { IuserProvider, Iethers, IethersLib, Iweb3Modal } from 'shared/src/types/evm'

const buffer = import("buffer/");

const EIP_191_PREFIX = "eip191:";

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

export const getFarcasterPostType = (post: any) => {
    if (post?.web3Preview?.meta?.parents?.length > 0) return 'reply'
    return 'single'
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

export const connectToFarcaster = async ({
    isConnectToFarcaster,
    web3Mprom,
    w3Modal,
    ethers,
    ethersLib,
    userProvider,
    stackAlertError,
    stackAlertSuccess,
    store,
    isConnectedToFarcaster,
    sendFarcasterConnectMsg,
    apiBase = API_BASE
}: {
    isConnectToFarcaster: Ref<boolean>;
    web3Mprom: Promise<any>,
    w3Modal: Iweb3Modal,
    ethers: Iethers,
    ethersLib: IethersLib,
    userProvider: IuserProvider
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    store: IMainStore
    isConnectedToFarcaster: Ref<boolean>
    sendFarcasterConnectMsg: Ref<boolean>
    apiBase?: string
}) => {
    try {
        isConnectToFarcaster.value = true;
        await web3Mprom;
        const inst = await w3Modal.value.connect();
        ethersLib.value = await ethers;
        userProvider.value = new ethersLib.value.providers.Web3Provider(inst);
        const signer = userProvider.value.getSigner();
        const timestamp = Date.now();
        const payload = {
            method: "generateToken",
            params: {
                timestamp,
            },
        };
        const sig = await signCanonChallenge(payload, signer);
        if (!sig) {
            stackAlertError(
                "Error while connecting to farcaster, user rejected signature request"
            );
            isConnectToFarcaster.value = false;
            return false;
        }

        const bufferLib = (await buffer).Buffer;
        const signatureString = bufferLib
            .from(ethersLib.value.utils.arrayify(sig)).toString('base64');
        const cusAuth = EIP_191_PREFIX + signatureString;

        const req = await fetch(`${API_BASE}/proxy/farcaster/v2/auth`, {
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
            if (token) {
                const dataTosend = {
                    auth: {
                        farcaster: {
                            appToken: token,
                        },
                    },
                };
                getFidByToken(token, API_BASE).then(fid => {
                    if (fid) {
                        store.fid = fid as string;
                        localStorage.setItem("fid", fid as string);
                    }
                })
                const req = await fetchWAuth(store, `${apiBase}/web3-auth`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataTosend),
                });
                if (req.ok) {
                    stackAlertSuccess("Connected to farcaster successfully");
                    isConnectedToFarcaster.value = true;
                    store.farcaster = token;
                    if (sendFarcasterConnectMsg.value) {
                        const text = 'I just connected my farcaster address to https://yup-live.pages.dev \nVerification hash: ' + digestSha256(token);
                        await FCSendCast(token, text, API_BASE)
                    }
                    localStorage.setItem("farcaster", token);
                } else {
                    stackAlertError("Error while connecting to farcaster: " + (await req.text()));
                }
            } else {
                stackAlertError("Error while connecting to farcaster: " + (await req.text()));
            }
        } else {
            stackAlertError("Error while connecting to farcaster: " + (await req.text()));
        }
        isConnectToFarcaster.value = false;
    } catch {
        isConnectToFarcaster.value = false;
        stackAlertError(
            "Error while connecting to farcaster: User rejected connect request"
        );
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
}) => {
    try {
        if (!isConnectedToFarcaster.value) {
            stackAlertError("You are not connected to farcaster");
            return;
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
        } else {
            // stackAlertError("Error while disconnecting from farcaster: " + (await req.text()));
        }
        isDisconnectFromFarcaster.value = false;
    } catch (e) {
        stackAlertError(
            "Error while disconnecting from farcaster: User rejected connect request"
        );
        isDisconnectFromFarcaster.value = false;
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