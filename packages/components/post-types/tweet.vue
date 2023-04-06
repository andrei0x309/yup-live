<template>
  <div>
  <div v-if="tweetType === 'original'" class="p-4">
    <div class="flex p-2">
      <AvatarBtn
        :key="mainTweet.userAvatar"
        class="w-9 h-9"
        imgClass="w-9 h-9"
        :pSource="mainTweet.userAvatar"
        :isSelf="false"
        :isTwitter="true"
        :pAccount="mainTweet.userHandle"
      />
      <div class="flex flex-col text-justify pl-3">
        <span>{{ mainTweet.userName }}</span>
        <span class="opacity-70">@{{ mainTweet.userHandle }} <VerifiedIcon v-if="mainTweet.verified" class="verIcon" /></span>
      </div>
      <span class="flex mfavIco ml-auto"><TwitterIcon class="w-6 h-6 tIcon" /></span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
      <div class="indent"></div>
      <div class="pl-4 flex flex-col">
        <p v-html="mainTweet.body"></p>
        <template v-for="media of mainTweet.mediaEntities" :key="media.url">
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
  <div v-else-if="tweetType === 'missing'">
    <div v-if="!embedLoaded">
      <p><WarningIcon class="w-10 mx-auto mt-2" /></p>
      <p class="p-4" v-if="deleted">Sorry this tweet is not available anymore was <b>deleted</b>!</p>
      <div v-else>
      <p>Preview for this tweet is missing.</p>
      <p>Do you want to load an embed?</p>
      <p><CustomButton :mobile="true" :loading="loadingEmebed ? true: false" :icon="loadingEmebed ? refBtnSpinner : refGoTo" class="mt-2 mx-auto" :text="loadingEmebed ? 'Loading' : 'Load Embed'" @click="loadEmbed" /></p>
      </div>
    </div>
    <div ref="tweet" :id="`${missingTweetId}`"></div>
  </div>
  <div v-else-if="tweetType === 'reply'" class="p-4">
    <div class="relative mb-6">
      <div class="flex p-2">
        <AvatarBtn
          :key="mainTweet.userAvatar"
          class="w-9 h-9"
          imgClass="w-9 h-9"
          :pSource="mainTweet.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainTweet.userHandle"
        />
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainTweet.userName }}</span>
          <span class="opacity-70">@{{ mainTweet.userHandle }} <VerifiedIcon v-if="mainTweet.verified" class="verIcon" /></span>
        </div>
        <span class="inline-block favIco ml-auto"><TwitterIcon class="w-6 h-6" /></span>
      </div>
      <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
        <div class="indent reply-line"></div>
        <div class="pl-4 flex flex-col">
          <p v-html="mainTweet.body"></p>
          <template v-for="media of mainTweet.mediaEntities" :key="media.url">
            <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
            <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
          </template>
        </div>
      </div>
    </div>
    <div>
      <div class="flex px-2">
        <AvatarBtn
          :key="replyOrQuote.userAvatar"
          class="w-7 h-7"
          imgClass="w-7 h-7"
          :pSource="replyOrQuote.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="replyOrQuote.userHandle"
        />
        <div class="flex flex-col text-justify pl-3">
          <span>{{ replyOrQuote.userName }}</span>
          <span class="opacity-70">@{{ replyOrQuote.userHandle }} <VerifiedIcon v-if="replyOrQuote.verified" class="verIcon" /></span>
        </div>
      </div>
      <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
        <div class="indent"></div>
        <div class="pl-4 flex flex-col">
          <p v-html="replyOrQuote.body"></p>
          <template v-for="media of replyOrQuote.mediaEntities" :key="media.url">
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
  <div v-else-if="tweetType === 'quoted' || tweetType === 'retweet'" class="p-4">
    <div :class="`relative ${tweetType === 'quoted' ?? 'mb-6'}:''`">
      <div class="flex p-2">
        <AvatarBtn
          :key="mainTweet.userAvatar"
          class="w-9 h-9"
          imgClass="w-9 h-9"
          :pSource="mainTweet.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainTweet.userHandle"
        />
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainTweet.userName }}</span>
          <span class="opacity-70">@{{ mainTweet.userHandle }} <VerifiedIcon v-if="mainTweet.verified" class="verIcon" /></span>
        </div>
        <span class="inline-block favIco ml-auto"><TwitterIcon class="w-6 h-6" /></span>
      </div>
      <div v-if="tweetType === 'quoted'" class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
        <div class="indent"></div>
        <div class="pl-4 flex flex-col">
          <p v-html="mainTweet.body"></p>
          <template v-for="media of mainTweet.mediaEntities" :key="media.url">
            <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
            <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
          </template>
        </div>
      </div>
      <span v-else class="text-[1.2rem] text-left">RT:</span>
    </div>
    <div class="flex">
      <span v-if="tweetType !== 'retweet'" class="text-[1.6rem]">❝</span>
      <div class="quotedStatus">
        <div class="flex px-2">
          <AvatarBtn
            :key="replyOrQuote.userAvatar"
            class="w-9 h-9"
            imgClass="w-9 h-9"
            :pSource="replyOrQuote.userAvatar"
            :isSelf="false"
            :isTwitter="true"
            :pAccount="replyOrQuote.userHandle"
          />
          <div class="flex flex-col text-justify pl-3">
            <span>{{ replyOrQuote.userName }}</span>
            <span class="opacity-70">@{{ replyOrQuote.userHandle }} <VerifiedIcon v-if="replyOrQuote.verified" class="verIcon" /></span>
          </div>
        </div>
        <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
          <div class="indent"></div>
          <div class="pl-4 flex flex-col">
            <p v-html="replyOrQuote.body"></p>
            <template v-for="media of replyOrQuote.mediaEntities" :key="media.url">
              <VideoPlayer v-if="media.type === 'video'" :videoSource="media.url" class="py-4 rounded-lg" />
              <ImagePreview v-if="media.type === 'image'" :source="media.url" class="py-4 rounded-lg" />
            </template>
          </div>
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
</div>
  <div id="scriptPlacer" class="hidden"></div>
</template>

<script lang="ts">
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref } from 'vue'
import AvatarBtn from 'components/functional/avatarBtn.vue'
// import { loadTwitterFactory, createTweetEmbed } from '@/utils/twitter'
import TwitterIcon from 'icons/src/twitter.vue'
import VideoPlayer from 'components/post/videoPlayer.vue'
import ClockIcon from 'icons/src/clock.vue'
import WarningIcon from 'icons/src/warning.vue'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import GoTo from 'icons/src/goTo.vue'
import CustomButton from 'components/functional/customButton.vue'
import ImagePreview from 'components/post/imagePreview.vue'
import VerifiedIcon from 'icons/src/verified.vue'
import type { mediaType } from 'shared/src/types/post'
import type { TweetData, TweetRaw } from 'shared/src/types/web2/twitter'

const refGoTo = GoTo
const refBtnSpinner = BtnSpinner

export default defineComponent({
  name: 'PostTweet',
  components: {
    AvatarBtn,
    TwitterIcon,
    VideoPlayer,
    ClockIcon,
    WarningIcon,
    CustomButton,
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
    const tweet = ref(null)
    const tweetType = ref('original')
    const loadingEmebed = ref(false)
    const embedLoaded = ref(false)
    const deleted = ref(false)
    const missingTweetId = ref('') as Ref<string>

    const mainTweet = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      verified: false,
      mediaEntities: [] as mediaType[]
    }) as Ref<TweetData>

    const replyOrQuote = ref({
      userName: '',
      userHandle: '',
      userAvatar: '',
      body: '',
      verified: false,
      mediaEntities: [] as mediaType[]
    }) as Ref<TweetData>

    const extractTweetIdFromUrl = (url: string) => {
      const urlParts = url.split('/')
      const tweetId = urlParts[urlParts.length - 1]
      return tweetId
    }

  
    const loadEmbed = async () => {
      loadingEmebed.value = true
      const scriptUrl = 'https://platform.twitter.com/widgets.js'
      const scriptId = 't-script'
      const script = document.createElement('script')
      script.id = scriptId
      script.async = true
      script.src = scriptUrl
      if(!!!document.querySelector('#t-script')) {
        document.querySelector('#scriptPlacer')?.insertAdjacentElement('afterbegin', script)
      }
      const embedInterval = setInterval(() => {
        if(!!document.querySelector('#t-script')) {
          const id = extractTweetIdFromUrl(props.post.url)
          ;(window as unknown as {twttr: Record<string, any>}).twttr.error = (err: any) => {
            console.log('error', err)
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as unknown as {twttr: Record<string, any>}).twttr.ready(() => {
            console.log('ready', id, tweet)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as unknown as {twttr: Record<string, any>}).twttr.widgets.createTweet(
              id,
              tweet.value,
              {
                theme: 'dark'
              }
            )
           
          }).then((r: unknown) => {
          if (r === undefined) {
                deleted.value = true
              }
              else {
                setTimeout(() => {
                  embedLoaded.value = true
                }, 100);
              }
              loadingEmebed.value = false
          })
          clearInterval(embedInterval)
        }
        console.log(document.querySelector('#t-script'))
      }, 250)

    }



    
    const getTweetType = () => {
      if (!(props.post?.tweetInfo)) return 'missing'
      if (props.post.tweetInfo?.retweeted_status) return 'retweet'
      if (props.post.tweetInfo?.quoted_status) return 'quoted'
      if (props.post.tweetInfo?.reply_status) return 'reply'
      if (!props.post.tweetInfo?.reply_status && props.post.tweetInfo?.in_replay_status) return 'delReply'
      return 'original'
    }

    const checkMedia = (filler: TweetRaw) => {
      const mediaEntities: mediaType[] = []
      if ((filler?.extended_entities?.media?.length ?? 0) > 0) {
        const twMediaEntities = filler?.extended_entities?.media
        twMediaEntities?.forEach((e) => {
          if (e?.type === 'video') {
            for (const pVideo of e?.video_info?.variants ?? []) {
              if ('bitrate' in pVideo) {
                mediaEntities.push({ type: 'video', url: pVideo.url ?? '' })
                break
              }
            }
          }
          if (e?.type === 'photo') {
            mediaEntities.push({ type: 'image', url: e?.media_url_https as string })
          }
        })
      }
      return mediaEntities
    }

    const parseBody = (text: string) => {
      text = text ?? ''
      return text
        .replace(/(http|https)(.*)( \n|\t|\s|$){1}/gi, "<a href='$1$2' rel='noFollow' target='_blank'>$1$2</a>$3")
        .replace(/@(.*?)($|\s|\t|\n)/g, "<a href='https://twitter.com/$1' rel='noFollow' target='_blank'>@$1</a>$2")
    }

    const fillTweet = (filler: TweetRaw, tweet: Ref<TweetData>) => {
      const tweetBuilder = {} as TweetData
      tweetBuilder.userAvatar = filler?.user.profile_image_url_https ?? '' as string
      tweetBuilder.userHandle = filler?.user?.screen_name ?? 'N/A' as string
      tweetBuilder.userName = filler?.user?.name ?? 'N/A' as string
      tweetBuilder.verified = filler?.user?.verified ?? false as boolean
      tweetBuilder.body = parseBody(filler?.full_text ?? (filler?.text as string)) ?? ''
      tweetBuilder.mediaEntities = checkMedia(filler)
      tweet.value = tweetBuilder
    }

    onMounted(() => {
      tweetType.value = getTweetType()
      console.log('............', tweetType.value, props.post?.tweetInfo)
      switch (tweetType.value) {
        case 'missing': {
          missingTweetId.value = extractTweetIdFromUrl(props.post.url)
          break
        }
        case 'original': {
          fillTweet(props.post.tweetInfo, mainTweet)
          break
        }
        case 'retweet':
        case 'quoted': {
          fillTweet(props.post.tweetInfo, mainTweet)
          if (tweetType.value === 'quoted') {
            fillTweet(props.post.tweetInfo.quoted_status, replyOrQuote)
          } else {
            fillTweet(props.post.tweetInfo.retweeted_status, replyOrQuote)
          }
          break
        }
        case 'reply': {
          fillTweet(props.post.tweetInfo.reply_status, mainTweet)
          fillTweet(props.post.tweetInfo, replyOrQuote)
          break
        }
      }
      console.log(tweetType.value, mainTweet)
    })

    return {
      tweet,
      mainTweet,
      replyOrQuote,
      tweetType,
      refGoTo,
      refBtnSpinner,
      loadingEmebed,
      embedLoaded,
      loadEmbed,
      missingTweetId,
      deleted
    }
  }
})
</script>

<style scoped lang="scss">
.quotedStatus {
  border: 0.1rem solid rgba(129, 129, 129, 0.568);
  box-shadow: inset -1px -1px 1px 0px rgb(0 0 0 / 46%);
  padding: 1.5rem 0.6rem;
  margin: 0.5rem;
  border-radius: 1rem;
  width: 100%;
}

.verIcon {
  width: 0.9rem;
  fill: rgb(10, 142, 250);
  line-height: 1.5rem;
  display: inline;
  margin-bottom: 0.18rem;
}
</style>
