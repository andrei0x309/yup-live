import type { IMainStore } from '../types/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWAuth = async (store: IMainStore, endpoint: string, options?: any) => {
    if (!options) options = {}
    if (options.body) options.body = JSON.parse(options.body)

    if (!options.headers) options.headers = {}
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
    if (!options.headers['Authorization']) options.headers['Authorization'] = 'Bearer ' + store.userData.authToken
    return fetch(endpoint, options)
}
