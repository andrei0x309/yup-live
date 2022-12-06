<template>
  <div class="p-4">
    <div class="flex p-2">
      <AvatarBtn
        :key="mainPost.userAvatar"
        class="w-9 h-9"
        :pSource="mainPost.userAvatar"
        :isSelf="false"
        :isTwitter="true"
        :pAccount="mainPost.userHandle"
      />
      <div class="flex flex-col text-justify pl-3">
        <span>{{ mainPost.userName }}</span>
        <span class="mainPost-70">@{{ mainPost.userHandle }} <VerifiedIcon v-if="mainPost.verified" class="verIcon" /></span>
      </div>
      <span class="inline-block favIco ml-auto">
        <router-link v-if="postId" :to="`/post/${postId}`">
          <LensIcon class="w-10 h-10 lensIcon" />
        </router-link>
        <LensIcon v-else class="w-10 h-10 lensIcon" />
      </span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
      <div class="indent"></div>
      <div class="pl-4">
        <p v-html="mainPost.body"></p>
        <template v-for="media of mainPost.mediaEntities" :key="media.url">
          <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
          <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
        </template>
        <!-- <template v-if="linkPreview.img">
          <LinkPreview :linkPreview="linkPreview" />
        </template> -->
      </div>
    </div>
    <span class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end">
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ mainPost.createdAt }}
      </p>
    </span>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType } from 'vue'
import type { Web3PostLens } from 'shared/src/types/web3/lens'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import LensIcon from 'icons/src/lens.vue'
import VideoPlayer from '@/components/content/post/videoPlayer.vue'
import ClockIcon from 'icons/src/clock.vue'
import ImagePreview from '@/components/content/post/imagePreview.vue'
import VerifiedIcon from 'icons/src/verified.vue'
export default defineComponent({
  name: 'PostLensBody',
  components: {
    AvatarBtn,
    VideoPlayer,
    ClockIcon,
    ImagePreview,
    VerifiedIcon,
    LensIcon
  },
  props: {
    mainPost: {
      type: Object as PropType<Web3PostLens>,
      required: true
    },
    postId: {
      type: String,
      default: ''
    }
  },
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>
