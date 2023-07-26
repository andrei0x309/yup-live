import type { OpenGraphPreview, mediaType } from '../post'
import type { Web3Media } from './media'

export type linkPreviewTypeEx = OpenGraphPreview & {
  originalUrl: string
}
export interface Web3PostLens {
  userName: string
  userHandle: string
  userAvatar: string
  userAddress: string
  body: string
  createdAt?: string
  verified?: boolean
  lensId: string
  mediaEntities: mediaType[]
  linkPreviews: linkPreviewTypeEx[]
}

export interface Web3LensRaw {
  content?: string
  full_text?: string
  attachments: Web3Media
  linkPreview: linkPreviewTypeEx[]
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
  id?: string
  profile?: {
    name?: string
    handle?: string
    ownedBy?: string
    picture?: {
      original: {
        url: string
      }
      uri?: string
    }
  }
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
