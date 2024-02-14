<template>
  <div v-if="processed">
    <div v-if="postType === 'single' || full" ref="postWrap" class="p-2">
      <FarcasterPostBody :replyComp="replyComp" :mainPost="mainPost" :postId="post.id"  :deps="deps" />
    </div>
    <div v-else ref="postWrap" class="p-2">
      <FarcasterPostBody
        v-if="!isComment"
        :replyComp="replyComp"
        :mainPost="mainPost"
        :postId="post.id"
        :isReply="true"
        :fetchComments="true"
        :deps="deps"
      />
      <FarcasterPostBody :replyComp="replyComp" :mainPost="replyPost" :postId="post.id"  :deps="deps" />
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, defineComponent, ref, Ref, PropType } from "vue";
import { getPostType } from "shared/src/utils/misc";
import type { Embed, mediaType } from "shared/src/types/post";
import { normalizePost } from "shared/src/utils/post";
import FarcasterPostBody from "./inner/farcasterPostBody.vue";
import type { IPost, PostBodyProcessed, linkPreviewTypeEx, IPostDeps } from "shared/src/types/post";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "PostFarcaster",
  inheritAttrs: false,
  components: {
    FarcasterPostBody,
  },
  props: {
    post: {
      required: false,
      type: Object as PropType<IPost>,
      default: () => ({}),
    },
    full: {
      type: Boolean,
      default: false,
    },
    replyComp: {
      type: Object as PropType<null | ReturnType<typeof defineComponent>>,
      default: null,
    },
    apiBase: {
      type: String,
      default: API_BASE,
    },
    isComment: {
      type: Boolean,
      default: false,
    },
    deps: {
      type: Object as PropType<IPostDeps>,
      default: () => ({}),
    },
  },
  setup(props) {
    // const store = useMainStore()

    const postWrap = ref(null);
    const processed = ref(false);
    const postType = ref("single");

    const userObject = {
      userName: "",
      userHandle: "",
      userAvatar: "",
      userAddress: "",
      body: "",
      postId: "",
      isVerified: false,
      mediaEntities: [] as mediaType[],
      lensId: "",
      linkPreviews: [] as linkPreviewTypeEx[],
      embeds: [] as Embed[],
      frames: [],
      farcaster: {
        fid: 0,
        hash: "",
        parentHash: "",
      },
    } as PostBodyProcessed;

    const mainPost = ref(userObject) as Ref<PostBodyProcessed>;
    const replyPost = ref(userObject) as Ref<PostBodyProcessed>;

    onMounted(() => {
      postType.value = getPostType(props.post);
      switch (postType.value) {
        case "single": {
          mainPost.value = normalizePost(props.post);
          break;
        }
        case "reply": {
          if (props.full) {
            mainPost.value = normalizePost(props.post);
          } else {
            mainPost.value = normalizePost(
              props.post?.web3Preview?.meta?.parentPost as IPost
            );
            replyPost.value = normalizePost(props.post);
          }
          break;
        }
      }
      processed.value = true;
    });
    return {
      postWrap,
      mainPost,
      replyPost,
      postType,
      processed
    };
  },
});
</script>

<style scoped lang="scss">
.comBorder {
  border: 1px solid rgba(82, 82, 82, 0.425);
  border-radius: 0.3rem;
  padding: 0.7rem;
}

.thread {
  &::before {
    content: "";
    position: absolute;
    top: -0.5rem;
    left: -0.6rem;
    width: 0.02rem;
    height: 108%;
    background-color: #583bf6a8;
  }
}
</style>
