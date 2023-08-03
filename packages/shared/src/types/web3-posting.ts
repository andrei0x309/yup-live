export type TPlatform = 'farcaster' | 'twitter' | 'lens' | 'bsky' | 'threads'

export type TMedia = {
    faracster: string
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
    }
    threads: string
}

export interface ISendPostData {
    content: string
    platforms: TPlatform[]
    media: TMedia[]
    replyTo?: IReplyTo
}
