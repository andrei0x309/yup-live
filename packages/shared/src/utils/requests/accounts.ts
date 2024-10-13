import { getNormalizedValue, getMaxVote, MAX_DELETE_VOTE, MAX_FOLLOW_USAGE, makePercentage, makeRandAvatar, noBio } from '../accounts'
import { formatNumber, truncteEVMAddr } from '../misc'
import type { IUserData } from '../../types/account'
import type { NameValue } from '../../types/account'
import type { IMainStore } from '../../types/store'
import type { Ref } from 'vue'
import type { TPlatform } from '../../types/web3-posting'
import { fetchWAuth } from '../auth'
import { fetchWeb3Profile } from './web3Profiles'

export const API_BASE = import.meta.env.VITE_YUP_API_BASE;
//export const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');


export const getActionUsage = async (userId: string) => {
  try {
    const req = await fetch(`${API_BASE}/accounts/actionusage/${userId}`)
    if (req.ok) {
      return { error: false, data: await req.json() }
    }
    return { error: true, msg: "API didn't return expected response." }
  } catch {
    return { error: true, msg: 'API is not available' }
  }
}

export const createActionUsage = async (userId: string, balance: number) => {
  const data = await getActionUsage(userId)
  if (data.error) return { error: true, msg: 'API returned error' }
  const MAX_VOTE = getMaxVote(balance)
  return {
    nextReset: new Date(data.data.lastReset + 864e5).toLocaleString(),
    actionBars: {
      deleteVote: makePercentage(getNormalizedValue(MAX_DELETE_VOTE - data.data.deleteVoteCount, 0, MAX_DELETE_VOTE)),
      follow: makePercentage(getNormalizedValue(MAX_FOLLOW_USAGE - data.data.followCount, 0, MAX_FOLLOW_USAGE)),
      vote: makePercentage(getNormalizedValue(MAX_VOTE - data.data.createVoteCount, 0, MAX_VOTE))
    }
  }
}

export const getUserData = async (userId: string, refreshWeight = false) => {
  if (!userId) return { error: true, msg: 'No user id provided' }
  try {
    const req = await fetch(`${API_BASE}/accounts/${userId}`)
    if (req.ok) {
      const data = await req.json()
      if (refreshWeight) {
        localStorage.setItem('weight', data.weight)
      }
      return { error: false, data }
    }
    return { error: true, msg: "API didn't return expected response." }
  } catch {
    return { error: true, msg: 'API is not available' }
  }
}

export const createUserData = async (userId: string, refreshWeight = false) => {
  const d = await getUserData(userId, refreshWeight)
  if (d.error) return { error: true, msg: d.msg, data: { userData: {} as unknown as IUserData, userFields: [] as Array<NameValue> } }
  const {
    _id,
    username,
    balance,
    total_vote_value,
    total_claimed_rewards,
    weight,
    lastAddRewardTxDateCreator,
    lastAddRewardTxDateCurator,
    score,
    fullname,
    avatar,
    twitterInfo,
    cum_deposit_time,
    bio,
    createdAt,
    ethInfo,
    web3Handles,
    connected,
    isPro,
    isTwitterBlue
  } = d.data
  const returnData = {
    userData: {
      _id,
      username: username ?? _id,
      balance: formatNumber(balance.YUP),
      balanceNum: balance.YUP,
      weight: formatNumber(weight),
      score: formatNumber(score),
      avatar: avatar ? (avatar.startsWith('https://ipfs2.yup.io') ? makeRandAvatar(_id) : avatar) : makeRandAvatar(_id),
      bio: !bio ? noBio(username) : bio,
      evmAddress: ethInfo?.address ?? '',
      fullname,
      web3Handles,
      twitterInfo,
      isPro: isPro,
      isTwitterBlue: isTwitterBlue,
      connected: connected || {
        farcaster: false,
        twitter: false,
        lens: false,
        bsky: false,
        threads: false
      }
    } as IUserData,
    userFields: [] as Array<NameValue>
  }

  const userInfoFields = [
    {
      name: 'Created At:',
      value: createdAt
    },
    {
      name: 'Cumulative Deposit Time',
      value: formatNumber(cum_deposit_time)
    },
    {
      name: 'Total Rewards Claimed',
      value: formatNumber(isNaN(total_claimed_rewards) ? 0 : total_claimed_rewards)
    },
    {
      name: 'Total Vote Value',
      value: formatNumber(total_vote_value)
    },
    {
      name: 'Last Curator Reward',
      value: lastAddRewardTxDateCurator
    },
    {
      name: 'Last Creator Reward',
      value: lastAddRewardTxDateCreator
    }
  ]
  if (ethInfo?.address) {
    userInfoFields.splice(1, 0, {
      name: 'Linked ETH Address',
      value: truncteEVMAddr(ethInfo.address)
    })
  } else {
    userInfoFields.splice(1, 0, {
      name: 'Linked ETH Address',
      value: 'Not linked'
    })
  }
  if (ethInfo?.isMirror) {
    userInfoFields.splice(2, 0, {
      name: 'Was EOS Mirror',
      value: 'Yes'
    })
  } else {
    userInfoFields.splice(2, 0, {
      name: 'Was EOS Mirror',
      value: 'No'
    })
  }
  if (twitterInfo?.userId) {
    userInfoFields.push({
      name: 'Twitter ID',
      value: twitterInfo.userId
    })
  } else {
    userInfoFields.push({
      name: 'Twitter ID',
      value: 'Not linked'
    })
  }
  if (web3Handles?.lens) {
    userInfoFields.push({
      name: 'Lens',
      value: web3Handles.lens
    })
  }
  if (web3Handles?.farcaster) {
    userInfoFields.push({
      name: 'Farcaster',
      value: web3Handles.farcaster
    })
  }

  returnData.userFields = userInfoFields
  return { error: false, data: returnData }
}

export const editProfile = async ({
  bio,
  fullname,
  avatar,
  authToken,
  loadState = null
}: {
  bio?: string
  fullname?: string
  avatar?: string
  authToken: string
  loadState?: null | Function,
}) => {
  const body = {} as Record<string, string>
  if (bio) body.bio = bio
  if (fullname) body.fullname = fullname
  if (avatar) body.avatar = avatar
  if (Object.keys(body).length > 0) {
    if (loadState) {
      loadState('start', 'Try setting up bio and fullname')
    }
    try {
      const req = await fetch(`${API_BASE}/accounts/edit-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      })
      if (req.ok) {
        return true
      }
      return false
    } catch (e) {
      if (loadState) {
        loadState('start', '')
      }
      return false
    }
  }
}

export const uploadAvatar = ({
  blob,
  isAvatarLoading,
  stackAlertError,
  store,
  avatar,
  stackAlertSuccess
}: {
  blob: Blob
  isAvatarLoading: Ref<boolean>
  stackAlertError: (msg: string) => void
  stackAlertSuccess: (msg: string) => void
  store: IMainStore
  avatar: Ref<string>
}) => {
  isAvatarLoading.value = true
  const fr = new FileReader()
  fr.onloadend = async () => {
    try {
      const split = (fr.result as string)?.split(',')
      const body = {
        data: split[1],
        contentType: split[0].split(':')[1],
        key: 'avatar',
      }
      const res = await fetch(`${API_BASE}/accounts/account/profileImage`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        stackAlertError("Error while uploading avatar, try later.")
        return
      }
      const data = await res.json()
      if (
        await editProfile({
          avatar: data.url,
          authToken: store.userData.authToken,
        })
      ) {
        stackAlertSuccess("Account was changed.");
      } else {
        stackAlertError("Error while uploading avatar, try later.");
      }
      avatar.value = data.url

      isAvatarLoading.value = false
    } catch (e) {
      stackAlertError("Error while uploading avatar, try later.")
    }
  }
  fr.readAsDataURL(blob)
}

export const getConnected = async (store: IMainStore, account: string, address?: string) => {
  // const connectedStore = localStorage.getItem('connected')
  let connected: Record<string, boolean> | null = null
  // try {
  //   if (connectedStore) {
  //     const parseConnected = JSON.parse(connectedStore)
  //     connected = parseConnected
  //     if (!('farcaster' in parseConnected) || !('twitter' in parseConnected) || !('lens' in parseConnected)) {
  //       connected = null
  //     }
  //   }
  // } catch (e) {
  //   connected = null
  // }
  if (!connected) {
    const uD = await createUserData(account, true)
    if (!uD.error) {
      connected = uD.data.userData.connected
      localStorage.setItem('connected', JSON.stringify(connected))
      store.userData.isTwitterBlue = uD.data.userData.isTwitterBlue
    } else {
      connected = {
        farcaster: false,
        twitter: false,
        lens: false,
        bsky: false,
        threads: false
      }
    }
  }
  store.userData.connected = connected as any
  if (store.userData.connected?.farcaster) {
    if (localStorage.getItem('fid')) {
      store.userData.fid = localStorage.getItem('fid') as string
    } else {
      address && fetchWeb3Profile(API_BASE, address).then((res) => {
        if (res?.farcaster?.fid) {
          store.userData.fid = res.farcaster.fid
          localStorage.setItem('fid', res.farcaster.fid)
        }
      })
    }

  }

  return connected
}

export const setConnected = (store: IMainStore, platform: TPlatform, value: boolean) => {
  if (!store.userData.connected) {
    store.userData.connected = {
      farcaster: false,
      twitter: false,
      lens: false,
      bsky: false,
      threads: false,
      mastodon: false
    }
  }
  store.userData.connected[platform] = value
  localStorage.setItem('connected', JSON.stringify(store.userData.connected))
}

export const getBlocks = async ({
  store,
  start = 0,
  limit = 10
}: {
  store: IMainStore
  start?: number
  limit?: number
}) => {
  try {
    const res = await fetchWAuth(store, `${API_BASE}/blocks/?start=${start}&limit=${limit}`)
    if (!res.ok) {
      console.error('getBlocks: not 200', res)
      return []
    }
    return await res.json()
  } catch (e) {
    console.error('getBlocks exception', e)
    return []
  }
}

export const addBlock = async ({
  store,
  address,
  localOnly = false
}: {
  store: IMainStore
  address: string
  localOnly?: boolean
}) => {
  try {
    const localProfileBlocks = localStorage.getItem('profileBlocks')

    try {
      if (localProfileBlocks) {
        const parseProfileBlocks = JSON.parse(localProfileBlocks)
        const { profiles } = parseProfileBlocks
        if (profiles?.includes(address)) {
          return true
        } else {
          profiles.push(address)
          parseProfileBlocks.timestamp = Date.now()
          localStorage.setItem('profileBlocks', JSON.stringify(parseProfileBlocks))
        }
      } else {
        localStorage.setItem('profileBlocks', JSON.stringify({ profiles: [address], timestamp: Date.now() }))
      }
    } catch (e) {
      console.error('addBlock exception', e)
    }

    if (localOnly) {
      return true
    }

    const res = await fetchWAuth(store, `${API_BASE}/blocks`, {
      method: 'POST',
      body: JSON.stringify({ address }),
    })
    if (!res.ok) {
      console.error('addBlock: not 200', res)
      return false
    }


    return true
  } catch (e) {
    console.error('addBlock exception', e)
    return false
  }
}

export const removeBlock = async ({
  store,
  address,
}: {
  store: IMainStore
  address: string
}) => {
  try {
    const localProfileBlocks = localStorage.getItem('profileBlocks')

    try {
      if (localProfileBlocks) {
        const parseProfileBlocks = JSON.parse(localProfileBlocks)
        const { profiles } = parseProfileBlocks
        if (profiles?.includes(address)) {
          profiles.splice(profiles.indexOf(address), 1)
          localStorage.setItem('profileBlocks', JSON.stringify(parseProfileBlocks))
        }
      }
    } catch (e) {
      console.error('removeBlock exception', e)
    }

    const res = await fetchWAuth(store, `${API_BASE}/blocks`, {
      method: 'DELETE',
      body: JSON.stringify({ address }),
    })
    if (!res.ok) {
      console.error('removeBlock: not 200', res)
      return false
    }
    return true
  } catch (e) {
    console.error('removeBlock exception', e)
    return false
  }
}

export const isBlocked = async ({
  store,
  address
}: {
  store: IMainStore
  address: string
}) => {
  const localProfileBlocks = localStorage.getItem('profileBlocks')
  try {
    if (localProfileBlocks) {
      const parseProfileBlocks = JSON.parse(localProfileBlocks)
      const { profiles } = parseProfileBlocks
      if (profiles?.includes(address)) {
        return true
      }
    }
    const blocks = await getBlocks({ store })
    if (blocks?.blocks?.includes(address)) {
      addBlock({ store, address, localOnly: true })
      return true
    }

  } catch (e) {
    console.error('isBlocked exception', e)
  }
  return false
}

export const clearProfileBlocks = () => {
  try {
    const localProfileBlocks = localStorage.getItem('profileBlocks')
    if (localProfileBlocks) {
      const parseProfileBlocks = JSON.parse(localProfileBlocks)
      if (parseProfileBlocks.timestamp) {
        const now = Date.now()
        const sixDays = 6 * 24 * 60 * 60 * 1000
        if (now - parseProfileBlocks.timestamp > sixDays) {
          localStorage.removeItem('profileBlocks')
        }
      }
    }
  } catch (e) {
    console.error('clearProfileBlocks exception', e)
  }
}