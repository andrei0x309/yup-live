<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color w-full mb-4">
      <nav class="feedNav">
        <ul>
          <li>
            <router-link :class="activeFeed === feeds[0] ? 'navActive' : ''" :to="`/feeds/${feeds[0]}`">Daily Hits</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[1] ? 'navActive' : ''" :to="`/feeds/${feeds[1]}`">Crypto</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[2] ? 'navActive' : ''" :to="`/feeds/${feeds[2]}`">NFTs</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[3] ? 'navActive' : ''" :to="`/feeds/${feeds[3]}`">Mirror</router-link>
          </li>
        </ul>
      </nav>
      <nav class="feedNav">
        <ul>
          <li>
            <router-link :class="activeFeed === feeds[4] ? 'navActive' : ''" :to="`/feeds/${feeds[4]}`">Recent</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[5] ? 'navActive' : ''" :to="`/feeds/${feeds[5]}`">Farcaster</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[6] ? 'navActive' : ''" :to="`/feeds/${feeds[6]}`">Lens</router-link>
          </li>
          <li>
            <router-link :class="activeFeed === feeds[7] ? 'navActive' : ''" :to="`/feeds/${feeds[7]}`">Politics</router-link>
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
          <div class="flex flex-row mx-auto">
            <div class="flex flex-col">
              <Post
                v-for="post of posts"
                :id="(post as Record<string, any>)._id.postid"
                :key="(post  as Record<string, any>)._id.postid"
                :post="(post as Record<string, any>)"
                :postTypesPromises="postTypesPromises"
                :isHidenInfo="(post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid"
                @updatepostinfo="
                  (postid: string) => {
                    postInfo = posts.find((p: any): boolean => postid === p._id.postid)
                  }
                "
              />
            </div>
            <PostInfo
              :key="(postInfo as Record<string, any>)._id.postid"
              class="hidden lg:flex"
              :post="(postInfo as Record<string, any>)"
            />
          </div>
        </template>
      </InfScroll>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from '@/components/content/vote-list/loader.vue'
import InfScroll from '@/components/functional/inf-scroll/infScroll.vue'
// import DateIcon from '@/components/content/icons/date.vue'
// import { useMainStore } from '@/store/main'
import { postTypesPromises } from '@/utils/post'
import { useRoute } from 'vue-router'
import Post from '@/components/content/post/post.vue'
import PostInfo from '@/components/content/post/postInfo.vue'

const FEED_APIS: Record<string, string> = {
  dailyhits: 'https://api.yup.io/feed/dailyhits',
  crypto: 'https://api.yup.io/feed/crypto',
  nfts: 'https://api.yup.io/feed/nfts',
  mirror: 'https://api.yup.io/feed/mirror',
  recent: 'https://api.yup.io/feed/recent',
  farcaster: 'https://api.yup.io/feed/farcaster',
  lens: 'https://api.yup.io/feed/lens',
  politics: 'https://api.yup.io/feed/politics'
}

export default defineComponent({
  name: 'RawInfluence',
  components: {
    DangLoader,
    InfScroll,
    Post,
    PostInfo
    // DateIcon
  },
  setup() {
    // const API_BASE = import.meta.env.VITE_YUP_API_BASE;
    // const search = ref("");
    // const store = useMainStore();
    // const apiError = ref(false);
    // const apiErrorMsg = ref("");
    // const userId = ref("");
    // const isDataLoading = ref(false);
    // const influence: Ref<null | string> = ref(null);
    // const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([]);
    // const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')
    const route = useRoute()
    const loading = ref(true)
    const feeds = ['dailyhits', 'crypto', 'nfts', 'mirror', 'recent', 'farcaster', 'lens', 'politics']
    console.log(route.params.feedId)
    const defaultFeed = (route.params.feedId as string) ?? 'dailyhits'
    const posts = ref([]) as Ref<Array<unknown>>
    const activeFeed = ref(defaultFeed) as Ref<string>
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>

    const getFeedPosts = async (start = 0) => {
      const res = await fetch(`${FEED_APIS[activeFeed.value]}?start=${start}&limit=10`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      return data
    }

    const onHit = async (type: string) => {
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
      // console.log(postsIndex.value, (posts.value[0] as {_id: any})._id, posts.value.length)
    }

    const feedChange = async (feed: string) => {
      loading.value = true
      activeFeed.value = feed
      postsIndex.value = 0
      posts.value = await getFeedPosts(postsIndex.value)
      loading.value = false
    }

    const siteData = reactive({
      title: `YUP Live - Check your raw influence`,
      description: `LiveCheck your raw influence for YUP DApp...`
    })

    onMounted(async () => {
      posts.value = await getFeedPosts(postsIndex.value)
      if (!postInfo.value) {
        postInfo.value = posts.value[0]
      }
      loading.value = false
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    return {
      postTypesPromises,
      onHit,
      feedChange,
      feeds,
      loading,
      posts,
      FEED_APIS,
      postInfo,
      activeFeed
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