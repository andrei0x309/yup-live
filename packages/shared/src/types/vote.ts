import { IDepsWeb3Profile } from 'shared/src/types/web3/web3Deps'

export interface Vote {
  influence: number
  like: boolean
  postid: string
  rating: number
  lastUpdated: string
  timestamp: string
  voter: string
  _id: {
    voteid: string
  }
}

export interface IVotingDeps extends IDepsWeb3Profile {
  stackAlertError: (message: string) => void
}