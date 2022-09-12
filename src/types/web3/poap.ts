export interface Web3PostPOAP {
    userAddr: string
    userEns: string
    userAvatar: string
    eventName: string
    eventDescription: string
    eventStarted: string
    eventImage: string
    eventUrl: string
    yupAccount: {
        avatar?: string
        username?: string
        _id?: string
    }
    createdAt: string
}

export interface Web3POAPRaw {
    creator: {
        address: string
        ens: string
        meta?: {
            _id: string
            avatar: string
            username: string
            ensAvatar: string
        }
        yupscore?: string
    }
    content: string
    title: string
    meta: {
        event: {
            event_url: string
            event_image: string
            start_date: string
            image_url: string
        }
    }

}