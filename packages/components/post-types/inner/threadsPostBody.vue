<template>
  <div :class="`relative ${isReply ? 'mb-6' : ''}`">
    <div class="flex p-2 overflow-hidden">
      <AvatarBtn
        :key="mainPost.userAvatar"
        class="w-9 h-9 cursor-pointer"
        imgClass="w-9 h-9"
        :pSource="mainPost.userAvatar"
        :isSelf="false"
        :isTwitter="true"
        :pAccount="mainPost.userHandle"
        @click="
          () => {
            goToCreator();
          }
        "
      />
      <div
        class="flex flex-col text-justify pl-3 cursor-pointer"
        @click="
          () => {
            goToCreator();
          }
        "
      >
        <span>{{ mainPost.userName }}</span>
        <span class="opacity-70"
          >@{{ mainPost.userHandle }}
          <VerifiedIcon v-if="mainPost.verified" class="verIcon"
        /></span>
      </div>
      <span v-if="isReply" class="flex mfavIco ml-auto">
        <ThreadsIcon class="w-5 h-5" />
      </span>
      <span v-else class="inline-block ml-auto"><ThreadsIcon class="w-3 h-3" /></span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
      <div :class="`indent ${isReply ? 'reply-line' : ''}`"></div>
      <div class="pl-1">
        <p v-html="mainPost.body"></p>
        <template
          v-for="media of mainPost.mediaEntities?.filter((e) => e.type === 'video')"
          :key="media.url"
        >
          <VideoPlayer
            v-if="media.type === 'video'"
            :videoSource="media.url"
            class="py-4 rounded-lg"
          />
        </template>
        <ImagePreview
          v-if="mainPost.mediaEntities?.filter((media) => media.type === 'image')?.length"
          :source="
            mainPost.mediaEntities
              ?.filter((media) => media.type === 'image')
              ?.map((e) => e.url) ?? []
          "
          class="py-4 rounded-lg"
          :postId="mainPost.postId"
        />
        <ExternalEmbeds v-if="mainPost?.embeds?.length" :embeds="mainPost.embeds" />

      </div>
    </div>
    <span
      class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end mt-3"
    >
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ mainPost.createdAt }}
      </p>
    </span>
    <div class="flex">
      <!-- <router-link v-if="(numComments ?? 0) > 1" :to="`/post/${mainPost?.postId}`">
      <ComentsIcon class="inline-block w-5 mr-2" />{{ numComments - 1 }}</router-link> -->
      <component
        v-if="replyComp"
        :platforms="['threads']"
        :is="replyComp"
        :showReplyButton="true"
        :replyTo="{
          threads:  mainPost.threads?.parentPostID,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType, ref } from "vue";
import type { PostBodyProcessed } from "shared/src/types/post";
import AvatarBtn from "components/functional/avatarBtn.vue";
import VideoPlayer from "components/post/videoPlayer.vue";
import FarcasterIcon from "icons/src/farcaster.vue";
import ImagePreview from "components/post/imagePreview.vue";
import VerifiedIcon from "icons/src/verified.vue";
import ClockIcon from "icons/src/clock.vue";
import ComentsIcon from "icons/src/comments.vue";
// import { getFarcasterYupThread } from "shared/src/utils/requests/farcaster";
// import { ref } from "vue";
// import { getComments } from 'shared/src/utils/requests/comments'
import type { IPostDeps } from "shared/src/types/post";
import { useRouter } from "vue-router";
import ThreadsIcon from "icons/src/threads.vue";
import ExternalEmbeds from "components/post/post-external/external-embeds.vue"


const API_BASE = import.meta.env.VITE_YUP_API_BASE as string;

export default defineComponent({
  name: "PostFarcasterBody",
  components: {
    AvatarBtn,
    VideoPlayer,
    FarcasterIcon,
    ImagePreview,
    VerifiedIcon,
    ClockIcon,
    ComentsIcon,
    ThreadsIcon,
    ExternalEmbeds
  },
  props: {
    mainPost: {
      type: Object as PropType<PostBodyProcessed>,
      required: true,
    },
    isReply: {
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
    deps: {
      type: Object as PropType<IPostDeps>,
      default: null,
    },
    fetchComments: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const numComments = ref(0);
    const router = useRouter();

    const goToCreator = () => {
      if (props.mainPost.userAddress) {
        router.push(`/web3-profile/${props.mainPost.userAddress}`);
      } else {
        props?.deps?.stackAlertWarning &&
          props.deps.stackAlertWarning("User does not have a connected address");
      }
    };

    onMounted(() => {
      // if(props.fetchComments) {
      //   getComments({
      //   apiBase: props.apiBase,
      //   postId: props.mainPost.postId as string,
      // }).then(res => {
      //   numComments.value = res.numComments
      //   console.log(res.numComments, 'commmeeents', props.mainPost.postId)
      // });
      // }
    });

    return {
      numComments,
      goToCreator,
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
