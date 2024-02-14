<template>
  <div>
    <div v-if="postType === 'single' || full" ref="postWrap" class="p-2">
      <ThreadsPostBody :replyComp="replyComp" :mainPost="mainPost" :postId="post.id" />
    </div>
    <div v-else ref="postWrap" class="p-2">
      <ThreadsPostBody
        v-if="!isComment"
        :replyComp="replyComp"
        :mainPost="mainPost"
        :postId="post.id"
        :isReply="true"
        :fetchComments="true"
      />
      <ThreadsPostBody :replyComp="replyComp" :mainPost="replyPost" :postId="post.id" />
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, defineComponent, ref, Ref, PropType } from "vue";
import { getPostType } from "shared/src/utils/misc";
import type { mediaType } from "shared/src/types/post";
import { normalizePost } from "shared/src/utils/post";
import ThreadsPostBody from "./inner/threadsPostBody.vue";
import type { IPost, PostBodyProcessed, linkPreviewTypeEx, Embed } from "shared/src/types/post";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "PostThreads",
  inheritAttrs: false,
  components: {
    ThreadsPostBody,
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
  },
  setup(props) {
    // const store = useMainStore()

    const postWrap = ref(null);
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
      frames: [] as string[],
      threads: {
        parentPostID: "",
      }
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
    });
    return {
      postWrap,
      mainPost,
      replyPost,
      postType,
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
