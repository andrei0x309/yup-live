import type { IMainStore } from 'shared/src/types/store'
import { config } from '../config'
import type { Ref } from 'vue'
import { fetchWAuth } from '../auth'

const API_BASE = config.API_BASE || ''
export const BLUESKY_SERVICE_URL = 'https://bsky.social';


// import { BLUESKY_SERVICE_URL } from '../config';

// type ApiMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

// interface ApiConfig {
//   url: string;
//   method?: ApiMethod;
//   params?: Record<string, any>;
//   data?: object | FormData;
// }

// export default async function callBluskyApi({ url, method = 'GET', params, data }: ApiConfig) {
//   const isFormData = data instanceof FormData;
//   const headers = {
//     Accept: 'application/json',
//     'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
//   };

//   // Configure api url, include query parameters if any
//   let apiUrl = `${BLUESKY_SERVICE_URL}${url}`;

//   if (method === 'GET' && params) {
//     apiUrl += '?' + new URLSearchParams(params).toString();
//   }

//   const requestOptions: RequestInit = {
//     method: method!,
//     headers
//   };

//   if ((method === 'POST' || method === 'PUT' || method === 'DELETE') && data) {
//     if (isFormData) {
//       requestOptions.body = data;
//     } else {
//       requestOptions.body = JSON.stringify(data);
//     }
//   }

//   const response = await fetch(apiUrl, requestOptions);

//   if (response.ok) {
//     return response.json();
//   } else {
//     let errorContent;
//     const contentType = response.headers.get('Content-Type');

//     try {
//       if (contentType?.includes('text/html')) {
//         errorContent = await response.text();
//       } else {
//         errorContent = await response.json();
//       }
//     } catch {}

//     console.log('Bluesky API error: ', { url, method, params, data, errorContent });

//     throw errorContent;
//   }
// }

// import callBlueskyApi from './base_api';
// import { BlueskySession } from './models';

// export async function apiBlueskyLogin(identifier: string, password: string): Promise<BlueskySession> {
//   return callBlueskyApi({
//     method: 'POST',
//     url: `/xrpc/com.atproto.server.createSession`,
//     data: { identifier, password }
//   });
// }

export const disconnectBlueSky = async ({
    store,
    stackAlertError,
    stackAlertSuccess,
    isDisconnectFromBlueSky,
    isConnectedToBsky,
    apiBase = API_BASE,
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

    const req = await fetchWAuth(store, `${apiBase}/web3-auth`, {
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

    if (store.userData.connected) store.userData.connected.bsky = false


    if (req.ok) {
        isDisconnectFromBlueSky.value = false
        isConnectedToBsky.value = false
        if (store.userData.connected) store.userData.connected.bsky = false
        stackAlertSuccess('Successfully disconnected from Bluesky')
    }
}

export const connectBlueSky = async ({
    store,
    bskyUser,
    bskyAppPassword,
    stackAlertError,
    stackAlertSuccess,
    isConnectedToBsky,
    isConnectToBsky,
    apiBase = API_BASE,
}: {
    store: IMainStore
    bskyUser: string
    bskyAppPassword: string
    stackAlertError: (msg: string) => void
    stackAlertSuccess: (msg: string) => void
    apiBase?: string
    isConnectedToBsky: Ref<boolean>
    isConnectToBsky: Ref<boolean>
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
            bsky
        }
    }

    const reqSave = await fetchWAuth(store, `${apiBase}/web3-auth`, {
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
    return reqSave.ok
}
