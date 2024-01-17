<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color w-full mb-4">
      <nav class="feedNav">
        <ul>
          <li>
            <router-link :class="activeFeed === feeds[0] ? 'navActive' : ''" :to="`/feeds/${feeds[0]}${userId ? '?userId='+userId : ''}`">Daily Hits</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[1] ? 'navActive' : ''" :to="`/feeds/${feeds[1]}${userId ? '?userId='+userId : ''}`">BlueSky</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[2] ? 'navActive' : ''" :to="`/feeds/${feeds[2]}${userId ? '?userId='+userId : ''}`">NFTs</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[3] ? 'navActive' : ''" :to="`/feeds/${feeds[3]}${userId ? '?userId='+userId : ''}`">Mirror</router-link>
          </li>
        </ul>
      </nav>
      <nav class="feedNav">
        <ul>
          <li>
            <router-link :class="activeFeed === feeds[4] ? 'navActive' : ''" :to="`/feeds/${feeds[4]}${userId ? '?userId='+userId : ''}`">Recent</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[5] ? 'navActive' : ''" :to="`/feeds/${feeds[5]}${userId ? '?userId='+userId : ''}`">Farcaster</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[6] ? 'navActive' : ''" :to="`/feeds/${feeds[6]}${userId ? '?userId='+userId : ''}`">Lens</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[7] ? 'navActive' : ''" :to="`/feeds/${feeds[7]}${userId ? '?userId='+userId : ''}`">Twitter</router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="bg-color table-list w-full mb-4">
      <template v-if="loading">
        <p class="p-4">Loading feed data</p>
        <DangLoader :unset="true" />
      </template>
      <InfScroll v-else :key="`${loading}-loaded`" :postLoaded="true" @hit="onHit">
        <template #content>
          <div v-if="posts.length > 0" class="flex flex-row mx-auto">
            <div class="flex flex-col">
              <Post
                v-for="post of posts"
                :id="(post as Record<string, any>)._id.postid"
                :key="(post  as Record<string, any>)._id.postid"
                :post="(post)"
                :postTypesPromises="postTypesPromises"
                :isHidenInfo="(post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid"
                :deps="deps"
                :crossPost="() => import('@/components/content/post/crossPost.vue')"
                @updatepostinfo="
                  (postid: string) => {
                    postInfo = posts.find((p: any): boolean => postid === p._id.postid)
                  }
                "
              />
              <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
            </div>
            <PostInfo
              :key="(postInfo as Record<string, any>)._id.postid"
              class="hidden lg:flex"
              :post="(postInfo as Record<string, any>)"
            />
          </div>
          <div v-else>
            <h2 class="text-[1.3rem] mt-2 uppercase">This feed is empty :(</h2>
            <component :is="(catComp as unknown)" v-if="catComp !== null" class="w-10 mx-auto" />
          </div>
        </template>
      </InfScroll>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, onUnmounted, Ref, ref, shallowRef } from 'vue'
import { useHead } from 'unhead'
import DangLoader from 'components/vote-list/loader.vue'
import InfScroll from 'components/functional/inf-scroll/infScroll.vue'
// import DateIcon from 'icons/src/date.vue'
// import { useMainStore } from '@/store/main'
import { postTypesPromises } from 'components/post-types/post-types'
import { useRoute } from 'vue-router'
import Post from 'components/post/post.vue'
import PostInfo from '@/components/content/post/postInfo.vue'
import LineLoader from 'components/functional/lineLoader.vue'
import { stackAlertError, stackAlertSuccess, stackAlertWarning } from '@/store/alertStore'
import { useMainStore, openConnectModal } from '@/store/main'
import { IPostDeps } from 'shared/src/types/post'
import type { IPost } from 'shared/src/types/post'
import type { IMainStore } from 'shared/src/types/store'
import PostMenu from '@/components/content/post/menu/postMenu.vue'
import CollectMenu from '@/components/content/post/menu/collectMenu.vue'
import { OTooltip } from '@oruga-ui/oruga-next'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const deps: IPostDeps = {
    stackAlertError,
    stackAlertSuccess,
    stackAlertWarning,
    openConnectModal,
    useMainStore: useMainStore as unknown as () => IMainStore,
    apiBase: API_BASE,
    PostMenu: PostMenu,
    CollectMenu: CollectMenu,
    ToolTip: OTooltip
  }

const FEED_APIS: Record<string, string> = {
  dailyhits: 'https://api.yup.io/feed/dailyhits',
  bsky: 'https://api.yup.io/feed/bsky',
  nfts: 'https://api.yup.io/feed/nfts',
  mirror: 'https://api.yup.io/feed/mirror',
  recent: 'https://api.yup.io/feed/recent',
  farcaster: 'https://api.yup.io/feed/farcaster',
  lens: 'https://api.yup.io/feed/lens',
  twitter: 'https://api.yup.io/feed/twitter'
}

export default defineComponent({
  name: 'FeedsPage',
  components: {
    DangLoader,
    InfScroll,
    Post,
    PostInfo,
    LineLoader
    // DateIcon
  },
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const feeds = ['dailyhits', 'bsky', 'nfts', 'mirror', 'recent', 'farcaster', 'lens', 'twitter']
    const defaultFeed = (route.params.feedId as string) ?? 'dailyhits'
    let userId = (route.query.userId as string) ?? ''
    const posts = ref([]) as Ref<Array<IPost>>
    const activeFeed = ref(defaultFeed) as Ref<string>
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>
    const feedLoading = ref(false)
    const catComp = shallowRef(null) as Ref<unknown>
    const feedPersonalization = ref('');

    const siteData = reactive({
      title: `YUP View Feed - ${activeFeed.value ?? ''}`,
      description: `Browse through yup feed: ${activeFeed.value ?? ''}`
    })

    useHead({
      title: siteData.title,
      meta: [
        {
          name: 'og:image',
          content: `/share/yup-live-ogs/og-yup-live-feeds.png`
        },
        {
          name: 'description',
          content: siteData.description
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content:  siteData.title
        },
        {
          name: 'og:description',
          content:  siteData.description
        },
        {
          name: 'og:url',
          content: route.fullPath
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: route.fullPath
        },
        {
          name: 'twitter:title',
          content: siteData.title
        },
        {
          name: 'twitter:description',
          content: siteData.description
        }
      ]
    })

    const getFeedPosts = async (start = 0) => {
      try {
      if(!userId) {
        if(feedPersonalization.value) {
          userId = feedPersonalization.value;
        }
      }
      const res = await fetch(`${FEED_APIS[activeFeed.value]}?start=${start}&limit=10${userId ? '&account='+userId : ''}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      return ((data ?? []) as Array<IPost>).filter(p => p?._id?.postid)
     } catch {
      return []
    }
    }

    const onHit = async (type: string) => {
      feedLoading.value = true
      if (type === 'up' && posts.value.length <= 30) {
        return
      } else if (type === 'up' && postsIndex.value >= 30) {
        postsIndex.value -= 10
        const newPosts = await getFeedPosts(postsIndex.value - 30)
        posts.value = [...newPosts, ...posts.value.slice(-30)]
      } else if (type === 'down' && posts.value.length <= 30) {
        postsIndex.value += 10
        const newPosts = await getFeedPosts(postsIndex.value)
        posts.value = [...posts.value, ...newPosts]
      } else if (type === 'down' && posts.value.length >= 30) {
        postsIndex.value += 10
        const newPosts = await getFeedPosts(postsIndex.value)
        posts.value = [...posts.value.slice(10), ...newPosts]
      }
      feedLoading.value = false
    }

    const feedChange = async (feed: string) => {
      loading.value = true
      activeFeed.value = feed
      postsIndex.value = 0
      posts.value = await getFeedPosts(postsIndex.value)
      loading.value = false
    }


    onMounted(async () => {
     ;(async () => (catComp.value = (await import('icons/src/catEmpty.vue')).default))()
     feedPersonalization.value = localStorage.getItem('feedPersonalization') ?? ''
     getFeedPosts(postsIndex.value).then(
      res => {
        posts.value  = res
        if (!postInfo.value) {
        postInfo.value = posts.value[0]
      }
      loading.value = false
      }
     )
    })

    

    onUnmounted(() => {
      // do nothing
    })


    return {
      postTypesPromises,
      onHit,
      feedChange,
      feeds,
      loading,
      posts,
      FEED_APIS,
      postInfo,
      activeFeed,
      feedLoading,
      catComp,
      userId,
      deps
    }
  }
})
</script>

<style lang="scss">
nav.feedNav {
  max-width: 100%;
  mask-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #1f1f1f 25%, #0e0e0e 75%, rgba(255, 255, 255, 0) 100%);
  margin: 1rem auto;
  padding: 0.1rem;
}

nav.feedNav {
  ul {
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgb(84 84 84 / 20%) 25%,
      rgb(54 54 54 / 30%) 75%,
      rgb(62 62 62 / 0%) 100%
    );
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1), inset 0 0 1px rgba(43, 43, 43, 0.6);
  }
  ul li {
    display: inline-block;
  }

  ul li a {
    padding: 1rem;
    text-transform: uppercase;
    // color: rgba(0, 35, 122, 0.5);
    font-size: 1.2rem;
    text-decoration: none;
    display: block;
  }

  ul li a:hover,
  ul li a.navActive {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), inset 0 0 1px rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
    // color: rgba(0, 35, 122, 0.7);
  }
}
</style>
