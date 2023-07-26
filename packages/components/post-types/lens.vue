<template>
  <div>
  <LensPostBody :mainPost="mainPost" :postId="post.id" />
  <div v-if="lensComments.length > 0 && full" class="p-2 flex-col">
    <h2 class="pl-4 text-left">Comments:</h2>
    <Post :deps="deps" v-for="comment in lensComments" :key="comment.lensId" :post="comment" :crossPost="crossPost" :postTypesPromises="postTypesPromises" />
  </div>
  </div>
</template>

<script lang="ts">
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref, PropType } from 'vue'
// import LinkPreview from '../linkPreview.vue'
import { timeAgo } from 'shared/src/utils/time'
import { isImage } from 'shared/src/utils/misc'
import { parseIpfs } from 'shared/src/utils/web3/ipfs'
import LensPostBody from './inner/lensPostBody.vue'
// import MD from 'markdown-it'
import { getLensComments, lensIdToRaw, rawToLensId } from 'shared/src/utils/requests/lens'
import type { OpenGraphPreview, mediaType } from 'shared/src/types/post'
import type { Web3LensRaw, Web3PostLens, linkPreviewTypeEx } from 'shared/src/types/web3/lens'
import type { Web3Media } from 'shared/src/types/web3/media'
import Post from '../post/post.vue'
import type {IPostDeps} from 'shared/src/types/post'
import { IPost } from 'shared/src/types/post'

export default defineComponent({
  name: 'PostLens',
  components: { LensPostBody, Post },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    comments: {
      type: Array as PropType<Array<any>>,
      default: () => []
    },
    full: {
      type: Boolean,
      default: false
    },
    deps: {
      type: Object as PropType<IPostDeps>,
      required: true,
    },
    crossPost: {
      type: Function as PropType<() => Promise<{ default: any }> | undefined>,
      required: false,
      default: undefined,
    },
    postTypesPromises: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // const store = useMainStore()

    const postWrap = ref(null)


    const mainPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      userAddress: '',
      body: '',
      isVerified: '',
      mediaEntities: [] as mediaType[],
      lensId: '',
      linkPreviews: [] as linkPreviewTypeEx[],
    }) as Ref<Web3PostLens>

    const lensComments = ref([]) as Ref<IPost[]>

    const parseBody = (text: string, linkPreviews: linkPreviewTypeEx[]) => {
      const links = [] as string[]
      text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
        links.push(url)
        return url
      })
      linkPreviews = linkPreviews.filter((e) => links.includes(e.url ?? e.originalUrl))
      linkPreviews.forEach((e) => {
        text = text.replace(e.url, '')
      })
      return text
    }

    const parseMedia = (mediaObject: Web3Media, linkPreviews:linkPreviewTypeEx[]) => {
      const retArr = [] as mediaType[]
      mediaObject.forEach((e) => {
        if (e.images) {
          e.images.forEach((el) => {
            if (el) {
              retArr.push({ type: 'image', url: parseIpfs(el) })
            }
          })
        }
        if (e.videos) {
          e.videos.forEach((el) => {
            if (el) {
              retArr.push({ type: 'video', url: parseIpfs(el) })
              console.log( parseIpfs(el))
            }
          })
        }
        if (e.url) {
          if (isImage(e.url)) {
            retArr.push({ type: 'image', url: parseIpfs(e.url) })
          }
        }
      })
      if(linkPreviews?.length === 0) return retArr
      return retArr.filter((e) => !(e.type === 'image' && linkPreviews.some((el) => el.img === e.url)))
    }
    // parseIpfs

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

    // const parseLinkPreview = ['phaver']

    const fillPost = (filler: Web3LensRaw) => {
      // const md = new MD({
      //   html: true,
      //   linkify: true,
      //   typographer: true
      // })
      const postBuilder = {} as Web3PostLens 
      postBuilder.userAvatar = filler?.creator?.avatarUrl ?? filler?.creator?.avatar as string
      postBuilder.userHandle = filler?.creator?.handle as string
      postBuilder.userName = filler?.creator?.fullname as string
      postBuilder.userAddress = filler?.creator?.address as string
      postBuilder.mediaEntities = parseMedia(filler?.attachments ?? [], postBuilder.linkPreviews ?? [])
      postBuilder.verified = filler?.meta?.isVerifiedAvatar
      postBuilder.lensId = rawToLensId(filler?.id as string)
      postBuilder.linkPreviews = filler?.linkPreview?.map(
        (e) =>
          (({
            title: e.title?? '',
            img: e.img ?? '',
            url: e.url ?? e.originalUrl ?? '',
            description: e?.description ?? ''
          })
      ) ?? []) as linkPreviewTypeEx[]
      postBuilder.body = parseBody((filler.content ?? ''), postBuilder.linkPreviews ?? [])
      // if (parseLinkPreview.includes(filler.meta?.metadata?.appId ?? '')) {
      //   linkPreview.value = filler?.linkPreview?.[0] ?? ([] as unknown as OpenGraphPreview)
      // }
      postBuilder.createdAt = timeAgo(filler?.createdAt as string)
      return postBuilder
    }



    onMounted(() => {
      mainPost.value = fillPost(props.post?.web3Preview)
      if (props.full) {
      getLensComments({
        apiBase: import.meta.env.VITE_YUP_API_BASE,
        postId:  props.post?._id?.postid
      }).then((res) => {
        lensComments.value = res.comments
      })
      }
    })

    return {
      postWrap,
      mainPost,
      lensComments
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
