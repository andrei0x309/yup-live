import { defineStore } from 'pinia'
import { IMainStore } from 'shared/src/types/store'
import { PLATFORMS } from 'shared/src/utils/requests/web3-posting'

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
        authToken: '',
        connected: {
          farcaster: false,
          twitter: false,
          lens: false,
          bsky: false,
        }
      },
      farcasterFeed: false,
      personalized: false,
      deletePost: '',
      isLoggedIn: false,
      openConnectModal: false,
      modalLoginState: true,
      openPostModal: false,
      openPostModalReply: null,
      openPostPlatforms: PLATFORMS,
      settings: {
        disableNativeLikes: false,
      }
    }
  }
}) as unknown as () => IMainStore

const useGraphStore = defineStore('graph', {
  state: () => {
    return {
      data: []
    } as {
      data: unknown[]
    }
  }
})


const openConnectModal = (state: IMainStore, modalLoginState = true) => {
  state.openConnectModal = true
  state.modalLoginState = modalLoginState
}

const closeConnectModal = (state: IMainStore) => {
  state.openConnectModal = false
  state.modalLoginState = true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openPostModal = (state: IMainStore, reply: any | null, platforms = PLATFORMS) => {
  state.openPostModalReply = reply
  state.openPostPlatforms = platforms
  if (state.openPostModal) {
    state.openPostModal = false
    setTimeout(() => {
      state.openPostModal = true
    }, 100)
  } else {
    state.openPostModal = true
  }
}

const closePostModal = (state: IMainStore) => {
  state.openPostModalReply = null
  state.openPostPlatforms = PLATFORMS
  state.openPostModal = false
}

export { useMainStore, useGraphStore, openConnectModal, closeConnectModal, openPostModal, closePostModal }
