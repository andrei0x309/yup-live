export interface NotifType {
    _id: string
    eventType: string
    count: number
    senderYupScore: number
    platform: string
    meta: {
        like?: boolean
        quantity?: number
        postid?: string
        url?: string
    }
    image: string
    createdAt: string
    senders: {
        _id: string
        handle: string
        avatar: string
    }[]
}
