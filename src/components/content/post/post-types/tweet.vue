<template>
  <div ref="tweet" class="p-4">
    <div class="flex p-2">
      <AvatarBtn
        class="w-9 h-9"
        :pSource="post.tweetInfo.user.profile_image_url_https"
        :isSelf="false"
        :isTwitter="true"
        :pAccount="post.tweetInfo.user.screen_name"
      />
      <div class="flex flex-col text-justify pl-3">
        <span>{{ post.tweetInfo.user.name }}</span>
        <span class="opacity-70">@{{ post.tweetInfo.user.screen_name }}</span>
      </div>
      <span class="inline-block favIco ml-auto"><TwitterIcon class="w-6 h-6" /></span>
    </div>
    <div class="pl-10 p-t2 text-justify pr-2">{{ post.tweetInfo.full_text }}</div>
    <span class="flex opacity-70 h-min space-x-1 items-center rounded-full text-xs order-last justify-end">
      <ClockIcon class="w-5 h-5" />
      <p class="text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
</template>

<script lang="ts">
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref } from 'vue'
import AvatarBtn from '@/components/content/connect/avatarBtn.vue'
// import { loadTwitterFactory } from '@/utils/twitter'
import TwitterIcon from '@/components/content/icons/twitter.vue'

export default defineComponent({
  name: 'TweetPostType',
  components: {
    AvatarBtn,
    TwitterIcon
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
    const tweet = ref(null)
    const tweetType = ref('original')

    // const extractTweetIdFromUrl = (url: string) => {
    //     const urlParts = url.split('/')
    //     const tweetId = urlParts[urlParts.length - 1]
    //     return tweetId
    // }

    //        let twFactProm
    //     if(!(window as unknown as {twttr: Record<string, never>}).twttr){
    //         twFactProm = loadTwitterFactory(window)
    //     } else {
    //         twFactProm = Promise.resolve()
    //     }
    //     const id = extractTweetIdFromUrl(props.post.url)
    //     twFactProm.then(() => {
    //         //  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         //  const widgets = (window as unknown as any)[0]

    //         console.log((window as unknown as any).twttr.ready())
    //              // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //              ;(window as unknown as {widgets: Record<string, any>}).widgets.createTweet(
    //         id,
    //        tweet,
    //         {
    //             theme: store.theme
    //         });

    //     })
    //     console.log('sss')
    // })

    const getTweetType = () => {
      if (props.post.tweetInfo.retweeted_status) tweetType.value = 'retweet'
      if (props.post.tweetInfo.quoted_status) tweetType.value = 'quoted'
      if (props.post.tweetInfo.reply_status) tweetType.value = 'reply'
    }

    onMounted(() => {
      getTweetType()
      console.log(tweetType.value, props.post.tweetInfo)
    })

    return {
      tweet
    }
  }
})
</script>
