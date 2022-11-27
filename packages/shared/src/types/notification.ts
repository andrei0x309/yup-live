export interface NotifType {
    _id: string
    action: string
    voter: string
    like: boolean
    quantity?: number
    post: {
        postid: string
        url: string
    }
    image: string
    createdAt: string
}
