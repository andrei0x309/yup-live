<template>
  <div>
    <div class="flex justify-between mt-4 px-4" style="z-index: 1;z-index: 1;position: absolute;width: 100%;">
    <span class="flex mtime h-min space-x-1 items-center rounded-full text-xs font-medium mt-2">
      <ClockIcon class="w-5 h-5" />
      <p class="font-semibold text-xs">
        {{ post.createdAt }}
      </p>
    </span>
    <div class="flex flex-col">
    <span class="flex mfavIco">
      <NFTIco  class="w-10 h-10 p-1"/>
    </span>
    <span class="inline-block mreplyIco mr-4 text-[0.8rem]" style="-webkit-text-stroke: 0.03rem #151515;">
      ERC721
    </span>
  </div>
  </div>
  <VideoPlayer v-if="post.isVideo" :key="`${post.image}-video`" :videoSource="post.web3Preview?.meta?.imageUrl" />
  <ImagePreview v-else :key="post.image" :source="[post.web3Preview?.meta?.imageUrl]" imgClass="min-w-60" :postId="post?.id" />
  <div class="py-2 px-4" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
    <h1 class="text-xl font-medium leading-6 tracking-wide dark:text-gray-300 text-gray-900 cursor-pointer">
      {{ post.web3Preview?.meta?.name ?? post.title }}
    </h1>
  </div>
  <div class="px-4 space-y-2" style="font-size: 0.9rem">
    <p class="font-normal leading-5 tracking-wide">
      {{ post.web3Preview?.creator?.ens ?? truncteEVMAddr(post.web3Preview?.creator?.address) }} has {{ post.web3Preview?.contentType === 'erc721-mint' ? 'minted this NFT.' :''  }}
      {{ post.web3Preview?.contentType === 'erc721-transfer' ? `transfered this nft to ${truncteEVMAddr(post.web3Preview?.meta?.recipient?.address) ?? 'an unknown address.'}` : '' }}
    </p>
  </div>
</div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import ImagePreview from 'components/post/imagePreview.vue'
import NFTIco from 'icons/src/nft.vue'
import VideoPlayer from 'components/post/videoPlayer.vue'
import { truncteEVMAddr } from 'shared/src/utils/misc'
import ClockIcon from 'icons/src/clock.vue'

export default defineComponent({
  name: 'PostERC721',
  inheritAttrs: false,
  components: {
    VideoPlayer,
    ImagePreview,
    NFTIco,
    ClockIcon
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    onMounted(() => {
        // console.log(props.post)
    })

    return {
        truncteEVMAddr
    }
  }
})
</script>