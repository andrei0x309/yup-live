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
// threads/0xb3ecd2e9367c5ada51eed6999d8a41454ad1bbf526b3a8637135c5478aed1327?viewer_address=0xe68C06cf27dFEE5bD440A47b3CE4b3Cd96627Bd8&include_deleted_casts=true&version=2
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref } from 'vue'
import { isImage } from 'shared/src/utils/misc'
import { timeAgo } from 'shared/src/utils/time'
import type { mediaType } from 'shared/src/types/post'
import type { Web3Media } from 'shared/src/types/web3/media'
import type { Web3PostFarcaster, Web3FarcasterRaw, Web3FarcasterRawReply } from 'shared/src/types/web3/farcaster'
import FarcasterPostBody from '@/components/copy/post/post-types/lens/farcasterPostBody.vue'

const FARCASTER_INDEXER_THREADS = `https://yup-farcaster-thread.deno.dev/`

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

    // const checkMedia = (filler: Web3Raw) => {
    //   const mediaEntities: mediaType[] = []
    //   if ((filler?.extended_entities?.media?.length ?? 0) > 0) {
    //     const twMediaEntities = filler?.extended_entities?.media
    //     twMediaEntities?.forEach((e) => {
    //       if (e?.type === 'video') {
    //         mediaEntities.push({ type: 'video', url: e?.video_info?.variants[0].url ?? '' })
    //       }
    //     })
    //   }
    //   return mediaEntities
    // }

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
      const req = await fetch(FARCASTER_INDEXER_THREADS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread })
      })
      if (req.ok) {
        return await req.json()
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
      postBuilder.thread = filler?.meta?.threadMerkleRoot as string
      return postBuilder
    }

    const fillReply = (filler: Web3FarcasterRawReply): Web3PostFarcaster => {
      const postBuilder = {} as Web3PostFarcaster
      postBuilder.userAvatar = filler?.meta?.avatar as string
      postBuilder.userHandle = filler?.body?.username as string
      postBuilder.userName = filler?.body?.username as string
      postBuilder.body = parseBody(filler?.body?.data?.text as string)
      postBuilder.verified = filler?.meta?.isVerifiedAvatar
      postBuilder.mediaEntities = parseMediaOpenGraph(filler?.attachments?.openGraph ?? [])
      postBuilder.createdAt = timeAgo(new Date(filler?.body?.publishedAt ?? Date.now() - Math.random() * 35000).toISOString())
      postBuilder.thread = filler?.threadMerkleRoot
      return postBuilder
    }

    onMounted(() => {
      postType.value = getWeb3Type()
      switch (postType.value) {
        case 'single': {
          mainPost.value = fillPost(props.post.web3Preview)
          break
        }
        case 'reply': {
          mainPost.value = fillReply(props.post.web3Preview.meta.parents[0])
          if (props.full) {
            postType.value = 'full'
            getComments(mainPost.value?.thread).then((r) => {
              const lCom = []
              for (const e of r?.result ?? []) {
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