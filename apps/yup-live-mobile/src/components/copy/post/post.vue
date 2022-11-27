<template>
  <div :class="`flex justify-between m-1 md:m-6 flex-row pPost ${postTypeClass}`">
    <div class="flex flex-col max-w-2xl mx-auto rounded-b-none mpostCard w-full">
      <component
        :is="!postTypeLoading ? postTypeCom : undefined"
        :key="`post-loaded-${postTypeLoading}`"
        :full="full"
        :post="processedPost"
      />
      <div class="flex flex-row items-end w-full px-4 mt-4">
        <div class="flex border-t border-gray-700 w-full py-4">
          <div class="flex items-center gap-x-2 border-r border-gray-700 w-full pl-2">
            <Voting
              :key="`${processedPost.title}${votingKey}`"
              v-model:vote="refHasVote"
              :postId="processedPost.id"
              :positiveWeight="processedPost.positiveWeight"
              :negativeWeight="processedPost.negativeWeight"
              :hasVote="refHasVote"
            />
            <div>
            
            </div>
          </div>
          <div class="flex items-center flex-shrink-0 px-2">
            <div class="flex items-center space-x-1">
              <PostMenu
                :key="menuKey"
                v-model:vote="refHasVote"
                :postId="processedPost.id"
                :postShareInfo="postShareInfo"
                :hasVote="refHasVote"
                :post="processedPost"
                @deletedvote="hasVoteDeleted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref, shallowRef, watch } from 'vue'
import ImagePreview from '@/components/copy/post/imagePreview.vue'
import Voting from '@/components/copy/post/voting.vue'
import FavIco from './favIco.vue'
import ClockIcon from 'icons/src/clock.vue'
import PostMenu from './menu/postMenu.vue'
import { useMainStore } from '@/store/main'
import { timeAgo } from 'shared/dist/utils/time'
import { hasVote } from 'shared/dist/utils/requests/vote'
import type { Vote } from 'shared/dist/types/vote'
import { chatbubble } from "ionicons/icons";

export default defineComponent({
  name: 'PostComponent',
  components: {
    ImagePreview,
    ClockIcon,
    Voting,
    FavIco,
    PostMenu,
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    isHidenInfo: {
      type: Boolean,
      default: false
    },
    postTypesPromises: {
      type: Object,
      required: true
    },
    full: {
      type: Boolean,
      required: false
    }
  },
  emits: ['updatepostinfo'],
  setup(props, ctx) {
    const postTypeCom: Ref<ReturnType<typeof defineComponent>> = shallowRef(undefined)

    const processedPost = reactive({
      id: '',
      title: '',
      content: '',
      image: '',
      createdAt: '',
      url: '',
      isVideo: false,
      videoType: '',
      positiveWeight: 0,
      negativeWeight: 0,
      tweetInfo: {},
      web3Preview: {}
      //   isMirror: false,
      //   isWeb3: false,
      //   isTwitter: false,
    })
    const store = useMainStore()
    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')
    const postTypeLoading = ref(true)
    const postShareInfo = reactive({}) as unknown as { url: string; title: string; text: string }
    const postTypeClass = ref('')
    const refHasVote = ref(Promise.resolve([])) as Ref<
      Promise<Vote[]>
    >
    const cloneWeights = {} as unknown as { positiveWeight: number; negativeWeight: number }

    const votingKey = ref(0)
    const menuKey = ref(0)

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
    })

    watch(refHasVote, (newVal) => {
      refHasVote.value = newVal
      menuKey.value++
    })

    const processPost = () => {
      processedPost.id = props.post._id.postid
      processedPost.title = props.post.previewData.title
      let content = props?.post?.previewData?.description ?? 'No description available'
      content = content.length > 261 ? `${content.substring(0, 261)}...` : content
      processedPost.content = content
      let image = props.post.previewData.img
      if (image && image.match(/\.gif.*?fm=jpg/)) {
        image = image.replace(/fm=jpg/, 'fm=gif')
      }
      processedPost.image = image
      if (processedPost.image) {
        const videoExt = ['.mp4', '.webm', '.ogg', '.avi']
        processedPost.isVideo = videoExt.some((ext) => processedPost.image.includes(ext))
      }
      processedPost.createdAt = timeAgo(props.post.createdAt)
      processedPost.url = props.post.url
      processedPost.positiveWeight = props.post.rawPositiveWeight ?? props.post.positiveWeight ?? 0
      processedPost.negativeWeight = props.post.rawNegativeWeight ?? props.post.negativeWeight ?? 0
      cloneWeights.positiveWeight = props.post.rawPositiveWeight ?? props.post.positiveWeight ?? 0
      cloneWeights.negativeWeight = props.post.rawNegativeWeight ?? props.post.negativeWeight ?? 0

      postShareInfo.title = processedPost.title
      postShareInfo.url = (window as unknown as { location: { origin: string } }).location.origin + '/post/' + processedPost.id
      postShareInfo.text = processedPost.content
    }

    const updatePostInfo = () => {
      ctx.emit('updatepostinfo', props.post._id.postid)
    }

    onMounted(() => {
      console.log('pp', props.post)
      if( props?.post?._id?.postid) {
        refHasVote.value = hasVote(props.post._id.postid, store.userData.account)
        checkPostType(props.post as unknown as { url: string; tag: string }).then(async (type) => {
        postTypeClass.value = type
        switch (type) {
          case 'tweet':
            processedPost.tweetInfo = props.post.tweetInfo
            postTypeCom.value = (await props.postTypesPromises.preLoadTweet).default
            break
          case 'farcaster':
            processedPost.web3Preview = props.post.web3Preview
            postTypeCom.value = (await props.postTypesPromises.preloadFarcaster).default
            break
          case 'lens':
            processedPost.web3Preview = props.post.web3Preview
            postTypeCom.value = (await props.postTypesPromises.preloadLens).default
            break
          case 'poap':
            processedPost.web3Preview = props.post.web3Preview
            postTypeCom.value = (await props.postTypesPromises.preloadPoap).default
            break
          case 'mirror':
            processedPost.web3Preview = props.post.web3Preview
            postTypeCom.value = (await props.postTypesPromises.preloadMirror).default
            break
          case 'snapshot':
            processedPost.web3Preview = props.post.web3Preview
            postTypeCom.value = (await props.postTypesPromises.preloadSnapshot).default
            break
          case 'youtubeVideo':
            postTypeCom.value = (await props.postTypesPromises.preloadYoutube).default
            break
          default:
            postTypeCom.value = (await props.postTypesPromises.preloadGeneral).default
            break
        }
        postTypeLoading.value = false
      })
      processPost()
      }
    })

    const checkPostType = async (post: { url: string; tag: string }) => {
      if (post.tag === 'mirror') return 'mirror'
      if (post.tag === 'poap') return 'poap'
      if (post.tag === 'farcaster') return 'farcaster'
      if (post.tag === 'lens') return 'lens'
      if (post.tag === 'snapshot') return 'snapshot'
      if (post.tag === 'twitter') return 'tweet'
      if (post?.url.match(/https?:\/\/(mobile.|www.)?twitter\.com\/.*?status/i)) return 'tweet'
      if (post?.url.startsWith('farcaster://')) return 'farcaster'
      if (post?.url.toLocaleLowerCase().includes('youtube.com/watch?')) return 'youtubeVideo'

      return 'general'
    }

    const hasVoteDeleted = () => {
      processedPost.positiveWeight = cloneWeights.positiveWeight
      processedPost.negativeWeight = cloneWeights.negativeWeight
      votingKey.value++
    }

    // onBeforeMount(() => {

    // })

    return {
      processedPost,
      iconsColor,
      postTypeCom,
      postTypeLoading,
      postShareInfo,
      updatePostInfo,
      postTypeClass,
      refHasVote,
      hasVoteDeleted,
      votingKey,
      menuKey
    }
  }
})
</script>

<style lang="scss">
html {
  --post-card-bg: #f9f9f93b;
}

html[class='dark'] {
  --post-card-bg: #2626263b;
}

.mpostCard {
  background-color: #2626263b;
  border: 1px solid #00000047;
  border-radius: 0.5rem;
  box-shadow: 2px 0 0 #0a0a0ab3;
  height: min-content;
  position: relative;
}

.mfavIco {
  display: flex;
  background: radial-gradient(ellipse at bottom, rgb(28 28 28 / 31%) 0%, rgb(30 30 30 / 46%) 100%);
  box-shadow: 2px 0px 10px 3px rgb(0 0 0 / 16%);
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -0.3rem;
  border: 1px solid rgba(107, 107, 107, 0.26);
  img {
    filter: brightness(0) invert(1);
  }
}

.mtime {
    background: radial-gradient(ellipse at bottom, rgb(28 28 28 / 31%) 0%, rgb(30 30 30 / 46%) 100%);
    box-shadow: 2px 0px 10px 3px rgb(0 0 0 / 16%);
    width: 6.8rem;
    padding: 0.05rem;
    justify-content: center;
    align-items: center;
}

.colbutton {
  border: 1px solid #c4c4c479;
  border-radius: 0.3rem;
}

.pPost {
  opacity: 1;
  transition: opacity 700ms linear;
  align-items: center;
}

.pPost.mirror div {
  max-width: 60rem;
}

div.w3TweetTypeBody {
  text-align: left;
  word-break: break-all;

  .reply-line {
    border-left: 2px solid rgba(255, 127, 80, 0.699);
  }

  a {
    filter: brightness(1.2) sepia(2);
    border-bottom: 1px solid rgba(184, 184, 184, 0.096);
  }
  a:hover {
    transform: skewX(20deg);
  }

  .indent {
    width: 1rem;
    margin-left: 1.5rem;
    margin-right: 1rem;
  }
}
</style>
