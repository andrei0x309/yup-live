<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
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
              :imgClass="`${token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full rounded-t-full`"
              :noPreviewClass="`${token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full rounded-t-full`"
              style="border-radius: 9999px;"
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
              :imgClass="`${token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full rounded-t-full`"
              :noPreviewClass="`${token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'} rounded-full rounded-t-full`"
              style="border-radius: 9999px;"
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
      <component :is="(catComp as unknown)" v-if="catComp !== null" class="w-10 mx-auto" />
    </div>
  </template>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, reactive, shallowRef, PropType } from 'vue'
import DangLoader from 'components/vote-list/loader.vue'
import CustomButton from 'components/functional/customButton.vue'
import { formatNumber } from 'shared/src/utils/misc'
import ImagePreview from 'components/post/imagePreview.vue'
import type { IProfileToken, IProfileNFT, IProfilePOAP } from 'shared/src/types/web3/wallet'
import AddIcon from 'icons/src/add.vue'
import { fetchFromWallet, resources, chains } from 'shared/src/utils/requests/web3Wallet'


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
    },
    apiBase : {
      type: String,
      required: true
    },
    stackAlertError: {
      type: Function as PropType<(msg: string) => void>,
      required: true
    },
  },
  setup(props) {
    const isLoading = ref(true)
    const catComp = shallowRef(null) as Ref<unknown>
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

    const walletLoadArgs = {
      address: props.accountEVMAddr,
      start: 0,
      limit: 11,
      res: resources,
      ch: chains,
      apiBase: props.apiBase
    }
 
    const getProfileWallet = async ({
      address,
      start,
      limit,
      res,
      ch,
      apiBase
    }: {
      address: string
      start: number
      limit: number
      res: string[]
      ch: string[]
      apiBase: string
    }) => {
      const r  = {
            poaps: [] as IProfilePOAP[],
            ethNfts: [] as IProfileNFT[],
            polyNfts: [] as IProfileNFT[],
            ethTokens: [] as IProfileToken[],
            polyTokens: [] as IProfileToken[],
         }
      try {
         const promises = []
        
         if(res.includes('poaps')){
         promises.push(fetchFromWallet({
          apiBase,
          address,
          start,
          limit,
          resource: 'poaps',
          chain: 'ethereum'
        }).then((rz) => {
          r.poaps = rz ?? []
        })) 
      }
      if(res.includes('nfts')){
        if(ch.includes('ethereum')){
          promises.push(fetchFromWallet({
            apiBase,
            address,
            start,
            limit,
            resource: 'nfts',
            chain: 'ethereum'
          }).then((rz) => {
            r.ethNfts = rz ?? []
          }))
        }
        if(ch.includes('polygon')){
          promises.push(fetchFromWallet({
            apiBase,
            address,
            start,
            limit,
            resource: 'nfts',
            chain: 'polygon'
          }).then((rz) => {
            r.polyNfts = rz ?? []
          }))
        }
      }
      if(res.includes('tokens')){
        if(ch.includes('ethereum')){
          promises.push(fetchFromWallet({
            apiBase,
            address,
            start,
            limit,
            resource: 'tokens',
            chain: 'ethereum'
          }).then((rz) => {
            r.ethTokens = rz ?? []
          }))
        }
        if(ch.includes('polygon')){
          promises.push(fetchFromWallet({
            apiBase,
            address,
            start,
            limit,
            resource: 'tokens',
            chain: 'polygon'
          }).then((rz) => {
            r.polyTokens = rz ?? []
          }))
        }
      }

        await Promise.all(promises)
        return r
      } catch {
        props.stackAlertError('Error fetching wallet data')
        return r
      }
    }

    onMounted(async () => {
      if (!props.accountEVMAddr) {
        nothingToShow.value = true
        isLoading.value = false
      } else {
        

        const r = (await getProfileWallet(walletLoadArgs))
          ethNfts.value = r.ethNfts.slice(0, 10)
          if(r.ethNfts.length !== walletLoadArgs.limit) {
            hasMore.ethNfts = false
          }
          polyNfts.value = r.polyNfts.slice(0, 10)
          if(r.polyNfts.length !== walletLoadArgs.limit) {
            hasMore.polyNfts = false
          }
          ethTokens.value = r.ethTokens.slice(0, 10)
          if(r.ethTokens.length !== walletLoadArgs.limit) {
            hasMore.ethTokens = false
          }
          polyTokens.value = r.polyTokens.slice(0, 10)
          if(r.polyTokens.length !== walletLoadArgs.limit) {
            hasMore.polyTokens = false
          }
          poaps.value = r.poaps.slice(0, -1)
          if(r.poaps.length !== walletLoadArgs.limit) {
            hasMore.poaps = false
          }
        }
        isLoading.value = false
      })


    const loadMore = async (type: string) => {
        switch(type) {
          case 'ethTokens': {
            walletLoadArgs.start = ethTokens.value.length
            walletLoadArgs.res = ['tokens']
            walletLoadArgs.ch = ['ethereum']
            const r = await getProfileWallet(walletLoadArgs)
            if(r.ethTokens.length !== walletLoadArgs.limit) {
              hasMore.ethTokens = false
              return
            }
            ethTokens.value = [...ethTokens.value, ...r.ethTokens.slice(0, 10)] 
            break
          }
          case 'polyTokens': {
            walletLoadArgs.start = polyTokens.value.length
            walletLoadArgs.res = ['tokens']
            walletLoadArgs.ch = ['polygon']
            const r = await getProfileWallet(walletLoadArgs)
            if(r.polyTokens.length !== walletLoadArgs.limit) {
              hasMore.polyTokens = false
              return
            }
            polyTokens.value = [...polyTokens.value, ...r.polyTokens.slice(0, 10)] 
            break
          }
          case 'ethNfts': {
            walletLoadArgs.start = ethNfts.value.length
            walletLoadArgs.res = ['nfts']
            walletLoadArgs.ch = ['ethereum']
            const r = await getProfileWallet(walletLoadArgs)
            if(r.ethNfts.length !== walletLoadArgs.limit) {
              hasMore.ethNfts = false
              return
            }
            ethNfts.value = [...ethNfts.value, ...r.ethNfts.slice(0, 10)] 
            break
          }
          case 'polyNfts': {
            walletLoadArgs.start = polyNfts.value.length
            walletLoadArgs.res = ['nfts']
            walletLoadArgs.ch = ['polygon']
            const r = await getProfileWallet(walletLoadArgs)
            if(r.polyNfts.length !== walletLoadArgs.limit) {
              hasMore.polyNfts = false
              return
            }
            polyNfts.value = [...polyNfts.value, ...r.polyNfts.slice(0, 10)] 
            break
          }
          case 'poaps': {
            walletLoadArgs.start = poaps.value.length
            walletLoadArgs.res = ['poaps']
            walletLoadArgs.ch = ['ethereum']
            const r = await getProfileWallet(walletLoadArgs)
            if(r.poaps.length !== walletLoadArgs.limit) {
              hasMore.poaps = false
              return
            }
            poaps.value = [...poaps.value, ...r.poaps.slice(0, 10)]
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
