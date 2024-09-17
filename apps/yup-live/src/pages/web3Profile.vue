<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto mb-8">
    <div class="bg-color flex flex-col">
      <h2 v-if="web3Profile?._id" class="text-2xl font-bold text-center mt-4 mb-4">
        Web3Profile for address: {{ truncteEVMAddr(web3Profile._id) }}
      </h2>

      <template v-if="!apiError">
        <div class="profile w-full mb-4 flex flex-row">
          <DangLoader v-if="isLoadingUser" class="mt-28" :unset="true" />
          <template v-else>
            <Web3ProfileCard
              :web3Profile="web3Profile"
              :followersCount="followersCount"
              :deps="web3Deps"
            />
            <RecommandedCard :data="recommandedProfiles" :isAuth="isAuth" />
          </template>
        </div>
      </template>
      <div v-else class="min-h-[40rem]">
        <div
          style="max-width: 40rem; margin: auto"
          class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300"
        >
          <div
            class="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full"
          >
            <span class="text-red-500">
              <svg fill="currentColor" viewBox="0 0 20 20" class="h-6 w-6">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
          <div class="alert-content ml-4">
            <div class="alert-title font-semibold text-lg text-red-800">Error</div>
            <div class="alert-description text-sm text-red-600">
              {{ apiErrorMsg }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!apiError" class="bg-color table-list profile w-full mb-4 flex flex-col">
      <o-tabs
        v-model="feedTab"
        :multiline="true"
        :expanded="false"
        type="default"
        position="centred"
        variant="warning"
        navTypeClass="boxed"
        class="mt-4"
      >
        <o-tab-item value="content">
          <template #header>
            <span><ContentIcon class="w-5 mr-2 inline-block" /> Created Content </span>
          </template>
        </o-tab-item>
        <!-- <o-tab-item value="wallet">
            <template #header>
              <WalletIcon class="w-5 mr-2" /><span> Wallet </span>
            </template>
          </o-tab-item> -->
        <o-tab-item value="followers">
          <template #header>
            <FollowersOutline class="w-5 mr-2" /><span> Followers </span>
          </template>
        </o-tab-item>
      </o-tabs>
      <template v-if="currentMenuTab === MENU_BUTTONS.feed">
        <InfScroll :key="`${postLoaded}-loaded`" :postLoaded="postLoaded" @hit="onHit">
          <template #content>
            <div v-if="posts.length > 0" class="flex flex-row mx-auto">
              <div class="flex flex-col">
                <Post
                  v-for="post of posts"
                  :id="(post as Record<string, any>)._id.postid"
                  :key="(post  as Record<string, any>)._id.postid"
                  :noYUPPost="externalPosts"
                  :post="(post as IPost)"
                  :postTypesPromises="postTypesPromises"
                  :isHidenInfo="((post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid) || feedTab === 'farcaster'"
                  :deps="postDeps"
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
            <template v-else-if="!postLoaded">
              <p class="mb-2">Loading user feed</p>
              <DangLoader :unset="true" />
            </template>
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
      </template>
      <!-- <WalletPage
        v-if="currentMenuTab === MENU_BUTTONS.wallet"
        :key="userAddr"
        :accountId="web3Profile?.handle ?? userAddr"
        :accountEVMAddr="userAddr"
        :stackAlertError = "stackAlertError"
        :apiBase="API_BASE"

      /> -->

      <Web3FollwersPage
        v-if="currentMenuTab === MENU_BUTTONS.followers"
        :followersList="followers"
        :addr="userAddr"
        :handle="web3Profile?.handle ?? userAddr"
        :stackAlertError="stackAlertError"
        :apiBase="API_BASE"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  reactive,
  computed,
  onUnmounted,
  Ref,
  ref,
  watch,
  defineAsyncComponent,
  shallowRef,
} from "vue";
import { useHead } from '@unhead/vue'
;
import DangLoader from "components/vote-list/loader.vue";
import { useMainStore, openConnectModal } from "@/store/main";
import { useRoute } from "vue-router";

import { wait } from "shared/src/utils/time";
import { MENU_BUTTONS } from "@/components/content/profile/menuButtonEnums";
import { postTypesPromises } from "components/post-types/post-types";
import Post from "components/post/post.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";

import Alert from "components/functional/alert.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
// import WalletIcon from "icons/src/walletIcon.vue";
import { getWeb3CreatedFeed } from "shared/src/utils/requests/accountFeeds";
import {
  fetchWeb3Profile,
  fetchRecommendedWeb3Profiles,
} from "shared/src/utils/requests/web3Profiles";
import type {
  IWeb3Profile,
  IWeb3ProfileRecommendation,
} from "shared/src/types/web3Profile";
import { truncteEVMAddr } from "shared/src/utils/misc";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import RecommandedCard from "@/components/content/profile/recommendedCard.vue";
import ContentIcon from "icons/src/content.vue";
import FollowersOutline from "icons/src/followersOutline.vue";
import PostInfo from "@/components/content/post/postInfo.vue";
import LineLoader from "components/functional/lineLoader.vue";
import Web3ProfileCard from "components/profile/web3ProfileCard.vue";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alertStore";
import type { IPost } from "shared/src/types/post";
import PostMenu from "@/components/content/post/menu/postMenu.vue";
import CollectMenu from "@/components/content/post/menu/collectMenu.vue";
import type { IPostDeps } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import { OTooltip } from "@oruga-ui/oruga-next";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const web3Deps = {
  openConnectModal,
  useMainStore,
  stackAlertWarning,
  stackAlertSuccess,
  apiBase: API_BASE,
};

const postDeps: IPostDeps = {
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
  name: "Web3ProfilePage",
  components: {
    DangLoader,
    // ProfileCard,
    // ProfileInfoCard,
    // ProfileMenu,
    Post,
    InfScroll,
    PostInfo,
    LineLoader,
    Alert,
    BtnSpinner,
    // WalletIcon,
    RecommandedCard,
    ContentIcon,
    FollowersOutline,
    Web3ProfileCard,
    Web3FollwersPage: defineAsyncComponent(
      () => import("@/components/content/profile/web3FollwersPage.vue")
    ),
    // WalletPage: defineAsyncComponent(() => import("components/profile/walletPage.vue")),
  },
  setup() {
    const route = useRoute();
    const userAddr = ref(route.params.addr as string);
    const accountRoute = route.params.accountRoute as string;
    const web3Profile = ref(null) as Ref<IWeb3Profile | null>;
    const search = ref("");
    const store = useMainStore();
    const apiError = ref(false);
    const apiErrorMsg = ref("");
    const isLoadingUser = ref(true);
    const influence: Ref<null | string> = ref(null);
    const posts = ref([]) as Ref<Array<IPost>>;
    const postsIndex = ref(0);
    const postLoaded = ref(false);
    const feedLoading = ref(false);
    const currentMenuTab = ref(
      Object.keys(MENU_BUTTONS).includes(accountRoute)
        ? (MENU_BUTTONS as { [key: string]: string })[accountRoute]
        : MENU_BUTTONS.feed
    );
    const catComp = shallowRef(null) as Ref<unknown>;
    const postInfo = ref(null) as Ref<unknown>;
    const isOwnAccount = ref(
      store?.isLoggedIn && store?.userData.address === userAddr.value
    );
    const feedTab = ref("content");
    const castContent = ref("");
    const castContentCharCount = computed(() => castContent.value.length);
    const isAuth = ref(store.isLoggedIn);
    const externalPosts = ref(false);
    const isFollowing = ref(true);
    const recommandedProfiles = ref([]) as Ref<Array<IWeb3ProfileRecommendation>>;
    const followersCount = ref(0);
    const followers = ref([]) as Ref<Array<string>>;

    // const router = useRouter()

    const siteData = reactive({
      title: `Web3 Profile`,
      description: `Check this web3 social profile - on yup live`,
    });

    useHead({
      title: computed(() => siteData.title).value,
      meta: [
        {
          name: "og:image",
          content: `$/share/yup-live-ogs/og-yup-live-web3-profile.png`,
        },
        {
          name: "description",
          content: computed(() => siteData.description).value,
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: computed(() => siteData.title).value,
        },
        {
          name: "og:description",
          content: computed(() => siteData.description).value,
        },
        {
          name: "og:url",
          content: computed(() => route.fullPath).value,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: computed(() => route.fullPath).value,
        },
        {
          name: "twitter:title",
          content: computed(() => siteData.title).value,
        },
        {
          name: "twitter:description",
          content: computed(() => siteData.description).value,
        },
        {
          name: "twitter:image",
          content: `/share/yup-live-ogs/og-yup-live-web3-profile.png`,
        },
      ],
    });

    store.$subscribe(async () => {
      isOwnAccount.value =
        store?.isLoggedIn && store?.userData.address === userAddr.value;
      isAuth.value = store.isLoggedIn;

      if (store.deletePost) {
        const el = document?.getElementById(store.deletePost);
        if (el) {
          el.style.opacity = "0";
        }
        await wait(600);
        posts.value = posts.value.filter(
          (p) => (p as { _id: { postid: string } })._id.postid !== store.deletePost
        );
      }
    });

    watch(currentMenuTab, (newValue) => {
      // const oldValue = currentMenuTab.value
      currentMenuTab.value = newValue;
      // if (oldValue !== newValue) {
      //   if (newValue === MENU_BUTTONS.FEED) {
      //     // do nothing
      //   } else if (oldValue === MENU_BUTTONS.COLLECTIONS) {
      //   }
      // }
    });

    const getCreatedFeedPosts = async (start = 0) => {
      return (await getWeb3CreatedFeed(API_BASE, start, userAddr.value)).posts;
    };

    let getFeedPosts = getCreatedFeedPosts;

    const scrollIntoView = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
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
        try {
          scrollIntoView(
            (posts.value[20] as Record<string, { postid: string }>)?._id?.postid
          );
        } catch (error) {
          console.error(error);
        }
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

    const resetPosts = async () => {
      posts.value = [];
      postLoaded.value = false;
      getFeedPosts().then((res) => {
        posts.value = res;
        if (!postInfo.value) {
          postInfo.value = posts.value[0];
        }
        if (posts.value.length < 1) {
          import("icons/src/catEmpty.vue").then(async (comp) => {
            catComp.value = (await comp).default;
          });
        }
        postLoaded.value = true;
      });
    };

    const menuChange = (tabId: string) => {
      currentMenuTab.value = tabId;
      if (currentMenuTab.value === MENU_BUTTONS.feed) {
        getFeedPosts = getCreatedFeedPosts;
        resetPosts();
      }
      // else if (currentMenuTab.value === MENU_BUTTONS.web3) {
      //   getFeedPosts = getCreatedFeedPosts
      //   resetPosts()
      // }
    };

    onMounted(async () => {
      // createUserData(userId.value, true).then((uD) => {
      //   if (uD.error) {
      //     apiErrorMsg.value = `Account { ${userId.value} } not found`;
      //     apiError.value = true;
      //   } else {
      //     userData.value = Object.assign(userData.value, uD.data?.userData);
      //     userId.value = userData.value._id as string;
      //     userFields.value = uD.data?.userFields ?? [];
      //     console.log("asdadsa", userData.value._id);
      //     getActionUsage(userData.value._id as string);
      //   }

      //   if (currentMenuTab.value === MENU_BUTTONS.feed) {
      //     getFeedPosts = getHomeFeedPosts;
      //     resetPosts();
      //   }

      //   isLoadingUser.value = false;
      // });

      web3Profile.value = await fetchWeb3Profile(API_BASE, userAddr.value);
      if (!web3Profile.value) {
        apiErrorMsg.value = `Account { ${userAddr.value} } not found`;
        apiError.value = true;
      }

      getFollowers(API_BASE, userAddr.value).then((res) => {
        if (res) {
          followers.value = res.followers.map((f: { _id: string }) => f._id);
          followersCount.value = res.totalCount;
        }
      });

      fetchRecommendedWeb3Profiles(API_BASE, store).then((res) => {
        recommandedProfiles.value = res as IWeb3ProfileRecommendation[];
      });
      resetPosts();
      isLoadingUser.value = false;
    });

    const getByActiveTab = async () => {
      if (feedTab.value === "content") {
        currentMenuTab.value = MENU_BUTTONS.feed;
        externalPosts.value = false;
        getFeedPosts = getCreatedFeedPosts;
      } else if (feedTab.value === "wallet") {
        currentMenuTab.value = MENU_BUTTONS.wallet;
      } else if (feedTab.value === "followers") {
        currentMenuTab.value = MENU_BUTTONS.followers;
      }
    };

    watch(
      () => feedTab.value,
      async () => {
        await getByActiveTab();
      }
    );

    onUnmounted(() => {
      // do nothing
    });

    return {
      search,
      apiError,
      apiErrorMsg,
      web3Profile,
      userAddr,
      influence,
      isLoadingUser,
      posts,
      onHit,
      postLoaded,
      menuChange,
      currentMenuTab,
      MENU_BUTTONS,
      postTypesPromises,
      postInfo,
      feedLoading,
      catComp,
      isOwnAccount,
      feedTab,
      castContent,
      castContentCharCount,
      isFollowing,
      isAuth,
      externalPosts,
      truncteEVMAddr,
      recommandedProfiles,
      followersCount,
      followers,
      API_BASE,
      stackAlertError,
      web3Deps,
      postDeps,
    };
  },
});
</script>

<style lang="scss">
.profile {
  justify-content: center;

  .o-tabs__nav {
    overflow-y: hidden;
  }

  .o-tabs__nav-item-default {
    outline: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
    background-color: transparent;
    align-items: center;
    line-height: 1.5;
    font-size: 1.15rem;
    border-bottom-color: var(--color-text-faded2);
    border-bottom-style: solid;
    border-bottom-width: 0.15rem;
    display: flex;
    justify-content: center;
    margin-bottom: -1px;
    padding: 1rem 1rem;
    vertical-align: top;
    cursor: pointer;
    text-decoration: none;
  }

  .o-tabs__nav-item-default--active {
    border-bottom-color: var(--glassTxt);
    color: var(--glassTxt);
    border-bottom-width: 0.28rem;
  }

  .o-tabs__content {
    display: flex;
    align-items: center;
  }

  .o-tab-item__content {
    display: contents;
  }
}
</style>
