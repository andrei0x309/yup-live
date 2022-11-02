export interface IUserData {
  account: string
  signature: string
  address: string
  authToken: string
  avatar: string
  weight: number
}

export interface IMainStore {
  theme: string
  userData: IUserData
  isLoggedIn: boolean
  openConnectModal: boolean
  modalLoginState: boolean
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
