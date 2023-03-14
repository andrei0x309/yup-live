import type { Web3Media } from './media'
import type { mediaType } from '../post'

export interface Web3PostFarcaster {
  userName: string
  userHandle: string
  userAvatar: string
  userFid: string
  body: string
  publishedAt?: string
  verified?: boolean
  mediaEntities: mediaType[]
  createdAt: string
  thread: string
  hash: string
  numComments?: number
  postId?: string
}

export interface Web3FarcasterRawReply {
  attachments: {
    openGraph: [{ url: string; image: string }]
  }
  text: string
  "body.data.text"?: string
  "body.username"?: string
  "meta.avatar"?: string
  body?: {
    data?: {
      text: string
    }
    username: string
    publishedAt: number
  }
  author?: {
    displayName: string
    fid: string
    pfp?: {
      url?: string
      verified?: boolean
    }
    username: string
  }
  threadMerkleRoot: string
  threadHash?: string
  timestamp: number  
  hash: string
  meta?: {
    avatar?: string
    displayName?: string
    isVerifiedAvatar?: boolean
  }
}

export interface Web3FarcasterRaw {
  content?: string
  full_text?: string
  attachments: Web3Media
  creator?: {
    address?: string
    fullname?: string
    handle?: string
    avatar?: string
    avatarUrl?: string
    yupScore?: number
    meta?: {
      connectedAddr: string
      fid: string
    }
  }
  meta?: {
    isVerifiedAvatar: boolean
    threadMerkleRoot: string
    threadHash?: string
    hash?: string
  }
  createdAt: string
}
