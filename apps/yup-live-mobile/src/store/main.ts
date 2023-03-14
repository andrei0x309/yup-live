import { defineStore } from 'pinia'
import { IMainStore } from 'shared/src/types/store'

const useMainStore = defineStore('main', {
    state: () => {
        return {
            theme: 'light',
            userData: {
                account: '',
                signature: '',
                address: '',
                avatar: '',
                weight: 1,
                authToken: ''
            },
            deletePost: '',
            isLoggedIn: false,
            openConnectModal: false,
            farcaster: '',
            fid: ''
        }
    }
}) as unknown as () => IMainStore

const useSettingsStore = defineStore('setiings', {
    state: () => {
        return {
            personalizedFeeds: false,
            accountTracking: false
        } as {
            personalizedFeeds: boolean
            accountTracking: boolean
        }
    }
})


export { useMainStore, useSettingsStore }
