import { config } from '../config'
import { ISearchBody } from '../../types/search'
const { API_BASE } = config

export const search = async ({
    offset = 0, byRencency = '', platforms = [] as string[], input = '', limit = 10
}) => {
    let tags
    if (platforms.length > 1) {
        tags = platforms.join(',')
    } else if (platforms.length === 1) {
        tags = platforms[0]
    } else {
        tags = 'all'
    }
    tags = tags === 'all' ? '' : `&tags=${tags}`

    byRencency = byRencency ? `&recency=${byRencency}` : ''
    const res = await fetch(`${API_BASE}/search/es/posts?offset=${offset}&limit=${limit}${tags}${byRencency}&searchText=${input}`)
    const data = await res.json()
    return data.filter((p: unknown) => p)
}

export const getWithFilters = async (body = {} as ISearchBody) => {
    try {
        const res = await fetch(`${API_BASE}/filtered-feed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        if (!res.ok) {
            return []
        }
        const data = await res.json()
        return data.filter((p: unknown) => p)
    } catch {
        return []
    }
}