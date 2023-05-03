import type { IMainStore } from '../types/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWAuth = async (store: IMainStore, endpoint: string, options?: any, noHeader = false) => {
    if (!options) options = {}
    if (!options.headers) options.headers = {}
    if (!options.headers['Content-Type'] && !noHeader) options.headers['Content-Type'] = 'application/json'
    if (!options.headers['Authorization']) options.headers['Authorization'] = 'Bearer ' + store.userData.authToken
    return fetch(endpoint, options)
}
