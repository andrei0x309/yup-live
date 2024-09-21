<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color w-full mb-4">
      <nav class="feedNav">
        <ul>
          <li>
            <router-link
              :class="activeFeed === feeds[0] ? 'navActive' : ''"
              :to="`/feeds/${feeds[0]}${userId ? '?userId=' + userId : ''}`"
              >For You</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[1] ? 'navActive' : ''"
              :to="`/feeds/${feeds[1]}${userId ? '?userId=' + userId : ''}`"
              >Threads</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[3] ? 'navActive' : ''"
              :to="`/feeds/${feeds[3]}${userId ? '?userId=' + userId : ''}`"
              >Articles</router-link
            >
          </li>
        </ul>
      </nav>
      <nav class="feedNav">
        <ul>
          <li>
            <router-link
              :class="activeFeed === feeds[4] ? 'navActive' : ''"
              :to="`/feeds/${feeds[4]}${userId ? '?userId=' + userId : ''}`"
              >Recent</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[5] ? 'navActive' : ''"
              :to="`/feeds/${feeds[5]}${userId ? '?userId=' + userId : ''}`"
              >Farcaster</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[6] ? 'navActive' : ''"
              :to="`/feeds/${feeds[6]}${userId ? '?userId=' + userId : ''}`"
              >Lens</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[7] ? 'navActive' : ''"
              :to="`/feeds/${feeds[7]}${userId ? '?userId=' + userId : ''}`"
              >Twitter</router-link
            >
          </li>
        </ul>
      </nav>
      <div class="channelTitle">Farcaster Channels</div>
      <nav class="feedNav">
        <ul class="channels">
          <li>
            <router-link
              :class="activeFeed === feeds[8] ? 'navActive' : ''"
              :to="`/feeds/${feeds[8]}`"
              >Yup</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[9] ? 'navActive' : ''"
              :to="`/feeds/${feeds[9]}`"
              >Farcaster</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[10] ? 'navActive' : ''"
              :to="`/feeds/${feeds[10]}`"
              >Memes</router-link
            >
          </li>
          <li>
            <router-link
              :class="activeFeed === feeds[11] ? 'navActive' : ''"
              :to="`/feeds/${feeds[11]}`"
              >Crypto Left</router-link
            >
          </li>
          <li
            v-for="channel in favChannels"
            :key="channel.id"
            @click.self="feedChange(channel.parent_url)"
          >
            <button
              :class="activeFeed === channel.id ? 'navActive' : ''"
              @click.self="feedChange(channel.parent_url)"
            >
              <img
                class="w-4 h-4 inline rounded-lg mx-2 my-1 border-gray-400"
                :src="channel.image_url"
                @click.self="feedChange(channel.parent_url)"
              />
              <p class="inline" @click.self="feedChange(channel.parent_url)">
                {{ channel.name }}
              </p>
              <DeleteIcon
                class="w-4 h-4 inline rounded-lg mx-2 my-1 border-gray-400 hover:scale-125"
                @click.stop="doFavChannelDelete(channel)"
              />
            </button>
          </li>
          <li v-if="store.userData?.account">
            <button
              @click.stop="
                modalContent = 'addChannel';
                modalOpen = true;
              "
            >
              +
            </button>
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
                :post="post"
                :postTypesPromises="postTypesPromises"
                :isHidenInfo="(post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid"
                :deps="deps"
                :crossPost="() => import('@/components/content/post/replyButton.vue')"
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
            <component
              :is="(catComp as unknown)"
              v-if="catComp !== null"
              class="w-10 mx-auto"
            />
          </div>
        </template>
      </InfScroll>
    </div>
  </div>

  <o-modal v-model:active="modalOpen" contentClass="modalDefault">
    <template v-if="modalContent == 'addChannel'">
      <div class="add-channel m-4">
        <h2 class="text-lg mb-1 font-medium title-font">Add Farcaster Channel</h2>
        <p>Search</p>
        <input
          id="farcasterChannelSearch"
          type="text"
          placeholder="channel name"
          class="mb-4 rounded p-2 text-[#e0e0e0] bg-stone-800 border-purple-800 border-2"
          @input="(e) => {
                searchChannels((e?.target as any)?.value)
            }"
        />
        <div v-if="channels?.length === 0">
          <p>No channels found</p>
        </div>
        <div v-else class="flex flex-col">
          <o-radio
            v-for="channel of channels"
            :key="channel.id"
            v-model="farcasterChannel"
            :native-value="channel.id"
          >
            <div class="flex flex-wrap-reverse my-1">
              <div class="w-max-[28%]">
                <img
                  class="w-8 h-8 inline rounded-lg mx-4 my-1"
                  :src="channel.image_url"
                />
              </div>
              <div class="flex flex-col text-left w-[70%]">
                <p>Name: {{ channel.name }}</p>
                <p class="text-[0.8rem] opacity-70">Id: {{ channel.id }}</p>
                <p class="text-xs">{{ channel.description }}</p>
              </div>
            </div>
          </o-radio>
        </div>
      </div>
    </template>
  </o-modal>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  reactive,
  onUnmounted,
  Ref,
  ref,
  shallowRef,
  watch,
} from "vue";
import { useHead } from "@unhead/vue";
import DangLoader from "components/vote-list/loader.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
// import DateIcon from 'icons/src/date.vue'
// import { useMainStore } from '@/store/main'
import { postTypesPromises } from "components/post-types/post-types";
import { useRoute } from "vue-router";
import Post from "components/post/post.vue";
import PostInfo from "@/components/content/post/postInfo.vue";
import LineLoader from "components/functional/lineLoader.vue";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alertStore";
import { useMainStore, openConnectModal } from "@/store/main";
import { IPostDeps } from "shared/src/types/post";
import type { IPost } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import PostMenu from "@/components/content/post/menu/postMenu.vue";
import CollectMenu from "@/components/content/post/menu/collectMenu.vue";
import { OTooltip } from "@oruga-ui/oruga-next";
import {
  getFavoriteChannels,
  favAddChannel,
  favChannelDelete,
} from "shared/src/utils/requests/farcaster";
import type { TChannel } from "shared/src/types/web3-posting";
import { searchChannel } from "shared/src/utils/requests/web3-posting";
import { wait } from "shared/src";
import DeleteIcon from "icons/src/delete.vue";
import { getStaticMetaFrame } from "shared/src/utils/frame";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const deps: IPostDeps = {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
  openConnectModal,
  useMainStore: (useMainStore as unknown) as () => IMainStore,
  apiBase: API_BASE,
  PostMenu: PostMenu,
  CollectMenu: CollectMenu,
  ToolTip: OTooltip,
};

const YUP_CHANNEL_URL = "https://warpcast.com/~/channel/yup";
const FARCASTER_CHANNEL_URL =
  "chain://eip155:7777777/erc721:0x4f86113fc3e9783cf3ec9a552cbb566716a57628";
const MEME_CHANNEL_URL =
  "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61";
const CRYPTO_LEFT_CHANNEL_URL = "https://warpcast.com/~/channel/cryptoleft";

const FEED_APIS: Record<string, string> = {
  dailyhits: "https://api.yup.io/feed/dailyhits",
  threads: "https://api.yup.io/feed/threads",
  nfts: "https://api.yup.io/feed/nfts",
  mirror: "https://api.yup.io/feed/mirror",
  recent: "https://api.yup.io/feed/recent",
  farcaster: "https://api.yup.io/feed/farcaster",
  lens: "https://api.yup.io/feed/lens",
  twitter: "https://api.yup.io/feed/twitter",
  yupchannel: "https://api.yup.io/feed/channel/get?parentUrl=" + YUP_CHANNEL_URL,
  farcasterchannel:
    "https://api.yup.io/feed/channel/get?parentUrl=" + FARCASTER_CHANNEL_URL,
  memechannel: "https://api.yup.io/feed/channel/get?parentUrl=" + MEME_CHANNEL_URL,
  cyptoleftchannel:
    "https://api.yup.io/feed/channel/get?parentUrl=" + CRYPTO_LEFT_CHANNEL_URL,
};

export default defineComponent({
  name: "FeedsPage",
  components: {
    DangLoader,
    InfScroll,
    Post,
    PostInfo,
    LineLoader,
    DeleteIcon,
  },
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const feeds = [
      "dailyhits",
      "threads",
      "nfts",
      "mirror",
      "recent",
      "farcaster",
      "lens",
      "twitter",
      "yupchannel",
      "farcasterchannel",
      "memechannel",
      "cyptoleftchannel",
    ];
    const defaultFeed =
      (route.params.feedId as string) ||
      (route.query?.parent_url as string) ||
      "dailyhits";
    let userId = (route.query.userId as string) ?? "";
    const posts = ref([]) as Ref<Array<IPost>>;
    const activeFeed = ref(defaultFeed) as Ref<string>;
    const postsIndex = ref(0);
    const postInfo = ref(null) as Ref<unknown>;
    const feedLoading = ref(false);
    const catComp = shallowRef(null) as Ref<unknown>;
    const feedPersonalization = ref("");
    const store = useMainStore();
    const modalOpen = ref(false);
    const modalContent = ref("addChannel");
    const channels = ref([]) as Ref<TChannel[]>;
    const favChannels = ref([]) as Ref<TChannel[]>;
    const farcasterChannel = ref(undefined) as Ref<TChannel | undefined | string>;
    const isChannelSearching = ref(false);
    let searchString = "";

    const siteData = reactive({
      title: `YUP View Feed - ${activeFeed.value ?? ""}`,
      description: `Browse through yup feed: ${activeFeed.value ?? ""}`,
    });

    useHead({
      title: siteData.title,
      meta: [
        {
          name: "og:image",
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-feeds.png`,
        },
        {
          name: "description",
          content: siteData.description,
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: siteData.title,
        },
        {
          name: "og:description",
          content: siteData.description,
        },
        {
          name: "og:url",
          content: route.fullPath,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: route.fullPath,
        },
        {
          name: "twitter:title",
          content: siteData.title,
        },
        {
          name: "twitter:description",
          content: siteData.description,
        },
        ...getStaticMetaFrame(`${BASE_URL}/share/yup-live-ogs/og-yup-live-feeds.png`),
      ],
    });

    const getFeedPosts = async (start = 0) => {
      try {
        if (!userId) {
          if (feedPersonalization.value) {
            userId = feedPersonalization.value;
          }
        }

        // channel/get?parentUrl=${channel.parent_url}

        let url;
        if (FEED_APIS[activeFeed.value] === undefined) {
          url = `${API_BASE}/feed/channel/get?parentUrl=${
            activeFeed.value
          }&start=${start}&limit=10${userId ? "&account=" + userId : ""}`;
        } else if (FEED_APIS[activeFeed.value].includes("/channel")) {
          url = `${FEED_APIS[activeFeed.value]}&start=${start}&limit=10${
            userId ? "&account=" + userId : ""
          }`;
        } else {
          url = `${FEED_APIS[activeFeed.value]}?start=${start}&limit=10${
            userId ? "&account=" + userId : ""
          }`;
        }

        // console.log('url', url)
        // return []

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        return ((data ?? []) as Array<IPost>).filter((p) => p?._id?.postid);
      } catch {
        return [];
      }
    };

    const onHit = async (type: string) => {
      feedLoading.value = true;
      if (type === "up" && posts.value.length <= 30) {
        return;
      } else if (type === "up" && postsIndex.value >= 30) {
        postsIndex.value -= 10;
        const newPosts = await getFeedPosts(postsIndex.value - 30);
        posts.value = [...newPosts, ...posts.value.slice(-30)];
      } else if (type === "down" && posts.value.length <= 30) {
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
      loading.value = true;
      activeFeed.value = feed;
      postsIndex.value = 0;
      posts.value = await getFeedPosts(postsIndex.value);
      loading.value = false;
    };

    onMounted(async () => {
      (async () => (catComp.value = (await import("icons/src/catEmpty.vue")).default))();
      getFavoriteChannels(store).then((res: TChannel[]) => {
        favChannels.value = res;
      });
      feedPersonalization.value = localStorage.getItem("feedPersonalization") ?? "";
      getFeedPosts(postsIndex.value).then((res) => {
        posts.value = res;
        if (!postInfo.value) {
          postInfo.value = posts.value[0];
        }
        loading.value = false;
      });
    });

    onUnmounted(() => {
      // do nothing
    });
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
      postInfo,
      activeFeed,
      feedLoading,
      catComp,
      userId,
      deps,
      store,
      feedAdd,
      doFavChannelDelete,
      modalOpen,
      modalContent,
      farcasterChannel,
      channels,
      searchChannels,
      favChannels,
    };
  },
});
</script>

<style lang="scss">
nav.feedNav {
  max-width: 100%;
  mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    #1f1f1f 25%,
    #0e0e0e 75%,
    rgba(255, 255, 255, 0) 100%
  );
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

  ul li a,
  ul li button {
    padding: 1rem;
    text-transform: uppercase;
    // color: rgba(0, 35, 122, 0.5);
    font-size: 1.2rem;
    text-decoration: none;
    display: block;
  }

  ul.channels li a,
  ul li button {
    font-size: 0.95rem;
  }

  ul li a:hover,
  ul li button:hover,
  ul li a.navActive {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), inset 0 0 1px rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
    // color: rgba(0, 35, 122, 0.7);
  }
}

.channelTitle {
  text-align: center;
  font-size: 1.1rem;
  text-transform: uppercase;
  margin: 1rem 0;
}
</style>
