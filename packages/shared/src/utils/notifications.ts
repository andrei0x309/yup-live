import { config } from './config'

const { API_BASE } = config
export const notificationTypes = ['vote', 'reward', 'all-followers', 'follow', 'unfollow']

export const getNotifications = async (
    { type, limit, skip, userId } = { type: null, limit: '10', skip: '0' } as { userId: string, type: null | string[]; limit?: string; skip?: string }
) => {
    let req
    let queryType = ''
    if (type) {
        queryType = `&inType=${type.join(',')}`
    }
    if (!limit) {
        limit = '10'
    }

    if (!skip) {
        skip = '0'
    }

    req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}${queryType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })

    if (!req.ok) {
        return false
    }
    const data = await req.json()
    return data
}
