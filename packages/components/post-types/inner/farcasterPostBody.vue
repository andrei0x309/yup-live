<template>
  <div :class="`relative ${isReply ? 'mb-6' : ''}`">
    <div class="flex p-2 overflow-hidden">
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
        <span class="opacity-70"
          >@{{ mainPost.userHandle }}
          <VerifiedIcon v-if="mainPost.verified" class="verIcon"
        /></span>
      </div>
      <span v-if="!isCom" class="inline-block mfavIco ml-auto">
        <FarcasterIcon class="w-5 h-5" />
      </span>
      <span v-else class="inline-block ml-auto"><FarcasterIcon class="w-3 h-3" /></span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
      <div :class="`indent ${isReply ? 'reply-line' : ''}`"></div>
      <div class="pl-1">
        <p v-html="mainPost.body"></p>
        <template v-for="media of mainPost.mediaEntities" :key="media.url">
          <VideoPlayer
            v-if="media.type === 'video'"
            :videoSource="media.url"
            class="py-4 rounded-lg"
          />
          <ImagePreview
            v-if="media.type === 'image'"
            :source="media.url"
            class="py-4 rounded-lg"
          />
        </template>
      </div>
    </div>
    <span
      class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end"
    >
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ mainPost.createdAt }}
      </p>
    </span>
    <div class="flex">
    <router-link v-if="(numComments ?? 0) > 1" :to="`/post/${mainPost.postId}?nested=1`">
    <ComentsIcon class="inline-block w-5 mr-2" />{{ numComments }}</router-link>
    <component :is="replyComp" v-if="replyComp" :showReplyButton="true" :replyTo="{fid: mainPost.userFid, hash:mainPost.hash}"  />
  </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType } from "vue";
import type { Web3PostFarcaster } from "shared/src/types/web3/farcaster";
import AvatarBtn from "components/functional/avatarBtn.vue";
import VideoPlayer from "components/post/videoPlayer.vue";
import FarcasterIcon from "icons/src/farcaster.vue";
import ImagePreview from "components/post/imagePreview.vue";
import VerifiedIcon from "icons/src/verified.vue";
import ClockIcon from "icons/src/clock.vue";
import ComentsIcon from 'icons/src/comments.vue'
import { getFarcasterYupThread } from "shared/src/utils/requests/farcaster";
import { ref } from "vue";

import { config } from "shared/src/utils/config";
const { API_BASE } = config;

export default defineComponent({
  name: "PostFarcasterBody",
  components: {
    AvatarBtn,
    VideoPlayer,
    FarcasterIcon,
    ImagePreview,
    VerifiedIcon,
    ClockIcon,
    ComentsIcon
  },
  props: {
    mainPost: {
      type: Object as PropType<Web3PostFarcaster>,
      required: true,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    isCom: {
      type: Boolean,
      default: false,
    },
    replyComp: {
      type: Object as PropType<ReturnType<typeof defineComponent>>,
      default: null,
    },
    apiBase: {
      type: String,
      default: API_BASE,
    },
  },
  setup(props) {
    const numComments = ref(0)

    onMounted(() => {
      if(props.mainPost.postId) {
      getFarcasterYupThread({
        apiBase: props.apiBase,
        postId: props.mainPost.postId,
      }).then((res: {
        numComments: number;
      }) => {
        numComments.value = res.numComments - 1
        console.log(res.numComments, 'commmeeents')
      });
      }
    });

    return {
      numComments

    };

  },
});
</script>

<style scoped lang="scss">
.verIcon {
  width: 0.8rem;
  fill: rgb(187 85 255);
  display: inline;
}
</style>