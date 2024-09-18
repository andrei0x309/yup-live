<template>
  <ion-page>
    <ion-content ref="content">
      <div id="top-el"></div>
      <HeaderMenu
        :key="`k${String(userData?._id)}${userData?.evmAddress}${store.isLoggedIn}`"
        :userData="userData"
      />
      <ion-tabs style="border-top: 2px solid #1a1a1a">
        <ion-router-outlet id="content-page" ref="outlet" />

        <ion-tab-bar slot="bottom" class="text-[0.85rem]">
          <ion-tab-button
            v-if="canDoPost"
            :class="`${canDoPostLoading ? 'blink' : ''}`"
            @click="
              () => {
                if (!canDoPostLoading) doOpenPostModal();
              }
            "
          >
            <CrossPostIcon class="inline w-6 h-6 mt-1" />
            <ion-label>Cross Post</ion-label>
          </ion-tab-button>
          <ion-tab-button
            v-else
            :class="`${canDoPostLoading ? 'blink' : ''}`"
            @click="
              () => {
                if (!canDoPostLoading) openSettings();
              }
            "
          >
            <ConnectPlatformIcon class="inline w-6 h-6 mt-1" />
            <ion-label>Link Socials</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="account"
            :href="`/tabs/account/${store?.userData?.account ?? ''}`"
          >
            <AvatarBtn
              :key="avatar"
              imgClass="h-8 w-8"
              :useMainStore="useMainStore"
              class="w-7 h-7 mt-1"
              :isSelf="true"
              :pSource="avatar"
              :isTwitter="true"
            />
            <ion-label>Account</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="feed" href="/tabs/feeds">
            <ion-icon style="font-size: 2.3rem" :icon="filterCircle"></ion-icon>
            <ion-label>Feeds</ion-label>
          </ion-tab-button>
          <ion-tab-button
            tab="notifications"
            href="/tabs/notifications"
            @click="
              () => {
                clearNot();
              }
            "
          >
            <ion-icon style="font-size: 2.3rem" :icon="notificationsCircle"></ion-icon>
            <ion-label>Notifications</ion-label>
            <ion-badge v-show="hasNewNot" color="danger">{{ notDisplay }}</ion-badge>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>

      <!-- 
            <button
              v-if="canDoPost"
              :key="`l${isLoggedIn}`"
              class="post-btn"
              @click="openPostModal = true"
            >
              <CrossPostIcon class="inline w-6 mr-2" />New Post
            </button>
            <router-link
              v-else
              class="post-btn"
              style="display: flex; line-height: 2rem"
              :to="{
                path: `/profile/${store.userData.account}/settings?show-connect=true`,
                query: { showConnect: 'true' },
              }"
            >
              <ConnectPlatformIcon class="inline w-6 mr-1 mt-1" />Link Social
            </router-link>
            -->
    </ion-content>
    <CrossPost :openModal="openPostModalState" :platforms="PLATFORMS" />
  </ion-page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  onBeforeUnmount,
  defineAsyncComponent,
  onMounted,
} from "vue";
import {
  IonPage,
  IonContent,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonBadge,
  modalController,
} from "@ionic/vue";
import { notificationsCircle, filterCircle } from "ionicons/icons";
import AvatarBtn from "components/functional/avatarBtn.vue";
import HeaderMenu from "./header-menu.vue";
import { useMainStore, openPostModal } from "@/store/main";
import { storage } from "@/utils/storage";
import { useRouter } from "vue-router";
import { getNotificationsCount } from "shared/src/utils/notifications";
import { CancelablePromise } from "shared/src/utils/misc";
import { wait } from "shared/src/utils/time";
import CrossPostIcon from "icons/src/crossPost.vue";
import ConnectPlatformIcon from "icons/src/connect.vue";
import { canPost } from "shared/src/utils/requests/crossPost";
import SettingsModal from "@/views/SettingsModal.vue";
import { createUserData } from "shared/src/utils/requests/accounts";
import { clearNotifications } from "shared/src/utils/notifications";
import { PLATFORMS } from "shared/src/utils/requests/web3-posting";
import { IMainStore } from "shared/src";
import { getConnected } from "shared/src/utils/requests/accounts";

export default defineComponent({
  name: "BottomNavigation",
  components: {
    IonPage,
    IonContent,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon,
    HeaderMenu,
    AvatarBtn,
    IonBadge,
    CrossPostIcon,
    ConnectPlatformIcon,
    CrossPost: defineAsyncComponent(() => import("@/views/CrossPostModal.vue")),
  },
  setup() {
    const store = useMainStore();
    const avatar = ref("");
    const account = ref("");
    // const router = useRouter();
    const outlet = (ref(null) as unknown) as Ref<typeof IonRouterOutlet>;
    const hasNewNot = ref(false);
    const notDisplay = ref("");
    let timerPromise: CancelablePromise | null = null;
    const canDoPost = ref(canPost(store));
    const canDoPostLoading = ref(false);
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
    const openPostModalState = ref(store.openPostModal);

    store.$subscribe(async (newValue) => {
      if (newValue?.userData?.account === userData.value._id || !newValue) return;
      await getUserData(newValue);
    });

    const checkNot = () => {
      getNotificationsCount(store.userData.address).then(async (result) => {
        hasNewNot.value = result.hasNewNot;
        notDisplay.value = result.notDisplay;
        timerPromise = new CancelablePromise(wait(10000));
        await timerPromise.promise;
        checkNot();
      });
    };

    const getUserData = async (store: IMainStore) => {
      canDoPostLoading.value = true;
      if (!store.isLoggedIn) {
        const authInfo = await storage.get("authInfo");
        if (authInfo) {
          store.userData = JSON.parse(authInfo);
          avatar.value = store.userData.avatar;
          account.value = store.userData.account;

          store.isLoggedIn = true;
        }
      }
      if (store.isLoggedIn) {
        checkNot();

        const uD = await createUserData(store.userData.account, true);
        if (!uD.error) {
          userData.value = Object.assign(userData.value, uD.data?.userData);
        }
      }
      if (!store?.userData?.address) {
        return;
      }
      await getConnected(store, store.userData.account, store.userData.address);
      canDoPost.value = canPost(store);
      canDoPostLoading.value = false;
    };

    onMounted(async () => {
      getUserData(store);
    });

    onBeforeUnmount(() => {
      if (timerPromise) {
        timerPromise.cancel();
      }
    });

    const openSettings = async () => {
      const modal = await modalController.create({
        component: SettingsModal,
        componentProps: {
          userData: userData.value,
          defaultAccordionOpen: "socials",
        },
      });

      modal.present();
      const { role } = await modal.onWillDismiss();
      if (role === "confirm") return true;
      return false;
    };

    const doOpenPostModal = () => {
      openPostModal({
        state: store,
        platforms: PLATFORMS,
      });
    };

    const clearNot = () => {
      if (hasNewNot.value) {
        hasNewNot.value = false;
        notDisplay.value = "";
        clearNotifications(store);
      }
    };

    return {
      notificationsCircle,
      filterCircle,
      avatar,
      account,
      outlet,
      useMainStore,
      notDisplay,
      hasNewNot,
      doOpenPostModal,
      openPostModalState,
      canDoPost,
      openSettings,
      clearNot,
      userData,
      PLATFORMS,
      store,
      canDoPostLoading,
    };
  },
});
</script>
