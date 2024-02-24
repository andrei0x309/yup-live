import type { IPost, IProcessedPost, IRPostShareInfo, PostBodyProcessed, linkPreviewTypeEx, mediaType, Embed } from 'shared/src/types/post'
import type { Web3Media } from 'shared/src/types/web3/media'
import { isImage, isVideo, isProbablyPage, linkify } from 'shared/src/utils/misc'
import { parseIpfs } from 'shared/src/utils/web3/ipfs'
// import MD from 'markdown-it'

import { timeAgo } from 'shared/src/utils/time'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const processPost = (post: IPost, processedPost: IProcessedPost,
    cloneWeights: { positiveWeight: number, negativeWeight: number },
    postShareInfo: IRPostShareInfo) => {
    processedPost.id = post._id.postid
    processedPost.title = post?.previewData?.title ?? 'No title available'
    let content = post?.previewData?.description ?? 'No description available'
    content = content.length > 261 ? `${content.substring(0, 261)}...` : content
    processedPost.content = content
    let image = post?.previewData?.img
    if (post?.web3Preview?.meta?.imageUrl) {
        image = post.web3Preview.meta.imageUrl
    }

    if (image && image.match(/\.gif.*?fm=jpg/)) {
        image = image.replace(/fm=jpg/, 'fm=gif')
    }
    processedPost.image = image ?? ''
    if (processedPost.image) {
        processedPost.isVideo = isVideo(processedPost.image)
    }
    processedPost.createdAt = timeAgo(post.createdAt ?? post?.web3Preview?.createdAt ?? `${new Date().getTime() - 3e6 * Math.random()}`)
    processedPost.url = post.url
    processedPost.positiveWeight = post.rawPositiveWeight ?? post.positiveWeight ?? 0
    processedPost.negativeWeight = post.rawNegativeWeight ?? post.negativeWeight ?? 0
    cloneWeights.positiveWeight = post.rawPositiveWeight ?? post.positiveWeight ?? 0
    cloneWeights.negativeWeight = post.rawNegativeWeight ?? post.negativeWeight ?? 0

    postShareInfo.title = processedPost.title
    postShareInfo.url = BASE_URL + '/post/' + processedPost.id
    postShareInfo.text = processedPost.content
}

const parseBody = (text: string, linkPreviews: linkPreviewTypeEx[]) => {
    const links = [] as string[]
    text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
        links.push(url)
        return url
    })
    linkPreviews = linkPreviews.filter((e) => links.includes(e.url ?? e.originalUrl))
    linkPreviews.forEach((e) => {
        text = text.replace(e.url, '')
    })
    return linkify(text)
}

const parseMedia = (mediaObject: Web3Media, linkPreviews: linkPreviewTypeEx[], embeds: Embed[], postTag?: string) => {
    const retArr = [] as mediaType[]
    const frames = [] as string[]
    mediaObject.forEach((e) => {
        if (e.url) {
            if (isProbablyPage(e.url) && postTag === 'farcaster') {
                frames.push(e.url)
                return
            }
            if (e.url.includes('youtube.com')) return
            if (linkPreviews.some((el) => el.img === e.url)) return
            if (embeds.some((el) => el.url === e.url)) return
            if (e.url && (e.title || e.description)) {
                linkPreviews.push({
                    url: e.url,
                    title: e.title ?? '',
                    description: e.description ?? '',
                    img: e.images?.[0] ?? e.url,
                    originalUrl: e.url
                })
                return
            }
            if (isImage(e.url)) {
                retArr.push({ type: 'image', url: parseIpfs(e.url) })
                return
            } else if (isVideo(e.url)) {
                retArr.push({ type: 'video', url: e.url })
                return
            }

        }
        if (e.images) {
            e.images.forEach((el) => {
                if (el) {
                    retArr.push({ type: 'image', url: parseIpfs(el) })
                }
            })
        }
        if (e.videos) {
            e.videos.forEach((el) => {
                if (el) {
                    retArr.push({ type: 'video', url: parseIpfs(el) })
                }
            })
        }
    })
    return { retArr, linkPreviews, frames }
}

const parseEmbeds = (content: string) => {
    const embeds = [] as Embed[]
    const regexYoutube = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+?)( |\n|\t|$)/g
    const regexSpotify = /(?:https?:\/\/)?(?:www\.)?(?:open\.spotify\.com)\/(?:track)\/(.+)/g

    // const regexWarpcast = /(?:https?:\/\/)?(?:www\.)?(?:warpcast\.com)\/(.?)/g

    // const regexLens = /(?:https?:\/\/)?(?:www\.)?(?:hey\.xyz)\/(.?)/g

    // const regexTwitter = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com)\/(.?)/g

    // const regexX = /(?:https?:\/\/)?(?:www\.)?(?:x\.com)\/(.?)/g

    // const regexTco = /(?:https?:\/\/)?(?:www\.)?(?:t\.co)\/(.?)/g



    const youtubeMatch = content.match(regexYoutube)
    const spotifyMatch = content.match(regexSpotify)

    if (youtubeMatch) {
        embeds.push({
            type: 'youtube',
            url: youtubeMatch[0]
        })
    }

    if (spotifyMatch) {
        embeds.push({
            type: 'spotify',
            url: spotifyMatch[0]?.trim()
        })
    }

    // const warpcastMatch = content.match(regexWarpcast)
    // if (warpcastMatch) {
    //     embeds.push({
    //         type: 'farcaster',
    //         url: warpcastMatch[0]
    //     })
    // }

    // const lensMatch = content.match(regexLens)
    // if (lensMatch) {
    //     embeds.push({
    //         type: 'lens',
    //         url: lensMatch[0]
    //     })
    // }

    // const twitterMatch = content.match(regexTwitter)
    // if (twitterMatch) {
    //     embeds.push({
    //         type: 'twitter',
    //         url: twitterMatch[0]
    //     })
    // }

    // const xMatch = content.match(regexX)
    // if (xMatch) {
    //     embeds.push({
    //         type: 'twitter',
    //         url: xMatch[0]
    //     })
    // }

    // const tcoMatch = content.match(regexTco)
    // if (tcoMatch) {
    //     embeds.push({
    //         type: 'twitter',
    //         url: tcoMatch[0]
    //     })
    // }


    return { embeds, content }
}


export const normalizePost = (fullPost: IPost): PostBodyProcessed => {
    const postBuilder = {} as PostBodyProcessed
    postBuilder.userAvatar = fullPost?.web3CreatorProfile?.avatar ?? fullPost?.web3Preview?.creator?.avatarUrl ?? ''
    postBuilder.userHandle = fullPost?.web3CreatorProfile?.handle ?? fullPost?.web3Preview?.creator?.handle ?? 'Anon'
    postBuilder.userName = fullPost?.web3CreatorProfile?.fullname ?? fullPost?.web3Preview?.creator?.fullname ?? 'Anon'
    postBuilder.userAddress = fullPost?.web3CreatorProfile?._id ?? fullPost?.web3Preview?.creator?.address ?? fullPost?.previewData?.creator ?? ''

    // if (!postBuilder.userAddress.startsWith('0x')) {
    //     postBuilder.userAddress = fullPost?.web3Preview?.creator?.address ?? fullPost?.previewData?.creator ?? ''
    // }

    postBuilder.verified = fullPost?.web3Preview?.meta?.isVerifiedAvatar ?? false
    postBuilder.postId = fullPost?._id?.postid ?? fullPost?.id
    const emebeds = parseEmbeds(fullPost?.web3Preview?.content ?? fullPost?.previewData?.description ?? '')

    postBuilder.linkPreviews = fullPost?.web3Preview?.linkPreview?.map(
        (e) =>
            (({
                title: e.title ?? '',
                img: e.img ?? '',
                url: e.url ?? e.originalUrl ?? '',
                description: e?.description ?? ''
            })
            ) ?? []) as linkPreviewTypeEx[]

    postBuilder.linkPreviews = (postBuilder.linkPreviews ?? []).filter((e) => !emebeds.embeds.some((el) => el.url === e.url))
    const parseTheMedia = parseMedia(fullPost?.web3Preview?.attachments ?? [], postBuilder.linkPreviews ?? [], emebeds.embeds, fullPost?.tag ?? fullPost?.web3Preview?.protocol ?? '')

    postBuilder.mediaEntities = parseTheMedia.retArr
    postBuilder.linkPreviews = parseTheMedia.linkPreviews
    postBuilder.frames = parseTheMedia.frames

    const fresPreviews = [] as linkPreviewTypeEx[]
    postBuilder.linkPreviews.forEach((e) => {
        if (e?.url.startsWith('https://t.co/') || e?.url.startsWith('https://twitter.com/') || e?.url.startsWith('https://x.com/')) {
            emebeds.embeds.push({
                type: 'twitter',
                url: e.url,
                linkPreview: e
            })
        } else if (e?.url.startsWith('https://warpcast.com/')) {
            emebeds.embeds.push({
                type: 'farcaster',
                url: e.url,
                linkPreview: e
            })
        } else if (e?.url.startsWith('https://hey.xyz/')) {
            emebeds.embeds.push({
                type: 'lens',
                url: e.url,
                linkPreview: e
            })
        } else {
            fresPreviews.push(e)
        }
    })
    postBuilder.linkPreviews = fresPreviews

    postBuilder.embeds = emebeds.embeds

    postBuilder.body = parseBody(emebeds.content ?? 'N/A', postBuilder.linkPreviews ?? [])
    postBuilder.createdAt = timeAgo(fullPost?.web3Preview?.createdAt ?? fullPost?.createdAt ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString())
    postBuilder.lens = {
        pubId: ''
    }
    postBuilder.lens.pubId = fullPost?.lensId ?? fullPost?.web3Preview?.id?.replace('lens://', '') ?? ''
    postBuilder.farcaster = {
        hash: '',
        fid: 0,
        parentHash: ''
    }
    postBuilder.farcaster.hash = fullPost?.web3Preview?.meta?.hash ?? ''
    postBuilder.farcaster.fid = fullPost?.web3Preview?.meta?.fid ?? fullPost?.web3CreatorProfile?.farcaster?.fid ?? 0
    postBuilder.farcaster.parentHash = fullPost?.web3Preview?.meta?.parentHash ?? ''
    postBuilder.bsky = {
        uri: ''
    }
    postBuilder.bsky.uri = fullPost?.web3Preview?.meta?.uri ?? fullPost?.web3Preview?.id ?? ''
    postBuilder.threads = {
        parentPostID: '',
    }
    postBuilder.threads.parentPostID = fullPost?.web3Preview?.meta?.parentPostId ?? ''
    postBuilder.crossPostGroup = fullPost?.crossPostGroup ?? {}
    postBuilder.qoutedPost = fullPost?.web3Preview?.meta?.quotedPost ?? null

    return postBuilder
}

export const getBlockedPosts = () => {
    try {
        const blockedPosts = localStorage.getItem('blockedPosts')
        if (blockedPosts) {
            const parsed = JSON.parse(blockedPosts)
            const { posts } = parsed ?? {}
            return posts ?? []
        }
        return []
    } catch (error) {
        console.error('getBlockedPosts e: ', error)
        return []
    }
}

export const addBlockedPost = (postId: string) => {
    try {
        const blockedPosts = getBlockedPosts()
        blockedPosts.push(postId)
        localStorage.setItem('blockedPosts', JSON.stringify({ posts: blockedPosts, timestamp: Date.now() }))
    } catch (error) {
        console.error('addBlockedPost e: ', error)
    }
}
export const cleanBlockedPosts = () => {
    try {
        const blockedPosts = localStorage.getItem('blockedPosts')
        if (blockedPosts) {
            const parsed = JSON.parse(blockedPosts)
            const { timestamp } = parsed ?? {}
            if (timestamp) {
                const now = Date.now()
                if (now - timestamp > 1000 * 60 * 60 * 24 * 3) {
                    localStorage.removeItem('blockedPosts')
                }
            }
        }
    } catch (error) {
        console.error('cleanBlockedPosts e: ', error)
    }
}
