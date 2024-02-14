export type TPlatform = 'farcaster' | 'twitter' | 'lens' | 'bsky' | 'threads'

export type TMedia = {
    farcaster: string
    twitter: string
    lens: string
}

export interface IReplyTo {
    twitter?: string
    lens?: string
    bsky?: string
    farcaster?: {
        fid: string
        hash: string
    } | string
    threads?: string
}

export type TChannel = {
    _id: string
    id: string
    name: string
    image_url: string
    parent_url: string
    description: string
}
export interface ISendPostData {
    content: string
    platforms: TPlatform[]
    media: TMedia[]
    replyTo?: IReplyTo
    time?: number
}

export interface IWeb3ThreadTask {
    _id: string
    platforms: string[]
    posts: Array<{
        crossPostGroupId?: string,
        postIds: Record<TPlatform, any>[] | undefined | {},
        media: Record<TPlatform, any>[] | undefined,
        content: string | {
            [key: string]: string
        }
        replyTo: Record<TPlatform, any> | undefined | {},
        status: { ok: boolean, message?: string, retryable?: boolean } | {}
    }>
    threadIndex: number,
    accountId: string,
    scheduledUnixTime?: number,
    postedFromScheduler: boolean,
    address: string,
    createdAt: Date
    updatedAt: Date
}

export interface IWeb3PostTask {
    _id: string
    platforms: string[]
    media: Record<TPlatform, any>[] | undefined,
    content: string | {
        [key: string]: string
    }
    replyTo: Record<TPlatform, any> | undefined,
    accountId: string
    status: { ok: boolean, message?: string, retryable?: boolean }
    crossPostGroupId?: string,
    scheduledUnixTime?: number,
    postedFromScheduler: boolean,
    address: string,
    taskId: string,
    threadId: string,
    createdAt: Date
    updatedAt: Date
}
