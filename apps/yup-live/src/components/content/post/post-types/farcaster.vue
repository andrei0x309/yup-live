<template>
  <div v-if="postType === 'single'" ref="postWrap" class="p-4">
    <FarcasterPostBody :mainPost="mainPost" :postId="post.id" />
  </div>
  <div v-else-if="postType === 'reply'" ref="postWrap" class="p-4">
    <FarcasterPostBody :mainPost="mainPost" :postId="post.id" :isReply="true" />
    <FarcasterPostBody :mainPost="replyPost" :postId="post.id" />
  </div>
  <div v-else-if="postType === 'full'" ref="postWrap" class="p-4">
    <FarcasterPostBody :mainPost="mainPost" :postId="post.id" />
    <div v-if="comments.length > 0" class="p-2 flex-col">
      <h2 class="pl-4 text-left">Comments:</h2>
      <FarcasterPostBody v-for="comment in comments" :key="comment.thread" class="mb-4 comBorder" :mainPost="comment" :isCom="true" />
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import { isImage } from 'shared/src/utils/misc'
import { timeAgo } from 'shared/src/utils/time'
import type { mediaType } from 'shared/src/types/post'
import type { Web3Media } from 'shared/src/types/web3/media'
import type { Web3PostFarcaster, Web3FarcasterRaw, Web3FarcasterRawReply } from 'shared/src/types/web3/farcaster'
import FarcasterPostBody from '@/components/content/post/post-types/lens/farcasterPostBody.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: 'PostFarcaster',
  components: {
    FarcasterPostBody
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // const store = useMainStore()

    const postWrap = ref(null)
    const postType = ref('single')

    const mainPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      isVerified: '',
      mediaEntities: [] as mediaType[],
      createdAt: '',
      thread: ''
    }) as Ref<Web3PostFarcaster>

    const replyPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      isVerified: false,
      mediaEntities: [] as mediaType[],
      createdAt: '',
      thread: ''
    }) as Ref<Web3PostFarcaster>

    const comments = ref([]) as Ref<Array<Web3PostFarcaster>>

    const getWeb3Type = () => {
      if (props.post?.web3Preview?.meta?.parents?.length > 0) return 'reply'
      return 'single'
    }
 

    const parseBody = (text: string) => {
      return text
        .replace(/(http|https)(.*)( \n|\t|\s|$){1}/gi, "<a href='$1$2' rel='noFollow' target='_blank'>$1$2</a>$3")
        .replace(/@(.*?)($|\s|\t|\n)/g, "<a href='https://twitter.com/$1' rel='noFollow' target='_blank'>@$1</a>$2")
    }

    const parseMedia = (mediaObject: Web3Media) => {
      const retArr = [] as mediaType[]
      mediaObject.forEach((e) => {
        if (e.images) {
          e.images.forEach((el) => {
            if (el) {
              retArr.push({ type: 'image', url: el })
            }
          })
        }
        if (e.videos) {
          e.videos.forEach((el) => {
            if (el) {
              retArr.push({ type: 'video', url: el })
            }
          })
        }
        if (e.url) {
          if (isImage(e.url)) {
            retArr.push({ type: 'image', url: e.url })
          }
        }
      })
      return retArr
    }

    const parseMediaOpenGraph = (mediaObject: { url: string; image: string }[]) => {
      const retArr = [] as mediaType[]
      mediaObject.forEach((el) => {
        if (el?.image) {
          retArr.push({ type: 'image', url: el.image })
        } else {
          isImage(el.url) ? retArr.push({ type: 'image', url: el.url }) : null
        }
      })
      return retArr
    }

    const getComments = async (thread: string) => {
      const req = await fetch(`${API_BASE}/farcaster/v2/thread-casts?castHash=${thread}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (req.ok) {
        return (await req.json())?.result?.casts ?? []
      } else {
        return []
      }
    }

    const fillPost = (filler: Web3FarcasterRaw): Web3PostFarcaster => {
      const postBuilder = {} as Web3PostFarcaster
      postBuilder.userAvatar = filler?.creator?.avatarUrl as string
      postBuilder.userHandle = filler?.creator?.handle as string
      postBuilder.userName = filler?.creator?.fullname as string
      postBuilder.body = parseBody(filler.content ?? '')
      postBuilder.mediaEntities = parseMedia(filler?.attachments ?? [])
      postBuilder.verified = filler?.meta?.isVerifiedAvatar
      postBuilder.createdAt = timeAgo(filler?.createdAt)
      postBuilder.thread = filler?.meta?.threadMerkleRoot ?? filler?.meta?.threadHash as string
      return postBuilder
    }

    const fillReply = (filler: Web3FarcasterRawReply): Web3PostFarcaster => {
      const postBuilder = {} as Web3PostFarcaster
      postBuilder.userAvatar =  filler.author?.pfp?.url ?? filler?.meta?.avatar ?? 'N/A' as string
      postBuilder.userHandle =  filler?.author?.username ?? filler?.body?.username ?? 'N/A' as string
      postBuilder.userName = filler?.author?.displayName ?? filler?.meta?.displayName ?? 'N/A' as string
      postBuilder.body = parseBody(filler?.text ?? filler?.body?.data?.text ?? '' as string)
      postBuilder.verified = filler.author?.pfp?.verified ?? filler?.meta?.isVerifiedAvatar ?? false
      postBuilder.mediaEntities = parseMediaOpenGraph(filler?.attachments?.openGraph ?? [])
      postBuilder.createdAt = timeAgo(new Date(filler?.timestamp ?? filler?.body?.publishedAt ?? Date.now() - Math.random() * 35000).toISOString())
      postBuilder.thread = filler?.threadHash ?? filler?.threadMerkleRoot  as string
      return postBuilder
    }

    onMounted(() => {
      postType.value = getWeb3Type()
      switch (postType.value) {
        case 'single': {
          console.log('single', props.post.web3Preview)
          mainPost.value = fillPost(props.post.web3Preview)
          break
        }
        case 'reply': {
          console.log('parent', props.post.web3Preview.meta.parents[0])
          mainPost.value = fillReply(props.post.web3Preview.meta.parents[0])
          if (props.full) {
            postType.value = 'full'
            getComments(mainPost.value?.thread).then((r) => {
              const lCom = []
              for (const e of r ?? []) {
                lCom.push(fillReply(e))
              }
              lCom.shift()
              comments.value = lCom
            })
          } else {
            replyPost.value = fillPost(props.post.web3Preview)
          }
          break
        }
      }
    })

    return {
      postWrap,
      mainPost,
      replyPost,
      postType,
      comments
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
</style>