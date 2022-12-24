export interface YUPAccountResponse {
    _id: string;
    username: string
    avatar: string
    createdAt: string
    score: number
    weight: number
    balance: {
        YUP: number
    }
}

export interface MirrorAccountResponse {
    data: {
        userProfile: {
            displayName: string
            avatarURL: string
            domain: string
            ens: string
            theme: {
                accent: string
                colorMode: string
            }
        }
    }
}

export interface LensAccountResponse {
    lens: string
    data: {
        defaultProfile: {
            id: string
            name: string
            handle: string
            picture: {
                original: {
                    url: string
                }
            },

        }
    }
}

export interface FarcasterAccountResponse {
    fid?: string
    farcaster?: string
    username?: string
}
