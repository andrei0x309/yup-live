<template>
  <div v-if="postType === 'single'" class="p-2">
    <MastodonBody :replyComp="replyComp" :mainPost="mainPost" />
  </div>
  <div v-else class="p-2">
    <MastodonBody
      v-if="!isComment"
      :replyComp="replyComp"
      :mainPost="mainPost"
      :postId="post.id"
      :isReply="true"
      :fetchComments="true"
    />
    <MastodonBody :replyComp="replyComp" :mainPost="replyPost" />
  </div>
  <div></div>
</template>

<script lang="ts">
getPostType;
import { onMounted, defineComponent, ref, Ref, PropType } from "vue";
import MastodonBody from "./inner/mastodonPostBody.vue";
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

export default defineComponent({
  name: "PostMastodon",
  components: { MastodonBody },
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
