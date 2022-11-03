import { useMainStore } from '@/store/main'

const store = useMainStore()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWAuth = async (endpoint: string, options?: any) => {
  if (!options) options = {}
  if (!options.body) options.body = {}
  else options.body = JSON.parse(options.body)

  if (!options.headers) options.headers = {}
  if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
  if (!options.headers['Authorization']) options.headers['Authorization'] = 'Bearer ' + store.userData.authToken
  options.body = JSON.stringify(options.body)
  return fetch(endpoint, options)
}
