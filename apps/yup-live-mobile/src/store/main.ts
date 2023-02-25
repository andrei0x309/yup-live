import { defineStore } from 'pinia'

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
})

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
