import { defineStore } from 'pinia'
import { IMainStore } from 'shared/src/types/store'

const useMainStore = defineStore('main', {
    state: () => {
        return {
            theme: 'light',
            settings: {
                personalizedFeeds: false,
                accountTracking: false
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
        }
    }
}) as () => IMainStore

const useSettingsStore = defineStore('setiings', {
    state: () => {
        return {
            personalizedFeeds: false,
            accountTracking: false,
        } as {
            personalizedFeeds: boolean
            accountTracking: boolean
        }
    }
})


export { useMainStore, useSettingsStore }
