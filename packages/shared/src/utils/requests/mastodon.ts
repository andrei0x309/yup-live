import type { IMainStore } from 'shared/src/types/store'
import type { Ref } from 'vue'
import { fetchWAuth } from '../auth'
import { wait } from '../time';

export const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// export const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');

export const getMastodonAuthUrl = async ({
  store,
  instanceURL
}: {
  store: IMainStore
  instanceURL: string
}) => {
  const req = await fetchWAuth(store, `${API_BASE}/mastodon/get-auth-url?instanceURL=${instanceURL}`, {
    method: 'GET',
  })

  if (!req.ok) {
    return ''
  }

  const url = await req.json()

  return url.url as string
}

export const isMastodonConfirmed = async () => {
  const req = await fetch(`${API_BASE}/mastodon/is-confirmed`, {
    method: 'GET',
  })

  if (!req.ok) {
    return false
  }

  const data = await req.json()

  return !!data?.confirmed as boolean
}

export const connectToMastodon = async ({
  store,
  instanceURL,
  isConnectedToMastodon,
  isConnectToMastodon,
  stackAlertError,
  stackAlertSuccess,
  settingsModal,
  cancelWaiting
}: {
  store: IMainStore
  instanceURL: string
  isConnectedToMastodon: Ref<boolean>
  isConnectToMastodon: Ref<boolean>
  stackAlertError: (msg: string) => void
  stackAlertSuccess: (msg: string) => void
  settingsModal: Ref<boolean>,
  cancelWaiting: Ref<boolean>
}) => {
  if (isConnectToMastodon.value) return
  isConnectToMastodon.value = true

  const url = await getMastodonAuthUrl({ store, instanceURL })

  if (!url) {
    isConnectToMastodon.value = false
    stackAlertError('Could not connect, mastodon instance is not valid')
    settingsModal.value = false
    return false
  }


  window.open(url, '_blank')
  let timeout = 300000
  let connected = false
  let error = false
  await wait(500)
  do {
    const req = await fetchWAuth(store, `${API_BASE}/mastodon/is-confirmed`, {
      method: 'GET',
    })
    if (req.ok) {
      const data = await req.json()
      connected = !!data?.confirmed
      error = !!data?.error
    }
    if (cancelWaiting.value) {
      break
    }
    if (error) {
      break
    }
    if (connected) {
      isConnectedToMastodon.value = true
      settingsModal.value = false
      stackAlertSuccess('Successfully connected to Mastodon')
      isConnectToMastodon.value = false
      break
    }
    await wait(500)
    timeout -= 500
    if (timeout <= 0) {
      break
    }
  } while (true)

  if (!connected) {
    isConnectToMastodon.value = false
    settingsModal.value = false
    if (cancelWaiting.value) {
      stackAlertError('Connection to Mastodon was canceled')
    } else if (error) {
      stackAlertError('Could not connect to Mastodon')
    } else if (timeout <= 0) {
      stackAlertError('Connection to Mastodon timed out')
    } else {
      stackAlertError('Could not connect to Mastodon')
    }
    return false
  }
  return true
}

export const disconnectMastodon = async ({
  store,
  stackAlertError,
  stackAlertSuccess,
  isDisconnectFromMastodon,
  isConnectedToMastodon,
}: {
  store: IMainStore
  stackAlertError: (msg: string) => void
  stackAlertSuccess: (msg: string) => void
  isDisconnectFromMastodon: Ref<boolean>
  isConnectedToMastodon: Ref<boolean>
  apiBase?: string
}) => {
  try {
    if (isDisconnectFromMastodon.value) return
    isDisconnectFromMastodon.value = true

    const req = await fetchWAuth(store, `${API_BASE}/web3-auth`, {
      method: 'DELETE',
      body: JSON.stringify({
        platforms: ['mastodon']
      })
    })

    if (!req.ok) {
      stackAlertError('Could not disconnect from Mastodon')
      isDisconnectFromMastodon.value = false
      return false
    }

    if (req.ok) {
      isDisconnectFromMastodon.value = false
      isConnectedToMastodon.value = false
      if (store.userData.connected) store.userData.connected.mastodon = false
      stackAlertSuccess('Successfully disconnected from Mastodon')
    }
    return true
  } catch (e) {
    console.error(e);
    return false
  }
}
