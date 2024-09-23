<template>
  <div v-if="postType === 'single'" class="p-2">
    <BskyPostBody :replyComp="replyComp" :mainPost="mainPost" />
  </div>
  <div v-else class="p-2">
    <BskyPostBody
      v-if="!isComment"
      :replyComp="replyComp"
      :mainPost="mainPost"
      :postId="post.id"
      :isReply="true"
      :fetchComments="true"
    />
    <BskyPostBody :replyComp="replyComp" :mainPost="replyPost" />
  </div>
  <div></div>
</template>

<script lang="ts">
getPostType;
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref, PropType } from "vue";
import BskyPostBody from "./inner/bskyPostBody.vue";
// import MD from 'markdown-it'
// import { getLensComments, lensIdToRaw, rawToLensId } from "shared/src/utils/web3/lens";
import { getPostType } from "shared/src/utils/misc";
import { normalizePost } from "shared/src/utils/post";
import type {
  linkPreviewTypeEx,
  mediaType,
  PostBodyProcessed,
  IPost,
  Embed,
} from "shared/src/types/post";
// import MD from 'markdown-it'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "PostBsky",
  components: { BskyPostBody },
  inheritAttrs: false,
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
    const postType = ref("single");

    const userObject = {
      userName: "",
      userHandle: "",
      userAvatar: "",
      userAddress: "",
      body: "",
      isVerified: false,
      postId: "",
      mediaEntities: [] as mediaType[],
      lensId: "",
      linkPreviews: [] as linkPreviewTypeEx[],
      embeds: [] as Embed[],
      frames: [],
      bsky: {
        uri: "",
      },
    } as PostBodyProcessed;

    const mainPost = ref(userObject) as Ref<PostBodyProcessed>;
    const replyPost = ref(userObject) as Ref<PostBodyProcessed>;

    onMounted(() => {
      console.log("props.post", props.post);

      postType.value = getPostType(props.post);
      mainPost.value.crossPostGroup = props.post?.crossPostGroup ?? {};

      switch (postType.value) {
        case "single": {
          mainPost.value = normalizePost(props.post);
          break;
        }
        case "reply": {
          mainPost.value = normalizePost(
            props.post?.web3Preview?.meta?.parentPost as IPost
          );
          replyPost.value = normalizePost(props.post);
          break;
        }
      }
    });

    return {
      mainPost,
      postType,
      replyPost,
    };
  },
});
</script>

<style lang="scss"></style>
