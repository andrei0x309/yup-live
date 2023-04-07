<template>
  <ion-page>
    <HeaderBar text="Search" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
      <ion-segment
        style="width: auto"
        class=""
        :value="currentSegment"
        mode="ios"
        @ion-change="segmentChange"
      >
        <ion-segment-button value="search">
          <ion-label>Posts</ion-label>
        </ion-segment-button>
        <ion-segment-button value="profiles">
          <ion-label>Profiles</ion-label>
        </ion-segment-button>
      </ion-segment>

      <template v-if="currentSegment === 'search'">
        <div class="bg-color search-controls w-full">
          <form @submit.prevent="() => search()">
            <ion-searchbar
              v-model="searchText"
              :animated="true"
              enterkeyhint="search"
              placeholder="Your search query"
            ></ion-searchbar>
          </form>
          <div class="text-[0.9rem] mt-4">
          Sort by<br>
          <ion-radio-group v-model="sortBy" value="relevance">
              <ion-radio aria-label="relevance" value="relevance" class="mt-4 mr-4 text-[0.9rem]" >Relevance</ion-radio>
              <ion-radio aria-label="recency" value="recency" class="mt-4 mr-4" >Recency</ion-radio>
          </ion-radio-group>
        </div>
        <div class="text-[0.9rem] mt-4">
          <template v-if="sortBy === 'recency'">
            Order<br>
            <ion-radio-group v-model="recencyType" value="desc" class="fadeIn">
                <ion-radio aria-label="desc" value="desc" class="mt-4 mr-4" >Newer First</ion-radio>
                <ion-radio value="asc" class="mt-4 mr-4" >Older First</ion-radio>
            </ion-radio-group>
          </template>
        </div>
        <div class="text-[0.9rem] mt-4">
          Filter Platform<br>
          <ion-radio-group v-model="filterPlatforms" value="all">
              <ion-radio aria-label="all" value="all" class="mt-4 mr-4" >All</ion-radio>
              <ion-radio aria-label="specific" value="specific" class="mt-4 mr-4" >Specific</ion-radio>
          </ion-radio-group>
        </div>
          <ion-select
            v-if="filterPlatforms !== 'all'"
            v-model="platforms"
            placeholder="Platforms"
            :multiple="true"
            class="fadeIn mt-4"
          >
            <ion-select-option aria-label="youtube" value="youtube"
              >Youtube</ion-select-option
            >
            <ion-select-option aria-label="mirror" value="mirror"
              >Mirror</ion-select-option
            >
            <ion-select-option aria-label="twitter" value="twitter"
              >Twitter</ion-select-option
            >
            <ion-select-option aria-label="farcaster" value="farcaster"
              >Farcaster</ion-select-option
            >
            <ion-select-option aria-label="lens" value="lens">Lens</ion-select-option>
            <ion-select-option aria-label="foundation" value="foundation"
              >Foundation</ion-select-option
            >
            <ion-select-option aria-label="general" value="general"
              >General</ion-select-option
            >
          </ion-select>
          <ion-button class="search-btn" fill="clear" @click="() => search()"
            >Search</ion-button
          >
        </div>
        <div v-if="searchStarted" class="bg-color search-controls w-full">
          <InfScroll
            v-if="!loading"
            :key="`${loading}-loaded`"
            :postLoaded="true"
            @hit="onHit"
          >
            <template #content>
              <div v-if="posts.length > 0" class="flex flex-row mx-auto">
                <div class="flex flex-col">
                  <Post
                    v-for="post of posts"
                    :id="(post as Record<string, any>)._id.postid"
                    :key="(post  as Record<string, any>)._id.postid"
                    :post="post"
                    :postTypesPromises="postTypesPromises"
                    :top-detection="false"
                    :mobile="true"
                    :deps="postDeps"
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
      </template>
      <template v-else>
        <div v-if="currentSegment === 'profiles'" class="bg-color search-controls w-full">
          <form @submit.prevent="() => search(true)">
            <ion-searchbar
              v-model="searchText"
              :animated="true"
              enterkeyhint="search"
              placeholder="Your search query"
            ></ion-searchbar>
          </form>
          <ion-button class="search-btn" fill="clear" @click="() => search(true)"
            >Search</ion-button
          >
        </div>
        <div v-if="searchStarted" class="bg-color search-controls w-full">
          <InfScroll
            v-if="!loading"
            :key="`${loading}-loaded`"
            :postLoaded="true"
            @hit="onHitProfiles"
          >
            <template #content>
              <div v-if="profiles.length > 0" class="flex flex-row">
                <div class="flex flex-col w-full">
                  <ul>
                    <li v-for="profile of profiles" :key="profile._id" class="p-4">
                      <div class="flex p-2">
                        <AvatarBtn
                          :mobile="true"
                          :pSource="profile.avatar"
                          :pAccount="profile._id"
                          :isSelf="false"
                          class="h-8 w-8"
                          imgClass="h-8 w-8"
                        />
                        <p class="ml-4 mt-3 text-[0.95rem]">
                        <b>{{ profile.handle || `${profile._id.slice(0, 6)}...` }}</b>
                       </p>
                        <ion-button
                          fill="outline"
                          size="small"
                          class="ml-auto opacity-70 text-[0.6rem]"
                          :router-link="`/tabs/web3-profile/${profile._id}`"
                          >View Profile</ion-button
                        >
                      </div>
                    </li>
                  </ul>
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
      </template>

      <ion-loading
        :key="`loading-${loading}`"
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
  IonLoading,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { onUnmounted, defineComponent, ref, Ref } from "vue";

import { postTypesPromises } from "components/post-types/post-types";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import LineLoader from "components/functional/lineLoader.vue";
import { config } from "shared/src/utils/config";
import {
  search as yupSearch,
  searchProfiles,
} from "shared/src/utils/requests/searchFilters";
import Post from "components/post/post.vue";
import PostMenu from "@/components/post/menu/postMenu.vue";
import type { IPostDeps } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alertStore";
import { useMainStore } from "@/store/main";
import { IPost } from "shared/src/types/post";
import AvatarBtn from 'components/functional/avatarBtn.vue'


const { API_BASE } = config;

const postDeps: IPostDeps = {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
  openConnectModal: () => "",
  useMainStore: (useMainStore as unknown) as () => IMainStore,
  apiBase: API_BASE,
  PostMenu,
};

export default defineComponent({
  name: "TokenMetrics",
  components: {
    IonPage,
    IonContent,
    IonSearchbar,
    HeaderBar,
    IonRadioGroup,
    IonRadio,
    IonSelectOption,
    IonSelect,
    IonButton,
    InfScroll,
    LineLoader,
    Post,
    IonLabel,
    IonLoading,
    IonSegment,
    IonSegmentButton,
    AvatarBtn
  },
  setup() {
    interface ISearchWeb3Profile {
      [key: string]: any;
    }

    const posts = ref([]) as Ref<Array<IPost>>;
    const profiles = ref([]) as Ref<Array<ISearchWeb3Profile>>;
    const itemIndex = ref(0);
    const searchStarted = ref(false);
    const feedLoading = ref(false);
    const loading = ref(false);
    const filterPlatforms = ref("all");
    const sortBy = ref("relevance");
    const searchText = ref("");
    const platforms = ref();
    const recencyType = ref("desc");
    const noMoreResults = ref(false);
    const currentSegment = ref("search");

    // offset=0&searchText=sadsadsa&limit=15
    const getFeedPosts = async (offset = 0) => {
      const platformsArray = Object.keys(platforms.value ?? {});
      return await yupSearch({
        offset,
        limit: 10,
        platforms: platformsArray,
        byRencency: recencyType.value,
        input: searchText.value,
      });
    };

    const getSearchProfiles = async (start = 0) => {
      return await searchProfiles({ start, limit: 10, input: searchText.value });
    };

    const segmentChange = async (value: any) => {
      currentSegment.value = value.detail.value;
      noMoreResults.value = false;
      if (value.detail.value === "search") {
        itemIndex.value = posts.value.length;
      } else {
        itemIndex.value = profiles.value.length;    
      }
    };

    const onHitProfiles = async (type: string) => {
      if (noMoreResults.value) {
        return;
      }
      feedLoading.value = true;
      const newProfiles = await getSearchProfiles(profiles.value.length);
      if (newProfiles.length === 0) {
        noMoreResults.value = true;
        feedLoading.value = false;
        return;
      }
      itemIndex.value += newProfiles.length;
      if (type === "down" && profiles.value.length <= 30) {
        profiles.value = [...profiles.value, ...newProfiles];
      } else if (type === "down" && profiles.value.length >= 30) {
        profiles.value = [...profiles.value.slice(10), ...newProfiles];
      }
      feedLoading.value = false;
    };

    const onHit = async (type: string) => {
      if (noMoreResults.value) {
        return;
      }
      feedLoading.value = true;
      const newPosts = await getFeedPosts(itemIndex.value);
      if (newPosts.length === 0) {
        noMoreResults.value = true;
        feedLoading.value = false;
        return;
      }
      itemIndex.value += newPosts.length;
      if (type === "down" && posts.value.length <= 30) {
        posts.value = [...posts.value, ...newPosts];
      } else if (type === "down" && posts.value.length >= 30) {
        posts.value = [...posts.value.slice(10), ...newPosts];
      }
      feedLoading.value = false;
    };

    onUnmounted(() => {
      // do nothing
    });
    const checkSearch = async (event: any) => {
      console.log(event);
    };

    const search = async (searchProfiles = false) => {
      if (searchText.value.length < 3) {
        searchStarted.value = false;
        stackAlertWarning("Search text must be at least 3 characters");
        return;
      }
      searchStarted.value = true;
      loading.value = true;
      noMoreResults.value = false;
      if (searchProfiles) {
        profiles.value = (await getSearchProfiles()) ?? [];
        itemIndex.value += posts.value.length;
      } else {
        posts.value = (await getFeedPosts()) ?? [];
        itemIndex.value += posts.value.length;
      }
      loading.value = false;
    };

    return {
      posts,
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
      checkSearch,
      currentSegment,
      postDeps,
      segmentChange,
      profiles,
      onHitProfiles,
    };
  },
});
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
.search-btn {
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
