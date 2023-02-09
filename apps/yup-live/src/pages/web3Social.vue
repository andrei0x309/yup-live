<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
      <h2>Check EVM address for Web3 Social Accounts:</h2>
      <div class="flex rounded bg-gray-200 w-min-[20rem] w-max-[25rem] mx-auto my-2">
        <input
          v-model="search"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="0x....."
        />

        <button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100"
          :class="search.length > 0 ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
          :disabled="search.length == 0 || isDataLoading"
          @click="searchUser"
        >
          check
        </button>
      </div>
      <DangLoader v-if="isDataLoading" :unset="true" />
      <div v-if="!isDataLoading" class="flex flex-wrap mx-auto mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center web3-socials">
          <template v-if="yupAccount">
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>YUP Account</h2>
              <p class="p-3">Username: {{ yupAccount.username }}</p>
              <AvatarBtn
                :key="yupAccount.avatar"
                class="w-9 h-9 mx-auto"
                :pSource="yupAccount.avatar"
                :isSelf="false"
                :isTwitter="false"
                :pAccount="yupAccount._id"
              />
              <p class="p-3">YUP Balance: {{ formatNumber(yupAccount.balance.YUP) }}</p>
              <p class="p-3">YUP Score: {{ formatNumber(yupAccount.score, 2) }}</p>
              <p class="p-3">YUP Influence: {{ yupAccount.weight }}</p>
              <router-link :to="`/profile/${yupAccount._id}/feed`">
                <CustomButton class="mx-auto" :icon="refRadarIcon" text="View Profile" />
              </router-link>
            </div>
          </template>
          <template v-else>
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>YUP Account</h2>
              <p class="p-3">Not found for address {{ truncteEVMAddr(addr) }}</p>
              <router-link :to="`/sign-up`">
                <CustomButton class="mx-auto" :icon="refGoToIcon" text="Sign Up" />
              </router-link>
            </div>
          </template>

          <template v-if="farcasterAccount">
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>Farcaster Account</h2>
              <p class="p-3">Username: {{ farcasterAccount.username }}</p>
              <p class="p-3">Account Fid: {{ farcasterAccount.fid }}</p>
              <p class="p-3">Farcaster Address: {{ farcasterAccount.farcaster }}</p>
            </div>
          </template>
          <template v-else>
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>Farcaster Account</h2>
              <p class="p-3">Not found for address {{ truncteEVMAddr(addr) }}</p>
              <p class="p-3">No public registration link available</p>
            </div>
          </template>

          <template v-if="mirrorAccount?.data?.userProfile?.displayName">
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>Mirror Account</h2>
              <p class="p-3">Username: {{ mirrorAccount?.data?.userProfile?.displayName }}</p>
              <AvatarBtn
                :key="mirrorAccount.data.userProfile.avatarURL"
                class="w-9 h-9 mx-auto"
                :pSource="mirrorAccount.data.userProfile.avatarURL"
                :isSelf="false"
                :isTwitter="true"
                :pAccount="mirrorAccount.data.userProfile.displayName"
              />
              <p class="p-3">ENS: {{ mirrorAccount.data.userProfile.ens }}</p>
              <p v-if="mirrorAccount.data.userProfile.theme" class="p-3">
                Theme: [{{ mirrorAccount.data.userProfile.theme.accent }}, {{ mirrorAccount.data.userProfile.theme.colorMode }}]
              </p>
              <a :href="`https://mirror.xyz/${addr}`" _target="_blank" rel="noopener noreferrer nofollow">
                <CustomButton class="mx-auto" :icon="refRadarIcon" text="View Profile" />
              </a>
            </div>
          </template>
          <template v-else>
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>Mirror Account</h2>
              <p class="p-3">Not found for address {{ truncteEVMAddr(addr) }}</p>
              <a :href="`https://mirror.xyz/`" _target="_blank" rel="noopener noreferrer nofollow">
                <CustomButton class="mx-auto" :icon="refGoToIcon" text="Create on Mirror" />
              </a>
            </div>
          </template>

          <template v-if="lensAccount?.data?.defaultProfile?.handle || lensAccount?.data?.fallback">
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>LENS Account</h2>
              <template v-if="lensAccount?.data?.defaultProfile?.handle">
              <p class="p-3">Handle: {{ lensAccount?.data?.defaultProfile?.handle }}</p>
              <AvatarBtn
                :key="lensAccount.data.defaultProfile.picture.original.url"
                class="w-9 h-9 mx-auto"
                :pSource="parseIpfs(lensAccount.data.defaultProfile.picture.original.url)"
                :isSelf="false"
                :isTwitter="true"
                :pAccount="lensAccount.data.defaultProfile.handle"
              />
              <p v-if="lensAccount.data.defaultProfile.name" class="p-3">Lens Name: {{ lensAccount.data.defaultProfile.name }}</p>
              <p class="p-3">Lens Id: {{ lensAccount.data.defaultProfile.id }}</p>
              <p>Stats</p>
              <ul>
              <li>Followers: {{ lensAccount.data.defaultProfile.stats.totalFollowers }}</li>
              <li>Following: {{ lensAccount.data.defaultProfile.stats.totalFollowing }}</li>
              <li>Posts: {{ lensAccount.data.defaultProfile.stats.totalPosts }}</li>
              </ul>
              </template>
              <template v-else>
                <p class="p-3">Handle: {{ lensAccount.data.fallback }}</p>
              </template>
              <!-- <CustomButton
                class="mx-auto"
                :icon="refLensIcon"
                text="Free Follow"
                @click="lensFollow(lensAccount.data.defaultProfile.id)"
              /> -->
            </div>
          </template>
          <template v-else>
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>LENS Account</h2>
              <p class="p-3">Not found for address {{ truncteEVMAddr(addr) }}</p>
              <a :href="`https://claim.lens.xyz`" _target="_blank" rel="noopener noreferrer nofollow">
                <CustomButton class="mx-auto" :icon="refGoToIcon" text="Go To claim" />
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from 'components/vote-list/loader.vue'
import { useMainStore } from '@/store/main'
import { useRoute } from 'vue-router'
import { isValidAddress, formatNumber, truncteEVMAddr } from 'shared/src/utils/misc'
import { parseIpfs } from 'shared/src/utils/web3/ipfs'
import { stackAlertWarning, stackAlertSuccess } from '@/store/alertStore'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import type { MirrorAccountResponse, YUPAccountResponse, FarcasterAccountResponse, LensAccountResponse } from 'shared/src/types/web3/web3Socials'
import RadarIcon from 'icons/src/radar.vue'
import GoToIcon from 'icons/src/goTo.vue'
import LensIcon from 'icons/src/lens.vue'
import CustomButton from 'components/functional/customButton.vue'

const providerOptionsProm = import('shared/src/utils/evm')
const web3Mprom = import('web3modal')
const ethers = import('ethers')

const refRadarIcon = RadarIcon
const refGoToIcon = GoToIcon
const refLensIcon = LensIcon

const API_BASE = import.meta.env.VITE_YUP_API_BASE
const lensGraphQl = 'https://api.lens.dev'
const mirrorEndpoint = 'https://mirror-endpoint.deno.dev'

export default defineComponent({
  name: 'SearchWeb3User',
  components: {
    DangLoader,
    AvatarBtn,
    CustomButton
  },
  setup() {
    const route = useRoute()
    const addr = ref((route.params.addr as string) ?? '')
    const search = ref((route.params.addr as string) ?? '')
    const yupAccount = ref(null) as unknown as Ref<YUPAccountResponse>
    const lensAccount = ref(null) as unknown as Ref<LensAccountResponse>
    const farcasterAccount = ref(null) as unknown as Ref<FarcasterAccountResponse>
    const mirrorAccount = ref(null) as unknown as Ref<MirrorAccountResponse>
    const isDataLoading = ref(false)
    const store = useMainStore()
    const isLoggedIn = ref(store.isLoggedIn)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ethersLib: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userProvider: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let w3Modal: any

    store.$subscribe(() => {
      isLoggedIn.value = store.isLoggedIn
    })

    const siteData = reactive({
      title: `YUP Live - Search Web3 Socials`,
      description: `Find if evm address has web3 accounts...`
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'og:description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'twitter:description',
          content: computed(() => siteData.description)
        }
      ]
    } as unknown as Ref<HeadObject>)


    onUnmounted(() => {
      // do nothing
    })

    const getLensUserData = async (address: string) => {
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

    const getYupData = async (address: string) => {
      try {
        const req = await fetch(`${API_BASE}/accounts/eth?address=${address}`)
        if (req.ok) {
          return await req.json()
        }
      } catch {
        // ignore
      }
      return null
    }

    const getFarcasterData = async (address: string) => {
      try {
        const req = await fetch(`${API_BASE}/profile/farcaster/${address}`)
        if (req.ok) {
          const farcaster = await req.json()
          if ('farcaster' in farcaster) {
              return farcaster
            }
          else {
            return null
          }
        }
      } catch {
        // ignore
      }
      return null
    }

    const getMirrorAccount = async (address: string) => {
      try {
        const req = await fetch(mirrorEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{
	userProfile(address: "${address}"){
		displayName
		avatarURL
		domain
		ens

		theme{
			accent
			colorMode
		}
	}
}`
          })
        })
        if (req.ok) {
          const data = await req.json()
          if ('errors' in data) {
            return null
          }
          return data
        }
      } catch {
        // ignore
      }
      return null
    }

    const resetAccValue = () => {
      lensAccount.value = null as unknown as LensAccountResponse
      yupAccount.value = null as unknown as YUPAccountResponse
      farcasterAccount.value = null as unknown as FarcasterAccountResponse
      mirrorAccount.value = null as unknown as MirrorAccountResponse
    }

    const getAccounsData = async (address: string) => {
      address = address.trim()
      await Promise.all([getYupData(address), getFarcasterData(address), getMirrorAccount(address), getLensUserData(address)]).then(
        ([yupData, farcasterData, mirrorData, lensData]) => {
          resetAccValue()
          if (yupData?.web3Handles?.lens || lensData?.data?.defaultProfile?.handle) {
            const lensResp = {...{data: {}}, ...(lensData ?? {})}
            console.log(lensResp)
            lensResp.data.fallback = yupData?.web3Handles?.lens
            lensAccount.value = lensResp
          }
          if (yupData) {
            yupAccount.value = yupData
          }
          if (farcasterData) {
            farcasterAccount.value = farcasterData
          }
          if (mirrorData) {
            mirrorAccount.value = mirrorData
          }
        }
      )
    }

    const searchUser = async () => {
      if (!isValidAddress(search.value)) {
        stackAlertWarning('Invalid EVM address!')
        return
      }
      isDataLoading.value = true
      await getAccounsData(search.value)
      isDataLoading.value = false
    }

    const prepareForTransaction = async () => {
      if (!userProvider) {
        try {
          await web3Mprom
          const inst = await w3Modal.connect()
          ethersLib = await ethers
          userProvider = new ethersLib.providers.Web3Provider(inst)
        } catch {
          stackAlertWarning('User rejected connection')
          return false
        }
      }
      const { chainId } = await userProvider.getNetwork()
      if (chainId !== 137) {
        stackAlertWarning(`You are on wrong network(${chainId}), please switch to polygon(137)`)
        return false
      }
      return true
    }

    const onLens = async () => {
      if (!(await prepareForTransaction())) {
        return null
      }
      const signer = await userProvider.getSigner()
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
          stackAlertWarning('User rejected signature')
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
              stackAlertWarning("You don't have a LENS account")
              return
            }
            const {
              data: {
                authenticate: { accessToken, refreshToken }
              }
            } = respData
            localStorage.setItem('lensAuthToken', accessToken)
            localStorage.setItem('lensRefreshToken', refreshToken)
            stackAlertSuccess('Lens auth OK')
          }
        }
      }
    }

    const lensFollowMutate = async (id: string) => {
      {
        const req = await fetch(`${lensGraphQl}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-access-token': 'Bearer ' + localStorage.getItem('lensAuthToken') },
          body: JSON.stringify({
            query: `mutation ProxyAction($request: ProxyActionRequest!) {\n  proxyAction(request: $request)\n}`,
            operationName: 'ProxyAction',
            variables: {
              request: {
                follow: {
                  freeFollow: {
                    profileId: `${id}`
                  }
                }
              }
            }
          })
        })
        if (req.ok) {
          const data = await req.json()
          if ('errors' in data) {
            stackAlertWarning(data.errors[0].message)
          } else {
            stackAlertSuccess(`Follow ok for account ${id}`)
          }
        }
      }
    }

    const lensFollow = async (id: string) => {
      if ((await onLens()) !== null) {
        await lensFollowMutate(id)
      }
    }

    onMounted(async () => {
      providerOptionsProm.then((pLib) => {
        web3Mprom.then((lib) => {
          const { default: libDefault } = lib
          w3Modal = new libDefault({
            network: 'matic', // optional
            cacheProvider: false, // optional
            providerOptions: pLib.providerOptions, // required
            theme: store.theme
          })
        })
      })

      isDataLoading.value = true
      if (addr.value) {
        await getAccounsData(addr.value)
      }
      isDataLoading.value = false
    })

    return {
      lensAccount,
      yupAccount,
      farcasterAccount,
      mirrorAccount,
      isDataLoading,
      addr,
      search,
      searchUser,
      isLoggedIn,
      formatNumber,
      refRadarIcon,
      refGoToIcon,
      truncteEVMAddr,
      parseIpfs,
      lensFollow,
      refLensIcon
    }
  }
})
</script>

<style lang="scss">
.table-list {
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-top: 2rem;
  }

  table {
    margin-top: 2rem;
  }

  table tr td {
    padding-bottom: 0.7rem;
    padding-top: 0.7rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
}
.web3-socials {
  .glassCard {
    background: var(--glass-menu-bg);
    color: var(--glassTxt);
    box-shadow: 0 8px 32px 0 var(--glassShadow);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  .token {
    width: 14rem;
    height: 12rem;
  }

  .nft {
    min-height: 20rem;
    max-height: 40rem;
  }
}
</style>