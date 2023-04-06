export const FILTERED_FEED_INDEX_1 = 'feedposts_1day'
export const FILTERED_FEED_INDEX_7 = 'feedposts_7days'
export const FILTERED_FEED_INDEX_30 = 'feedposts_30days'
export const FILTERED_FEED_ALL = 'feedposts_all'

export const FILTERED_FEED_INDEXES = [
    FILTERED_FEED_INDEX_1,
    FILTERED_FEED_INDEX_7,
    FILTERED_FEED_INDEX_30,
    FILTERED_FEED_ALL
]

export const FILTERED_FEED_SETTING_GENERAL = 'general'
export const FILTERED_FEED_SETTING_FOLLOWING = 'following'
export const FILTERED_FEED_SETTING_PERSONALIZED = 'personalized'
export const SearchPlatforms = ['twitter', 'youtube', 'farcaster', 'erc721', 'poap', 'lens', 'mirror', 'general']
export const FILTRED_FEED_SETTING = [FILTERED_FEED_SETTING_GENERAL, FILTERED_FEED_SETTING_FOLLOWING, FILTERED_FEED_SETTING_PERSONALIZED]

export type IPlatform = typeof SearchPlatforms[number]
export type IFEED_INDEX = typeof FILTERED_FEED_INDEXES[number]
export type IFEED_INDEXES = typeof FILTERED_FEED_INDEXES
export type IFEED_PLATFORM_SETTING = 'following' | 'personalized' | 'general'

export interface IFEED_SORT {
    createdAt?: 'asc' | 'desc'
    web3PreviewCreatorYupScore?: 'asc' | 'desc'
}

export interface ISearchFilters {
    tags: IPlatform[]
    web3Creators?: string[]
    setting?: IFEED_PLATFORM_SETTING
    account?: string
    keywords: string[]
    sortBy?: IFEED_SORT
    index: IFEED_INDEX
}

export interface ISearchBody {
    query: ISearchFilters
    account?: string
    name?: string,
    start?: number
}

export interface IFEEDSave {
    account: string
    query: ISearchFilters
    name: string
}

export interface ISearchWeb3Profile {
    _id: string
    handle: string
    avatar: string
}