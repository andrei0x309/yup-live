import { defineStore } from 'pinia'

const useMainStore = defineStore('main', {
  state: () => {
    return {
      theme: 'light'
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

export { useMainStore, useGraphStore }
