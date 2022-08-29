import { useMainStore } from '@/store/main'

const store = useMainStore()

export const fetchWAuth = async (endpoint: string, options?: any) => {
    if (!options) options = {}
    if (!options.body) options.body = {}
    else options.body = JSON.parse(options.body)

    if (!options.headers) options.headers = {}
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
    options.body.address = store.userData.address
    options.body.signature = store.userData.signature
    options.body = JSON.stringify(options.body)
    return fetch(endpoint, options)
}