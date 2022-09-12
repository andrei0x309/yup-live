import type { OpenGraphPreview, mediaType } from '@/types/post'
import type { Web3Media } from './media'

export interface Web3PostLens {
    userName: string
    userHandle: string
    userAvatar: string
    body: string
    createdAt?: string
    verified?: boolean
    lensId: string
    mediaEntities: mediaType[]
}

export interface Web3LensRaw {
    content?: string
    full_text?: string
    attachments: Web3Media
    linkPreview: OpenGraphPreview[]
    id?: string
    createdAt?: string
    creator?: {
        address?: string
        fullname?: string
        handle?: string
        avatar?: string
        avatarUrl?: string
        yupScore?: number
    }
    meta?: {
        isVerifiedAvatar: boolean
        metadata?: {
            appId: string
        }
    }
}

export interface lensPostCommentRaw {
    id?: string,
    profile?: {
        name?: string
        handle?: string
        ownedBy?: string
        picture?: {
            original: {
                url: string
            }
        }
    },
    metadata: {
        content?: string
        media?: [
            {
                url: string
                images?: string[]
                video?: string
            }
        ]

    }
    createdAt?: string
}