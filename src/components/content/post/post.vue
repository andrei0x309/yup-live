<template>
  <div class="flex justify-between m-6 flex-row pPost">
    <div class="flex flex-col max-w-lg mx-auto rounded-b-none postCard w-full">
      <component :is="!postTypeLoading ? postTypeCom : undefined" :key="`post-loaded-${postTypeLoading}`" :post="processedPost" />
      <div class="flex flex-row items-end w-full px-4 mt-4">
        <div class="flex border-t border-gray-700 w-full py-4">
          <div class="flex items-center space-x-3 border-r border-gray-700 w-full">
            <!-- <img
                  class="object-cover w-8 h-8 border-2 border-white rounded-full"
                  src="https://storageapi.fleek.co/kamaludin21-team-bucket/portfolio/avatar.jpg"
                  alt="profile users"
                  loading="lazy"
                />
                <div class="">
                  <p class="text-sm font-semibold tracking-wide text-gray-200">
                    Author
                  </p>
                  <p class="text-xs font-light tracking-wider text-gray-300">
                    2 Hours ago
                  </p>
                </div> -->
            <Voting
              :key="processedPost.title"
              :postId="processedPost.id"
              :positiveWeight="processedPost.positiveWeight"
              :negativeWeight="processedPost.negativeWeight"
            />
          </div>
          <div class="flex items-center flex-shrink-0 px-2">
            <div class="flex items-center space-x-1">
              <CollectMenu collections="" />
              <PostMenu :postInfo="postInfo" :postId="processedPost.id" :postShareInfo="postShareInfo" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <PostInfo class="hidden lg:flex" :postInfo="postInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref, shallowRef } from 'vue'

import ImagePreview from '@/components/content/post/imagePreview.vue'
import PostInfo from '@/components/content/post/postInfo.vue'
import Voting from '@/components/content/post/voting.vue'
import FavIco from './favIco.vue'
import ClockIcon from '@/components/content/icons/clock.vue'
import PostMenu from './menu/postMenu.vue'
import CollectMenu from './menu/collectMenu.vue'
import { useMainStore } from '@/store/main'
import type { NameValue } from '@/types/common'
import { timeAgo } from '@/utils/time'

export default defineComponent({
  name: 'Post',
  components: {
    ImagePreview,
    PostInfo,
    ClockIcon,
    Voting,
    FavIco,
    PostMenu,
    CollectMenu
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    postTypesPromises: {
      type: Object,
      required: true
    }
  },
  setup(props) {
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
      tweetInfo: {}
      //   isMirror: false,
      //   isWeb3: false,
      //   isTwitter: false,
    })
    const postInfo = ref([]) as unknown as Ref<Array<NameValue>>
    const store = useMainStore()
    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')
    const postTypeLoading = ref(true)
    const postShareInfo = reactive({}) as unknown as { url: string; title: string; text: string }

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
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
      processedPost.positiveWeight = props.post.positiveWeight
      processedPost.negativeWeight = props.post.negativeWeight

      postInfo.value = [
        {
          name: 'Post Id',
          value: props.post._id.postid
        },
        {
          name: 'URL',
          value: `<a href="${props.post.url}">Link</a>`
        },
        {
          name: 'Positive Weight',
          value: props.post.positiveWeight
        },
        {
          name: 'Negative Weight',
          value: props.post.negativeWeight
        },
        {
          name: 'Total Creator Rewards',
          value: props.post.totalCreatorRewards.toFixed(2)
        }
      ]
      // console.log(props.post)

      postShareInfo.title = processedPost.title
      postShareInfo.url = (window as unknown as { location: { origin: string } }).location.origin + '/post/' + processedPost.id
      postShareInfo.text = processedPost.content
    }

    onMounted(() => {
      checkPostType(props.post.url).then(async (type) => {
        switch (type) {
          case 'tweet':
            processedPost.tweetInfo = props.post.tweetInfo
            postTypeCom.value = (await props.postTypesPromises.preLoadTweet).default
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
    })

    const checkPostType = async (url: string) => {
      if (url.match(/https?:\/\/(mobile.|www.)?twitter\.com\/.*?status/i)) return 'tweet'
      if (url.toLocaleLowerCase().includes('youtube.com/watch?')) return 'youtubeVideo'
      return 'general'
    }

    // onBeforeMount(() => {

    // })

    return {
      processedPost,
      postInfo,
      iconsColor,
      postTypeCom,
      postTypeLoading,
      postShareInfo
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

.postCard {
  background-color: var(--post-card-bg);
  border: 1px solid #00000047;
  border-radius: 0.5rem;
  box-shadow: 2px 0 0 #0a0a0ab3;
  height: min-content;
}

.favIco {
  background: radial-gradient(ellipse at bottom, #1d2024f3 0%, rgba(31, 31, 31, 0.829) 100%);
  box-shadow: 9px 8px 25px 5px rgba(0, 0, 0, 0.473);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.2rem;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -0.3rem;
  border: 1px solid rgba(107, 107, 107, 0.26);
  padding: 1.55%;
  img {
    filter: brightness(0) invert(1);
  }
}

.time {
  background: radial-gradient(ellipse at bottom, #1d2024f3 0%, rgba(31, 31, 31, 0.438) 100%);
  box-shadow: 9px 8px 25px 5px rgb(0 0 0 / 79%);
  width: 8.5rem;
  padding: 0.2rem;
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
</style>