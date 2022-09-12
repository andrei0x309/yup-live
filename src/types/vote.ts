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
