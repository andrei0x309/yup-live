<template>
  <ion-page>
    <HeaderBar text="WEB3 PROFILE" :menu="true" />

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
              <DangLoader v-if="isLoadingProfile" class="mt-28" :unset="true" />
              <template v-else>
                <Web3ProfileCard
                  :web3Profile="web3Profile"
                  :followersCount="followersCount"
                  :deps="web3Deps"
                >
                  <template #block>
                    <button
                      class="ml-14 view-btn text-[0.85rem] mt-3 min-w-20 p-1 text-center block"
                      @click="doBlock"
                    >
                      Block
                    </button>
                  </template>

                  <template #report>
                    <button
                      class="ml-14 view-btn text-[0.85rem] mt-3 min-w-20 p-1 text-center block"
                      @click="doReport"
                    >
                      Report
                    </button>
                  </template>
                </Web3ProfileCard>
              </template>
            </div>
          </template>
          <div class="profile w-full mb-4 flex flex-row" v-else-if="isUserBlocked">
            <BlockedProfile :web3Profile="web3Profile">
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
        <div
          v-if="!apiError && !isUserBlocked"
          class="bg-color table-list profile w-full mb-4 flex flex-col"
        >
          <ion-list style="position: sticky; top: 0; z-index: 2">
            <ion-item>
              <ion-select
                v-model="currentAccountPage"
                style="margin: auto"
                interface="action-sheet"
                placeholder="Select Feed"
                @ionChange="pageChange"
              >
                <ion-select-option :value="accountPages[0]"
                  >Created Content</ion-select-option
                >
                <ion-select-option :value="accountPages[1]">Wallet</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
          <template v-if="[accountPages[0]].includes(currentAccountPage) && !postLoaded">
            <p class="text-center m-4">Loading user feed</p>
            <DangLoader :unset="true" />
          </template>
          <InfScroll
            v-if="[accountPages[0]].includes(currentAccountPage) && postLoaded"
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
                    :post="(post as IPost)"
                    :postTypesPromises="postTypesPromises"
                    :deps="postDeps"
                    :crossPost="() => import('@/views/CrossPostModal.vue')"
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
            v-else-if="accountPages[1] === currentAccountPage"
            :key="`${userAddr}${walletKeyRefresh}`"
            :accountId="web3Profile?.handle || userAddr"
            :accountEVMAddr="userAddr"
            :apiBase="API_BASE"
            :stackAlertError="stackAlertError"
          />
        </div>
      </div>
    </ion-content>
    <ReportUserModal
      :userId="web3Profile?._id ?? web3Profile?.evmAddress ?? ''"
      ref="reportModal"
    />
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  onIonViewDidEnter,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import HeaderBar from "@/components/template/header-bar.vue";

import { defineComponent, onUnmounted, Ref, ref, shallowRef, ShallowRef } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import { useMainStore } from "@/store/main";
import { useRoute } from "vue-router";
import { postTypesPromises } from "components/post-types/post-types";
import LineLoader from "components/functional/lineLoader.vue";
import WalletPage from "components/profile/walletPage.vue";
import { settingsOutline } from "ionicons/icons";
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
import { IWeb3Profile } from "shared/src/types/web3Profile";
import { fetchWeb3Profile } from "shared/src/utils/requests/web3Profiles";
import Web3ProfileCard from "components/profile/web3ProfileCard.vue";
import BlockedProfile from "components/profile/blockedProfile.vue";
import { addBlock, removeBlock, isBlocked } from "shared/src/utils/requests/accounts";
import ReportUserModal from "@/components/profile/reportUser.vue";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const web3Deps = {
  openConnectModal: () => "",
  useMainStore,
  stackAlertWarning,
  stackAlertSuccess,
  apiBase: API_BASE,
};

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
  name: "Web3ProfilePage",
  components: {
    DangLoader,
    Web3ProfileCard,
    Post,
    InfScroll,
    LineLoader,
    BlockedProfile,
    WalletPage,
    HeaderBar,
    IonPage,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonList,
    IonRefresher,
    IonRefresherContent,
    ReportUserModal,
  },
  setup() {
    const route = useRoute();
    const userAddr = ref(route.params.addr as string);
    const store = useMainStore();
    const web3Profile = ref(null) as Ref<IWeb3Profile | null>;

    const accountPages = ["created", "wallet", "followers"];

    const search = ref("");
    const apiError = ref(false);
    const apiErrorMsg = ref("");
    const isLoadingProfile = ref(true);
    const influence: Ref<null | string> = ref(null);
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([]);
    const posts = ref([]) as Ref<Array<IPost>>;
    const postsIndex = ref(0);
    const postLoaded = ref(false);
    const feedLoading = ref(false);
    const currentAccountPage = ref(accountPages[0]);
    const catComp = shallowRef(null) as Ref<unknown>;

    const postInfo = ref(null) as Ref<unknown>;
    const isAuth = ref(store.isLoggedIn);
    const walletKeyRefresh = ref(0);
    const followersCount = ref(0);
    const followers = ref([]) as Ref<Array<string>>;
    const isUserBlocked = ref(false);
    const reportModal = shallowRef(null) as ShallowRef<typeof ReportUserModal | null>;

    // const router = useRouter()

    store.$subscribe(async () => {
      isAuth.value = store.isLoggedIn;
    });

    const doBlock = async () => {
      const res = await addBlock({
        address: userAddr.value,
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
        address: userAddr.value,
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

    const getCreatedFeedPosts = async (start = 0) => {
      const res = await fetch(
        `${API_BASE}/profile/posts/${userAddr.value}/?start=${start}&limit=10`
      );
      const data = await res.json();
      return data.posts;
    };

    let getFeedPosts = getCreatedFeedPosts;

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

    onIonViewDidEnter(async () => {
      web3Profile.value = await fetchWeb3Profile(API_BASE, userAddr.value);
      if (!web3Profile.value) {
        apiErrorMsg.value = `Web Profile { ${userAddr.value} } not found`;
        apiError.value = true;
      }

      isUserBlocked.value = await isBlocked({
        address: userAddr.value,
        store,
      });

      resetPosts();

      getFollowers(API_BASE, userAddr.value).then((res) => {
        if (res) {
          followers.value = res.followers.map((f: { _id: string }) => f._id);
          followersCount.value = res.totalCount;
        }
        isLoadingProfile.value = false;
      });
    });

    // onIonViewWillLeave( () => clearTimeout(LoadTimeout))

    const pageChange = async () => {
      if (currentAccountPage.value === accountPages[0]) {
        postLoaded.value = false;
        postsIndex.value = 0;
        getFeedPosts = getCreatedFeedPosts;
        posts.value = await getFeedPosts(postsIndex.value);
        postLoaded.value = true;
      }
    };

    const handleRefresh = async (event: any) => {
      if ([accountPages[0]].includes(currentAccountPage.value)) {
        postLoaded.value = false;
        postsIndex.value = 0;
        posts.value = await getFeedPosts(postsIndex.value);
        postLoaded.value = true;
      } else if (currentAccountPage.value === accountPages[1]) {
        walletKeyRefresh.value++;
      }
      event.target.complete();
    };

    onUnmounted(() => {
      // do nothing
    });

    return {
      search,
      apiError,
      apiErrorMsg,
      influence,
      historicInfluence,
      isLoadingProfile,
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
      pageChange,
      accountPages,
      walletKeyRefresh,
      handleRefresh,
      settingsOutline,
      API_BASE,
      stackAlertError,
      postDeps,
      web3Deps,
      web3Profile,
      followersCount,
      userAddr,
      doBlock,
      doUnblock,
      doReport,
      isUserBlocked,
      reportModal,
    };
  },
});
</script>

<style lang="scss">
.profile {
  justify-content: space-evenly;

  .settingsIcon {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 1.4rem;
  }
}
</style>
