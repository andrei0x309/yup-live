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
    result: {
        user: {
            username: string
            displayName: string
            avatar: {
                url: string
                isVerified: boolean
            },
            followerCount: number
            followingCount: number
            profile: {
                directMessageTargets: {
                    telegram: string
                }
            }
        }
    }
}
