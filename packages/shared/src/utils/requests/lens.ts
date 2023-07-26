import { prepareForTransaction, signedTypeData, TWeb3Libs } from '../evmTxs'
import { config } from '../config'
const API_BASE = config.API_BASE || ''
import { fetchWAuth } from '../auth'
import { IMainStore } from 'shared/src/types/store'


const lensGraphQl = 'https://api.lens.dev'
export const YUP_DISPATCHER_ADDRESS = '0xB3e40374054bE93e8328f50FFad1464d0E1D990D'
export const LENS_DISPATCHER_ADDRESSES =
  ['0xC9FA5F824530b0DB3Df97820ded190F849b9bc0d',
    '0x3530c7CAc2E47F27bA82a5d0D3671181171292DB',
    '0x999119915b0d11aE86087F03E312aCC1C2aC750E']

export const getRandomDispatcherAddress = () => {
  return LENS_DISPATCHER_ADDRESSES[Math.floor(Math.random() * LENS_DISPATCHER_ADDRESSES.length)]
}

export const setLocalLensAuth = async ({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) => {
  localStorage.setItem('lensAuthToken', accessToken)
  localStorage.setItem('lensRefreshToken', refreshToken)
}

export const removeLocalLensAuth = () => {
  localStorage.removeItem('lensAuthToken')
  localStorage.removeItem('lensRefreshToken')
}

export const authLens = async ({
  web3Libs,
  stackAlertWarning,
  stackAlertSuccess
}: {
    web3Libs: TWeb3Libs,
    stackAlertWarning?: (msg: string) => void,
  stackAlertSuccess?: (msg: string) => void
}

) => {

  const wgamiLib = (await prepareForTransaction({
    localWeb3Libs: web3Libs,
    stackAlertWarning,

  }))
  if (!(wgamiLib)) {
    return null
  }
  const wgamiCore = wgamiLib.wgamiCore
  let signature
  const address = (await wgamiCore.getAccount()).address ?? ''
  const req = await fetch(`${lensGraphQl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query Challenge {
challenge(request: { address: "${address}" }) {
  text
}
}`
    })
  })
  if (req.ok) {
    const {
      data: {
        challenge: { text }
      }
    } = await req.json()
    console.log(text)
    try {
      signature = await wgamiCore.signMessage({ message: text })
    } catch (error) {
      stackAlertWarning && stackAlertWarning('User rejected signature')
      return null
    }
    if (signature) {
      const req = await fetch(`${lensGraphQl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation Authenticate {
authenticate(request: {
  address: "${address}",
  signature: "${signature}"
}) {
  accessToken
  refreshToken
}
}`
        })
      })

      if (req.ok) {
        const respData = await req.json()
        if (!('authenticate' in (respData?.data ?? {}))) {
          stackAlertWarning && stackAlertWarning("You don't have a LENS account")
          return
        }
        const {
          data: {
            authenticate: { accessToken, refreshToken }
          }
        } = respData
        setLocalLensAuth({ accessToken, refreshToken })
        stackAlertSuccess && stackAlertSuccess('Lens auth OK')
        return { accessToken, refreshToken }
      }
    }
  }
}

export const getLensUserData = async (address: string) => {
  try {
    const req = await fetch(`${lensGraphQl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query DefaultProfile {
defaultProfile(request: { ethereumAddress: "${address}"}) {
  id
  name
  bio
  isDefault
  attributes {
    displayType
    traitType
    key
    value
  }
  followNftAddress
  metadata
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      chainId
      verified
    }
    ... on MediaSet {
      original {
        url
        mimeType
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      chainId
      verified
    }
    ... on MediaSet {
      original {
        url
        mimeType
      }
    }
  }
  ownedBy
  dispatcher {
    address
    canUseRelay
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
  }
  followModule {
    ... on FeeFollowModuleSettings {
      type
      contractAddress
      amount {
        asset {
          name
          symbol
          decimals
          address
        }
        value
      }
      recipient
    }
    ... on ProfileFollowModuleSettings {
     type
    }
    ... on RevertFollowModuleSettings {
     type
    }
  }
}
}`
      })
    })
    if (req.ok) {
      const data = await req.json()
      if (!data?.data?.defaultProfile) {
        return null
      }
      return data
    }
  } catch {
    // ignore
  }
  return null
}

export const setDispatcher = async ({ profileId, authToken, test = false, web3Libs }: { profileId: string, authToken: string, web3Libs: TWeb3Libs, test: boolean }) => {
  const dispatcher = !test ? getRandomDispatcherAddress() : YUP_DISPATCHER_ADDRESS

  const wgamiLib = (await prepareForTransaction({
    localWeb3Libs: web3Libs,
  }))
  if (!(wgamiLib)) {
    return null
  }
  const wgamiCore = wgamiLib.wgamiCore

  const req = await fetch(`${lensGraphQl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      , 'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      query: `mutation CreateSetDispatcherTypedData {
                createSetDispatcherTypedData(request:{
                  profileId: "${profileId}",
                  dispatcher: "${dispatcher}"
                }) {
                  id
                  expiresAt
                  typedData {
                    types {
                      SetDispatcherWithSig {
                        name
                        type
                      }
                    }
                    domain {
                      name
                      chainId
                      version
                      verifyingContract
                    }
                    value {
                      nonce
                      deadline
                      profileId
                      dispatcher
                    }
                  }
                }
              }
            `})
  })
  if (req.ok) {
    const data = (await req.json())?.data?.createSetDispatcherTypedData
    const signature = await signedTypeData({
      domain: data.typedData.domain,
      types: data.typedData.types,
      value: data.typedData.value,
      signTypedData: wgamiCore.signTypedData
    })
    const deadline = Math.floor(new Date(data.expiresAt).getTime() / 1000)
    return { signature, deadline, profileId, dispatcher }
  }
  return null
}

export const setDispatcherWithBackend = async ({ profileId, dispatcher, deadline, signature, apiBase = API_BASE, store }:
  { profileId: string, dispatcher: string, deadline: number, signature: string, apiBase: string, store: IMainStore }) => {
  const data = {
    profileId,
    dispatcher,
    deadline,
    signature
  }

  const req = await fetchWAuth(store, `${apiBase}/lens/set-dispatcher`, {
    method: 'POST',
    body: JSON.stringify(data)
  })

  return req.ok
}

export const setAuthLens = async ({ store, apiBase = API_BASE, accessToken, refreshToken }: { store: IMainStore, apiBase: string, accessToken: string, refreshToken: string }) => {
  const data = {
    auth: {
      lens: {
        accessToken,
        refreshToken
      }
    }
  }

  const req = await fetchWAuth(store, `${apiBase}/web3-auth`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (store.userData.connected) store.userData.connected.lens = true
  return req.ok
}

export const disconnectLens = async ({ store, apiBase = API_BASE }: { store: IMainStore, apiBase: string }) => {
  const req = await fetchWAuth(store, `${apiBase}/web3-auth`, {
    method: 'DELETE',
    body: JSON.stringify({
      platforms: ['lens']
    })
  })
  removeLocalLensAuth()
  if (store.userData.connected) store.userData.connected.lens = false
  return req.ok
}


export const lensIdToRaw = (lensId: string) => lensId.replace('lens://', '')
export const rawToLensId = (lensId: string) => `lens://${lensId}`

export const getLensComments = async ({ postId, apiBase = API_BASE }: { postId: string, apiBase: string }) => {
  const empty = {
    comments: [],
    numComments: 0,
  }
  if (!postId) return empty;
  const req = await fetch(`${apiBase}/lens/comments/${postId}`);
  if (req.ok) {
    const data = await req.json();
    if (data) {
      return {
        comments: data?.posts ?? [],
        numComments: data?.count ?? 0,
      }
    }
  }
  return empty;
}