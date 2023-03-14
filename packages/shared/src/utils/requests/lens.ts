import type { IethersLib, IuserProvider, Iweb3Modal, Iweb3Mprom, Iethers } from 'shared/src/types/evm'
import { prepareForTransaction, signedTypeData } from '../evmTxs'
import { config } from '../config'
const API_BASE = config.API_BASE || ''
import { fetchWAuth } from '../auth'
import { IMainStore } from 'shared/src/types/store'


const lensGraphQl = 'https://api.lens.dev'
const YUP_DISPATCHER_ADDRESS = '0xB3e40374054bE93e8328f50FFad1464d0E1D990D'

export const authLens = async ({
  depUserProvider,
  w3Modal,
  ethersLib,
  stackAlertWarning,
  web3Mprom,
  ethers,
  stackAlertSuccess
}: {
  depUserProvider: IuserProvider,
  w3Modal: Iweb3Modal,
  ethersLib: IethersLib,
  stackAlertWarning?: (msg: string) => void,
  web3Mprom: Iweb3Mprom,
  ethers: Iethers,
  stackAlertSuccess?: (msg: string) => void
}

) => {
  if (!(await prepareForTransaction({
    depUserProvider,
    w3Modal,
    ethersLib,
    stackAlertWarning,
    web3Mprom,
    ethers
  }))) {
    return null
  }
  const signer = await depUserProvider.value.getSigner()
  console.log(signer)
  let signature
  const req = await fetch(`${lensGraphQl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query Challenge {
challenge(request: { address: "${await signer.getAddress()}" }) {
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
      signature = await signer.signMessage(text)
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
  address: "${await signer.getAddress()}",
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
        localStorage.setItem('lensAuthToken', accessToken)
        localStorage.setItem('lensRefreshToken', refreshToken)
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

export const setDispatcher = async ({ profileId, authToken, userProvider }: { profileId: string, authToken: string, userProvider: IuserProvider }) => {
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
                  dispatcher: "${YUP_DISPATCHER_ADDRESS}"
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
      userProvider
    })
    return { signature, deadline: data.expiresAt, profileId, dispatcher: YUP_DISPATCHER_ADDRESS }
  }
  return null
}

export const setDispatcherYup = async ({ profileId, dispatcher, deadline, signature, apiBase = API_BASE, store }:
  { profileId: string, dispatcher: string, deadline: string, signature: string, apiBase: string, store: IMainStore }) => {
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

  return req.ok
}

export const disconnectLens = async ({ store, apiBase = API_BASE }: { store: IMainStore, apiBase: string }) => {
  const req = await fetchWAuth(store, `${apiBase}/lens/disconnect`, {
    method: 'DELETE'
  })
  localStorage.removeItem('lensAuthToken')
  localStorage.removeItem('lensRefreshToken')
  return req.ok
}

export const isConnectedLens = async ({ store, apiBase = API_BASE }: { store: IMainStore, apiBase: string }) => {
  const req = await fetchWAuth(store, `${apiBase}/web3-auth`, {
    method: 'GET'
  })
  const data = await req.json()
  return data?.lens?.refreshToken
}