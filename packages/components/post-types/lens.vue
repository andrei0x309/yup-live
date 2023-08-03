<template>
    <div v-if="postType === 'single' || full" ref="postWrap" class="p-4">
    <LensPostBody :replyComp="replyComp" :mainPost="mainPost" :postId="post.id"/>
  </div>
  <div v-else ref="postWrap" class="p-4">
    <LensPostBody v-if="!isComment" :replyComp="replyComp" :mainPost="mainPost" :postId="post.id" :isReply="true" :fetchComments="true" />
    <LensPostBody :replyComp="replyComp" :mainPost="replyPost" />
  </div>
  <div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, PropType } from 'vue'
import { getPostType } from 'shared/src/utils/misc'
import LensPostBody from './inner/lensPostBody.vue'
import { normalizePost } from 'shared/src/utils/post'
import type { linkPreviewTypeEx, mediaType, PostBodyProcessed, IPost, Embed } from 'shared/src/types/post'
// import MD from 'markdown-it'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export default defineComponent({
  name: 'PostLens',
  components: { LensPostBody },
  props: {
    post: {
      required: false,
      type: Object as PropType<IPost>,
      default: () => ({})
    },
    full: {
      type: Boolean,
      default: false
    },
    replyComp: {
      type: Object as PropType<null | ReturnType<typeof defineComponent> >,
      default: null
    },
    apiBase: {
      type: String,
      default: API_BASE
    },
    isComment: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // const store = useMainStore()
    const postType = ref('single')
    const postWrap = ref(null)

    const userObject = {
      userName: '',
      userHandle: '',
      userAvatar: '',
      userAddress: '',
      body: '',
      isVerified: false,
      postId: '',
      mediaEntities: [] as mediaType[],
      lensId: '',
      linkPreviews: [] as linkPreviewTypeEx[],
      embeds: [] as Embed[],
      lens: {
        pubId: '',
      }
    } as PostBodyProcessed

    const mainPost = ref(userObject) as Ref<PostBodyProcessed>
    const replyPost = ref(userObject) as Ref<PostBodyProcessed>

    
    onMounted(() => {
      postType.value = getPostType(props.post)
      switch (postType.value) {
        case 'single': {
          mainPost.value = normalizePost(props.post)
          break
        }
        case 'reply': {
          if (props.full) {
            mainPost.value = normalizePost(props.post)
          } else {
            mainPost.value = normalizePost(props.post?.web3Preview?.meta?.parentPost as IPost)
            replyPost.value = normalizePost(props.post)
          }
          break
        }
      }
    })

 
    return {
      postWrap,
      mainPost,
      postType,
      replyPost
    }
  }
})
</script>

<style lang="scss">
.verIconLens {
  width: 0.8rem;
  fill: rgb(70, 212, 57);
  display: inline;
}
</style>
