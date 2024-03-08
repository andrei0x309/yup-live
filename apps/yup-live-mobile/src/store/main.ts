import { defineStore } from 'pinia'
import { IMainStore } from 'shared/src/types/store'
import { PLATFORMS } from 'shared/src/utils/requests/web3-posting'

const useMainStore = defineStore('main', {
    state: () => {
        return {
            theme: 'dark',
            settings: {
                personalizedFeeds: false,
                accountTracking: false,
                lastCheckForUpdate: 0,
                forcedVersion: '',
                updateMessage: 'The current version of the app is no longer supported. You must update to the latest version to continue using the app. Do you want to update now?',
                updateUrl: 'https://play.google.com/store/apps/details?id=gf.info.yup',
                updatePaused: false
            },
            userData: {
                account: '',
                signature: '',
                address: '',
                avatar: '',
                weight: 1,
                authToken: '',
                connected: {
                    farcaster: false,
                    twitter: false,
                    lens: false
                }
            },
            deletePost: '',
            isLoggedIn: false,
            openConnectModal: false,
            pushNotifications: [],
            version: '',
            openPostModal: false,
            openPostModalReply: null,
            openPostPlatforms: PLATFORMS
        }
    }
}) as () => IMainStore

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openPostModal = (state: IMainStore, reply: any | null, platforms = PLATFORMS) => {
    state.openPostModalReply = reply
    state.openPostPlatforms = platforms
    state.openPostModal = true
}

const closePostModal = (state: IMainStore) => {
    state.openPostModalReply = null
    state.openPostPlatforms = PLATFORMS
    state.openPostModal = false
}


export { useMainStore, openPostModal, closePostModal }
