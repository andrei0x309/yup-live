export interface IUserData {
  _id: string | number | symbol | undefined
  username: string
  balance: string
  balanceNum: number
  weight: string
  score: string
  avatar: string
  bio: string
  cum_deposit_time?: number
  nextReset: string
  followers: number
  evmAddress: string
  fullname: string
  actionBars: {
    vote: string
    deleteVote: string
    follow: string
  }
  web3Handles?: {
    farcaster?: string
    lens?: string
  }
  twitterInfo?: {
    userId: string
    username: string
  }
}

export interface NameValue {
  name: string
  value: string
}

export interface PartialAccountInfo {
  _id: string
  avatar: string
  [key: string]: string | unknown | Record<string, unknown> | number
}
