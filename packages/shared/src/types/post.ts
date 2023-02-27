import type { reactive } from 'vue'
export interface IPost {
  _id: {
    postid: string
  }
  previewData?: {
    title: string
    description?: string
    img?: string
    creator?: string
    url?: string
    lastUpdated?: string
  }
  tag?: string
  secondaryTags?: string[]
  createdAt?: string
  updatedAt?: string
  lang?: string
  rating?: {
    overall?: {
      ratingCount?: number
      ratingWeight?: number
    }
  }
  negativeWeight?: number
  positiveWeight?: number
  rawPositiveWeight?: number
  rawNegativeWeight?: number
  web3Preview?: {
    id: string
    contentType: string
    protocol: string
    creator: {
      address: string
    }
    content: string
    attachments: []
    urls: string[]
    meta?: {
      chain?: string
      contractAddress?: string
      tokenId?: string
      name?: string
      description?: string
      tokenUri?: string
      imageUrl?: string
      mediaUrl?: string
      mediaType?: string
      imageData?: string
      attributes?: []
      collectionName?: string
      collectionDescription?: string
      collectionImageUrl?: string
      collectionExternalUrl?: string
      symbol?: string
      totalSupply?: string
      recipient?: {
        address: string
      }
      erc721Postid?: string
      [key: string]: any
    }
    linkPreview?: []
    createdAt?: string
    updatedAt?: string
  }
  web3CreatorProfile?: {
    _id: string
    __v: number
    createdAt: string
    ens: {}
    farcaster: {}
    lens: {}
    noData: boolean
    updatedAt: string
    yup: {}
    avatar: string
    handle: string
  }
  tweetInfo?: Record<string, any>
  claimedCreatorRewards?: number
  [key: string]: any
}

export type IProcessedPost = ReturnType<typeof reactive<{
  id: string
  title: string
  content: string
  image: string
  createdAt: string
  url: string
  isVideo: boolean
  videoType: string
  positiveWeight: number
  negativeWeight: number
  tweetInfo?: Record<string, any>
  web3Preview?: Record<string, any>
  [key: string]: any
}>>

export interface IPostShareInfo {
  title: string
  url: string
  text: string
}

export type IRPostShareInfo = ReturnType<typeof reactive<IPostShareInfo>>

export interface OpenGraphPreview {
  title: string
  img: string
  url: string
  description: string
}

export interface mediaType {
  type: string
  url: string
}
