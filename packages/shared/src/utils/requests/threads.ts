import type { Ref } from 'vue';
import type { IMainStore } from '../../types/store'
import { fetchWAuth } from '../auth'

export const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// export const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');

const deviceID = 'android-k3wpbt5bk5c0000'

const connectErrorThreads = ({
    stackAlertError,
    isConnectToThreads,
}: {
    stackAlertError: (msg: string) => void
    isConnectToThreads: Ref<boolean>
}) => {
    stackAlertError('Could not connect to threads using the provided credentials')
    isConnectToThreads.value = false
    return false
}

export const connectToThreads = async ({
    store,
    threadsUser,
    threadsPassword,
    stackAlertError,
    stackAlertSuccess,
    isConnectedToThreads,
    isConnectToThreads,
    apiBase = API_BASE,
    settingsModal
}: {
    store: IMainStore
    threadsUser: string
    threadsPassword: string
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    apiBase?: string
    isConnectedToThreads: Ref<boolean>
    isConnectToThreads: Ref<boolean>
        settingsModal: Ref<boolean>
}

) => {
    if (isConnectToThreads.value) return
    isConnectToThreads.value = true
    try {

        const req = await fetch(`${API_BASE}/web3-auth/threads/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: threadsUser,
                password: threadsPassword,
                deviceID
            })
        })
        if (!req.ok) {
        return connectErrorThreads({
            stackAlertError,
            isConnectToThreads,
        })
    }
        const { token, userID } = await req.json()
    if (!token) {
        return connectErrorThreads({
            stackAlertError,
            isConnectToThreads,
        })
    }


    const data = {
        auth: {
                threads: {
                    token,
                    userId: userID.replace(',', '').trim(),
                    deviceId: deviceID
                }
            }
        }

        const reqSave = await fetchWAuth(store, `${apiBase}/web3-auth`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!reqSave.ok) {
            isConnectToThreads.value = false
            stackAlertError('Could not connect to Threads, error saving token')
            return false
        }

        if (store.userData.connected) store.userData.connected.threads = true
        isConnectToThreads.value = false
        isConnectedToThreads.value = true
        stackAlertSuccess('Connected to Threads')
        settingsModal.value = false
        return reqSave.ok

    } catch (e) {
        console.error(e);
        return connectErrorThreads({
            stackAlertError,
            isConnectToThreads,
        })
    }
}

export const connectToThreadsOauth = async ({
    store,
    stackAlertError,
    stackAlertSuccess,
    isConnectedToThreads,
    isConnectToThreads,
    apiBase = API_BASE,
    isThreadsCancel
}: {
    store: IMainStore
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    apiBase?: string
    isConnectedToThreads: Ref<boolean>
    isConnectToThreads: Ref<boolean>,
    isThreadsCancel: Ref<boolean>
}) => {
    if (isConnectToThreads.value) return
    isConnectToThreads.value = true

    const req = await fetchWAuth(store, `${apiBase}/web3-auth/threads/redirect-url`, {
        method: 'GET',
    })

    if (!req.ok) {
        stackAlertError('Could not connect to Threads')
        isConnectToThreads.value = false
        return false
    }
    const { url } = await req.json()

    if (url) {
        window.open(url, '_blank')
        // isConnectToThreads.value = false
        // isConnectedToThreads.value = false
        // if (store.userData.connected) store.userData.connected.threads = false
    }

    let timeout = 300000

    for (; ;) {
        const req = await fetchWAuth(store, `${apiBase}/web3-auth/threads/is-connected`, {
            method: 'GET',
        })
        if (!req.ok) {
            stackAlertError('Could not connect to Threads')
            isConnectToThreads.value = false
            return false
        }
        const { isConnected } = await req.json()
        if (isConnected) {
            isConnectedToThreads.value = true
            if (store.userData.connected) store.userData.connected.threads = true
            isConnectToThreads.value = false
            stackAlertSuccess('Connected to Threads')
            return true
        }
        if (isThreadsCancel.value) {
            isConnectToThreads.value = false
            return false
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        timeout -= 500
        if (timeout <= 0) {
            stackAlertError('Could not connect to Threads due to timeout')
            isConnectToThreads.value = false
            return false
        }
    }
}


export const disconnectThreads = async ({
    store,
    stackAlertError,
    stackAlertSuccess,
    isDisconnectFromThreads,
    isConnectedToThreads,
    apiBase = API_BASE,
}: {
    store: IMainStore
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    isDisconnectFromThreads: Ref<boolean>
    isConnectedToThreads: Ref<boolean>
    apiBase?: string
}) => {
    if (isDisconnectFromThreads.value) return
    isDisconnectFromThreads.value = true

    // console.log(await getWeb3Auth({ store }))

    const req = await fetchWAuth(store, `${apiBase}/web3-auth`, {
        method: 'DELETE',
        body: JSON.stringify({
            platforms: ['threads']
        })
    })

    if (!req.ok) {
        stackAlertError('Could not disconnect from Threads')
        isDisconnectFromThreads.value = false
        return false
    }

    if (req.ok) {
        isDisconnectFromThreads.value = false
        isConnectedToThreads.value = false
        if (store.userData.connected) store.userData.connected.threads = false
        stackAlertSuccess('Successfully disconnected from Threads')
    }
    return true
}