import type { IPost, IProcessedPost, IRPostShareInfo } from 'shared/src/types/post'
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
        const videoExt = ['.mp4', '.webm', '.ogg', '.avi']
        processedPost.isVideo = videoExt.some((ext) => processedPost.image.includes(ext))
    }
    processedPost.createdAt = timeAgo(post.createdAt ?? `${new Date().getTime() - 3e6 * Math.random()}`)
    processedPost.url = post.url
    processedPost.positiveWeight = post.rawPositiveWeight ?? post.positiveWeight ?? 0
    processedPost.negativeWeight = post.rawNegativeWeight ?? post.negativeWeight ?? 0
    cloneWeights.positiveWeight = post.rawPositiveWeight ?? post.positiveWeight ?? 0
    cloneWeights.negativeWeight = post.rawNegativeWeight ?? post.negativeWeight ?? 0

    postShareInfo.title = processedPost.title
    postShareInfo.url = BASE_URL + '/post/' + processedPost.id
    postShareInfo.text = processedPost.content
}

