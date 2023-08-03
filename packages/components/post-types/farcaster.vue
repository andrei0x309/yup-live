<template>
  <div>
  <div v-if="postType === 'single' || full" ref="postWrap" class="p-4">
    <FarcasterPostBody :replyComp="replyComp" :mainPost="mainPost" :postId="post.id"/>
  </div>
  <div v-else ref="postWrap" class="p-4">
    <FarcasterPostBody v-if="!isComment" :replyComp="replyComp" :mainPost="mainPost" :postId="post.id" :isReply="true" :fetchComments="true" />
    <FarcasterPostBody :replyComp="replyComp" :mainPost="replyPost" :postId="post.id" />
  </div>
</div>
</template>
<script lang="ts">

import { onMounted, defineComponent, ref, Ref, PropType } from 'vue'
import { getPostType } from 'shared/src/utils/misc'
import type { Embed, mediaType } from 'shared/src/types/post'
import { normalizePost } from 'shared/src/utils/post'
import FarcasterPostBody from './inner/farcasterPostBody.vue'
import type { IPost, PostBodyProcessed, linkPreviewTypeEx } from 'shared/src/types/post'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: 'PostFarcaster',
  components: {
    FarcasterPostBody
  },
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

    const postWrap = ref(null)
    const postType = ref('single')

    const userObject = {
      userName: '',
      userHandle: '',
      userAvatar: '',
      userAddress: '',
      body: '',
      postId: '',
      isVerified: false,
      mediaEntities: [] as mediaType[],
      lensId: '',
      linkPreviews: [] as linkPreviewTypeEx[],
      embeds: [] as Embed[],
      faracster: {
        fid: 0,
        hash: '',
        parentHash: '',
      },
    } as PostBodyProcessed

    const mainPost = ref(userObject) as Ref<PostBodyProcessed>
    const replyPost = ref(userObject) as Ref<PostBodyProcessed>

    // const parseBody = (text: string) => {
    //   return text
    //     .replace(/(http|https)(.*)( \n|\t|\s|$){1}/gi, "<a href='$1$2' rel='noFollow' target='_blank'>$1$2</a>$3")
    //     .replace(/@(.*?)($|\s|\t|\n)/g, "<a href='https://twitter.com/$1' rel='noFollow' target='_blank'>@$1</a>$2")
    // }

    // const parseMedia = (mediaObject: Web3Media) => {
    //   const retArr = [] as mediaType[]
    //   mediaObject.forEach((e) => {
    //     if (e.images) {
    //       e.images.forEach((el) => {
    //         if (el) {
    //           retArr.push({ type: 'image', url: el })
    //         }
    //       })
    //     }
    //     if (e.videos) {
    //       e.videos.forEach((el) => {
    //         if (el) {
    //           retArr.push({ type: 'video', url: el })
    //         }
    //       })
    //     }
    //     if (e.url) {
    //       if (isImage(e.url)) {
    //         retArr.push({ type: 'image', url: e.url })
    //       }
    //     }
    //   })
    //   const filtredArr = [] as mediaType[]
    //   retArr.forEach((el) => {
    //     filtredArr.findIndex((e) => e.url === el.url) === -1 ? filtredArr.push(el) : null
    //   })
    //   return filtredArr
    // }

    // const parseMediaOpenGraph = (mediaObject: { url: string; image: string }[]) => {
    //   const retArr = [] as mediaType[]
    //   mediaObject.forEach((el) => {
    //     if (el?.image) {
    //       retArr.push({ type: 'image', url: el.image })
    //     } else {
    //       isImage(el.url) ? retArr.push({ type: 'image', url: el.url }) : null
    //     }
    //   })
    //   return retArr
    // }

    // const fillPost = (filler: Web3FarcasterRaw, postId = "", web3CreatorProfile:any = null): Web3PostFarcaster => {
    //   const postBuilder = {} as Web3PostFarcaster
    //   postBuilder.userAvatar = web3CreatorProfile?.avatar ?? filler?.creator?.avatarUrl as string
    //   postBuilder.userHandle = web3CreatorProfile?.handle ?? filler?.creator?.handle as string
    //   postBuilder.userName = web3CreatorProfile?.fullname ?? filler?.creator?.fullname as string
    //   postBuilder.userAddress = filler?.creator?.meta?.connectedAddr as string
    //   postBuilder.body = parseBody(filler.content ?? '')
    //   postBuilder.mediaEntities = parseMedia(filler?.attachments ?? [])
    //   postBuilder.verified = filler?.meta?.isVerifiedAvatar
    //   postBuilder.createdAt = timeAgo(filler?.createdAt)
    //   postBuilder.thread = filler?.meta?.threadMerkleRoot ?? filler?.meta?.threadHash as string
    //   postBuilder.hash = filler?.meta?.hash as string
    //   postBuilder.userFid = filler?.creator?.meta?.fid as string
    //   if(postId) postBuilder.postId = postId
    //   return postBuilder
    // }

    // const fillReply = (filler: Web3FarcasterRawReply): Web3PostFarcaster => {
    //   const postBuilder = {} as Web3PostFarcaster
    //   postBuilder.userAvatar =  filler.author?.pfp?.url ?? filler?.meta?.avatar ?? 'N/A' as string
    //   postBuilder.userHandle =  filler?.author?.username ?? filler?.body?.username ?? 'N/A' as string
    //   postBuilder.userName = filler?.author?.displayName ?? filler?.meta?.displayName ?? 'N/A' as string
    //   postBuilder.userAddress = filler?.body?.address as string
    //   postBuilder.body = parseBody(filler?.text ?? filler?.body?.data?.text ?? '' as string)
    //   postBuilder.verified = filler.author?.pfp?.verified ?? filler?.meta?.isVerifiedAvatar ?? false
    //   postBuilder.mediaEntities = parseMediaOpenGraph(filler?.attachments?.openGraph ?? [])
    //   postBuilder.createdAt = timeAgo(new Date(filler?.timestamp ?? filler?.body?.publishedAt ?? Date.now() - Math.random() * 35000).toISOString())
    //   postBuilder.thread = filler?.threadHash ?? filler?.threadMerkleRoot  as string
    //   postBuilder.hash = filler?.hash as string
    //   postBuilder.userFid = filler?.author?.fid as string
    //   return postBuilder
    // }

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
      replyPost,
      postType
    }
  }
})
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
