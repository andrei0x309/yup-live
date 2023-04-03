import { config } from './config'

const { API_BASE } = config
const types = ['all', 'vote', 'reward', 'all-followers', 'follow', 'unfollow']

export const getNotifications = async (
    { type, limit, skip, userId } = { type: 'all', limit: '10', skip: '0' } as { userId: string, type: string; limit?: string; skip?: string }
) => {
    let req

    if (!types.includes(type)) {
        type = ''
    } else {
        type = `&type=${type}`
    }
    if (!limit) {
        limit = '10'
    }

    if (!skip) {
        skip = '0'
    }

    req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}${type}`, {
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
