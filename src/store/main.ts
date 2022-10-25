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
        weight: 1,
        authToken: ''
      },
      deletePost: '',
      isLoggedIn: false,
      openConnectModal: false,
      modalLoginState: true
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

const openConnectModal = (state: IMainStore, modalLoginState = true) => {
  state.openConnectModal = true
  state.modalLoginState = modalLoginState
}

const closeConnectModal = (state: IMainStore) => {
  state.openConnectModal = false
  state.modalLoginState = true
}

export { useMainStore, useGraphStore, openConnectModal, closeConnectModal }
