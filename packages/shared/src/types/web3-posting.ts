export type TPlatform = 'farcaster' | 'twitter' | 'lens' | 'bsky'

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
}

export interface ISendPostData {
    content: string
    platforms: TPlatform[]
    media: TMedia[]
    replyTo?: IReplyTo
}
