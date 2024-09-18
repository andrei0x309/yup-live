import { TPlatform } from "./web3-posting"

export interface IStoreUserData {
  account: string
  signature: string
  address: string
  authToken: string
  avatar: string
  weight: number
  fid: string
  connected?: {
    farcaster: boolean
    twitter: boolean
    lens: boolean
    bsky: boolean
    threads: boolean
  }
  bio?: string
  fullname?: string
  isOwner?: boolean
}

export interface IMainStore {
  theme: string
  userData: IStoreUserData
  isLoggedIn?: boolean
  openConnectModal?: boolean
  openCrossPostModal?: boolean
  modalLoginState?: boolean
  farcaster?: string
  fid?: string
  $subscribe: (fn: (store?: IMainStore) => void) => () => void
  deletePost?: string
  settings?: {
    personalizedFeeds: boolean
    accountTracking: boolean
    lastCheckForUpdate?: number
    forcedVersion?: string
    updateMessage?: string
    updateUrl?: string
    updatePaused?: boolean
    disableNativeLikes?: boolean
  }
  pushNotifications?: string[]
  version?: string,
  openPostModalReply?: any
  openPostModal?: boolean
  openPostShareLink?: string
  openPostPlatforms?: TPlatform[]


}

export interface ICollection {
  _id: string
  postIds: string[]
  owner: string
  name: string
  createdAt: string
  imgSrcUrl: string
  lastUpdated: string
}

export interface ICollectionStore {
  collections: ICollection[]
  collectionsPromise: Promise<ICollection[]> | undefined | null
}
