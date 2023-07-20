<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user settings Page</p>
    <DangLoader :unset="true" />
  </template>
  <div v-else class="settings-section">
    <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Social Platform Connections</h2>
          <template v-if="!isConnectedToFarcaster">
            <button
              :disabled="isConnectToFarcaster"
              class="bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg"
              @click="
                () => {
                  settingsModalContent = 'farcaster-connect';
                  settingsModal = true;
                }
              "
            >
              <ProfileFarcasterIcon class="w-6 inline mr-2" />
              <BtnSpinner v-if="isConnectToFarcaster" class="inline mr-2" />Connect to
              Farcaster
            </button>
          </template>
          <button
            v-else
            :disabled="isDisconnectFromFarcaster"
            class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
            @click="doDisconnectFromFarcaster"
          >
            <BtnSpinner
              v-if="isDisconnectFromFarcaster"
              class="inline mr-2"
            /><ProfileFarcasterIcon class="w-6 inline mr-2" />

            Disconnect from Farcaster
          </button>
          <template v-if="!isConnectedToTwitter">
            <button
              class="mt-4 bg-sky-500 border-0 py-2 px-6 focus:outline-none hover:bg-sky-700 rounded text-lg"
              @click="twitterLink"
            >
              <TwitterIcon class="w-6 inline" />
              <BtnSpinner v-if="isLoadingTwitter" class="inline mr-2" /> Connect to
              Twitter
            </button>
            <o-checkbox v-model="twFollowersAsKeywords" class="p-2" :native-value="true">
              <span class="ml-2"
                >Insert my twitter followers into personal keywords.</span
              >
            </o-checkbox>
            <button
            v-if="!isTwitterCancel && isLoadingTwitter"
            class="view-btn" @click="() => {
              isTwitterCancel = true;

            }">Cancel Twitter Linking</button>
          </template>
          <template v-else>
            <button
              class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
              @click="twitterUnlink"
            >
              <TwitterIcon class="w-6 inline" />
              <BtnSpinner v-if="isLoadingTwitter" class="inline mr-2" /> Disconnect from
              Twitter
            </button>
          </template>
          <template v-if="!isConnectedToLens">
            <button
              class="mt-4 bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
              @click="() => doConnectLens(false)"
            >
              <ProfileLensIcon class="w-6 inline mr-2" />
              <BtnSpinner v-if="isConnectToLens" class="inline mr-2" /> Connect to Lens
            </button>
            <!-- <button
              class="mt-4 bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg opacity-50"
              @click="() => doConnectLens(true)"
            >
              <ProfileLensIcon class="w-6 inline mr-2" />
              <BtnSpinner v-if="isConnectToLens" class="inline mr-2" /> Set Test Yup
              Dispatcher
            </button> -->
          </template>
          <template v-else>
            <button
              class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
              @click="doDisconnectLens"
            >
              <ProfileLensIcon class="w-6 inline mr-2" />
              <BtnSpinner v-if="isConnectToLens" class="inline mr-2" /> Disconnect from
              Lens
            </button>
            <!-- <button class="view-btn" @click="doTestLensPost">Do test lens POST</button> -->
          </template>
          <template v-if="!isConnectedToBsky">
            <button
              :disabled="isConnectToBsky"
              class="mt-4 bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-900 rounded text-lg"
              @click="
                () => {
                  settingsModalContent = 'bsky-connect';
                  settingsModal = true;
                }
              "
            >
              <BlueSkyIcon class="w-6 inline mr-2 bg-gray-200 rounded-full" />
              <BtnSpinner v-if="isConnectToBsky" class="inline mr-2" />Connect to
              BlueSky
            </button>
          </template>
          <button
            v-else
            :disabled="isDisconnectFromBlueSky"
            class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
            @click="doBskyDisconnect"
          >
            <BtnSpinner
              v-if="isDisconnectFromBlueSky"
              class="inline mr-2"
            /><BlueSkyIcon class="w-6 inline mr-2 bg-gray-200 rounded-full" />

            Disconnect from BlueSky
          </button>
        </div>
      </div>
    </section>
    <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Edit Account Details</h2>
          <h3>Edit avatar</h3>
          <DangLoader v-if="isAvatarLoading" :unset="true" />
          <VACropper v-else class="mb-4" :avatar="avatar" @cropped="doUploadAvatar" />
          <div class="relative mb-4">
            <label
              for="fullnameField"
              class="leading-7 text-sm text-gray-200 dark:text-gray-300"
              >Full Name</label
            >
            <input
              id="fullnameField"
              v-model="fullName"
              type="text"
              class="w-full dark:bg-stone-800 dark:text-gray-300 text-gray-600 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div class="relative mb-4">
            <label
              for="bioField"
              class="leading-7 text-sm text-gray-200 dark:text-gray-300"
              >Bio</label
            >
            <textarea
              id="bioField"
              v-model="bio"
              class="w-full dark:bg-stone-800 dark:text-gray-300 dark:text-gray-200 text-gray-600 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-22 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            >
            </textarea>
          </div>
          <button
            :disabled="isEditLoading"
            class="bg-stone-700 border-0 py-2 px-6 focus:outline-none hover:bg-stone-900 rounded text-lg"
            @click="onEditProfile"
          >
            <BtnSpinner v-if="isEditLoading" class="inline mr-2" />Edit
          </button>
        </div>
      </div>
    </section>
    <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Feed</h2>
          <div>
            Feeds personalization
            <o-switch
              v-model="feedPersonalization"
              :rounded="true"
              position="right"
              size="small"
              variant="warning"
              @change="changeFeedPersonalization"
              >&nbsp;&nbsp;{{ feedPersonalization ? "Disable" : "Enable" }}</o-switch
            >
          </div>

          <div class="block my-3">
            <span class="block my-2">Home Feed on yup profile</span>
            <o-radio
              v-for="feed of Object.entries(mapFeeds)"
              :key="feed[0]"
              v-model="defaultAccountFeed"
              :native-value="feed[0]"
              @change="changeDefaultFeed"
              >{{ feed[1] }}</o-radio
            >
          </div>
        </div>
      </div>
    </section>
    <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Delete Account</h2>
          <button
            :disabled="isDeleteLoading"
            class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
            @click="settingsModal = true"
          >
            <BtnSpinner v-if="isDeleteLoading" class="inline mr-2" />Delete
          </button>
        </div>
      </div>
    </section>
  </div>
  <o-modal
    v-model:active="settingsModal"
    contentClass="modal-body grid grid-cols-1 gap-4 content-center settings-modal"
    @close="
      () => {
        closeSettingsModal();
      }
    "
  >
    <template v-if="settingsModalContent === 'delete'">
      <h2 class="mt-2 p-4 text-[1.3rem]">Delete Account</h2>
      <h2 class="mt-2 p-4 text-[1.3rem]">Action is irreversible</h2>
      <p class="p-4 mb-4 text-[1.3rem]">Are you sure?</p>
      <div class="flex">
        <CustomButton
          class="mx-auto"
          :icon="refGoTo"
          iconClass="transform -rotate-180"
          text="Nay"
          @click="settingsModal = false"
        />
        <CustomButton
          class="mx-auto"
          :icon="refGoTo"
          iconClass="transform rotate-90"
          text="Yup"
          @click="deleteAccount"
        />
      </div>
    </template>
    <template v-else-if="settingsModalContent === 'lens-dispatcher'">
      <h2 class="mt-2 p-4 text-[1.3rem]">Setting Dispatcher</h2>
      <p class="p-4 mb-4 text-[1.3rem]">
        Dispatcher is not set to lens dispatcher in order to connect your profile needs to
        have the dispatcher set to lens, do you want to continue?
      </p>
      <div class="flex">
        <CustomButton
          class="mx-auto"
          :icon="refGoTo"
          iconClass="transform rotate-180"
          text="Nay"
          @click="
            () => {
              settingsModal = false;
              resolvePromiseSetDispatcher(false);
            }
          "
        />
        <CustomButton
          class="mx-auto"
          :icon="refGoTo"
          iconClass="transform rotate-90"
          text="Yup"
          @click="
            () => {
              settingsModal = false;
              resolvePromiseSetDispatcher(true);
            }
          "
        />
      </div>
    </template>
    <template v-else-if="settingsModalContent === 'farcaster-connect'">
      <o-tabs
        v-model="farcasterConnectTabs"
        :disabled="isConnectToFarcaster"
        :multiline="true"
        :expanded="false"
        type="default"
        position="centred"
        variant="warning"
        navTypeClass="boxed"
        class="mb-2"
      >
        <div class="mb-4">
          <o-tab-item value="warpcast">
            <template #header>
              <ProfileFarcasterIcon class="w-5 mr-2" /><span> Use Warpcast </span>
            </template>
          </o-tab-item>
          <o-tab-item value="wallet">
            <template #header>
              <WalletIcon class="w-5 mr-2" /><span> Use Wallet </span>
            </template>
          </o-tab-item>
        </div>
        <template v-if="farcasterConnectTabs === 'warpcast'">
          <small class="my-4"
            >By confirming in warpcast you'll enable yup backend to do casts on your
            behalf.</small
          >
          <button
            v-if="farcasterDeepLink.length === 0"
            :disabled="isConnectToFarcaster"
            class="bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg mt-4"
            @click="() => doConnectToFarcaster('warpcast')"
          >
            <ProfileFarcasterIcon class="w-6 inline mr-2" />
            <BtnSpinner v-if="isConnectToFarcaster" class="inline mr-2" />Connect to
            Farcaster
          </button>
          <template v-else>
            <p class="mb-3">Scan Qr code to approve in Warpcast App.</p>
            <div class="flex justify-center">
              <qrcode-vue :value="farcasterDeepLink" :size="300" />
            </div>
            <p class="my-4">
              Time remaining to confirm
              {{
                farcasterTimeRemaing.minutes
                  ? farcasterTimeRemaing.minutes > 1
                    ? farcasterTimeRemaing.minutes + " minutes "
                    : farcasterTimeRemaing.minutes + " minute "
                  : ""
              }}
              {{
                farcasterTimeRemaing.seconds
                  ? farcasterTimeRemaing.seconds + " seconds "
                  : ""
              }}
            </p>

            <button
              :disabled="isDeleteLoading"
              class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg mb-4"
              @click="
                () => {
                  closeSettingsModal();
                  settingsModal = false;
                }
              "
            >
              <BtnSpinner v-if="isDeleteLoading" class="inline mr-2" />Cancel operation
            </button>
          </template>
        </template>
        <template v-if="farcasterConnectTabs === 'wallet'">
          <small class="my-2"
            >You need to sign with the custody address of farcaster account.</small
          >
          <small class="my-2"
            >By sigining you'll enable yup backend to do casts on your behalf.</small
          >
          <small class="my-2"
            >If you didn't import that address yet into your wallet, you need to do that
            first.</small
          >
          <button
            :disabled="isConnectToFarcaster"
            class="bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg mt-4"
            @click="() => doConnectToFarcaster('wallet')"
          >
            <ProfileFarcasterIcon class="w-6 inline mr-2" />
            <BtnSpinner v-if="isConnectToFarcaster" class="inline mr-2" />Connect to
            Farcaster
          </button>
        </template>
      </o-tabs>
    </template>
    <template v-else-if="settingsModalContent === 'bsky-connect'">
            <div class="mx-8 flex flex-col">
            <p class="text-[1rem]">Conect to BlueSky</p>
            <small class="my-4">
            <ul>
            <li>Credentials are required to connect to bsky</li>
            <li>Identifier is your email or blueSky handle</li>
            <li>Password is either an app password(recommended) or your blue sky account password.</li>
            <li>Login session will be forwarded to YUP API</li>
            </ul></small>
      <input v-model="bskyIdent" type="text" name="ident" placeholder="Identifier" class="mb-4 rounded p-2 text-[#222]" />
      <input v-model="bskyPass" type="password" name="pass" placeholder="Password" class="mb-4 rounded p-2 text-[#222]" />
          <button
            v-if="farcasterDeepLink.length === 0"
            :disabled="isConnectToFarcaster"
            class="bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg mt-4"
            @click="() => doBskyConnect()"
          >
          <BlueSkyIcon class="w-6 inline mr-2 bg-gray-200 rounded-full" />
            <BtnSpinner v-if="isConnectToFarcaster" class="inline mr-2" />Connect to
            BlueSky
          </button>
        </div>
    </template>
  </o-modal>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType, Ref, computed } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from "components/functional/customButton.vue";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alertStore";
import { formatNumber } from "shared/src/utils/misc";
import { fetchWAuth } from "shared/src/utils/auth";
import { useMainStore } from "@/store/main";
import GoToIcon from "icons/src/goTo.vue";
import { editProfile, setConnected } from "shared/src/utils/requests/accounts";
const refGoTo = GoToIcon;
import type { IUserData } from "shared/src/types/account";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { useRouter } from "vue-router";
import TwitterIcon from "icons/src/twitter.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileLensIcon from "icons/src/profileLens.vue";
import BlueSkyIcon from "icons/src/bsky.vue";

import { linkTwitter, unlinkTwitter } from "shared/src/utils/requests/twitter";
import { uploadAvatar } from "shared/src/utils/requests/accounts";
import {
  connectToFarcaster,
  disconnectFromFarcaster,
  // makeAddSignerRequest
} from "shared/src/utils/requests/farcaster";
import { connectBlueSky, disconnectBlueSky } from "shared/src/utils/requests/bsky";
import { VACropper } from "vue-cup-avatar";
import {
 TWeb3Libs,
 web3Libs
} from "shared/src/utils/evmTxs";
import {
  getLensUserData,
  authLens,
  setDispatcher,
  setAuthLens,
  disconnectLens,
  setDispatcherWithBackend,
  removeLocalLensAuth,
} from "shared/src/utils/requests/lens";
import { getTimeRemaining } from "shared/src/utils/time";
import "vue-cup-avatar/dist/style.css";
import QrcodeVue from "qrcode.vue";
import WalletIcon from "icons/src/walletIcon.vue";
import { CancelablePromise } from "shared/src/utils/misc";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "SettingsPage",
  components: {
    DangLoader,
    CustomButton,
    BtnSpinner,
    ProfileFarcasterIcon,
    VACropper,
    ProfileLensIcon,
    TwitterIcon,
    QrcodeVue,
    WalletIcon,
    BlueSkyIcon
  },
  props: {
    userData: {
      type: Object as PropType<IUserData>,
      default: {} as IUserData,
    },
  },
  setup(props) {
    const isLoading = ref(true);
    const settingsModal = ref(false);
    const settingsModalContent = ref("delete");
    const resolvePromiseSetDispatcher = ref(() => 42) as Ref<
      (a: unknown) => typeof a & void
    >;
    const store = useMainStore();
    const bio = ref(props.userData.bio);
    const fullName = ref(props.userData.fullname);
    const avatar = ref(props.userData.avatar);
    const isEditLoading = ref(false);
    const isDeleteLoading = ref(false);
    const isConnectToFarcaster = ref(false);
    const isConnectedToFarcaster = ref(store.userData.connected?.farcaster ?? false);
    const isConnectedToTwitter = ref(store.userData.connected?.twitter ?? false);
    const isConnectedToBsky = ref(store.userData.connected?.bsky ?? false);
    const isLoadingTwitter = ref(false);
    const isTwitterCancel = ref(false);
    const isDisconnectFromFarcaster = ref(false);
    const isDisconnectFromBlueSky = ref(false);
    const router = useRouter();
    const farcasterToken = ref("");
    const farcasterDeepLink = ref("");
    const farcasterTimeout = ref(600000);
    const farcasterConnecWarpCancel = ref(false);
    const farcasterTimeRemaing = computed(() =>
      getTimeRemaining(new Date(Date.now() + farcasterTimeout.value))
    );
    let farcasterConnectPromise: CancelablePromise | null = null;
    const feedPersonalization = ref(false);
    const twFollowersAsKeywords = ref(false);
    const isAvatarLoading = ref(false);
    const isConnectedToLens = ref(store.userData.connected?.lens ?? false);
    const isConnectToLens = ref(false);
    const isConnectToBsky = ref(false); 
    const farcasterConnectTabs = ref("warpcast");

    const bskyIdent = ref("");
    const bskyPass = ref("");

    const mapFeeds = {
      likes: "Likes",
      content: "Web3 created Content",
    };
    const defaultAccountFeed = ref(localStorage.getItem("defaultAccountFeed") || "likes");

    const Web3Libs = ref(null) as unknown as Ref<TWeb3Libs>;

    const deleteAccount = async () => {
      isDeleteLoading.value = true;
      settingsModal.value = false;
      try {
        const req = await fetchWAuth(store, `${API_BASE}/accounts/delete`, {
          method: "DELETE",
        });
        if (req.ok) {
          localStorage.clear();
          store.isLoggedIn = false;
          stackAlertSuccess("Account deleted successfully");
        } else {
          stackAlertError("Error while deleting account: " + (await req.text()));
        }
      } catch {
        // ignore
      }
      isDeleteLoading.value = false;
      router.push("/");
    };

    const cleanDoConnectLens = (error: string) => {
      if (error) stackAlertError(error);
      isConnectToLens.value = false;
      removeLocalLensAuth();
      return null;
    };

    const doConnectLens = async (setTestDispatcher = false) => {
      if (isConnectToLens.value) {
        return;
      }
      isConnectToLens.value = true;
      const user = await getLensUserData(store.userData.address);
      if (!user) {
        return cleanDoConnectLens(
          "No lens user found, please set your default lens account for this address"
        );
      }
      const profileId = user.data.defaultProfile.id;
      const auth = await authLens({
        web3Libs: Web3Libs.value,
        stackAlertWarning,
      });
      console.log("auth", auth);
      if (!auth) {
        return cleanDoConnectLens("Error while authenticating lens");
      }
      const { accessToken: authToken, refreshToken } = auth;
      if (!setTestDispatcher) {
        const needToSetDispatcher = !user?.data?.defaultProfile?.dispatcher?.canUseRelay;
        if (needToSetDispatcher) {
          settingsModalContent.value = "lens-dispatcher";
          settingsModal.value = true;
          const userConfirm = new Promise((resolve) => {
            resolvePromiseSetDispatcher.value = resolve;
          });
          if (!(await userConfirm)) {
            return cleanDoConnectLens("User refused to set dispatcher");
          }
          const sigDisp = await setDispatcher({
            profileId,
            authToken,
            web3Libs: Web3Libs.value,
            test: false,
          });
          if (!sigDisp) {
            return cleanDoConnectLens("Error while signing dispatcher");
          }
          const sigDispBackend = await setDispatcherWithBackend({
            dispatcher: sigDisp.dispatcher,
            profileId,
            apiBase: API_BASE,
            store,
            deadline: sigDisp.deadline,
            signature: sigDisp.signature,
          });
          if (!sigDispBackend) {
            return cleanDoConnectLens("Error while signing dispatcher");
          }
        }
      } else {
        const sigDisp = await setDispatcher({
          profileId,
          authToken,
          web3Libs: Web3Libs.value,
          test: true,
        });
        if (!sigDisp) {
          return cleanDoConnectLens("Error while signing dispatcher");
        }
        const sigDispBackend = await setDispatcherWithBackend({
          dispatcher: sigDisp.dispatcher,
          profileId,
          apiBase: API_BASE,
          store,
          deadline: sigDisp.deadline,
          signature: sigDisp.signature,
        });
        if (!sigDispBackend) {
          return cleanDoConnectLens("Error while signing dispatcher");
        }
      }
      await setAuthLens({
        store,
        apiBase: API_BASE,
        accessToken: authToken,
        refreshToken,
      });
      isConnectedToLens.value = true;
      isConnectToLens.value = false;
      setConnected(store, "lens", true);
      stackAlertSuccess("Successfully connected to lens");
    };

    const doConnectToFarcaster = async (type: string) => {
      let connectResult = null;
      if (type === "wallet") {
        farcasterConnectPromise = new CancelablePromise(
          connectToFarcaster({
            isConnectedToFarcaster,
            isConnectToFarcaster,
            stackAlertError,
            stackAlertSuccess,
            store,
            web3Libs: Web3Libs.value,
            apiBase: API_BASE,
            withWarpCast: false,
            showQr: false,
            deepLink: farcasterDeepLink,
          })
        );
        connectResult = await farcasterConnectPromise.promise;
      } else if (type === "warpcast") {
        farcasterConnectPromise = new CancelablePromise(
          connectToFarcaster({
            isConnectedToFarcaster,
            isConnectToFarcaster,
            stackAlertError,
            stackAlertSuccess,
            store,
            web3Libs: Web3Libs.value,
            apiBase: API_BASE,
            withWarpCast: true,
            showQr: true,
            deepLink: farcasterDeepLink,
            timeout: farcasterTimeout,
            isCancel: farcasterConnecWarpCancel,
          })
        );
        connectResult = await farcasterConnectPromise.promise;
      }
      if (connectResult) {
        setConnected(store, "farcaster", true);
      }
      isConnectToFarcaster.value = false;
      settingsModal.value = false;
    };

    const closeSettingsModal = () => {
      if (settingsModalContent.value === "farcaster-connect") {
        farcasterConnectPromise?.cancel();
        isConnectToFarcaster.value = false;
        isConnectedToFarcaster.value = false;
        farcasterConnecWarpCancel.value = true;
        farcasterDeepLink.value = "";
        farcasterTimeout.value = 600000;
      }
      settingsModal.value = false;
    };

    const doDisconnectFromFarcaster = async () => {
      const disResult = await disconnectFromFarcaster({
        farcasterToken,
        isConnectedToFarcaster,
        isDisconnectFromFarcaster,
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
      });
      if (disResult) {
        setConnected(store, "farcaster", false);
      }
    };

    const changeFeedPersonalization = async () => {
      const LSFP = localStorage.getItem("feedPersonalization");
      if (LSFP === "true") {
        feedPersonalization.value = !!"";
        localStorage.setItem("feedPersonalization", "");
      } else {
        feedPersonalization.value = !!"true";
        localStorage.setItem("feedPersonalization", "true");
      }
    };

    const onEditProfile = async () => {
      isEditLoading.value = true;
      if (
        await editProfile({
          bio: bio.value,
          fullname: fullName.value,
          authToken: store.userData.authToken,
        })
      ) {
        stackAlertSuccess("Account data successfully edited.");
      } else {
        stackAlertError("Error trying to edit.");
      }
      isEditLoading.value = false;
    };

    const twitterLink = async () => {
      if (isLoadingTwitter.value) {
        return;
      }
      isLoadingTwitter.value = true;
      isTwitterCancel.value = false;
      const connect = await linkTwitter(store, twFollowersAsKeywords.value, true, isTwitterCancel);
      if (connect.error) {
        stackAlertError("Error while connecting to twitter");
      } else {
        stackAlertSuccess("Connected to twitter successfully");
        isConnectedToTwitter.value = true;
        setConnected(store, "twitter", true);
      }
      isLoadingTwitter.value = false;
    };

    const twitterUnlink = async () => {
      if (isLoadingTwitter.value) {
        return;
      }
      isLoadingTwitter.value = true;
      const req = await unlinkTwitter(store);
      if (req.error) {
        stackAlertError("Error while disconnecting from twitter");
      } else {
        stackAlertSuccess("Disconnected from twitter successfully");
        isConnectedToTwitter.value = false;
        setConnected(store, "twitter", false);
      }
      isLoadingTwitter.value = false;
    };

    onMounted(async () => {
      Web3Libs.value = web3Libs();
      feedPersonalization.value = !!(localStorage.getItem("feedPersonalization") || "");
      isLoading.value = false;
    });

    const changeDefaultFeed = () => {
      localStorage.setItem("defaultAccountFeed", defaultAccountFeed.value);
    };

    const doDisconnectLens = async () => {
      const req = await disconnectLens({
        store,
        apiBase: API_BASE,
      });
      if (!req) {
        stackAlertError("Error while disconnecting from lens");
      } else {
        stackAlertSuccess("Disconnected from lens successfully");
        setConnected(store, "lens", false);
        isConnectedToLens.value = false;
      }
    };

    const doBskyConnect = async () => {
      connectBlueSky({
          bskyAppPassword: bskyPass.value,
          bskyUser: bskyIdent.value,
          stackAlertError,
          stackAlertSuccess,
          store,
          apiBase: API_BASE,
          isConnectedToBsky,
          isConnectToBsky
      })
    }

    const doBskyDisconnect = async () => {
      disconnectBlueSky({
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
        isDisconnectFromBlueSky,
        isConnectedToBsky
      })
    }

    const doUploadAvatar = async (blob: Blob) => {
      if(isAvatarLoading.value) {
        return
      }
      await uploadAvatar({
        blob,
        store,
        avatar,
        isAvatarLoading,
        stackAlertError,
        stackAlertSuccess
      })
    }

    // const doTestLensPost = async () => {
    //   const req = await fetchWAuth(store, `${API_BASE}/lens/create-test-post`, {
    //     method: "POST",
    //   });
    //   if (!req) {
    //     stackAlertError("Error while posting to lens");
    //   } else {
    //     stackAlertSuccess("Posted to lens successfully");
    //   }
    // };

    return {
      isLoading,
      formatNumber,
      settingsModal,
      deleteAccount,
      refGoTo,
      bio,
      fullName,
      onEditProfile,
      isEditLoading,
      isDeleteLoading,
      isConnectToFarcaster,
      connectToFarcaster,
      isConnectedToFarcaster,
      disconnectFromFarcaster,
      isDisconnectFromFarcaster,
      changeFeedPersonalization,
      feedPersonalization,
      isConnectedToTwitter,
      isLoadingTwitter,
      twitterLink,
      twitterUnlink,
      twFollowersAsKeywords,
      avatar,
      isAvatarLoading,
      uploadAvatar,
      mapFeeds,
      defaultAccountFeed,
      changeDefaultFeed,
      doConnectToFarcaster,
      doDisconnectFromFarcaster,
      doConnectLens,
      isConnectToLens,
      isConnectedToLens,
      doDisconnectLens,
      // doTestLensPost,
      settingsModalContent,
      resolvePromiseSetDispatcher,
      farcasterConnectTabs,
      farcasterDeepLink,
      farcasterTimeout,
      farcasterTimeRemaing,
      closeSettingsModal,
      doUploadAvatar,
      isTwitterCancel,
      bskyIdent,
      bskyPass,
      doBskyConnect,
      isConnectedToBsky,
      isConnectToBsky,
      isDisconnectFromBlueSky,
      doBskyDisconnect
    };
  },
});
</script>

<style lang="scss">
.settings-modal {
  .o-tabs__nav {
    justify-content: center !important;
  }
}
.settings-section {
  width: 100%;
  max-width: 35rem;

  // .glassCard {
  //   background: var(--glass-menu-bg);
  //   color: var(--glassTxt);
  //   box-shadow: 0 8px 32px 0 var(--glassShadow);
  //   backdrop-filter: blur(4px);
  //   -webkit-backdrop-filter: blur(4px);
  //   border-radius: 10px;
  //   border: 1px solid rgba(255, 255, 255, 0.18);
  // }
}
</style>
