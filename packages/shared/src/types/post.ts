import type { reactive, defineComponent } from 'vue'
import type { IVotingDeps } from 'shared/src/types/vote'
import { IMainStore } from './store'
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
  lensId?: string
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
      avatarUrl: string
      fullname: string
      handle: string
      meta: {
        connectedAddr: string
        fid: number
      }
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
      parentPostId: string
      postType?: string
      hash?: string
      parentHash?: string
      uri?: string
      parents?: Array<IPost['web3Preview']>
      [key: string]: any
    }
    linkPreview?: [
      {
        img: string
        title: string
        description: string
        originalUrl: string
        url: string
      }
    ]
    createdAt?: string
    updatedAt?: string
    parentPost: IPost
    rootPost: IPost
  }
  web3CreatorProfile?: {
    _id: string
    __v: number
    createdAt: string
    ens: { handle: string }
    farcaster: {
      fid: number
      handle: string
      avatar: string
      bio: string
      fullname: string
      verifications: [
        string
      ]
    }
    lens: {
      avatar: string
      handle: string
      profileId: string
    }
    noData: boolean
    updatedAt: string
    yup: {}
    fullname: string
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

export interface IPostDeps extends IVotingDeps {
  CollectMenu?: ReturnType<typeof defineComponent>
  PostMenu?: ReturnType<typeof defineComponent>
  ToolTip?: ReturnType<typeof defineComponent>
}

export type linkPreviewTypeEx = OpenGraphPreview & {
  originalUrl: string
}
export interface PostBodyProcessed {
  userName: string
  userHandle: string
  userAvatar: string
  userAddress: string
  body: string
  createdAt?: string
  verified?: boolean
  mediaEntities: mediaType[]
  linkPreviews: linkPreviewTypeEx[]
  postId?: string
  embeds: Embed[]
  lens?: {
    pubId: string
  }
  farcaster?: {
    hash: string
    fid: number
    parentHash: string
  }
  bsky?: {
    uri: string
  }
  threads?: {
    parentPostID: string
  }
  crossPostGroup?: {
    [key: string]: string
  }
  frames: string[]
}

export type Embed = {
  type: string
  url: string
  linkPreview?: linkPreviewTypeEx
}

// export interface Web3PostFarcaster {
//   userName: string
//   userHandle: string
//   userAvatar: string
//   userAddress: string
//   userFid: string
//   body: string
//   publishedAt?: string
//   verified?: boolean
//   mediaEntities: mediaType[]
//   createdAt: string
//   thread: string
//   hash: string
//   numComments?: number
//   postId?: string
// }