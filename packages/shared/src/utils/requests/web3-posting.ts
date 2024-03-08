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

export const submitThread = async ({
    store,
    apiBase,
    sendData
}: {
    store: IMainStore
    apiBase: string
    sendData: {
        posts: ISendPostData[]
        platforms: TPlatform[]
    }
}
) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post/thread`, {
            method: 'POST',
            body: JSON.stringify(sendData)
        })
        const data = await req.json()
        if (!req.ok) {
            if (data?.message.toLowerCase().includes('balance') || data?.message.toLowerCase().includes('insufficient')) {
                return { error: true, insufficientError: true }
            }
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

export const makeSendData = (
    {
        replyTo,
        postContent,
        postPlatforms,
        media,
        showError,
        maxCharCount,
        time
    }: {
        replyTo?: IReplyTo
            postContent: string,
            postPlatforms?: TPlatform[]
            media: Record<string, unknown>[]
            showError?: (message: string) => void
            maxCharCount: number
        time?: Date
    }
) => {

    if (!postContent) {
        showError && showError("Post must have some content");
        return;
    } else if (postContent.length > maxCharCount) {
        showError && showError(`Post cannot be longer than ${maxCharCount} characters`);
        return;
    }

    const sendData = {
        content: postContent,
        platforms: postPlatforms ? postPlatforms : undefined,
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

    if (time) {
        sendData.time = time.getTime()
    }

    return sendData
}

export const sendPost = async ({
    replyTo,
    postContent,
    isSendPost,
    postPlatforms,
    media,
    store,
    stackAlertSuccess,
    stackAlertWarning,
    showError,
    maxCharCount
}: {
    replyTo?: IReplyTo
        postContent: string
        maxCharCount: number
    isSendPost: Ref<boolean>
        postPlatforms: TPlatform[]
    media: Record<string, unknown>[]
    store: IMainStore
    stackAlertSuccess?: (message: string) => void,
    stackAlertWarning?: (message: string) => void,
    showError?: (message: string) => void
}) => {
    isSendPost.value = true;

    const sendData = makeSendData({
        replyTo,
        postContent,
        postPlatforms,
        media,
        showError,
        maxCharCount
    })

    if (!sendData) return

    const result = await submitPost({
        store,
        apiBase: API_BASE,
        sendData
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

export const getScheduledPosts = async ({ store, apiBase }: { store: IMainStore, apiBase: string }) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post/schedule?accountId=${store.userData.account}`)
        if (!req.ok) throw new Error('Error getting scheduled posts' + req.statusText)
        return (await req.json()).scheduledPosts
    } catch (e) {
        console.error('Get Scheduled Posts: ', e)
        return []
    }
}

export const getScheduledThreads = async ({ store, apiBase }: { store: IMainStore, apiBase: string }) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post/schedule/thread?accountId=${store.userData.account}`)
        if (!req.ok) throw new Error('Error getting scheduled threads' + req.statusText)
        return (await req.json()).scheduledThreads
    } catch (e) {
        console.error('Get Scheduled Threads: ', e)
        return []
    }
}

export const deleteScheduledTask = async ({ store, apiBase, taskId, isTread }: { store: IMainStore, apiBase: string, taskId: string, isTread: boolean }) => {
    try {
        const thread = isTread ? '/thread' : ''
        const req = await fetchWAuth(store, `${apiBase}/web3-post/schedule${thread}`, {
            body: JSON.stringify({ taskId }),
            method: 'DELETE'
        })
        if (!req.ok) throw new Error('Error deleting scheduled task' + req.statusText)
        return await req.json()
    } catch (e) {
        console.error('Delete Scheduled task: ', e)
        return null
    }
}

export const schedulePost = async (
    { store, apiBase, sendData, isThread = false }:
        { store: IMainStore, apiBase: string, sendData: ISendPostData | { posts: (ISendPostData | undefined)[]; platforms: TPlatform[]; time: number; replyTo?: IReplyTo } | undefined, isThread: boolean }) => {
    try {
        const req = await fetchWAuth(store, `${apiBase}/web3-post/schedule${isThread ? '/thread' : ''}`, {
            body: JSON.stringify(sendData),
            method: 'POST'
        })
        if (!req.ok) {
            const data = await req.json()
            if (data?.message.toLowerCase().includes('balance') || data?.message.toLowerCase().includes('insufficient')) {
                return { ok: false, error: 'insufficient' }
            }
            return { ok: false, error: 'other' }
        } else {
            console.error('Error scheduling post' + req.statusText)
            return { ok: true }
        }
    } catch (e) {
        console.error('Schedule Post: ', e)
        return null
    }
}

export const postFrameAction = async (
    { store, apiBase, sendData }: {
        store: IMainStore, apiBase: string, sendData: {
            url: string
            castFid: number
            castHash: string
            inputText?: string
            buttonIndex?: number,
            state?: string
        }
    }) => {
    try {

        const req = await fetchWAuth(store, `${apiBase}/farcaster/frame-packet-action`, {
            body: JSON.stringify(sendData),
            method: 'POST'
        })

        if (!req.ok) {
            console.error('Error postFrameAction: ', req.statusText)
            return null
        }
        const json = await req.json();
        console.info('json', JSON.stringify(json));
        return json
    } catch (e) {
        console.error('postFrameAction: ', e)
        return null
    }
}

export const searchChannel = async (term: string) => {
    try {
        const req = await fetch(`${API_BASE}/farcaster/channels/search?q=${term}`)
        if (!req.ok) {
            console.error('Error searchChannel: ', req.statusText)
            return []
        }
        return await req.json()
    } catch (e) {
        console.error('Search Channel: ', e)
        return []
    }
}

export const getReposts = async ({
    store,
    postId
}: {
    store: IMainStore
    postId: string
}) => {
    try {
        const req = await fetchWAuth(store, `${API_BASE}/web3-repost/${postId}`)
        if (!req.ok) {
            console.error('Error getReposts: ', req.statusText)
            return []
        }
        return await req.json()
    } catch (e) {
        console.error('Get Reposts: ', e)
        return []
    }
}

export const sendRepost = async ({
    store,
    postId
}: {
    store: IMainStore
    postId: string
}) => {
    try {
        const req = await fetchWAuth(store, `${API_BASE}/web3-repost/${postId}`, {
            method: 'POST'
        })
        if (!req.ok) {
            console.error('Error sentRepost: ', req.statusText)
            return false
        }
        return true
    } catch (e) {
        console.error('Sent Repost: ', e)
        return false
    }
}

export const deleteRepost = async ({
    store,
    postId
}: {
    store: IMainStore
    postId: string
}) => {
    try {
        const req = await fetchWAuth(store, `${API_BASE}/web3-repost/${postId}`, {
            method: 'DELETE'
        })
        if (!req.ok) {
            console.error('Error deleteRepost: ', req.statusText)
            return false
        }
        return true
    } catch (e) {
        console.error('Delete Repost: ', e)
        return false
    }
}

export const getInitialFrame = async (url: string) => {
    //API_BASE
    const metas = await fetch(`${API_BASE}/posts/website-meta?url=${url}`)
    let metaTags = [] as any[]
    try {
        metaTags = (await metas.json())?.metaTags ?? []
    } catch (e) {
        console.error('Error getting initial frame: ', e)
    }
    const frameRes: any = {}
    const buttons: any = []
    metaTags.map((metaTag: any) => {
        const property = metaTag.property ?? metaTag.name
        const content = metaTag.content
        if (property === 'fc:frame') {
            frameRes.version = content
        } else if (property === 'fc:frame:image') {
            frameRes.imageUrl = content
        } else if (property === 'fc:frame:post_url') {
            frameRes.postUrl = content
        } else if (property === 'og:image' && !frameRes.imageUrl) {
            frameRes.imageUrl = content
        } else if (property === 'fc:frame:input:text') {
            frameRes.inputText = content
        } else if (property === 'fc:frame:state') {
            frameRes.state = content
        } else if (property?.startsWith('fc:frame:button')) {
            const tokens = property.split(':')
            const index = Number(tokens?.[3])
            const forthToken = tokens?.[4]?.trim()
            if (!buttons?.find((b: any) => b?.index === index)) {
                buttons[index] = { index, title: content, type: forthToken ?? 'post' }
            } else {
                if (forthToken === 'target') {
                    buttons[index] = { ...buttons[index], index: (index || undefined), target: content }
                } else if (forthToken === 'action') {
                    buttons[index] = { ...buttons[index], index: (index || undefined), type: content }
                }
            }
        } else if (property?.startsWith('redirectUrl')) {
            frameRes.redirectUrl = content
        }
    })

    return {
        ...frameRes,
        buttons: buttons.filter((b: any) => b)
    }
}

export const sendThread = async ({
    replyTo,
    isSendPost,
    store,
    stackAlertSuccess,
    stackAlertWarning,
    showError,
    posts,
}: {
    replyTo?: IReplyTo
    isSendPost: Ref<boolean>
    store: IMainStore
    stackAlertSuccess?: (message: string) => void,
    stackAlertWarning?: (message: string) => void,
    showError?: (message: string) => void
    posts: {
        postContent: string
        maxCharCount: number
        media: Record<string, unknown>[]
        postPlatforms: TPlatform[]
    }[]
}) => {
    isSendPost.value = true;

    let index = 0;
    const sendDataPosts = posts.map((post) => {
        index++;
        return makeSendData({
            replyTo: index === 1 ? replyTo : undefined,
            postContent: post.postContent,
            media: post.media,
            showError,
            maxCharCount: post.maxCharCount
        })
    }) as ISendPostData[]


    if (!sendDataPosts || !sendDataPosts.length) return
    const sendData = {
        posts: sendDataPosts,
        platforms: posts?.[0]?.postPlatforms
    }

    const result = await submitThread({
        store,
        apiBase: API_BASE,
        sendData
    });

    isSendPost.value = false;

    if (result && !result.error) {
        stackAlertSuccess && stackAlertSuccess("Thread sent!");
    } else if (result.error && result.insufficientError) {
        showError && showError("Insufficient yup balance to access sending threads feature");
        return false
    }
    else if (result && result.partial) {
        const failed = result.platforms.join(", ");
        stackAlertWarning && stackAlertWarning("Thread sent to all platforms except " + failed + "One retry will be attempted automatically.");
    } else {
        showError && showError("Thread failed to send to all platforms");
        return false;
    }
    return true
};