export interface IWeb3Profile {
    _id: string
    yup?: {
        avatar: string
        handle: string
        weight: number
    }
    farcaster?: {
        avatar: string
        handle: string
        fid: string
    }
    twitter?: {
        handle: string
    }
    ens?: {
        handle: string
    }
    lens?: {
        handle: string
        avatar: string
        profileId: string
    }
    bsky?: {
        did: string
        handle: string
        avatar: string
    }
    yupScore?: number
    avatar?: string
    handle?: string
    evmAddress: string
    [key: string]: any
}

export interface IWeb3ProfileRecommendation {
    _id: string
    handle: string
    avatar: string
}

export interface IFollowersResponse {
    followers: IWeb3ProfileRecommendation[]
    totalCount: number
}