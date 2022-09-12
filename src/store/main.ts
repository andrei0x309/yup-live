import { defineStore } from 'pinia'
import { IMainStore } from '@/types/store'

const useMainStore = defineStore('main', {
  state: () => {
    return {
      theme: 'light',
      userData: {
        account: '',
        signature: '',
        address: '',
        avatar: '',
        weight: 1
      },
      deletePost: '',
      isLoggedIn: false,
      openConnectModal: false
    }
  }
})

const useGraphStore = defineStore('graph', {
  state: () => {
    return {
      data: []
    } as {
      data: unknown[]
    }
  }
})

const openConnectModal = (state: IMainStore) => {
  state.openConnectModal = true
}

const closeConnectModal = (state: IMainStore) => {
  state.openConnectModal = false
}

export { useMainStore, useGraphStore, openConnectModal, closeConnectModal }
