import { config } from './config'

const { API_BASE } = config

export const getNotifications = async (
    { type, limit, skip, userId } = { type: 'all', limit: '10', skip: '0' } as { userId: string, type: string; limit?: string; skip?: string }
) => {
    let req

    if (type === 'all') {
        req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
    } else if (type === 'vote') {
        req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}&type=vote`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
    } else {
        req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}&type=reward`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
    }

    if (!req.ok) {
        return false
    }
    const data = await req.json()
    return data
}
