import { TPlatform, ISendPostData, IReplyTo } from '../../types/web3-posting';
import { fetchWAuth } from '../auth';
import type { IMainStore } from '../../types/store';
import type { Ref } from 'vue';

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const PLATFORMS: TPlatform[] = ["farcaster", "twitter", "lens", "bsky", "threads"];

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
        const data = await req.json()
        if (!req.ok) {
            console.error('Error submitting post: ', req.statusText)
            const status = data?.status
            if (!status) return null
            const failed = [] as string[]
            const statusPlatforms = Object.entries(status)
            for (const [key, value] of statusPlatforms) {
                if (!(value as { ok: boolean })?.ok) {
                    failed.push(key)
                }
            }

            if (failed.length === statusPlatforms.length) return null

            retryPost({ taskId: data.taskId, store, apiBase })
            return {
                error: true,
                partial: true,
                platforms: failed
            }
        }
        return data
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

const retryPost = async ({ taskId, store,
    apiBase, }: {
        store: IMainStore
        apiBase: string,
        taskId: string
    }) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post/${taskId}`, {
            method: 'POST',
            body: JSON.stringify({})
        })
        if (!req.ok) throw new Error('Error retrying post' + req.statusText)
        return await req.json()
    } catch (e) {
        console.error('Retry Post: ', e)
        return null
    }
}


export const sendPost = async ({
    replyTo,
    postContent,
    maxCharCount,
    isSendPost,
    postPlatforms,
    media,
    store,
    stackAlertSuccess,
    stackAlertWarning,
    showError
}: {
        replyTo?: IReplyTo
    postContent: Ref<string>
    maxCharCount: Ref<number>
    isSendPost: Ref<boolean>
    postPlatforms: Ref<TPlatform[]>
        media: Record<string, unknown>[]
        store: IMainStore
    stackAlertSuccess?: (message: string) => void,
    stackAlertWarning?: (message: string) => void,
    showError?: (message: string) => void
}) => {
    if (!postContent.value) {
        showError && showError("Post must have some content");
        return;
    } else if (postContent.value.length > maxCharCount.value) {
        showError && showError(`Post cannot be longer than ${maxCharCount.value} characters`);
        return;
    }
    isSendPost.value = true;

    const sendData = {
        content: postContent.value,
        platforms: postPlatforms.value,
        media: media.map((media: Record<string, unknown>) => {
            const ret = {} as Record<string, unknown>
            if (media.farcaster) ret['farcaster'] = media.farcaster
            if (media.twitter) ret['twitter'] = media.twitter
            if (media.lens) ret['lens'] = media.lens
            if (media.bsky) ret['bsky'] = media.bsky
            if (media.threads) ret['threads'] = media.threads
            return ret
        }),
    } as ISendPostData;

    if (replyTo) {
        sendData.replyTo = replyTo
    }

    const result = await submitPost({
        store,
        apiBase: API_BASE,
        sendData,
    });

    isSendPost.value = false;

    if (result && !result.error) {
        stackAlertSuccess && stackAlertSuccess("Post sent!");
    }
    else if (result && result.partial) {
        const failed = result.platforms.join(", ");
        stackAlertWarning && stackAlertWarning("Post sent to all platforms except " + failed + "One retry will be attempted automatically.");
    } else {
        showError && showError("Post failed to send to all platforms");
        return false;
    }
    return true
};