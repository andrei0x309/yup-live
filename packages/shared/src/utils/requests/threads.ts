import type { Ref } from 'vue';
import type { IMainStore } from '../../types/store'
const API_BASE = import.meta.env.VITE_YUP_API_BASE;
import { ThreadsAPI } from 'threads-api';



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
}: {
    store: IMainStore
    threadsUser: string
    threadsPassword: string
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    apiBase?: string
    isConnectedToThreads: Ref<boolean>
    isConnectToThreads: Ref<boolean>
}

) => {
    if (isConnectToThreads.value) return

    let token = null;
    try {
        const threadsAPI = new ThreadsAPI({
            username: threadsUser,
            password: threadsPassword
        });

        token = await threadsAPI.getToken();
    } catch {
        return connectErrorThreads({
            stackAlertError,
            isConnectToThreads,
        })
    }
    if (!token) {
        return connectErrorThreads({
            stackAlertError,
            isConnectToThreads,
        })
    }

    const data = {
        auth: {
            threads
        }
    }




}