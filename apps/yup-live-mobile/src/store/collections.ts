import { defineStore } from 'pinia'
import { ICollectionStore } from 'shared/dist/types/store'
import { config } from 'shared/dist/utils/config'
const { API_BASE } = config

const useCollectionStore = defineStore('collections', {
  state: () => {
    return {
      collections: [],
      collectionsPromise: null
    } as ICollectionStore
  }
})

const useCollectionStoreEx = defineStore('collectionsEx', {
  state: () => {
    return {
      collections: [],
      collectionsPromise: null
    } as ICollectionStore
  }
})

const getCollections = (store: ICollectionStore, accountId: string, reset = false) => {
  return new Promise((resolve, reject) => {
    if (store.collections && store.collections.length > 0 && !reset) {
      resolve(store.collections)
    } else {
      if (!store.collectionsPromise || reset) {
        store.collectionsPromise = new Promise((resolve) => {
          fetch(`${API_BASE}/accounts/${accountId}/collections`).then((data) => {
            if (!data.ok) {
              reject(data.statusText)
            } else {
              data.json().then((data) => {
                store.collections = data
                resolve(data)
              })
            }
          })
        })
      } else {
        store.collectionsPromise.then((data) => {
          store.collections = data
          resolve(data)
        })
      }
    }
  })
}

export { useCollectionStore, useCollectionStoreEx, getCollections }
