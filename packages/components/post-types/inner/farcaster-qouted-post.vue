<template>
  <div
    :class="`pressable openpost relative qouted-border ${isReply ? 'mb-6' : ''}`"
    @click="openLocalPost"
  >
    <div class="flex p-2 overflow-hidden openpost">
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
      <span
        v-if="Object.keys(mainPost.crossPostGroup ?? {})?.length > 1"
        class="mCrossIcon"
      >
        <CrossIconGroup :post="mainPost" />
      </span>
      <span v-else class="flex mfavIco ml-auto">
        <FarcasterIcon class="w-4 h-4" />
      </span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody openpost">
      <div class="qoute-indent openpost"></div>
      <div class="pl-1 w-full openpost">
        <div class="openpost" v-html="mainPost.body"></div>
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

        <LinkPreview
          v-for="(preview, index) in mainPost.linkPreviews"
          :linkPreview="preview"
          :key="preview.url"
          :noImage="index > 0 || mainPost.mediaEntities?.length > 0"
        />

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

        <Frame
          v-for="frameUrl of mainPost?.frames ?? []"
          :url="frameUrl"
          :deps="deps"
          :castDep="castDep"
        />
      </div>
    </div>
    <span
      class="openpost flex opacity-60 h-min space-x-1 items-center rounded-full text-[0.7rem] order-last justify-end mt-4 mr-2"
    >
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ mainPost.createdAt }}
      </p>
    </span>
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
import ExternalEmbeds from "components/post/post-external/external-embeds.vue";
// import { getFarcasterYupThread } from "shared/src/utils/requests/farcaster";
// import { ref } from "vue";
// import { getComments } from 'shared/src/utils/requests/comments'
import LinkPreview from "components/post/linkPreview.vue";
import type { IPostDeps } from "shared/src/types/post";
import { useRouter } from "vue-router";
import CrossIconGroup from "components/post-types/misc/crossicon-group.vue";
import Frame from "components/post/frame.vue";
import { openPost } from "shared/src/utils/post";

const API_BASE = import.meta.env.VITE_YUP_API_BASE as string;

export default defineComponent({
  name: "QoutedPost",
  components: {
    AvatarBtn,
    VideoPlayer,
    FarcasterIcon,
    ImagePreview,
    VerifiedIcon,
    ClockIcon,
    ComentsIcon,
    ExternalEmbeds,
    LinkPreview,
    CrossIconGroup,
    Frame,
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
      default: () => ({}),
    },
    fetchComments: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const numComments = ref(0);
    const router = useRouter();
    const castDep = (props.mainPost?.farcaster as unknown) as {
      hash: string;
      fid: string;
    };

    const openLocalPost = (e: any) => {
      if (!e.target.classList.contains("mention-handle")) {
        if (!e?.target?.classList?.contains("openpost")) return;
        if (!props.mainPost?.postId) return;
        openPost(router, props.mainPost.postId || "");
        e.stopPropagation();
      }
    };

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
      castDep,
      openLocalPost,
    };
  },
});
</script>

<style scoped lang="scss">
.qouted-border {
  border: 1px solid #332d4da2;
  padding: 0.5rem;
  border-radius: 1rem;
  margin-top: 0.4rem;
  max-width: 91vw;
}

.qoute-indent {
  width: 0.2rem;
  margin-left: 0.6rem;
  margin-right: 0.4rem;
}
</style>
