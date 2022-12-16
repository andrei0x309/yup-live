<template>
    <ion-page>
  <HeaderBar text="Search" :menu="true" />
  <ion-content :fullscreen="false" class="ion-padding mt-4">
<div class="bg-color search-controls w-full">
    <form @submit.prevent="search">
    <ion-searchbar v-model="searchText" :animated="true" enterkeyhint="search" placeholder="Your search query"></ion-searchbar>
  </form>
 Sort by 
 <ion-radio-group v-model="sortBy" value="relevance">
    <ion-item>
    <ion-label>Relevance</ion-label>
    <ion-radio value="relevance" class="mt-2 mr-4"/>
    </ion-item>
    <ion-item>
        <ion-label>Recency</ion-label>
        <ion-radio value="recency" class="mt-2 mr-4"/>
  </ion-item>
  </ion-radio-group>
  <template v-if="sortBy === 'recency'">
    Order 
 <ion-radio-group v-model="recencyType" value="desc" class="fadeIn">
    <ion-item>
    <ion-label>Newer First</ion-label>
    <ion-radio value="desc" class="mt-2 mr-4"/>
    </ion-item>
    <ion-item>
        <ion-label>Older First</ion-label>
        <ion-radio value="asc" class="mt-2 mr-4"/>
  </ion-item>
</ion-radio-group>
  </template>  
   Filter Platform 
  <ion-radio-group v-model="filterPlatforms" value="all">
   <ion-item>
    <ion-label>All</ion-label>
    <ion-radio value="all" class="mt-2 mr-4" />
</ion-item>
<ion-item>
    <ion-label>Specific</ion-label>
    <ion-radio value="specific" class="mt-2 mr-4" />
</ion-item>
  </ion-radio-group>
  <ion-select v-if="filterPlatforms !== 'all'" v-model="platforms" placeholder="Platforms" :multiple="true" class="fadeIn">
        <ion-select-option value="youtube">Youtube</ion-select-option>
        <ion-select-option value="mirror">Mirror</ion-select-option>
        <ion-select-option value="twitter">Twitter</ion-select-option>
        <ion-select-option value="farcaster">Farcaster</ion-select-option>
        <ion-select-option value="lens">Lens</ion-select-option>
        <ion-select-option value="foundation">Foundation</ion-select-option>
        <ion-select-option value="general">General</ion-select-option>
  </ion-select>
      <ion-button class="search-btn" fill="clear" @click="search">Search</ion-button>
      </div>
      <div v-if="searchStarted" class="bg-color search-controls w-full">
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
                :top-detection="false"
              />
              <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
              <div v-if="noMoreResults">
                <h2 class="text-[0.9rem] mt-2 uppercase">No more results</h2>
              </div>
            </div>
          </div>
          <div v-else>
            <h2 class="text-[1.3rem] mt-2 uppercase">No results :(</h2>
          </div>
        </template>
      </InfScroll>
</div>
<ion-loading
      :is-open="loading"
      message="Loading..."
      :duration="3000"
      @didDismiss="loading = false"
    >
    </ion-loading>
</ion-content>
</ion-page>
</template>

<script lang="ts">
import { 
    IonPage, 
    IonContent, 
    IonSearchbar,
    IonRadioGroup,
    IonRadio,
    IonSelectOption,
    IonSelect,
    IonButton,
    IonLabel,
    IonItem,
    IonLoading
 } from '@ionic/vue'
import HeaderBar from '@/components/template/header-bar.vue'
import {
onUnmounted,
defineComponent,
ref,
Ref
} from 'vue'

import { postTypesPromises } from '@/components/copy/post/post-types'
import Post from '@/components/copy/post/post.vue'
import InfScroll from 'components/functional/inf-scroll/infScroll.vue'
import LineLoader from 'components/functional/lineLoader.vue'
import { config } from 'shared/src/utils/config'

const { API_BASE } = config
import { stackAlertWarning } from '@/store/alertStore'

export default defineComponent({
name: 'TokenMetrics',
components: {IonPage, IonContent, IonSearchbar, HeaderBar, IonRadioGroup,
    IonRadio,
    IonSelectOption,
    IonSelect,
    IonButton,
    InfScroll,
    LineLoader,
    Post,
    IonLabel,
    IonItem,
    IonLoading
 },
setup() {
const posts = ref([]) as Ref<Array<unknown>>
const postsIndex = ref(0)
const searchStarted = ref(false)
const feedLoading = ref(false)
const loading = ref(false)
const filterPlatforms = ref('all')
const sortBy = ref('relevance')
const searchText = ref('') 
const platforms = ref()
const recencyType = ref('desc')
const noMoreResults = ref(false)

// offset=0&searchText=sadsadsa&limit=15
const getFeedPosts = async (offset = 0) => {
  let tags
  if(Object.keys(platforms.value ?? {}).length < 1){
    tags = 'all'
  } else if(Object.keys(platforms.value ?? {}).length > 1){
    tags = Object.values(platforms.value).join(',')
  } else {
    tags = Object.values(platforms.value)[0]
  }
  tags = tags === 'all' ? '' : `&tags=${tags}`

  const byRencency = sortBy.value === 'recency' ? `&recency=${recencyType.value}` : ''
  const res = await fetch(`${API_BASE}/search/es/posts?offset=${offset}&limit=10${tags}${byRencency}&searchText=${searchText.value}`)
  const data = await res.json()
  return data.filter((p: unknown) => p)
}


const onHit = async (type: string) => {
      if (noMoreResults.value) {
        return
      }
      feedLoading.value = true
      const newPosts = await getFeedPosts(postsIndex.value)
      if (newPosts.length === 0) {
        noMoreResults.value = true
        feedLoading.value = false
        return
      }
      postsIndex.value += 10
      if (type === 'down' && posts.value.length <= 30) {
        posts.value = [...posts.value, ...newPosts]
      } else if (type === 'down' && posts.value.length >= 30) {
        posts.value = [...posts.value.slice(10), ...newPosts]
      }
      feedLoading.value = false
    }

  onUnmounted(() => {
    // do nothing
  })
  const checkSearch = async (event: any) => {
     console.log(event)
  }

  const search = async () => {
    if (searchText.value.length < 3) {
    searchStarted.value = false
    stackAlertWarning('Search text must be at least 3 characters')
      return
    }
    searchStarted.value = true
    loading.value = true
    noMoreResults.value = false
    posts.value = await getFeedPosts()
    postsIndex.value += 10
    loading.value = false
  }

  return {
    posts,
    postsIndex,
    postTypesPromises,
    loading,
    onHit,
    feedLoading,
    filterPlatforms,
    search,
    platforms,
    sortBy,
    searchText,
    recencyType,
    searchStarted,
    noMoreResults,
    checkSearch
  }
}
})
</script>

<style scoped lang="scss">
.search-controls {
  margin-top: 0.5rem;
  min-height: 7.4rem;
  color: #818181;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0 0 20rem rgba(0, 0, 0, 0.623);
  grid-template-columns: 1fr;

h2 {
  display: inline-block;
}

.box {
  border: 1px solid #222;
  padding: 1rem;
}

}

.fadeIn {
  animation: 1s linear fadein;
} 
.search-btn{
  color: rgba(240, 248, 255, 0.829);
  background-color: rgba(240, 248, 255, 0.021);
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
 }
</style>
