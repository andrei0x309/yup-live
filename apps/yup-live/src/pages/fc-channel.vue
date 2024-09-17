<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color w-full mb-4">
      <div v-if="channelData && !loading" class="flex flex-col items-center p-4 m-4">
        <img
          v-if="channelData.image_url"
          :src="channelData.image_url"
          alt="channel image"
          class="min-w-16 min-h-16 max-w-28 max-h-28 rounded-full p-2"
        />
        <h1 class="text-[1.3rem] mt-2">
          <b>Farcaster Channel: </b>{{ channelData.name }}
        </h1>
        <p class="text-[1rem ] my-4"><b>Description: </b>{{ channelData.description }}</p>
        <p class="text-[0.8rem] mt-2">
          <b>Created at: </b>{{ channelData.channel_created_at }}
        </p>
      </div>
      <div v-else-if="channelNotFound" class="flex flex-col items-center p-4 m-4">
        <h1 class="text-[1.5rem] mt-2">Channel not found</h1>
        <p class="text-[1rem ] mt-2">Failed to find channel with id: {{ channelId }}</p>
      </div>
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
import type { IPost, T_CHANNEL } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import PostMenu from "@/components/content/post/menu/postMenu.vue";
import CollectMenu from "@/components/content/post/menu/collectMenu.vue";
import { OTooltip } from "@oruga-ui/oruga-next";
import { searchChannel } from "shared/src/utils/requests/web3-posting";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

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

export default defineComponent({
  name: "FcChannelPage",
  components: {
    DangLoader,
    InfScroll,
    Post,
    PostInfo,
    LineLoader,
    // DateIcon
  },
  setup() {
    const route = useRoute();
    const loading = ref(true);

    const channelId = (route.params.channelId as string) ?? "";
    const BASE_URL_CHANNEL = "https://api.yup.io/feed/channel/get?parentUrl=";
    const posts = ref([]) as Ref<Array<IPost>>;
    const postsIndex = ref(0);
    const postInfo = ref(null) as Ref<unknown>;
    const channelNotFound = ref(false);
    const feedLoading = ref(false);
    const catComp = shallowRef(null) as Ref<unknown>;
    const channelData = ref({
      name: "",
      description: "",
      image: "",
      id: "",
      channel_created_at: "",
      createdAt: "",
      updatedAt: "",
      parent_url: "",
      url: "",
      lead: {},
      image_url: "",
    } as T_CHANNEL) as Ref<T_CHANNEL>;

    const siteData = reactive({
      title: `YUP  channel Page - ${channelData.value?.name ?? ""}`,
      description: `Browse through yup feed: ${channelData.value?.name ?? ""}`,
    });

    useHead({
      title: siteData.title,
      meta: [
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-feeds.png`,
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
      ],
    });

    const getFeedPosts = async (start = 0) => {
      try {
        const url =
          BASE_URL_CHANNEL +
          channelData.value?.parent_url +
          "&start=" +
          start +
          "&limit=10";
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

    onMounted(async () => {
      (async () => (catComp.value = (await import("icons/src/catEmpty.vue")).default))();

      const channels = (await searchChannel(channelId)).filter(
        (c: T_CHANNEL) => c?.id === channelId
      );
      if (channels.length === 0) {
        channelNotFound.value = true;
        loading.value = false;
        return;
      }
      channelData.value = channels[0] as T_CHANNEL;
      siteData.title = `YUP  channel Page - ${channelData.value?.name ?? ""}`;
      siteData.description = `Browse through yup feed: ${channelData.value?.name ?? ""}`;

      posts.value = await getFeedPosts(postsIndex.value);

      if (!postInfo.value) {
        postInfo.value = posts.value[0];
      }
      loading.value = false;
    });

    onUnmounted(() => {
      // do nothing
    });

    return {
      postTypesPromises,
      onHit,
      loading,
      posts,
      postInfo,
      feedLoading,
      catComp,
      deps,
      channelData,
      channelId,
      channelNotFound,
    };
  },
});
</script>
