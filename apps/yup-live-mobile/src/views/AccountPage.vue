<template>
  <ion-page>
    <HeaderBar text="ACCOUNT" :menu="true" />

    <ion-content :fullscreen="true">
      <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto mb-8">
        <div class="bg-color flex flex-col">
          <template v-if="!apiError && !isUserBlocked">
            <ion-refresher
              slot="fixed"
              mode="ios"
              :pull-factor="0.5"
              :pull-min="100"
              :pull-max="200"
              @ionRefresh="handleRefresh($event)"
            >
              <ion-refresher-content pulling-text="Refershing..."></ion-refresher-content>
            </ion-refresher>
            <div class="profile w-full mb-4 flex flex-row">
              <DangLoader v-if="isLoadingUser" class="mt-28" :unset="true" />
              <template v-else>
                <ProfileCard :userData="userData">
                  <template #settings>
                    <ion-icon
                      v-if="isOwnAccount"
                      :icon="settingsOutline"
                      button
                      class="settingsIcon"
                      @click="openSettings"
                    />
                  </template>

                  <template v-if="!isOwnAccount" #block>
                    <button
                      class="mx-auto view-btn text-[0.85rem] mt-3 min-w-20 p-1 text-center block opacity-75 mb-2"
                      @click="doBlock"
                    >
                      Block
                    </button>
                  </template>

                  <template v-if="!isOwnAccount" #report>
                    <button
                      class="mx-auto view-btn text-[0.85rem] mt-3 min-w-20 p-1 text-center block opacity-75 mb-2"
                      @click="doReport"
                    >
                      Report
                    </button>
                  </template>
                </ProfileCard>
              </template>
            </div>
          </template>
          <div class="profile w-full mb-4 flex flex-row" v-else-if="isUserBlocked">
            <BlockedProfile
              :web3Profile="{
                _id: userData.evmAddress,
                evmAddress: userData.evmAddress,
                avatar: userData.avatar,
                handle: userData.username,
              }"
            >
              <template #unblock>
                <button
                  class="ml-12 view-btn text-[0.85rem] mt-3 min-w-20 p-1 text-center block"
                  @click="doUnblock"
                >
                  Unblock
                </button>
              </template>
            </BlockedProfile>
          </div>
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
        <router-link
          v-if="!isLoadingUser"
          class="asocLink mb-2"
          :to="`/web3-profile/${userData.evmAddress}`"
          >View Web3 profile</router-link
        >
        <ion-list style="position: sticky; top: 0; z-index: 2">
          <ion-item>
            <HorizontalChips>
              <template #chips>
                <ion-chip
                  :key="accountPages[0]"
                  :color="accountPages[0] === currentAccountPage ? 'success' : 'primary'"
                  @click="accountPageChange(accountPages[0])"
                >
                  Created Content
                </ion-chip>
                <ion-chip
                  :key="accountPages[1]"
                  :color="accountPages[1] === currentAccountPage ? 'success' : 'primary'"
                  @click="accountPageChange(accountPages[1])"
                >
                  Likes
                </ion-chip>
                <ion-chip
                  :key="accountPages[2]"
                  :color="accountPages[2] === currentAccountPage ? 'success' : 'primary'"
                  @click="accountPageChange(accountPages[2])"
                >
                  Wallet
                </ion-chip>
              </template>
            </HorizontalChips>
          </ion-item>
        </ion-list>
        <div
          v-if="!apiError"
          class="bg-color table-list profile w-full mb-4 flex flex-col"
        >
          <template
            v-if="
              [accountPages[0], accountPages[1]].includes(currentAccountPage) &&
              !postLoaded
            "
          >
            <p class="text-center m-4">Loading user feed</p>
            <DangLoader :unset="true" />
          </template>
          <InfScroll
            v-if="
              [accountPages[0], accountPages[1]].includes(currentAccountPage) &&
              postLoaded
            "
            :key="`${postLoaded}-loaded`"
            :postLoaded="postLoaded"
            :top-detection="false"
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
                    :crossPost="() => import('@/views/CrossPostModal.vue')"
                    :postTypesPromises="postTypesPromises"
                    :deps="postDeps"
                    :mobile="true"
                  />
                  <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
                </div>
              </div>
              <div v-else>
                <h2 v-if="!feedLoading" class="text-[1.3rem] mt-8 uppercase text-center">
                  User did not create content
                </h2>
                <DangLoader v-else class="mt-28" :unset="true" />
              </div>
            </template>
          </InfScroll>
          <WalletPage
            v-else-if="accountPages[2] === currentAccountPage"
            :key="`${userData.evmAddress}${walletKeyRefresh}`"
            :accountId="userId"
            :accountEVMAddr="userData.evmAddress"
            :apiBase="API_BASE"
            :stackAlertError="stackAlertError"
          />
        </div>
      </div>
    </ion-content>
    <ReportUserModal :userId="userData.evmAddress ?? ''" ref="reportModal" />
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  onIonViewDidEnter,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  modalController,
  IonChip,
} from "@ionic/vue";
import HeaderBar from "@/components/template/header-bar.vue";

import { defineComponent, onUnmounted, Ref, ref, shallowRef, ShallowRef } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import ProfileCard from "@/components/profile/profileCard.vue";
// import ProfileInfoCard from '@/components/content/profile/infoCard.vue'
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import { useMainStore } from "@/store/main";
import { useRoute } from "vue-router";
import { wait } from "shared/src/utils/time";
import { postTypesPromises } from "components/post-types/post-types";
import LineLoader from "components/functional/lineLoader.vue";
import { createActionUsage, createUserData } from "shared/src/utils/requests/accounts";
import WalletPage from "components/profile/walletPage.vue";
import { settingsOutline } from "ionicons/icons";
import SettingsModal from "@/views/SettingsModal.vue";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import Post from "components/post/post.vue";
import type { IPost } from "shared/src/types/post";
import type { IPostDeps } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alert-store";
import PostMenu from "@/components/post/menu/postMenu.vue";
import HorizontalChips from "@/components/misc/horizontal-chips.vue";
import BlockedProfile from "components/profile/blockedProfile.vue";
import { addBlock, removeBlock, isBlocked } from "shared/src/utils/requests/accounts";
import ReportUserModal from "@/components/profile/reportUser.vue";

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

export default defineComponent({
  name: "ProfilePage",
  components: {
    DangLoader,
    ProfileCard,
    Post,
    InfScroll,
    LineLoader,
    WalletPage,
    HeaderBar,
    IonPage,
    IonContent,
    IonChip,
    IonItem,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    HorizontalChips,
    BlockedProfile,
    ReportUserModal,
  },
  setup() {
    const route = useRoute();
    const store = useMainStore();
    const userId = ref("");
    // const accountRoute = route.params.accountRoute as string

    const accountPages = ["created", "feed", "wallet"];

    const search = ref("");
    const apiError = ref(false);
    const apiErrorMsg = ref("");
    const isLoadingUser = ref(true);
    const influence: Ref<null | string> = ref(null);
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([]);
    // const userFields = ref([]) as Ref<Array<NameValue>>
    const posts = ref([]) as Ref<Array<IPost>>;
    const postsIndex = ref(0);
    const postLoaded = ref(false);
    const feedLoading = ref(false);
    // const currentMenuTab = ref(
    //   Object.keys(MENU_BUTTONS).includes(accountRoute) ? (MENU_BUTTONS as { [key: string]: string })[accountRoute] : MENU_BUTTONS.feed
    // )
    const currentAccountPage = ref(accountPages[0]);
    const catComp = shallowRef(null) as Ref<unknown>;

    // const collections = useCollectionStore()
    // const collectionsEx = useCollectionStoreEx()
    const postInfo = ref(null) as Ref<unknown>;
    const followers = ref([]) as Ref<string[]>;
    const isAuth = ref(store.isLoggedIn);
    // let LoadTimeout = 0
    const walletKeyRefresh = ref(0);

    const isOwnAccount = ref(
      store?.isLoggedIn && store?.userData.account === userId.value
    );

    const isUserBlocked = ref(false);
    const reportModal = shallowRef(null) as ShallowRef<typeof ReportUserModal | null>;

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

    store.$subscribe(async () => {
      isAuth.value = store.isLoggedIn;
      isOwnAccount.value = store?.isLoggedIn && store?.userData.account === userId.value;

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

    // watch(currentMenuTab, (newValue) => {
    //   // const oldValue = currentMenuTab.value
    //   currentMenuTab.value = newValue
    //   // if (oldValue !== newValue) {
    //   //   if (newValue === MENU_BUTTONS.FEED) {
    //   //     // do nothing
    //   //   } else if (oldValue === MENU_BUTTONS.COLLECTIONS) {
    //   //   }
    //   // }
    // })

    const getActionUsage = (userId: string) => {
      createActionUsage(userId, userData.value.balanceNum).then((d) => {
        if (!d.error) {
          userData.value.nextReset = d.nextReset as string;
          userData.value.actionBars.deleteVote = d.actionBars?.deleteVote as string;
          userData.value.actionBars.follow = d.actionBars?.follow as string;
          userData.value.actionBars.vote = d.actionBars?.vote as string;
        }
      });
    };

    const getHomeFeedPosts = async (start = 0) => {
      const res = await fetch(
        `${API_BASE}/feed/account/${userId.value}?start=${start}&limit=10`
      );
      const data = await res.json();
      return data.posts.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    };

    const getCreatedFeedPosts = async (start = 0) => {
      const res = await fetch(
        `${API_BASE}/profile/posts/${userData.value.evmAddress}/?start=${start}&limit=10`
      );
      const data = await res.json();
      return data.posts;
    };

    let getFeedPosts = getHomeFeedPosts;

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

    const resetPosts = async (noLoading = false) => {
      if (noLoading) {
        postLoaded.value = false;
      } else {
        postLoaded.value = true;
      }
      getFeedPosts().then((res) => {
        posts.value = res;
        if (!postInfo.value) {
          postInfo.value = posts.value[0];
        }
        postLoaded.value = true;
      });
    };

    const userLoad = (noLoading = false) => {
      userId.value =
        (route.params.userId as string) ?? (store.userData.account as string);
      createUserData(userId.value, true).then(async (uD) => {
        if (uD.error) {
          apiErrorMsg.value = `Account { ${userId.value} } not found`;
          apiError.value = true;
        } else {
          userData.value = Object.assign(userData.value, uD.data?.userData);
          userId.value = userData.value._id as string;
          // userFields.value = uD.data?.userFields ?? []
          getActionUsage(userData.value._id as string);
        }

        getFollowers(API_BASE, userData.value.evmAddress).then((res) => {
          if (res) {
            followers.value = res.followers.map((f: { _id: string }) => f._id) ?? [];
            userData.value.followers = res.totalCount;
          }
        });

        if (currentAccountPage.value === "created") {
          getFeedPosts = getCreatedFeedPosts;
        } else if (currentAccountPage.value === "none") {
          // getFeedPosts = getCreatedFeedPosts
        }
        resetPosts(noLoading).then(async () => {
          if (posts.value.length < 1) {
            // catComp.value = (await import('icons/src/catEmpty.vue')).default
          }
        });

        isOwnAccount.value =
          store?.isLoggedIn && store?.userData.account === userId.value;

        isUserBlocked.value = await isBlocked({
          address: userData.value.evmAddress,
          store,
        });

        isLoadingUser.value = false;
      });
    };

    onIonViewDidEnter(async () => {
      userLoad();
      console.log(store?.isLoggedIn, store?.userData.account, userId.value);
    });

    // onIonViewWillLeave( () => clearTimeout(LoadTimeout))

    const accountPageChange = async (page: string) => {
      if (page === accountPages[0]) {
        postLoaded.value = false;
        postsIndex.value = 0;
        getFeedPosts = getCreatedFeedPosts;
        posts.value = await getFeedPosts(postsIndex.value);
        postLoaded.value = true;
      } else if (page === accountPages[1]) {
        postLoaded.value = false;
        postsIndex.value = 0;
        getFeedPosts = getHomeFeedPosts;
        posts.value = await getFeedPosts(postsIndex.value);
        postLoaded.value = true;
      }
      currentAccountPage.value = page;
    };

    const handleRefresh = async (event: any) => {
      if ([accountPages[0], accountPages[1]].includes(currentAccountPage.value)) {
        postLoaded.value = false;
        postsIndex.value = 0;
        posts.value = await getFeedPosts(postsIndex.value);
        postLoaded.value = true;
      } else if (currentAccountPage.value === accountPages[2]) {
        walletKeyRefresh.value++;
      }
      event.target.complete();
    };

    const openSettings = async () => {
      const modal = await modalController.create({
        component: SettingsModal,
        componentProps: {
          userData: userData.value,
        },
      });
      modal.present();
      const { role } = await modal.onWillDismiss();
      if (role === "confirm") return true;
      return false;
    };

    const doBlock = async () => {
      const res = await addBlock({
        address: userData.value.evmAddress,
        store,
      });
      if (res) {
        isUserBlocked.value = true;
        stackAlertSuccess("User blocked");
      } else {
        stackAlertError("Error blocking user");
      }
    };

    const doUnblock = async () => {
      const res = await removeBlock({
        address: userData.value.evmAddress,
        store,
      });
      if (res) {
        isUserBlocked.value = false;
        stackAlertSuccess("User unblocked");
      } else {
        stackAlertError("Error unblocking user");
      }
    };

    const doReport = () => {
      console.log("doReport", reportModal?.value);
      reportModal?.value?.toggleModal();
    };

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
      // userFields,
      posts,
      onHit,
      postLoaded,
      // menuChange,
      currentAccountPage,
      // MENU_BUTTONS,
      // collectionsPageCollections,
      // collectionsPagePromise,
      postTypesPromises,
      postInfo,
      feedLoading,
      followers,
      catComp,
      isAuth,
      accountPageChange,
      accountPages,
      walletKeyRefresh,
      handleRefresh,
      settingsOutline,
      openSettings,
      API_BASE,
      stackAlertError,
      postDeps,
      isOwnAccount,
      doBlock,
      doUnblock,
      doReport,
      isUserBlocked,
      reportModal,
    };
  },
});
</script>

<style scoped lang="scss">
.profile {
  justify-content: space-evenly;

  .settingsIcon {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 1.4rem;
  }
}
.asocLink {
  text-transform: uppercase;
  font-size: 0.85rem;
  border: 1px solid rgb(50, 50, 50);
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  opacity: 0.8;
  box-shadow: 2px -1px 0px 0px rgb(249 249 249 / 28%);
  transition: all 0.3s ease-in-out;
  justify-content: center;
  display: flex;
  width: 10rem;
  margin-left: auto;
  margin-right: auto;
  color: #ffffffe0;
}

.glow-button {
  --button-background: #383040bd;
  --button-color: #fff;
  --button-shadow: rgb(0 0 0 / 20%);
  --button-shine-left: rgba(120, 0, 245, 0.5);
  --button-shine-right: rgb(31 2 62 / 65%);
  --button-glow-start: #b000e8;
  --button-glow-end: #009ffd;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  border-radius: 11px;
  position: relative;
  line-height: 24px;
  cursor: pointer;
  color: var(--button-color);
  box-shadow: 0 8px 20px var(--button-shadow);
}
</style>
