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
          <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center wallet-section"
          >
            <div
              v-for="token of polyTokens"
              :key="token.address"
              class="grid-missing flex flex-col p-4 glassCard token"
            >
              <p class="p-3">Token: {{ token.symbol }}</p>
              <ImagePreview
                :source="
                  token.symbol === 'WETH' ? '/res/svg/purple-eth.svg' : token.image
                "
                :imgClass="`${
                  token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'
                } rounded-full rounded-t-full`"
                :noPreviewClass="`${
                  token.symbol === 'WETH' ? 'h-15 w-15' : 'h-13 w-13'
                } rounded-full rounded-t-full`"
                style="border-radius: 9999px"
                :noPreviewParagraph="false"
              />
              <p class="p-3">Balance: {{ formatNumber(token.balance, 4) }}</p>
            </div>
          </div>
          <CustomButton
            v-if="hasMore.polyTokens"
            class="mt-2 mx-auto"
            :mobile="true"
            :icon="AddIcon"
            text="Load more"
            @click="loadMore('polyTokens')"
          />
        </template>
        <template v-if="ethTokens.length > 0">
          <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Ethereum Tokens</h2>
          <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center wallet-section"
          >
            <div
              v-for="token of ethTokens"
              :key="token.address"
              class="grid-missing flex flex-col p-4 glassCard token"
            >
              <p class="p-3">Token: {{ token.symbol }}</p>
              <ImagePreview
                :source="token.symbol === 'ETH' ? '/res/svg/purple-eth.svg' : token.image"
                :imgClass="`${
                  token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'
                } rounded-full rounded-t-full`"
                :noPreviewClass="`${
                  token.symbol === 'ETH' ? 'h-15 w-15' : 'h-13 w-13'
                } rounded-full rounded-t-full`"
                style="border-radius: 9999px"
                :noPreviewParagraph="false"
              />
              <p class="p-3">Balance: {{ formatNumber(token.balance, 4) }}</p>
            </div>
          </div>
          <CustomButton
            v-if="hasMore.ethTokens"
            class="mt-2 mx-auto"
            :mobile="true"
            :icon="AddIcon"
            text="Load more"
            @click="loadMore('ethTokens')"
          />
        </template>
        <template v-if="ethNfts.length > 0">
          <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Ethereum NFTs</h2>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section"
          >
            <div
              v-for="nft of ethNfts"
              :key="nft.address"
              class="grid-missing flex flex-col p-4 glassCard nft"
            >
              <p class="p-3">{{ nft.collectionName }}</p>
              <ImagePreview
                :source="nft.imageURI"
                imgClass="min-w-32 max-h-52"
                noPreviewClass="min-w-32 max-h-52"
                :noPreviewParagraph="false"
              />
              <p class="p-3">
                <a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link"
                  >OpenSea</a
                >
              </p>
            </div>
          </div>
          <CustomButton
            v-if="hasMore.ethNfts"
            class="mt-2 mx-auto"
            :mobile="true"
            :icon="AddIcon"
            text="Load more"
            @click="loadMore('ethNfts')"
          />
        </template>
        <template v-if="polyNfts.length > 0">
          <h2 class="text-[1.1rem] mb-4 uppercase mt-8">Polygon NFTs</h2>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section"
          >
            <div
              v-for="nft of polyNfts"
              :key="nft.address"
              class="grid-missing flex flex-col p-4 glassCard nft"
            >
              <p class="p-3">{{ nft.collectionName }}</p>
              <ImagePreview
                :source="nft.imageURI"
                imgClass="min-w-32 max-h-52"
                noPreviewClass="min-w-32 max-h-52"
                :noPreviewParagraph="false"
              />
              <p class="p-3">
                <a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link"
                  >OpenSea</a
                >
              </p>
            </div>
          </div>
          <CustomButton
            v-if="hasMore.polyNfts"
            class="mt-2 mx-auto"
            :mobile="true"
            :icon="AddIcon"
            text="Load more"
            @click="loadMore('polyNfts')"
          />
        </template>
        <template v-if="poaps.length > 0">
          <h2 class="text-[1.1rem] mb-4 uppercase mt-8">POAPs</h2>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center wallet-section"
          >
            <div
              v-for="nft of poaps"
              :key="nft.eventId"
              class="grid-missing flex flex-col p-4 glassCard nft"
            >
              <p class="p-3">{{ nft.title }}</p>
              <ImagePreview
                :source="nft.image"
                imgClass="min-w-32 max-h-52"
                noPreviewClass="min-w-32 max-h-52"
                :noPreviewParagraph="false"
                :noLightbox="true"
              />
              <p class="p-3">
                <a rel="noopener noreferrer nofollow" target="_blank" :href="nft.link"
                  >Event on POAP</a
                >
              </p>
            </div>
          </div>
          <CustomButton
            v-if="hasMore.poaps"
            class="mt-2 mx-auto"
            :icon="AddIcon"
            :mobile="true"
            text="Load more"
            @click="loadMore('poaps')"
          />
        </template>
      </template>
      <div v-else>
        <h2 class="text-[1.3rem] mt-2 uppercase">{{ accountId }}'s wallet is empty</h2>
        <component
          :is="(catComp as unknown)"
          v-if="catComp !== null"
          class="w-10 mx-auto"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  ref,
  Ref,
  reactive,
  shallowRef,
  PropType,
} from "vue";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from "components/functional/customButton.vue";
import { formatNumber } from "shared/src/utils/misc";
import ImagePreview from "components/post/imagePreview.vue";
import type {
  IProfileToken,
  IProfileNFT,
  IProfilePOAP,
} from "shared/src/types/web3/wallet";
import AddIcon from "icons/src/add.vue";
import { fetchFromWallet, resources, chains } from "shared/src/utils/requests/web3Wallet";
import type { IWeb3Profile } from "shared/src/types/web3Profile";

export default defineComponent({
  name: "MentionSection",
  components: { DangLoader, ImagePreview, CustomButton },
  props: {
    mentions: {
      type: Array as PropType<Array<IWeb3Profile> | null>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["mentionSelected"],
  setup(props, { emit }) {
    const catComp = shallowRef(null) as Ref<unknown>;
    const nothingToShow = ref(false);
    const ethTokens = ref([]) as Ref<IProfileToken[]>;
    const polyTokens = ref([]) as Ref<IProfileToken[]>;
    const ethNfts = ref([]) as Ref<IProfileNFT[]>;
    const polyNfts = ref([]) as Ref<IProfileNFT[]>;
    const poaps = ref([]) as Ref<IProfilePOAP[]>;
    const hasMore = reactive({
      poaps: true,
      ethTokens: true,
      polyTokens: true,
      ethNfts: true,
      polyNfts: true,
    });
    const currentSegment = ref("tokens");

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
      hasMore,
    };
  },
});
</script>

<style lang="scss">
.wallet-section {
  margin-bottom: 2rem;

  .token {
    width: 14rem;
    height: 12rem;

    img {
      height: 3rem;
    }
  }

  .nft {
    min-height: 20rem;
    max-height: 40rem;
  }
}
</style>
