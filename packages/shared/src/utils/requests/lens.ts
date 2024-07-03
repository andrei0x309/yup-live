import { prepareForTransaction, signedTypeData, TWeb3Libs, getConfig } from '../evmTxs'
import { fetchWAuth } from '../auth'
import { IMainStore } from 'shared/src/types/store'
import type { Ref } from 'vue'
import { walletDisconnect, getWalletAddress } from 'shared/src/utils/login-signup'

const lensGraphQl = 'https://api-v2.lens.dev'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export const YUP_DISPATCHER_ADDRESS = '0xB3e40374054bE93e8328f50FFad1464d0E1D990D'
export const LENS_DISPATCHER_ADDRESSES =
  ['0xC9FA5F824530b0DB3Df97820ded190F849b9bc0d',
    '0x3530c7CAc2E47F27bA82a5d0D3671181171292DB',
    '0x999119915b0d11aE86087F03E312aCC1C2aC750E']

export const getRandomDispatcherAddress = () => {
  return LENS_DISPATCHER_ADDRESSES[Math.floor(Math.random() * LENS_DISPATCHER_ADDRESSES.length)]
}

export const authLens = async ({
  web3Libs,
  stackAlertWarning,
  profileId
}: {
    web3Libs: TWeb3Libs,
    stackAlertWarning?: (msg: string) => void,
    profileId: string
}

) => {

  const wgamiLib = (await prepareForTransaction({
    localWeb3Libs: web3Libs,
    stackAlertWarning,
  }, true))
  if (!(wgamiLib)) {
    return null
  }
  const wgamiCore = wgamiLib.wgamiCore
  let signature

  const address = (await wgamiCore.getAccount(wgamiLib.wgConfig.wagmiConfig)).address ?? ''

  if (address === '') {
    stackAlertWarning && stackAlertWarning('User address could not be retrieved')
    return null
  }

  const req = await fetch(`${lensGraphQl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query Challenge {
challenge(request: { signedBy: "${address}", for: "${profileId}" }) {
  text
  id
}
}`
    })
  })
  if (req.ok) {
    const {
      data: {
        challenge: { text, id }
      }
    } = await req.json()
    try {
      signature = await wgamiCore.signMessage(wgamiLib.wgConfig.wagmiConfig, { message: text })
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
  id: "${id}",
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


const getLensOwnedBy = async (address: string) => {
  const query = `
  query Profiles {
    profiles(request: {where: { ownedBy: ["${address}"] }, limit: Ten })  {
      items {
        id
        handle {
          fullHandle
        }
        signless
        sponsor
      }
    }
  }
  `
  try {
    const req = await fetch(`${lensGraphQl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query
      })
    })
    if (req.ok) {
      const data = await req.json()
      if (!data?.data?.profiles?.items || !data?.data?.profiles?.items.length) {
        return null
      }
      return data.data.profiles.items
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
    return -1
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
      signTypedData: wgamiCore.signTypedData,
      wagmiConfig: wgamiLib.wgConfig.wagmiConfig
    })
    if (!signature) {
      return -3
    }

    const deadline = Math.floor(new Date(data.expiresAt).getTime() / 1000)
    return { signature, deadline, profileId, dispatcher }
  }
  return -2
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

export const setAuthLens = async ({ store, apiBase = API_BASE, profileId, refreshToken, accessToken }:
  { store: IMainStore, apiBase: string, profileId: string, refreshToken: string, accessToken: string }) => {
  const data = {
    auth: {
      lens: {
        profileId,
        refreshToken,
        accessToken
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
  if (store.userData.connected) store.userData.connected.lens = false
  return req.ok
}

const cleanDoConnectLens = ({
  error,
  stackAlertError,
  isConnectToLens
}: {
  error?: string;
  stackAlertError: (message: string) => void;
  isConnectToLens: Ref<boolean>;
}) => {
  if (error) stackAlertError(error);
  isConnectToLens.value = false;
  walletDisconnect();
  return null;
};

const enableSignless = async ({ web3Libs, store, apiBase = API_BASE, }:
  { web3Libs: TWeb3Libs, store: IMainStore, apiBase: string }) => {
  try {
    const wgamiLib = (await prepareForTransaction({
      localWeb3Libs: web3Libs,
    }))
    if (!(wgamiLib)) {
      return -1
    }
    const typeForSignless = await fetchWAuth(store, `${apiBase}/lens/enable-profile-manager-typed-data`, {
      method: 'POST',
    })
    const { id, typedData } = await typeForSignless.json()
    await wgamiLib.wgamiCore.reconnect(wgamiLib.wgConfig.wagmiConfig)

    const signature = await signedTypeData({
      domain: typedData.domain,
      types: typedData.types,
      value: typedData.value,
      signTypedData: wgamiLib.wgamiCore.signTypedData,
      primaryType: 'ChangeDelegatedExecutorsConfig',
      wagmiConfig: wgamiLib.wgConfig.wagmiConfig
    })

    if (!signature) {
      return -3
    }

    await fetchWAuth(store, `${apiBase}/lens/enable-profile-manager`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        signature
      })
    })

  } catch {
    // ignore
  }
}


export const connectLens = async ({
  stackAlertWarning,
  stackAlertSuccess,
  stackAlertError,
  store,
  Web3Libs,
  isConnectToLens,
  settingsModalContent,
  settingsModal,
  resolvePromiseSetDispatcher,
  resolvePromiseSetProfile,
  isConnectedToLens,
  transferData
}: {
  stackAlertWarning: (message: string) => void;
  stackAlertSuccess: (message: string) => void;
  stackAlertError: (message: string) => void;
  store: IMainStore;
  Web3Libs: Ref<TWeb3Libs>;
  isConnectToLens: Ref<boolean>;
  settingsModalContent: Ref<string>;
  settingsModal: Ref<boolean>;
  resolvePromiseSetDispatcher: Ref<(value: unknown) => void | null>;
    resolvePromiseSetProfile: Ref<(value: unknown) => void | null>;
  isConnectedToLens: Ref<boolean>;
    transferData: Ref<null | { type: string; data: any }>;
}) => {
  if (isConnectToLens.value) {
    return;
  }
  isConnectToLens.value = true;
  const address = await getWalletAddress();
  if (!address) {
    return cleanDoConnectLens(
      {
        error: "Error while getting wallet address",
        stackAlertError,
        isConnectToLens,
      }
    );
  }

  const ownedProfiles = await getLensOwnedBy(address);

  if (ownedProfiles?.length === 0 || !ownedProfiles) {
    return cleanDoConnectLens(
      {
        error: "Error no lens found for this wallet address, please check wallet address",
        stackAlertError,
        isConnectToLens,
      }
    );
  }
  let connectProfile: any;

  if (ownedProfiles?.length === 1) {
    connectProfile = ownedProfiles[0];
  } else {
    transferData.value = { type: "lens-profiles", data: ownedProfiles };
    settingsModalContent.value = "lens-profiles";
    settingsModal.value = true;
    const userConfirm = new Promise((resolve) => {
      resolvePromiseSetProfile.value = resolve;
    });
    await userConfirm;
    connectProfile = transferData.value?.data;
  }

  if (!connectProfile) {
    return cleanDoConnectLens(
      {
        error: "Error no profile selected",
        stackAlertError,
        isConnectToLens,
      }
    );
  }

  const profileId = connectProfile?.id;
  const auth = await authLens({
    web3Libs: Web3Libs.value,
    profileId,
    stackAlertWarning
  });
  if (!auth) {
    return cleanDoConnectLens(
      {
        error: "Error while authenticating lens",
        stackAlertError,
        isConnectToLens,
      }
    );
  }
  const { accessToken, refreshToken } = auth;

  const isBanned = !connectProfile?.sponsor

  if (isBanned) {
    return cleanDoConnectLens(
      {
        error: "You are banned to use lens API you can't connect to lens",
        stackAlertError,
        isConnectToLens,
      }
    );
  }

  const needToSetDispatcher = !connectProfile?.signless
  if (needToSetDispatcher) {
    await enableSignless({ web3Libs: Web3Libs.value, store, apiBase: API_BASE })
  }

  // TODO: old setup might be usseful for allowing user to choose lens profile
  // if (needToSetDispatcher) {
  //     settingsModalContent.value = "lens-dispatcher";
  //     settingsModal.value = true;
  //     const userConfirm = new Promise((resolve) => {
  //       resolvePromiseSetDispatcher.value = resolve;
  //     });
  //     if (!(await userConfirm)) {
  //       return cleanDoConnectLens(
  //         {
  //           error: "User refused to set dispatcher",
  //           stackAlertError,
  //           isConnectToLens,
  //         }
  //       );
  //     }
  //     const sigDisp = await setDispatcher({
  //       profileId,
  //       authToken,
  //       web3Libs: Web3Libs.value,
  //       test: false,
  //     });
  //     if (sigDisp === -1) {
  //       return cleanDoConnectLens(
  //         {
  //           error: "Error while loading wallet libraries",
  //           stackAlertError,
  //           isConnectToLens,
  //         }
  //       );
  //     }
  //     if (sigDisp === -2) {
  //       return cleanDoConnectLens(
  //         {
  //           error: "Error while interacting with lens API",
  //           stackAlertError,
  //           isConnectToLens,
  //         }
  //       );
  //     }
  //     if (sigDisp === -3) {
  //       return cleanDoConnectLens(
  //         {
  //           error: "Wallet is not on the right network [Polygon] please switch",
  //           stackAlertError,
  //           isConnectToLens,
  //         }
  //       );
  //     }
  //     const sigDispBackend = await setDispatcherWithBackend({
  //       dispatcher: sigDisp.dispatcher,
  //       profileId,
  //       apiBase: API_BASE,
  //       store,
  //       deadline: sigDisp.deadline,
  //       signature: sigDisp.signature,
  //     });
  //     if (!sigDispBackend) {
  //       return cleanDoConnectLens(
  //         {
  //           error: "Error while signing dispatcher",
  //           stackAlertError,
  //           isConnectToLens,
  //         }
  //       );
  //     }
  // }
  await setAuthLens({
    store,
    apiBase: API_BASE,
    profileId,
    refreshToken,
    accessToken
  });
  isConnectedToLens.value = true;
  isConnectToLens.value = false;
  stackAlertSuccess("Successfully connected to lens");
  return true
};
