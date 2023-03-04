<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto mb-8">
    <div class="bg-color flex flex-col">
      <template v-if="!apiError">

        <h2 v-if="userData?.evmAddress" class="text-2xl font-bold text-center mt-6 mb-2">Yup Profile for address: {{ truncteEVMAddr(userData.evmAddress) }}</h2>


        <div class="profile w-full mb-4 flex flex-row">
          <DangLoader v-if="isLoadingUser" class="mt-28 mb-20" :unset="true" />
          <template v-else>
            <ProfileCard 
            :key="`following-${isFollowing}`"
            :userData="userData"
            :isOwnAccount="isOwnAccount"
             />
            <ProfileInfoCard class="mt-8" :bio="userData.bio" :fields="userFields" />
          </template>
        </div>
        <ProfileMenu
          :isOwnAccount="isOwnAccount"
          :currentMenuTab="currentMenuTab"
          @change="menuChange"
        />
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
      <router-link class="asocLink" :to="`/web3-profile/${userData.evmAddress}`">View Associated web3 profile</router-link>
      <template v-if="currentMenuTab === MENU_BUTTONS.feed">
        <o-tabs
          v-model="feedTab"
          :multiline="true"
          :expanded="false"
          type="default"
          position="centred"
          variant="warning"
          navTypeClass="boxed"
        > 

         <template v-if="defaultAccountFeed === 'content'">
          <o-tab-item value="content">
            <template #header>
              <ContentIcon class="w-5 mr-2 inline-block"/>
              <span> Created Content </span>
            </template>
          </o-tab-item>
          <o-tab-item value="likes">
            <template #header>
              <LikesIcon class="w-5 mr-2 inline-block"/>
              <span> Likes </span>
            </template>
          </o-tab-item>
        </template>
        <template v-else>
          <o-tab-item value="likes">
            <template #header>
              <LikesIcon class="w-5 mr-2 inline-block"/>
              <span> Likes </span>
            </template>
          </o-tab-item>

          <o-tab-item value="content">
            <template #header>
              <ContentIcon class="w-5 mr-2 inline-block"/>
              <span> Created Content </span>
            </template>
          </o-tab-item>
          </template>

          <o-tab-item v-if="isOwnAccount && hasFarcaster" value="farcaster">
            <template #header>
              <ProfileFarcasterIcon class="w-5 mr-2 inline-block"/>
              <span> Farcaster </span>
            </template>
          </o-tab-item>
        </o-tabs>
        <button
          v-if="feedTab === 'farcaster'"
          class="bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg mt-4"
          @click="openCastModal = true"
        >
          Create Cast
        </button>
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
              <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
            </div>
          </template>
        </InfScroll>
      </template>
      <CollectionsPage
        v-if="currentMenuTab === MENU_BUTTONS.collections"
        :accountId="userId"
        :collections="collectionsPageCollections"
        :collectionPromise="collectionsPagePromise"
      />
      <Web3FollwersPage
        v-if="currentMenuTab === MENU_BUTTONS.followers && followers !== null"
        :key="followers.length"
        :followersList="followers"
        :handle="userData.username"
        :addr="userData.evmAddress"
      />
      <WalletPage
        v-if="currentMenuTab === MENU_BUTTONS.wallet "
        :key="userData.evmAddress"
        :accountId="userId"
        :accountEVMAddr="userData.evmAddress"
        :stackAlertError = "stackAlertError"
        :apiBase="API_BASE"

      />
      <SettingsPage
        v-if="currentMenuTab === MENU_BUTTONS.settings"
        :key="userData._id"
        :userData="userData"
      />

    </div>
  </div>
  <SendCastModal :key="`${openCastModal}k`" :openModal="openCastModal" @update:open-modal="(v) => (openCastModal = v)" @success="castSent" />
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
  shallowRef
} from "vue";
import { useHead, HeadObject } from "@vueuse/head";
import DangLoader from "components/vote-list/loader.vue";
import ProfileCard from "@/components/content/profile/profileCard.vue";
import ProfileInfoCard from "@/components/content/profile/infoCard.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import ProfileMenu from "@/components/content/profile/menu.vue";
import { useMainStore } from "@/store/main";
import { useRoute } from "vue-router";
import Post from "@/components/content/post/post.vue";
import { wait } from "shared/src/utils/time";
import {
  useCollectionStore,
  useCollectionStoreEx,
  getCollections,
} from "@/store/collections";
import { MENU_BUTTONS } from "@/components/content/profile/menuButtonEnums";
import CollectionsPage from "@/components/content/profile/collectionsPage.vue";
import { postTypesPromises } from "components/post-types/post-types";
import PostInfo from "@/components/content/post/postInfo.vue";
import LineLoader from "components/functional/lineLoader.vue";
import {
  createActionUsage,
  createUserData,
} from "shared/src/utils/requests/accounts";
import type { NameValue } from "shared/src/types/account";
import type { ICollection } from "shared/src/types/store";
import Web3FollwersPage from "@/components/content/profile/web3FollwersPage.vue"
import Alert from "components/functional/alert.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { utilsAFGetCreated } from "shared/src/utils/requests/accountFeeds";
import { truncteEVMAddr } from "shared/src/utils/misc";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import { stackAlertError  } from "@/store/alertStore";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import type { IPost } from "shared/src/types/post";
import ContentIcon from "icons/src/content.vue";
import LikesIcon from "icons/src/likes.vue"; 
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "ProfilePage",
  components: {
    DangLoader,
    ProfileCard,
    ProfileInfoCard,
    ProfileMenu,
    Post,
    InfScroll,
    CollectionsPage,
    PostInfo,
    LineLoader,
    Web3FollwersPage,
    Alert,
    BtnSpinner,
    ContentIcon,
    LikesIcon,
    ProfileFarcasterIcon,
    SendCastModal: defineAsyncComponent(
      () => import("@/components/content/post/sendCastModal.vue")
    ),
    SettingsPage: defineAsyncComponent(
      () => import("@/components/content/profile/settingsPage.vue")
    ),
    WalletPage: defineAsyncComponent(
      () => import("components/profile/walletPage.vue")
    ),
  },
  setup() {
    const route = useRoute();
    const userId = ref(route.params.userId as string);
    const accountRoute = route.params.accountRoute as string;
    const search = ref("");
    const store = useMainStore();
    const apiError = ref(false);
    const apiErrorMsg = ref("");
    const isLoadingUser = ref(true);
    const influence: Ref<null | string> = ref(null);
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([]);
    const userFields = ref([]) as Ref<Array<NameValue>>;
    const posts = ref([]) as Ref<Array<unknown>>;
    const postsIndex = ref(0);
    const postLoaded = ref(false);
    const feedLoading = ref(false);
    const currentMenuTab = ref(
      Object.keys(MENU_BUTTONS).includes(accountRoute)
        ? (MENU_BUTTONS as { [key: string]: string })[accountRoute]
        : MENU_BUTTONS.feed
    );
    const catComp = shallowRef(null) as Ref<unknown>;

    const collections = useCollectionStore();
    const collectionsEx = useCollectionStoreEx();
    const postInfo = ref(null) as Ref<unknown>;
    const followers = ref(null) as Ref<string[] | null>;
    const isOwnAccount = ref(
      store?.isLoggedIn && store?.userData.account === userId.value
    );
    const hasFarcaster = ref(store?.isLoggedIn && store?.farcaster);
    const defaultAccountFeed = localStorage.getItem("defaultAccountFeed") || "content";
    const feedTab = ref(defaultAccountFeed === 'content' ? 'content': 'likes');
    let nextFaracasterCursor = "";
    let lastFarcasterIndex = -1;
    const isAuth = ref(store.isLoggedIn);
    const externalPosts = ref(false)
    const openCastModal = ref(false)
    const isFollowing = ref(true);

    const userData = (ref({
      _id: "",
      username: "",
      followers: 0,
      following: 0,
      totalVotes: 0,
      balance: "",
      balanceNum: 0,
      weight: "",
      avatar: "",
      bio: "",
      score: "",
      cum_deposit_time: 0,
      nextReset: "",
      evmAddress: "",
      actionBars: {
        vote: "",
        deleteVote: "",
        follow: "",
      },
    }) as unknown) as Ref<Awaited<ReturnType<typeof createUserData>>["data"]["userData"]>;
    // const router = useRouter()

    const siteData = reactive({
      title: `YUP Profile`,
      description: `Check my web3 YUP social profile - yup.info.gf`,
    });

    useHead(({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: 'description',
          content: computed(() => siteData.description)
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: computed(() => siteData.title),
        },
        {
          name: "og:description",
          content: computed(() => siteData.description),
        },
        {
          name: "og:url",
          content: computed(() => route.fullPath),
        },
        {
          name: 'og:image',
          content: `$/share/yup-live-ogs/og-yup-live-web3-profile.png`
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: computed(() => route.fullPath),
        },
        {
          name: "twitter:title",
          content: computed(() => siteData.title),
        },
        {
          name: "twitter:description",
          content: computed(() => siteData.description),
        },
        {
          name: "twitter:image",
          content: `/share/yup-live-ogs/og-yup-live-web3-profile.png`
        },
      ],
    } as unknown) as Ref<HeadObject>);

    store.$subscribe(async () => {
      isOwnAccount.value = store?.isLoggedIn && store?.userData.account === userId.value;
      hasFarcaster.value = store?.isLoggedIn && store?.farcaster;
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

    const getActionUsage = (userId: string) => {
      createActionUsage(userId, userData.value.balanceNum).then((d) => {
        if (!d.error) {
          siteData.title = `Yup Profile - ${
            userData.value?.username ?? userData.value?._id ?? ""
          }`;
          userData.value.nextReset = d.nextReset as string;
          userData.value.actionBars.deleteVote = d.actionBars?.deleteVote as string;
          userData.value.actionBars.follow = d.actionBars?.follow as string;
          userData.value.actionBars.vote = d.actionBars?.vote as string;
        }
      });
    };


    const getHomeFeedPosts = async (start = 0) => {
      if (!userId.value) return [];
      const res = await fetch(
        `${API_BASE}/feed/account/${userId.value}?start=${start}&limit=10`
      );
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    };

    const getCreatedFeedPosts = async (start = 0) => {
      return (await utilsAFGetCreated(API_BASE, start, userData.value?.evmAddress)).posts;
    };

    const getFarcasterFeed = async (start = 0) => {
      const alreadyStarted = start > 0 && !nextFaracasterCursor;
      if (start < lastFarcasterIndex || alreadyStarted) {
        return [];
      }

      lastFarcasterIndex = start;
      const req = await fetch(
        `${API_BASE}/proxy/farcaster/v2/casts?fid=${store.fid}${
          nextFaracasterCursor ? "&cursor=" + nextFaracasterCursor : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.farcaster}`,
          },
        }
      );
      if (req.ok) {
        const data = await req.json();
        nextFaracasterCursor = data?.result?.cursor;
        console.log(data?.result);
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data?.result?.casts?.map((c: any) => {
            return {
              _id: {
                postid: c?.hash,
              },
              url: `farcaster://${c?.author?.fid}/${c?.hash}`,
              tag: "farcaster",
              createdAt: c?.timestamp,
              previewData: {
                title: c?.text,
                description: c?.text,
                image: c?.author?.pfp?.url,
                url: `farcaster://${c?.author?.fid}/${c?.hash}`,
              },
              web3Preview: {
                createdAt: c?.timestamp,
                content: c?.text,
                thread: c?.threadHash,
                attatchments: c?.attachments,
                postType: "single",
                creator: {
                  avatarUrl: c?.author?.pfp?.url,
                  handle: c?.author?.username,
                  fullname: c?.author?.displayName,
                },
                meta: {
                  isVerifiedAvatar: c?.author?.pfp?.isVerified,
                },
              },
            };
          }) ?? []
        );
      } else {
        return [];
      }
    };

    let getFeedPosts = defaultAccountFeed === 'content' ? getCreatedFeedPosts : getHomeFeedPosts;

    const scrollIntoView = (id: string) => {
      const el = document.getElementById(id);
      console.log(el);
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
          console.log(error);
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

    const castSent = () => {
      openCastModal.value = false;
      resetPosts();
    };

    const menuChange = (tabId: string) => {
      currentMenuTab.value = tabId;
      if (currentMenuTab.value === MENU_BUTTONS.feed) {
        getFeedPosts = getHomeFeedPosts;
        resetPosts();
      }
      // else if (currentMenuTab.value === MENU_BUTTONS.web3) {
      //   getFeedPosts = getCreatedFeedPosts
      //   resetPosts()
      // }
    };

    const collectionsPageCollections = computed(() => {
      if (userId.value !== store.userData.account) {
        return collectionsEx.collections;
      } else {
        return collections.collections;
      }
    });

    const collectionsPagePromise = computed(() => {
      if (userId.value !== store.userData.account) {
        return collectionsEx.collectionsPromise as Promise<ICollection[]>;
      } else {
        return collections.collectionsPromise as Promise<ICollection[]>;
      }
    });

    onMounted(async () => {
      createUserData(userId.value, true).then((uD) => {
        if (uD.error) {
          apiErrorMsg.value = `Account { ${userId.value} } not found`;
          apiError.value = true;
        } else {
          userData.value = Object.assign(userData.value, uD.data?.userData);
          userId.value = userData.value._id as string;
          userFields.value = uD.data?.userFields ?? [];
          console.log("asdadsa", userData.value._id);
          getActionUsage(userData.value._id as string);
        }

        getFollowers(API_BASE, userData.value.evmAddress).then((res) => {
        if(res) {
          followers.value = res.followers.map((f: { _id: string}) => f._id) ?? [];
          userData.value.followers = res.totalCount
        }
      });

        // getUserFollowers(userData.value._id as string).then((r) => {
        //   if (!r.error) {
        //     userData.value.followers = r?.data?.length;
        //     followers.value = r?.data ?? [];

        //   } else {
        //     console.error(r.msg);
        //   }
        // });
        

        if (userId.value !== store.userData.account) {
          collectionsEx.collectionsPromise = getCollections(
            collectionsEx,
            userData.value._id as string,
            true
          ) as Promise<ICollection[]>;
        } else {
          collections.collectionsPromise = getCollections(
            collections,
            userData.value._id as string
          ) as Promise<ICollection[]>;
        }
        if (currentMenuTab.value === MENU_BUTTONS.feed) {
          resetPosts();
        } 
        
        isLoadingUser.value = false;
      });
    });

    const getByActiveTab = async () => {
      if (feedTab.value === "likes") {
        externalPosts.value = false
        getFeedPosts = getHomeFeedPosts;
      } else if (feedTab.value === "content") {
        getFeedPosts = getCreatedFeedPosts;
        externalPosts.value = false
      } else if (feedTab.value === "farcaster") {
        getFeedPosts = getFarcasterFeed;
        externalPosts.value = true
      }
      resetPosts();
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
      userData,
      userId,
      influence,
      historicInfluence,
      isLoadingUser,
      userFields,
      posts,
      onHit,
      postLoaded,
      menuChange,
      currentMenuTab,
      MENU_BUTTONS,
      collectionsPageCollections,
      collectionsPagePromise,
      postTypesPromises,
      postInfo,
      feedLoading,
      followers,
      catComp,
      isOwnAccount,
      feedTab,
      hasFarcaster,
      isFollowing,
      isAuth,
      externalPosts,
      truncteEVMAddr,
      openCastModal,
      stackAlertError,
      API_BASE,
      castSent,
      defaultAccountFeed
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

.asocLink {
    text-transform: uppercase;
    font-size: 0.85rem;
    border: 1px solid #4a4a4aa3;
    padding: 0.2rem 0.5rem;
    border-radius: 0.4rem;
    margin-bottom: 1rem;
    opacity: 0.8;
    box-shadow: -1px 2px 1px var(--profile-av-holder-sh2);
    transition: all 0.3s ease-in-out;
}

.asocLink:hover {
    opacity: 1;
    background-color: aquamarine;
    background-color: #26262680;
}

</style>
