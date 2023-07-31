import { TPlatform, ISendPostData } from '../../types/web3-posting';
import { fetchWAuth } from '../auth';
import type { IMainStore } from '../../types/store';

export const mediaUpload = async (store: IMainStore, apiBase: string, platforms: TPlatform[], file: File) => {
    try {
        const data = new FormData()
        data.append('platforms', JSON.stringify(platforms))
        data.append('data', file)

        const req = await fetchWAuth(store, `${apiBase}/media-upload`, {
            method: 'POST',
            body: data
        }, true)

        return req.json()
    } catch (e) {
        console.error('Media Upload: ', e)
        return null
    }
}

export const submitPost = async ({
    store,
    apiBase,
    sendData
}: {
    store: IMainStore
    apiBase: string
    sendData: ISendPostData
}
) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post`, {
            method: 'POST',
            body: JSON.stringify(sendData)
        })
        if (!req.ok) {
            console.error('Error submitting post: ', req.statusText)
            return null
        }
        return await req.json()
    } catch (e) {
        console.error('Submit Post: ', e)
        return null
    }
}

export const deletePost = async ({
    store,
    apiBase,
    postid
}: {
    store: IMainStore
    apiBase: string
    postid: string
}) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post`, {
            method: 'DELETE',
            body: JSON.stringify({ postid })
        })
        if (!req.ok) throw new Error('Error deleting post' + req.statusText)
        return await req.json()
    } catch (e) {
        console.error('Delete Post: ', e)
        return null
    }
}
