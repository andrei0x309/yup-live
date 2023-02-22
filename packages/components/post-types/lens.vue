<template>
  <LensPostBody :mainPost="mainPost" :postId="post.id" />

  <div v-if="lensComments.length > 0 && full" class="p-2 flex-col">
    <h2 class="pl-4 text-left">Comments:</h2>
    <LensPostBody v-for="comment in lensComments" :key="comment.lensId" :mainPost="comment" />
  </div>
</template>

<script lang="ts">
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref } from 'vue'
// import LinkPreview from '../linkPreview.vue'
import { timeAgo } from 'shared/src/utils/time'
import { isImage } from 'shared/src/utils/misc'
import { parseIpfs } from 'shared/src/utils/web3/ipfs'
import LensPostBody from './lens/lensPostBody.vue'
// import MD from 'markdown-it'
import { commentLensQuery, lensIdToRaw, convertToWeb3Raw, rawToLensId } from 'shared/src/utils/web3/lens'
import type { OpenGraphPreview, mediaType } from 'shared/src/types/post'
import type { Web3LensRaw, Web3PostLens } from 'shared/src/types/web3/lens'
import type { Web3Media } from 'shared/src/types/web3/media'

const lensGraphQl = 'https://api.lens.dev'

export default defineComponent({
  name: 'PostLens',
  components: { LensPostBody },
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
    const linkPreview = ref({
      title: '',
      img: '',
      url: '',
      description: ''
    }) as Ref<OpenGraphPreview>

    const mainPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      isVerified: '',
      mediaEntities: [] as mediaType[],
      lensId: ''
    }) as Ref<Web3PostLens>

    const lensComments = ref([]) as Ref<Web3PostLens[]>

    const parseBody = (text: string, noLinks = false) => {
      if (!noLinks) {
        text = text.replace(/(http|https)(.*)( \n|\t|\s|$){1}/gi, "<a href='$1$2' rel='noFollow' target='_blank'>$1$2</a>$3")
      }
      return text.replace(/@(.*?)($|\s|\t|\n)/g, "<a href='https://twitter.com/$1' rel='noFollow' target='_blank'>@$1</a>$2")
    }

    const parseMedia = (mediaObject: Web3Media) => {
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
      return retArr
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
      postBuilder.body = parseBody((filler.content ?? ''), true)
      postBuilder.mediaEntities = parseMedia(filler?.attachments ?? [])
      postBuilder.verified = filler?.meta?.isVerifiedAvatar
      postBuilder.lensId = rawToLensId(filler?.id as string)
      // if (parseLinkPreview.includes(filler.meta?.metadata?.appId ?? '')) {
      //   linkPreview.value = filler?.linkPreview?.[0] ?? ([] as unknown as OpenGraphPreview)
      // }
      postBuilder.createdAt = timeAgo(filler?.createdAt as string)
      return postBuilder
    }

    const getLensComments = async (id: string) => {
      const req = await fetch(lensGraphQl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentLensQuery(id))
      })
      if (req.ok) {
        const data = await req.json()
        const web3RawLensPosts = [] as Web3LensRaw[]
        for (const item of data?.data?.publications?.items ?? []) {
          web3RawLensPosts.push(convertToWeb3Raw(item))
        }
        console.log(web3RawLensPosts)
        return web3RawLensPosts
      }
      return []
    }

    onMounted(() => {
      mainPost.value = fillPost(props.post?.web3Preview)
      // if (props.full) {
      getLensComments(lensIdToRaw(props.post?.web3Preview?.id)).then((comments) => {
        lensComments.value = comments.map((c) => fillPost(c))
      })
      // }
    })

    return {
      postWrap,
      mainPost,
      linkPreview,
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
