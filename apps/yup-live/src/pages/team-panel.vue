<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color w-full mb-4">
      <nav class="feedNav">
        <ul>
          <li>
            <router-link
              :class="activePage === pages[0] ? 'navActive' : ''"
              :to="`/team-panel?page=${pages[0]}`"
              >CossPosts Events</router-link
            >
          </li>
          <li>
            <router-link
              :class="activePage === pages[1] ? 'navActive' : ''"
              :to="`/team-panel?page=${pages[1]}`"
              >Twitter Limits</router-link
            >
          </li>
          <li>
            <router-link
              :class="activePage === pages[2] ? 'navActive' : ''"
              :to="`/team-panel?page=${pages[2]}`"
              >Active Users</router-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <template v-if="activePage === pages[0]">
      <CrossPostEvents />
    </template>
    <template v-else-if="activePage === pages[1]">
      <TwitterLimits />
    </template>
    <template v-else-if="activePage === pages[2]">
      <ActiveUsers />
    </template>
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
  computed,
  watch,
} from "vue";
import { useHead } from "@unhead/vue";
// import DangLoader from "components/vote-list/loader.vue";
// import InfScroll from "components/functional/inf-scroll/infScroll.vue";
// import DateIcon from 'icons/src/date.vue'
// import { useMainStore } from '@/store/main'
import { postTypesPromises } from "components/post-types/post-types";
import { useRoute } from "vue-router";
// import Post from "components/post/post.vue";
// import PostInfo from "@/components/content/post/postInfo.vue";
// import LineLoader from "components/functional/lineLoader.vue";
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
import type { TChannel } from "shared/src/types/web3-posting";
// import DeleteIcon from "icons/src/delete.vue";
import CrossPostEvents from "./team/cross-post-events.vue";
import TwitterLimits from "./team/twitter-limits.vue";
import ActiveUsers from "./team/active-users.vue";
import { getStaticMetaFrame } from "shared/src/utils/frame";

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
  name: "TeamPanel",
  components: {
    CrossPostEvents,
    TwitterLimits,
    ActiveUsers,
  },
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const pages = ["cross-post-events", "twitter-limits", "active-users"];
    const defaultPage = (route.query.page as string) || pages[0];
    const posts = ref([]) as Ref<Array<IPost>>;
    const activePage = ref(defaultPage) as Ref<string>;
    const postInfo = ref(null) as Ref<unknown>;
    const feedLoading = ref(false);
    const catComp = shallowRef(null) as Ref<unknown>;
    const store = useMainStore();
    const modalOpen = ref(false);
    const modalContent = ref("addChannel");
    const channels = ref([]) as Ref<TChannel[]>;
    const favChannels = ref([]) as Ref<TChannel[]>;
    const farcasterChannel = ref(undefined) as Ref<TChannel | undefined | string>;
    const queryParams = computed(() => {
      return route.query;
    });

    watch(queryParams, (newParams) => {
      if (newParams.page) {
        const foundPage = pages.find((p) => p === newParams.page);
        if (foundPage && foundPage !== activePage.value) {
          activePage.value = foundPage;
        }
      }
    });

    const siteData = reactive({
      title: `YUP Team Panel`,
      description: `Team Panel - actions and stats`,
    });

    useHead({
      title: siteData.title,
      meta: [
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-default.png`,
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
        ...getStaticMetaFrame(`/share/yup-live-ogs/og-yup-live-default.png`),
      ],
    });

    onMounted(async () => {
      // do nothing
    });

    onUnmounted(() => {
      // do nothing
    });

    return {
      postTypesPromises,
      pages,
      loading,
      posts,
      postInfo,
      activePage,
      feedLoading,
      catComp,
      deps,
      store,
      modalOpen,
      modalContent,
      farcasterChannel,
      channels,
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
