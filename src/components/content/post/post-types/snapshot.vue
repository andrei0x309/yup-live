<template>
  <div v-if="postType === 'original'" ref="postWrap" class="p-4">
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
        <span class="mainPost-70">@{{ mainPost.userHandle }}</span>
      </div>
      <span class="inline-block favIco ml-auto"><FarcasterIcon class="w-6 h-6 fIcon" /></span>
    </div>
    <div class="pl-10 p-t2 text-justify pr-2 tBody">
      <p v-html="mainPost.body"></p>
      <template v-for="media of mainPost.mediaEntities" :key="media.url">
        <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
      </template>
    </div>
    <span class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end">
      <ClockIcon class="w-4 h-4" />
      <p class="text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
  <div v-else-if="postType === 'reply'" ref="tweet" class="p-4">
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
          <span class="opacity-70">@{{ mainPost.userHandle }}</span>
        </div>
        <span class="inline-block favIco ml-auto"><TwitterIcon class="w-6 h-6" /></span>
      </div>
      <!-- <div class="pl-10 p-t2 text-justify pr-2 tBody">
        <p v-html="mainPost.body"></p>
        <template v-for="media of mainPost.mediaEntities" :key="media.url">
          <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
        </template>
      </div> -->
      <span role="image" class="replyBar"></span>
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
          <span class="opacity-70">@{{ replyPost.userHandle }}</span>
        </div>
      </div>
      <!-- <div class="pl-10 p-t2 text-justify pr-2 tBody">
        <p v-html="replyPost.body"></p>
        <template v-for="media of replyPost.mediaEntities" :key="media.url">
          <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
        </template>
      </div> -->
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
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref } from 'vue'
import AvatarBtn from '@/components/content/connect/avatarBtn.vue'
// import { loadTwitterFactory } from '@/utils/twitter'
import FarcasterIcon from '@/components/content/icons/farcaster.vue'
import VideoPlayer from '@/components/content/post/videoPlayer.vue'
import ClockIcon from '@/components/content/icons/clock.vue'

export default defineComponent({
  name: 'PostSnapshot',
  components: {
    AvatarBtn,
    FarcasterIcon,
    VideoPlayer,
    ClockIcon
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    // const store = useMainStore()
    interface mediaType {
      type: string
      url: string
    }

    interface TweetData {
      userName: string
      userHandle: string
      userAvatar: string
      body: string
      mediaEntities: mediaType[]
    }

    // interface TweetRaw {
    //   text?: string
    //   full_text?: string
    //   user: {
    //     name?: string
    //     screen_name?: string
    //     profile_image_url_https?: string
    //   }
    //   extended_entities?: {
    //     media: Array<{
    //       video_info?: {
    //         variants: Array<{
    //           url: string
    //         }>
    //       }
    //       type?: string
    //     }>
    //   }
    // }

    const postWrap = ref(null)
    const postType = ref('single')

    const mainPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      mediaEntities: [] as mediaType[]
    }) as Ref<TweetData>

    const replyPost = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      mediaEntities: [] as mediaType[]
    }) as Ref<TweetData>

    // const getTweetType = () => {
    //   if (props.post.tweetInfo.retweeted_status) postType.value = 'hasReply'
    // }

    // const checkMedia = (filler: TweetRaw) => {
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

    // const parseBody = (text: string) => {
    //   return text
    //     .replace(/(http|https)(.*)( \n|\t|\s|$){1}/gi, "<a href='$1$2' rel='noFollow' target='_blank'>$1$2</a>$3")
    //     .replace(/@(.*?)($|\s|\t|\n)/g, "<a href='https://twitter.com/$1' rel='noFollow' target='_blank'>@$1</a>$2")
    // }

    // const fillPost = (filler: TweetRaw, tweet: Ref<TweetData>) => {
    //   const tweetBuilder = {} as TweetData
    //   tweetBuilder.userAvatar = filler.user.profile_image_url_https as string
    //   tweetBuilder.userHandle = filler.user.screen_name as string
    //   tweetBuilder.userName = filler.user.name as string
    //   tweetBuilder.body = parseBody(filler.full_text ?? (filler.text as string))
    //   tweetBuilder.mediaEntities = checkMedia(filler)
    //   tweet.value = tweetBuilder
    // }

    onMounted(() => {
      //   getTweetType()
      //   switch (postType.value) {
      //     case 'original': {
      //       fillPost(props.post.tweetInfo, mainPost)
      //       break
      //     }
      //     case 'retweet': {
      //       break
      //     }
      //     case 'quoted': {
      //       break
      //     }
      //     case 'reply': {
      //       fillPost(props.post.tweetInfo.reply_status, mainPost)
      //       fillPost(props.post.tweetInfo, replyPost)
      //       break
      //     }
      //   }
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
.replyBar {
  border-left: 3px solid rgba(153, 8, 8, 0.7411764706);
  height: max-content;
  width: 3px;
  position: absolute;
  top: 3.5rem;
  left: 1.55rem;
}

div.tBody {
  text-align: left;
  a {
    filter: brightness(1.2) sepia(2);
  }
  a:hover {
    transform: skewX(20deg);
  }
}

.fIcon {
  position: absolute;
  left: 19%;
  top: 16%;
}
</style>
