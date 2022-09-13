<template>
  <div v-if="postType === 'single'" ref="postWrap" class="p-4">
    <div class="flex p-2">
      <AvatarBtn
        :key="mainPost.userAvatar"
        class="w-9 h-9"
        :pSource="mainPost.userAvatar"
        :isSelf="false"
        :isTwitter="true"
        :pAccount="mainPost.userHandle"
      />
      <div class="flex flex-col text-justify pl-3">
        <span>{{ mainPost.userName }}</span>
        <span class="mainPost-70">@{{ mainPost.userHandle }} <VerifiedIcon v-if="mainPost.verified" class="verIcon" /></span>
      </div>
      <span class="inline-block favIco ml-auto"><FarcasterIcon class="w-8 h-8" /></span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
      <div class="indent"></div>
      <div class="pl-4">
        <p v-html="mainPost.body"></p>
        <template v-for="media of mainPost.mediaEntities" :key="media.url">
          <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
          <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
        </template>
      </div>
    </div>
    <span class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end">
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
  <div v-else-if="postType === 'reply'" ref="postWrap" class="p-4">
    <div class="relative mb-6">
      <div class="flex p-2">
        <AvatarBtn
          :key="mainPost.userAvatar"
          class="w-9 h-9"
          :pSource="mainPost.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainPost.userHandle"
        />
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainPost.userName }}</span>
          <span class="opacity-70">@{{ mainPost.userHandle }} <VerifiedIcon v-if="mainPost.verified" class="verIcon" /></span>
        </div>
        <span class="inline-block favIco ml-auto"><FarcasterIcon class="w-8 h-8" /></span>
      </div>
      <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
        <div class="indent reply-line"></div>
        <div class="pl-1">
          <p v-html="mainPost.body"></p>
          <template v-for="media of mainPost.mediaEntities" :key="media.url">
            <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
            <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
          </template>
        </div>
      </div>
    </div>
    <div>
      <div class="flex px-2">
        <AvatarBtn
          :key="replyPost.userAvatar"
          class="w-9 h-9"
          :pSource="replyPost.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="replyPost.userHandle"
        />
        <div class="flex flex-col text-justify pl-3">
          <span>{{ replyPost.userName }}</span>
          <span class="opacity-70">@{{ replyPost.userHandle }} <VerifiedIcon v-if="mainPost.verified" class="verIcon" /></span>
        </div>
      </div>
      <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
        <div class="indent"></div>
        <div class="pl-1">
          <p v-html="replyPost.body"></p>
          <template v-for="media of replyPost.mediaEntities" :key="media.url">
            <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
            <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
          </template>
        </div>
      </div>
    </div>
    <span class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end">
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
</template>
<script lang="ts">
// https://api.farcaster.xyz/indexer/threads/0xb3ecd2e9367c5ada51eed6999d8a41454ad1bbf526b3a8637135c5478aed1327?viewer_address=0xe68C06cf27dFEE5bD440A47b3CE4b3Cd96627Bd8&include_deleted_casts=true&version=2
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref } from 'vue'
import AvatarBtn from '@/components/content/connect/avatarBtn.vue'
// import { loadTwitterFactory } from '@/utils/twitter'
import FarcasterIcon from '@/components/content/icons/farcaster.vue'
import VideoPlayer from '@/components/content/post/videoPlayer.vue'
import ClockIcon from '@/components/content/icons/clock.vue'
import ImagePreview from '../imagePreview.vue'
// import { timeAgo } from '@/utils/time'
import { isImage } from '@/utils/post'
import VerifiedIcon from '@/components/content/icons/verified.vue'
import type { mediaType } from '@/types/post'
import type { Web3Media } from '@/types/web3/media'
import type { Web3PostFarcaster, Web3FarcasterRaw, Web3FarcasterRawReply } from '@/types/web3/farcaster'

export default defineComponent({
  name: 'PostFarcaster',
  components: {
    AvatarBtn,
    FarcasterIcon,
    VideoPlayer,
    ClockIcon,
    ImagePreview,
    VerifiedIcon
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
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
      mediaEntities: [] as mediaType[]
    }) as Ref<Web3PostFarcaster>

    const replyPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      isVerified: false,
      mediaEntities: [] as mediaType[]
    }) as Ref<Web3PostFarcaster>

    const getWeb3Type = () => {
      if (props.post?.web3Preview?.meta?.parents?.length > 0) postType.value = 'reply'
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

    const fillPost = (filler: Web3FarcasterRaw, post: Ref<Web3PostFarcaster>) => {
      const postBuilder = {} as Web3PostFarcaster
      postBuilder.userAvatar = filler?.creator?.avatarUrl as string
      postBuilder.userHandle = filler?.creator?.handle as string
      postBuilder.userName = filler?.creator?.fullname as string
      postBuilder.body = parseBody(filler.content ?? '')
      postBuilder.mediaEntities = parseMedia(filler?.attachments ?? [])
      postBuilder.verified = filler?.meta?.isVerifiedAvatar
      console.log(postBuilder.mediaEntities)
      post.value = postBuilder
    }

    const fillReply = (filler: Web3FarcasterRawReply, post: Ref<Web3PostFarcaster>) => {
      const postBuilder = {} as Web3PostFarcaster
      postBuilder.userAvatar = filler?.meta?.avatar as string
      postBuilder.userHandle = filler?.body?.username as string
      postBuilder.userName = filler?.body?.username as string
      postBuilder.body = parseBody(filler?.body?.data?.text as string)
      postBuilder.verified = filler?.meta?.isVerifiedAvatar
      postBuilder.mediaEntities = parseMediaOpenGraph(filler?.attachments.openGraph ?? [])
      console.log(postBuilder.mediaEntities)
      post.value = postBuilder
    }

    onMounted(() => {
      getWeb3Type()
      switch (postType.value) {
        case 'single': {
          fillPost(props.post.web3Preview, mainPost)
          break
        }
        case 'reply': {
          fillReply(props.post.web3Preview.meta.parents[0], mainPost)
          fillPost(props.post.web3Preview, replyPost)
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
.verIcon {
  width: 0.8rem;
  fill: rgb(187 85 255);
  display: inline;
}
</style>