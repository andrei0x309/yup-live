import type { IMainStore } from 'shared/src/types/store'
import type { Ref } from 'vue'
import { fetchWAuth } from '../auth'

export const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// export const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');


export const BLUESKY_SERVICE_URL = 'https://bsky.social';

export const disconnectBlueSky = async ({
    store,
    stackAlertError,
    stackAlertSuccess,
    isDisconnectFromBlueSky,
    isConnectedToBsky,
}: {
    store: IMainStore
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    isDisconnectFromBlueSky: Ref<boolean>
    isConnectedToBsky: Ref<boolean>
    apiBase?: string
}) => {
    if (isDisconnectFromBlueSky.value) return
    isDisconnectFromBlueSky.value = true

    const req = await fetchWAuth(store, `${API_BASE}/web3-auth`, {
        method: 'DELETE',
        body: JSON.stringify({
            platforms: ['bsky']
        })
    })

    if (!req.ok) {
        stackAlertError('Could not disconnect from Bluesky')
        isDisconnectFromBlueSky.value = false
        return false
    }

    if (req.ok) {
        isDisconnectFromBlueSky.value = false
        isConnectedToBsky.value = false
        if (store.userData.connected) store.userData.connected.bsky = false
        stackAlertSuccess('Successfully disconnected from Bluesky')
    }
    return true
}

export const connectBlueSky = async ({
    store,
    bskyUser,
    bskyAppPassword,
    stackAlertError,
    stackAlertSuccess,
    isConnectedToBsky,
    isConnectToBsky,
    settingsModal
}: {
    store: IMainStore
    bskyUser: string
    bskyAppPassword: string
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    apiBase?: string
    isConnectedToBsky: Ref<boolean>
    isConnectToBsky: Ref<boolean>
        settingsModal: Ref<boolean>
}

) => {
    if (isConnectToBsky.value) return
    isConnectToBsky.value = true
    const req = await fetch(`${BLUESKY_SERVICE_URL}/xrpc/com.atproto.server.createSession`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ identifier: bskyUser, password: bskyAppPassword })
    })
    if (!req.ok) {
        isConnectToBsky.value = false
        stackAlertError('Could not connect to Bluesky, invalid credentials')
        return false
    }
    const bsky = await req.json()

    const data = {
        auth: {
            bsky: {
                session: bsky,
                credentials: {
                    identity: bskyUser,
                    appPass: bskyAppPassword
                }
            }
        }
    }

    const reqSave = await fetchWAuth(store, `${API_BASE}/web3-auth`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    if (!reqSave.ok) {
        isConnectToBsky.value = false
        stackAlertError('Could not connect to Bluesky, could not save session')
        return false
    }

    if (store.userData.connected) store.userData.connected.bsky = true
    isConnectToBsky.value = false
    isConnectedToBsky.value = true
    stackAlertSuccess('Connected to Bluesky')
    settingsModal.value = false
    return reqSave.ok
}
