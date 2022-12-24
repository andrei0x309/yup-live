<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user wallet</p>
    <DangLoader :unset="true" />
  </template>
  <template v-else>
    <template v-if="!nothingToShow">
      <h2 class="text-[1.3rem] my-4 uppercase">{{ accountId }}'s Wallet</h2>
      <template v-if="polyTokens.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Polygon Tokens</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center wallet-section">
          <div v-for="token of polyTokens" :key="token.address" class="grid-missing flex flex-col p-4 glassCard token">
            <p class="p-3">Token: {{ token.symbol }}</p>
            <ImagePreview
              :source="token.symbol === 'WETH' ? '/res/svg/purple-eth.svg' : token.image"
              :imgClass="`${token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full`"
              :noPreviewClass="`${token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full `"
              :noPreviewParagraph="false"
            />
            <p class="p-3">Balance: {{ formatNumber(token.balance, 4) }}</p>
          </div>
        </div>
        <CustomButton v-if="hasMore.polyTokens" class="mt-2 mx-auto" :mobile="true" :icon="AddIcon" text="Load more"  @click="loadMore('polyTokens')" />
      </template>
      <template v-if="ethTokens.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Ethereum Tokens</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center wallet-section">
          <div v-for="token of ethTokens" :key="token.address" class="grid-missing flex flex-col p-4 glassCard token">
            <p class="p-3">Token: {{ token.symbol }}</p>
            <ImagePreview
              :source="token.symbol === 'ETH' ? '/res/svg/purple-eth.svg' : token.image"
              :imgClass="`${token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full`"
              :noPreviewClass="`${token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full `"
              :noPreviewParagraph="false"
            />
            <p class="p-3">Balance: {{ formatNumber(token.balance, 4) }}</p>
          </div>
        </div>
        <CustomButton v-if="hasMore.ethTokens" class="mt-2 mx-auto" :mobile="true" :icon="AddIcon" text="Load more"  @click="loadMore('ethTokens')" />
      </template>
      <template v-if="ethNfts.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Ethereum NFTs</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section">
          <div v-for="nft of ethNfts" :key="nft.address" class="grid-missing flex flex-col p-4 glassCard nft">
            <p class="p-3">{{ nft.collectionName }}</p>
            <ImagePreview
              :source="nft.imageURI"
              imgClass="min-w-30 max-h-50"
              noPreviewClass="min-w-30 max-h-50"
              :noPreviewParagraph="false"
            />
            <p class="p-3"><a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link">OpenSea</a></p>
          </div>
        </div>
        <CustomButton v-if="hasMore.ethNfts" class="mt-2 mx-auto"  :mobile="true" :icon="AddIcon" text="Load more"  @click="loadMore('ethNfts')" />
      </template>
      <template v-if="polyNfts.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Polygon NFTs</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section">
          <div v-for="nft of polyNfts" :key="nft.address" class="grid-missing flex flex-col p-4 glassCard nft">
            <p class="p-3">{{ nft.collectionName }}</p>
            <ImagePreview
              :source="nft.imageURI"
              imgClass="min-w-30 max-h-50"
              noPreviewClass="min-w-30 max-h-50"
              :noPreviewParagraph="false"
            />
            <p class="p-3"><a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link">OpenSea</a></p>
          </div>
        </div>
        <CustomButton v-if="hasMore.polyNfts" class="mt-2 mx-auto"  :mobile="true" :icon="AddIcon" text="Load more"  @click="loadMore('polyNfts')" />
      </template>
      <template v-if="poaps.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">POAPs</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section">
          <div v-for="nft of poaps" :key="nft.eventId" class="grid-missing flex flex-col p-4 glassCard nft">
            <p class="p-3">{{ nft.title }}</p>
            <ImagePreview :source="nft.image" imgClass="min-w-30 max-h-50" noPreviewClass="min-w-30 max-h-50" :noPreviewParagraph="false" />
            <p class="p-3"><a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link">Event on POAP</a></p>
          </div>
        </div>
        <CustomButton v-if="hasMore.poaps" class="mt-2 mx-auto" :icon="AddIcon" :mobile="true" text="Load more"  @click="loadMore('poaps')" />
      </template>
    </template>
    <div v-else>
      <h2 class="text-[1.3rem] mt-2 uppercase">{{ accountId }}'s wallet is empty</h2>
      <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
    </div>
  </template>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, reactive } from 'vue'
import DangLoader from 'components/vote-list/loader.vue'
import CustomButton from 'components/functional/customButton.vue'
import { stackAlertError } from '@/store/alertStore'
import { formatNumber } from 'shared/src/utils/misc'
import ImagePreview from 'components/post/imagePreview.vue'
import type { IProfileToken, IProfileNFT, IProfilePOAP } from 'shared/src/types/web3/wallet'
import AddIcon from 'icons/src/add.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE
// CustomButton

export default defineComponent({
  name: 'WalletPage',
  components: { DangLoader, ImagePreview, CustomButton },
  props: {
    accountId: {
      type: String,
      required: true
    },
    accountEVMAddr: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const assets = ref({}) as Ref< {
      yupScore?: number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tokens?: any[] 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nfts?: any[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      poaps?: any[]
    }>
    const isLoading = ref(true)
    const catComp = ref(null) as Ref<unknown>
    const nothingToShow = ref(false)
    const ethTokens = ref([]) as Ref< IProfileToken[]>
    const polyTokens = ref([]) as Ref< IProfileToken[]>
    const ethNfts = ref([]) as Ref< IProfileNFT[]>
    const polyNfts = ref([]) as Ref< IProfileNFT[]>
    const poaps = ref([]) as Ref< IProfilePOAP[]>
    const hasMore = reactive({
      poaps: true,
      ethTokens: true,
      polyTokens: true,
      ethNfts: true,
      polyNfts: true,
    })
    const currentSegment = ref('tokens')



    // colStore.$subscribe(() => {
    //   refCollections.value = colStore.collections
    // })

    const getProfileWallet = async () => {
      try {
        const req = await fetch(`${API_BASE}/profile/${props.accountEVMAddr}`, {
          method: 'GET'
        })
        if (req.ok) {
          return req.json()
        } else {
          return {
            nfts: [],
            tokens: [],
            poaps: []
          }
        }
      } catch {
        stackAlertError(`Network ERROR: when contacting API`)
        return {
          nfts: [],
          tokens: [],
          poaps: []
        }
      }
    }

    onMounted(async () => {
      if (!props.accountEVMAddr) {
        nothingToShow.value = true
        isLoading.value = false
      } else {
        getProfileWallet().then((r) => {
          assets.value = r ?? {}
          if(!('poaps' in assets.value) && !('tokens' in assets.value) && !('nfts' in assets.value)) {
            nothingToShow.value = true
          }
          if ('poaps' in assets.value) {
            poaps.value = assets.value?.poaps?.slice(0, 10) ?? []
            if(poaps.value.length >= (assets.value?.poaps?.length ?? 0)) {
              hasMore.poaps = false
            }
          }
          if ('nfts' in assets.value) {
            ethNfts.value = assets.value?.nfts?.filter(n => n.chain === 'ethereum').slice(0, 10) ?? []
            if(ethNfts.value.length >= (assets.value?.nfts?.filter(n => n.chain === 'ethereum').length ?? 0)) {
              hasMore.ethNfts = false
            }
            polyNfts.value = assets.value?.nfts?.filter(n => n.chain === 'polygon').slice(0, 10) ?? []
            if(polyNfts.value.length >= (assets.value?.nfts?.filter(n => n.chain === 'polygon').length ?? 0)) {
              hasMore.polyNfts = false
            }
          }
          if ('tokens' in assets.value) {
            ethTokens.value = assets.value?.tokens?.filter(n => n.chain === 'ethereum').slice(0, 10) ?? []
            if(ethTokens.value.length >= (assets.value?.tokens?.filter(n => n.chain === 'ethereum').length ?? 0)) {
              hasMore.ethTokens = false
            }
            polyTokens.value = assets.value?.tokens?.filter(n => n.chain === 'polygon').slice(0, 10) ?? []
            if(polyTokens.value.length >= (assets.value?.tokens?.filter(n => n.chain === 'polygon').length ?? 0)) {
              hasMore.polyTokens = false
            }
          }
            isLoading.value = false
        })
      }
    })

    const loadMore = (type: string) => {
        switch(type) {
          case 'ethTokens': {
          ethTokens.value = assets.value?.tokens?.filter(n => n.chain === 'ethereum').slice(0, ethTokens.value.length + 10) ?? []
            if(ethTokens.value.length >= (assets.value?.tokens?.filter(n => n.chain === 'ethereum').length ?? 0)) {
              hasMore.ethTokens = false
            }
            break
          }
          case 'polyTokens': {
            polyTokens.value = assets.value?.tokens?.filter(n => n.chain === 'polygon').slice(0, polyTokens.value.length + 10) ?? []
            if(polyTokens.value.length >= (assets.value?.tokens?.filter(n => n.chain === 'polygon').length ?? 0)) {
              hasMore.polyTokens = false
            }
          break
          }
          case 'ethNfts': {
            ethNfts.value = assets.value?.nfts?.filter(n => n.chain === 'ethereum').slice(0, ethNfts.value.length + 10) ?? []
            if(ethNfts.value.length >= (assets.value?.nfts?.filter(n => n.chain === 'ethereum').length ?? 0)) {
              hasMore.ethNfts = false
            }
          break
          }
          case 'polyNfts': {
            polyNfts.value = assets.value?.nfts?.filter(n => n.chain === 'polygon').slice(0, polyNfts.value.length +  10) ?? []
            if(polyNfts.value.length >= (assets.value?.nfts?.filter(n => n.chain === 'polygon').length ?? 0)) {
              hasMore.polyNfts = false
            }
          break
          }
          case 'poaps': {
            poaps.value = assets.value?.poaps?.slice(0, poaps.value.length + 10) ?? []
            if(poaps.value.length >= (assets.value?.poaps?.length ?? 0)) {
              hasMore.poaps = false
            }
          break
          }
        }

      }

    return {
      isLoading,
      catComp,
        ethTokens,
      polyTokens,
      ethNfts,
      poaps,
      polyNfts,
      nothingToShow,
      loadMore,
      formatNumber,
      AddIcon,
      currentSegment,
      hasMore
    }
  }
})
</script>

<style lang="scss">
.wallet-section {
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
// .grid-missing:last-child:nth-child(3n - 1) {
//   grid-column-end: -2;
// }

// .grid-missing:nth-last-child(2):nth-child(3n + 1) {
//   grid-column-end: 4;
// }

// .grid-missing:last-child:nth-child(3n - 2) {
//   grid-column-end: 5;
// }
</style>
