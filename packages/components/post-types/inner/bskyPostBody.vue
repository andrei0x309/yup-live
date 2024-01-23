<template>
  <div :class="`relative ${isReply ? 'mb-6' : ''}`">
    <div class="flex p-2 overflow-hidden">
      <router-link v-if="mainPost.userAddress" :to="`/web3-profile/${mainPost.userAddress}`">
        <AvatarBtn
          :key="mainPost.userAvatar"
          class="w-9 h-9"
          imgClass="w-9 h-9"
          :pSource="parseIpfs(mainPost.userAvatar)"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainPost.userHandle"
        />
      </router-link>
      <AvatarBtn
          v-else
          :key="mainPost.userAvatar"
          class="w-9 h-9"
          imgClass="w-9 h-9"
          :pSource="parseIpfs(mainPost.userAvatar)"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainPost.userHandle"
        />
        <router-link v-if="mainPost.userAddress" :to="`/web3-profile/${mainPost.userAddress}`">
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainPost.userName }}</span>
          <span class="mainPost-70"
            >@{{ mainPost.userHandle }}
            <!-- <VerifiedIcon v-if="mainPost.verified" class="verIcon"
          /> --></span>
        </div>
      </router-link>
      <div v-else>
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainPost.userName }}</span>
          <span class="mainPost-70"
            >@{{ mainPost.userHandle }}
            <!-- <VerifiedIcon v-if="mainPost.verified" class="verIcon"
          /> --></span>
        </div>
      </div>
      <span v-if="Object.keys(mainPost.crossPostGroup ?? {})?.length > 1" class="mCrossIcon">
        <CrossIconGroup :post="mainPost" />
      </span>
      <span v-else class="flex mfavIco ml-auto">
        <BskyIcon class="w-5 h-5" />
      </span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
      <div :class="`indent ${isReply ? 'reply-line' : ''}`"></div>
      <div class="pl-4">
        <p v-html="mainPost.body"></p>
        <template v-for="media of mainPost.mediaEntities?.filter(e => e.type === 'video')" :key="media.url">
          <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
        </template>
        <ImagePreview v-if="mainPost.mediaEntities?.filter(media => media.type === 'image')?.length" :source="mainPost.mediaEntities?.filter(media => media.type === 'image')?.map(e => e.url) ?? []" class="py-4 rounded-lg" :postId="mainPost.postId" />

 
          <LinkPreview v-for="(preview, index) in mainPost.linkPreviews" :linkPreview="preview" :key="preview.url" :noImage="index > 0 || mainPost.mediaEntities?.length > 0" />

            <ExternalEmbeds v-if="mainPost?.embeds?.length" :embeds="mainPost.embeds" />
      </div>
    </div>
    <span class="flex opacity-60 h-min space-x-1 items-center rounded-full text-[0.7rem] order-last justify-end mt-4 mr-2">
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ mainPost.createdAt }}
      </p>
    </span>
    <div class="flex">
    <!-- <router-link v-if="(numComments ?? 0) > 1" :to="`/post/${mainPost.postId}?nested=1`">
    <ComentsIcon class="inline-block w-5 mr-2" />{{ numComments - 1 }}</router-link> -->
    <component v-if="replyComp" :platforms="['bsky']" :is="replyComp" :showReplyButton="true" :replyTo="{bsky: mainPost?.bsky?.uri}"  />
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import BskyIcon from "icons/src/bsky.vue";
import VideoPlayer from 'components/post/videoPlayer.vue'
import ClockIcon from 'icons/src/clock.vue'
import ImagePreview from 'components/post/imagePreview.vue'
import LinkPreview from 'components/post/linkPreview.vue'
import VerifiedIcon from 'icons/src/verified.vue'
import { parseIpfs } from 'shared/src/utils/web3/ipfs'
import type { PostBodyProcessed } from 'shared/src/types/post'
import ExternalEmbeds from "components/post/post-external/external-embeds.vue"
import CrossIconGroup from "components/post-types/misc/crossicon-group.vue"

export default defineComponent({
  name: 'PostLensBody',
  components: {
    AvatarBtn,
    VideoPlayer,
    ClockIcon,
    ImagePreview,
    VerifiedIcon,
    BskyIcon,
    LinkPreview,
    ExternalEmbeds,
    CrossIconGroup
  },
  props: {
    mainPost: {
      type: Object as PropType<PostBodyProcessed>,
      required: true
    },
    postId: {
      type: String,
      default: ''
    },
    replyComp: {
      type: Object as PropType<ReturnType<typeof defineComponent>>,
      default: null,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      parseIpfs
    }
  }
})
</script>
