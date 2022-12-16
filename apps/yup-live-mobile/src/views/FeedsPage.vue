<template>
  <ion-page>
    <HeaderBar text="FEEDS" :menu="true" />

    <ion-content :fullscreen="true">
      <ion-list style="position: sticky;top: 0;z-index: 2;">
    <ion-item>
      <ion-select v-model="activeFeed" @ionChange="feedChange" :value="feeds[0][0]" style="margin:auto;" interface="action-sheet" placeholder="Select Feed">
        <ion-select-option v-for="feed of feeds" :key="feed[0]" :value="feed[0]">{{feed[1]}}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
  
  <ion-loading
      :is-open="loading"
      message="Loading..."
      :duration="3000"
      @didDismiss="loading = false"
    >
    </ion-loading>
  <InfScroll v-if="!loading" :key="`${loading}-loaded`" :postLoaded="true" @hit="onHit">
        <template #content>
          <div v-if="posts.length > 0" class="flex flex-row mx-auto">
            <div class="flex flex-col">
              <Post
                v-for="post of posts"
                :id="(post as Record<string, any>)._id.postid"
                :key="(post  as Record<string, any>)._id.postid"
                :post="(post as Record<string, any>)"
                :postTypesPromises="postTypesPromises"
              />
              <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
            </div>
          </div>
          <div v-else>
            <h2 class="text-[1.3rem] mt-2 uppercase">This feed is empty :(</h2>
            <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
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
  IonItem,
  IonLoading,
onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent, ref, Ref } from "vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { postTypesPromises } from '@/components/copy/post/post-types'
import Post from '@/components/copy/post/post.vue'
import InfScroll from 'components/functional/inf-scroll/infScroll.vue'
import LineLoader from 'components/functional/lineLoader.vue'

import { config } from 'shared/src/utils/config'
const { API_BASE } = config
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
    IonLoading,
    LineLoader

  },
  setup () {
    const loading = ref(true)
    const feeds = [
      ['dailyhits', 'Daily Hits'],
      ['farcaster', 'Farcaster'],
      ['lens', 'Lens'],
      ['crypto', 'Crypto'], 
      ['nfts', 'NFTs' ],
      ['mirror', 'Mirror' ],
      ['twitter', 'Twitter' ],
      ['recent', 'Recent' ]
  ]

    const defaultFeed = 'dailyhits'
    const posts = ref([]) as Ref<Array<unknown>>
    const activeFeed = ref(defaultFeed) as Ref<string>
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>
    const feedLoading = ref(false)
    const catComp = ref(null) as Ref<unknown>


    const getFeedPosts = async (start = 0) => {
      try {
      const res = await fetch(`${FEED_APIS}/${activeFeed.value}?start=${start}&limit=10`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      return data
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

    const feedChange = async (event?: any) => {
      console.log(event)
      loading.value = true
      postsIndex.value = 0
      posts.value = await getFeedPosts(postsIndex.value)
      loading.value = false
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
      catComp
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
</style>
