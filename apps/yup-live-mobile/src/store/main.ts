import { defineStore } from 'pinia'
import { IMainStore } from 'shared/src/types/store'

const useMainStore = defineStore('main', {
    state: () => {
        return {
            theme: 'dark',
            settings: {
                personalizedFeeds: false,
                accountTracking: false,
                lastCheckForUpdate: Date.now(),
                forcedVersion: 0,
                updateMessage: 'The current version of the app is no longer supported. You must update to the latest version to continue using the app. Do you want to update now?',
                updateUrl: 'https://play.google.com/store/apps/details?id=gf.info.yup'
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
            pushNotifications: []
        }
    }
}) as () => IMainStore

export { useMainStore }
