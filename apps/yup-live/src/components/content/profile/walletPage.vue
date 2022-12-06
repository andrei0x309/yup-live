<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user wallet</p>
    <DangLoader :unset="true" />
  </template>
  <template v-else>
    <template v-if="!nothingToShow">
      <h2 class="text-[1.3rem] my-4 uppercase">{{ accountId }}'s Wallet</h2>
      <template v-if="refTokensPoly.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Polygon Tokens</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center wallet-section">
          <div v-for="token of refTokensPoly" :key="token.address" class="grid-missing flex flex-col p-4 glassCard token">
            <p class="p-3">Token: {{ token.symbol }}</p>
            <ImagePreview
              :source="token.symbol === 'WETH' ? '/res/svg/purple-eth.svg' : token.image"
              :imgClass="`rounded-b-full rounded-t-full ${token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'}`"
              :noPreviewClass="`rounded-b-full rounded-t-full ${token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'}`"
              :noPreviewParagraph="false"
            />
            <p class="p-3">Balance: {{ formatNumber(token.balance, 4) }}</p>
          </div>
        </div>
      </template>
      <template v-if="refTokensEth.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Ethereum Tokens</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center wallet-section">
          <div v-for="token of refTokensEth" :key="token.address" class="grid-missing flex flex-col p-4 glassCard token">
            <p class="p-3">Token: {{ token.symbol }}</p>
            <ImagePreview
              :source="token.symbol === 'ETH' ? '/res/svg/purple-eth.svg' : token.image"
              :imgClass="`rounded-b-full rounded-t-full ${token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'}`"
              :noPreviewClass="`rounded-b-full rounded-t-full ${token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'}`"
              :noPreviewParagraph="false"
            />
            <p class="p-3">Balance: {{ formatNumber(token.balance, 4) }}</p>
          </div>
        </div>
      </template>
      <template v-if="refNftsEth.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Ethereum NFTs</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section">
          <div v-for="nft of refNftsEth" :key="nft.address" class="grid-missing flex flex-col p-4 glassCard nft">
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
      </template>
      <template v-if="refNftsPoly.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Polygon NFTs</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section">
          <div v-for="nft of refNftsPoly" :key="nft.address" class="grid-missing flex flex-col p-4 glassCard nft">
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
      </template>
      <template v-if="POAPS.length > 0">
        <h2 class="text-[1.1rem] mb-4 uppercase mt-8">POAPs</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section">
          <div v-for="nft of POAPS" :key="nft.eventId" class="grid-missing flex flex-col p-4 glassCard nft">
            <p class="p-3">{{ nft.title }}</p>
            <ImagePreview :source="nft.image" imgClass="min-w-30 max-h-50" noPreviewClass="min-w-30 max-h-50" :noPreviewParagraph="false" />
            <p class="p-3"><a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link">Event on POAP</a></p>
          </div>
        </div>
      </template>
    </template>
    <div v-else>
      <h2 class="text-[1.3rem] mt-2 uppercase">{{ accountId }}'s wallet is empty</h2>
      <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
    </div>
  </template>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import DangLoader from 'components/vote-list/loader.vue'
// import CustomButton from 'components/functional/customButton.vue'
import { stackAlertError } from '@/store/alertStore'
import { formatNumber } from 'shared/src/utils/misc'
import ImagePreview from '@/components/content/post/imagePreview.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE
// CustomButton

export default defineComponent({
  name: 'WalletPage',
  components: { DangLoader, ImagePreview },
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
    interface IProfileToken {
      address: string
      balance: number
      image: string
      name: string
      symbol: string
    }

    interface IProfileNFT {
      address: string
      collectionImageURI: string
      collectionName: string
      imageURI: string
      link: string
      tokenId: number
    }

    interface IProfilePOAP {
      description: string
      eventId: string
      image: string
      link: string
      title: string
    }

    const isLoading = ref(true)
    const catComp = ref(null) as Ref<unknown>
    const nothingToShow = ref(false)
    const refTokensPoly = ref([]) as unknown as Ref<IProfileToken[]>
    const refTokensEth = ref([]) as unknown as Ref<IProfileToken[]>
    const refNftsPoly = ref([]) as unknown as Ref<IProfileNFT[]>
    const refNftsEth = ref([]) as unknown as Ref<IProfileNFT[]>
    const POAPS = ref([]) as unknown as Ref<IProfilePOAP[]>

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
          console.log(r)
          if (r?.nfts.length > 0 && r?.tokens.length > 0 && r?.poaps.length > 0) {
            refTokensPoly.value = r?.tokens.filter((e: { chain: string }) => e.chain === 'polygon') ?? []
            refTokensEth.value = r?.tokens.filter((e: { chain: string }) => e.chain === 'ethereum') ?? []
            refNftsPoly.value =
              r?.nfts.filter((e: { chain: string }) => e.chain === 'polygon').filter((e: IProfileNFT) => e?.imageURI) ?? []
            refNftsEth.value = r?.nfts.filter((e: { chain: string }) => e.chain === 'ethereum') ?? []
            POAPS.value = r?.poaps ?? []
            console.log(refTokensPoly, refTokensEth, refNftsPoly, refNftsEth)
            isLoading.value = false
          } else {
            nothingToShow.value = true
            isLoading.value = false
          }
        })
      }
    })

    return {
      isLoading,
      catComp,
      refTokensPoly,
      refTokensEth,
      refNftsPoly,
      refNftsEth,
      POAPS,
      nothingToShow,
      formatNumber
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
