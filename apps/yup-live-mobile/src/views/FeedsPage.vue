<template>
  <ion-page>
    <HeaderBar text="FEEDS" :menu="true" />



    <!-- <ion-item>
      <ion-select v-model="activeFeed" aria-label="feed" :value="feeds[0][0]" style="margin:auto;" interface="action-sheet" placeholder="Select Feed" @ionChange="feedChange">
        <ion-select-option v-for="feed of feeds" :key="feed[0]" :value="feed[0]">{{feed[1]}}</ion-select-option>
      </ion-select>
    </ion-item> -->
    <ion-content :fullscreen="true">
  <ion-refresher
              slot="fixed"
              mode="ios"
              :pull-factor="0.5"
              :pull-min="100"
              :pull-max="200"
              @ionRefresh="handleRefresh($event)"
            >
  <ion-refresher-content pulling-text="Fetching..."></ion-refresher-content>
</ion-refresher>
  <ion-loading
      :key="`${loading}-loading`"
      :is-open="loading"
      message="Loading..."
      :duration="3000"
      @didDismiss="loading = false"
    >
    </ion-loading>

    <HorizontalChips>
    <template #chips>
      <ion-chip v-for="feed in feeds" :key="feed[0]" :color="feed[0] === activeFeed ? 'success': 'primary'" @click="feedChange(feed[0])" >
      {{feed[1]}}
    </ion-chip>
    </template>
    </HorizontalChips>

  <InfScroll v-if="!loading" :key="`${loading}-loaded`" :postLoaded="true" @hit="onHit">
        <template #content>
          <div v-if="posts.length > 0" class="flex flex-row mx-auto">
            <div class="flex flex-col">
              <Post
                v-for="post of posts"
                :id="(post as Record<string, any>)._id.postid"
                :key="(post  as Record<string, any>)._id.postid"
                :post="(post)"
                :crossPost="() => import('@/components/post/reply-btn-mobile.vue')"
                :postTypesPromises="postTypesPromises"
                :deps="postDeps"
                :mobile="true"
              />
              <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
            </div>
          </div>
          <div v-else>
            <h2 class="text-[1.3rem] mt-2 uppercase">This feed is empty :(</h2>
            <component :is="(catComp as any)" v-if="catComp !== null" class="w-10 mx-auto" />
          </div>
        </template>
      </InfScroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonList,
  IonSelect,
  IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  IonItem,
  IonLoading,
  IonChip,
onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, ref, Ref, shallowRef } from "vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { postTypesPromises } from 'components/post-types/post-types'
import InfScroll from 'components/functional/inf-scroll/infScroll.vue'
import LineLoader from 'components/functional/lineLoader.vue'
import Post from 'components/post/post.vue'
import PostMenu from '@/components/post/menu/postMenu.vue'
import type { IPostDeps } from 'shared/src/types/post'
import type { IMainStore } from 'shared/src/types/store'
import { stackAlertError, stackAlertSuccess, stackAlertWarning } from "@/store/alert-store";
import { useMainStore } from "@/store/main";
import { IPost } from "shared/src/types/post";
import { fetchWAuth } from "shared/src/utils/auth";
import HorizontalChips from "@/components/misc/horizontal-chips.vue";


const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const postDeps: IPostDeps = {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
  openConnectModal: () => '',
  useMainStore: useMainStore as unknown as () => IMainStore,
  apiBase: API_BASE,
  PostMenu,
}

const FEED_APIS = `${API_BASE}/feed`

export default defineComponent({
  name: "FeedsPage",
  components: {
    IonContent,
    IonPage,
    IonList,
  IonSelect,
  IonSelectOption,
  IonItem,
    HeaderBar,
    InfScroll,
    Post,
    IonRefresher,
  IonRefresherContent,
    IonLoading,
    LineLoader,
    HorizontalChips,
    IonChip

  },
  setup () {
    const loading = ref(true)
    const feeds = [
      ['dailyhits', 'For You'],
      ['farcaster', 'Farcaster'],
      ['lens', 'Lens'],
      ['bsky', 'BlueSky'], 
      ['nfts', 'NFTs' ],
      ['mirror', 'Mirror' ],
      ['twitter', 'Twitter' ],
      ['recent', 'Recent' ]
  ]

    const defaultFeed = 'dailyhits'
    const posts = ref([]) as Ref<Array<IPost>>
    const activeFeed = ref(defaultFeed) as Ref<string>
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>
    const feedLoading = ref(false)
    const catComp = shallowRef(null) as Ref<unknown>
    const store = useMainStore()
    const personalized = store.settings?.personalizedFeeds


    const getFeedPosts = async (start = 0, refresh=false) => {
      try {
        let res
      if(refresh) {
        res = await fetchWAuth(store, `${FEED_APIS}/${activeFeed.value}?start=${start}&limit=10&refresh=true${personalized && store?.userData?.account ? '&account='+store.userData.account : ''}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } {
       res = await fetch(`${FEED_APIS}/${activeFeed.value}?start=${start}&limit=10${personalized && store?.userData?.account ? '&account='+store.userData.account : ''}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
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
      activeFeed.value = feed
      loading.value = true
      postsIndex.value = 0
      posts.value = await getFeedPosts(postsIndex.value)
      loading.value = false
    }

    const handleRefresh = async (event:any) => {
      loading.value = true
      postsIndex.value = 0
      posts.value = await getFeedPosts(postsIndex.value, true)
      loading.value = false
      event.target.complete();
    }

    onIonViewWillEnter(async () => {
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
      postDeps,
      handleRefresh
    }

  }
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-chip {
    width: max-content;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

</style>
