<template>
  <ion-page>
    <HeaderBar text="FC CHANNELS" :menu="true" />

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
          <ion-chip
            v-for="feed in feeds"
            :key="feed[0]"
            :color="feed[0] === activeFeed ? 'success' : 'primary'"
            @click="feedChange(feed[0])"
          >
            {{ feed[1] }}
          </ion-chip>
          <ion-chip
            v-for="channel in favChannels"
            :key="channel.id"
            @click.self="feedChange(`channel/get?parentUrl=${channel.parent_url}`)"
          >
            <img
              class="w-4 h-4 inline rounded-lg mx-2 my-1 border-gray-400"
              :src="channel.image_url"
            />
            <p>{{ channel.name }}</p>
            <ion-icon
              :icon="trashBinOutline"
              @click.stop="doFavChannelDelete(channel)"
              class="w-4 h-4 inline rounded-lg mx-2 my-1 border-gray-400"
            ></ion-icon>
          </ion-chip>
          <ion-chip
            @click="
              modalContent = 'addChannel';
              modalOpen = true;
            "
          >
            +
          </ion-chip>
        </template>
      </HorizontalChips>

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
            <component
              :is="(catComp as any)"
              v-if="catComp !== null"
              class="w-10 mx-auto"
            />
          </div>
        </template>
      </InfScroll>

      <ion-modal :is-open="modalOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title v-if="modalContent === 'addChannel'">Recent Voters</ion-title>
            <ion-title v-else>Modal</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="modalOpen = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <template v-if="modalContent === 'addChannel'">
            <div class="add-channel">
              <h2 class="text-lg mb-1 font-medium title-font">
                Select Farcaster Channel
              </h2>
              <p>Search</p>
              <input
                id="farcasterChannelSearch"
                type="text"
                placeholder="channel name"
                class="mb-4 rounded p-2 text-[#e0e0e0] bg-stone-800 border-purple-800 border-2 w-full"
                @input="(e) => {
                searchChannels((e?.target as any)?.value)
            }"
              />
              <div v-if="channels?.length === 0">
                <p>No channels found</p>
              </div>
              <ion-list v-else class="flex flex-col">
                <ion-item
                  v-for="channel of channels"
                  :key="channel.id"
                  :native-value="channel.id"
                  @click="farcasterChannel = channel.id"
                  class="my-2"
                >
                  <div class="flex flex-wrap-reverse w-full">
                    <div class="w-max-[28%]">
                      <img
                        class="w-8 h-8 inline rounded-lg mx-4 my-1"
                        :src="channel.image_url"
                      />
                    </div>
                    <div class="flex flex-col text-left w-[65%]">
                      <p>Name: {{ channel.name }}</p>
                      <p class="text-[0.8rem] opacity-70">Id: {{ channel.id }}</p>
                      <p class="text-xs">{{ channel.description }}</p>
                    </div>
                  </div>
                </ion-item>
              </ion-list>
            </div>
          </template>
        </ion-content>
      </ion-modal>
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
  onIonViewWillEnter,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
import { defineComponent, ref, Ref, shallowRef, watch } from "vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { postTypesPromises } from "components/post-types/post-types";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import LineLoader from "components/functional/lineLoader.vue";
import Post from "components/post/post.vue";
import PostMenu from "@/components/post/menu/postMenu.vue";
import type { IPostDeps } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alert-store";
import { useMainStore } from "@/store/main";
import { IPost } from "shared/src/types/post";
import { fetchWAuth } from "shared/src/utils/auth";
import HorizontalChips from "@/components/misc/horizontal-chips.vue";
import type { TChannel } from "shared/src/types/web3-posting";
import { searchChannel } from "shared/src/utils/requests/web3-posting";
import { wait } from "shared/src";
import {
  getFavoriteChannels,
  favAddChannel,
  favChannelDelete,
} from "shared/src/utils/requests/farcaster";

import { trashBinOutline } from "ionicons/icons";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const postDeps: IPostDeps = {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
  openConnectModal: () => "",
  useMainStore: (useMainStore as unknown) as () => IMainStore,
  apiBase: API_BASE,
  PostMenu,
};

const FEED_APIS = `${API_BASE}/feed`;

export default defineComponent({
  name: "FcChannelsPage",
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
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
    IonChip,
    IonIcon,
  },
  setup() {
    const loading = ref(true);

    const YUP_CHANNEL_URL = "https://warpcast.com/~/channel/yup";
    const FARCASTER_CHANNEL_URL =
      "chain://eip155:7777777/erc721:0x4f86113fc3e9783cf3ec9a552cbb566716a57628";
    const MEME_CHANNEL_URL =
      "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61";
    const CRYPTO_LEFT_CHANNEL_URL = "https://warpcast.com/~/channel/cryptoleft";

    const feeds = [
      ["channel/get?parentUrl=" + YUP_CHANNEL_URL, "Yup"],
      ["channel/get?parentUrl=" + FARCASTER_CHANNEL_URL, "Farcaster"],
      ["channel/get?parentUrl=" + MEME_CHANNEL_URL, "Memes"],
      ["channel/get?parentUrl=" + CRYPTO_LEFT_CHANNEL_URL, "CryptoLeft"],
    ];

    const defaultFeed = feeds[0][0];
    const posts = ref([]) as Ref<Array<IPost>>;
    const activeFeed = ref(defaultFeed) as Ref<string>;
    const postsIndex = ref(0);
    const feedLoading = ref(false);
    const catComp = shallowRef(null) as Ref<unknown>;
    const store = useMainStore();
    const personalized = store.settings?.personalizedFeeds;
    const modalOpen = ref(false);
    const modalContent = ref("addChannel");
    const channels = ref([]) as Ref<TChannel[]>;
    const favChannels = ref([]) as Ref<TChannel[]>;
    const farcasterChannel = ref(undefined) as Ref<TChannel | undefined | string>;
    const isChannelSearching = ref(false);
    let searchString = "";

    const getFeedPosts = async (start = 0, refresh = false) => {
      try {
        let res;
        if (refresh) {
          res = await fetchWAuth(
            store,
            `${FEED_APIS}/${activeFeed.value}&start=${start}&limit=10&refresh=true${
              personalized && store?.userData?.account
                ? "&account=" + store.userData.account
                : ""
            }`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
        {
          res = await fetch(
            `${FEED_APIS}/${activeFeed.value}&start=${start}&limit=10${
              personalized && store?.userData?.account
                ? "&account=" + store.userData.account
                : ""
            }`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
        const data = await res.json();
        return ((data ?? []) as Array<IPost>).filter((p) => p?._id?.postid);
      } catch {
        return [];
      }
    };

    const onHit = async (type: string) => {
      feedLoading.value = true;
      if (type === "down" && posts.value.length <= 30) {
        postsIndex.value += 10;
        const newPosts = await getFeedPosts(postsIndex.value);
        posts.value = [...posts.value, ...newPosts];
      } else if (type === "down" && posts.value.length >= 30) {
        postsIndex.value += 10;
        const newPosts = await getFeedPosts(postsIndex.value);
        posts.value = [...posts.value.slice(10), ...newPosts];
      }
      feedLoading.value = false;
    };

    const feedChange = async (feed: string) => {
      activeFeed.value = feed;
      loading.value = true;
      postsIndex.value = 0;
      posts.value = await getFeedPosts(postsIndex.value);
      loading.value = false;
    };

    const handleRefresh = async (event: any) => {
      loading.value = true;
      postsIndex.value = 0;
      posts.value = await getFeedPosts(postsIndex.value, true);
      loading.value = false;
      event.target.complete();
    };

    const searchChannels = async (value: string) => {
      searchString = value;
      if (!value) return;
      if (isChannelSearching.value) return;
      await wait(300);
      if (isChannelSearching.value) return;
      isChannelSearching.value = true;
      let result: TChannel[];
      let searchTerm = "";
      do {
        searchTerm = searchString;
        result = await searchChannel(searchString);
      } while (searchTerm !== searchString);
      channels.value = result;
      isChannelSearching.value = false;
    };

    const feedAdd = () => {
      modalOpen.value = true;
    };

    const doFavChannelDelete = (channel: TChannel) => {
      favChannelDelete(store, channel);
      favChannels.value = favChannels.value.filter((c) => c.id !== channel.id);
    };

    onIonViewWillEnter(async () => {
      getFavoriteChannels(store).then((res: TChannel[]) => {
        favChannels.value = res;
      });
      getFeedPosts(postsIndex.value).then((res) => {
        posts.value = res;
        loading.value = false;
      });
    });

    watch(
      () => farcasterChannel.value,
      (newVal) => {
        if (newVal !== undefined && newVal !== "" && !(newVal as TChannel)?.id) {
          farcasterChannel.value = channels.value.find((c) => c.id === newVal);
          favChannels.value = [...favChannels.value, farcasterChannel.value as TChannel];
          favAddChannel(store, farcasterChannel.value as TChannel);
          modalOpen.value = false;
        }
      }
    );

    return {
      postTypesPromises,
      onHit,
      feedChange,
      feeds,
      loading,
      posts,
      FEED_APIS,
      activeFeed,
      feedLoading,
      catComp,
      postDeps,
      handleRefresh,
      feedAdd,
      doFavChannelDelete,
      modalOpen,
      modalContent,
      farcasterChannel,
      channels,
      searchChannels,
      favChannels,
      trashBinOutline,
    };
  },
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
