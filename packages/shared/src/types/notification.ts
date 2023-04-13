export interface NotifType {
    _id: string
    action: string
    voter: string
    VoterHandle: string
    count: number
    like: boolean
    quantity?: number
    post: {
        postid: string
        url: string
    }
    image: string
    createdAt: string
    EVMRecipient: {
        handle: string
        avatar: string
        address: string
    }
    notifications: NotifType[]
}
