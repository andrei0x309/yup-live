<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-accordion-group v-if="!loading" :value="defaultAccordionOpen">
        <ion-accordion value="account">
          <ion-item slot="header" color="light">
            <ion-label>Account</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            <section class="body-font relative">
              <div class="container py-2 mx-auto flex">
                <div
                  class="glassCard rounded-lg p-4 flex flex-col md:ml-auto w-full mt-2 md:mt-0 relative shadow-md"
                >
                  <h2 class="text-[1.1rem] text-center mb-1 font-medium title-font">
                    Edit Account Details
                  </h2>
                  <h3 class="text-[0.95rem] text-center">Edit avatar</h3>
                  <DangLoader v-if="isAvatarLoading" :unset="true" />
                  <VACropper
                    v-else
                    class="mb-4"
                    :avatar="avatar"
                    @cropped="doUploadAvatar"
                  />
                  <div class="relative mb-4">
                    <label
                      for="fullnameField"
                      class="leading-7 text-sm text-gray-600 dark:text-gray-300"
                      >Full Name</label
                    >
                    <input
                      id="fullnameField"
                      v-model="fullName"
                      type="text"
                      class="text-white w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div class="relative mb-4">
                    <label
                      for="bioField"
                      class="leading-7 text-sm text-gray-600 dark:text-gray-300"
                      >Bio</label
                    >
                    <textarea
                      id="bioField"
                      v-model="bio"
                      class="text-white w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-30 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    >
                    </textarea>
                  </div>
                  <button
                    :disabled="isEditLoading"
                    class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg"
                    @click="onEditProfile"
                  >
                    <BtnSpinner v-if="isEditLoading" class="inline mr-2" />Edit
                  </button>
                </div>
              </div>
            </section>
          </div>
        </ion-accordion>
        <ion-accordion value="socials">
          <ion-item slot="header" color="light">
            <ion-label>Social Connect</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding flex flex-col">
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
              <button
                v-if="!isTwitterCancel && isLoadingTwitter"
                class="view-btn"
                @click="
                  () => {
                    isTwitterCancel = true;
                  }
                "
              >
                Cancel Twitter Linking
              </button>
              <!-- <o-checkbox v-model="twFollowersAsKeywords" class="p-2" :native-value="true">
        <span class="ml-2">Insert my twitter followers into personal keywords.</span>
      </o-checkbox>
       -->
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
            <template v-if="!isConnectedToThreads">
              <button
                :disabled="isConnectToBsky"
                class="mt-4 bg-gray-600 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-lg"
                @click="
                  () => {
                    settingsModalContent = 'threads-connect';
                    settingsModal = true;
                  }
                "
              >
                <ThreadsIcon class="w-6 inline mr-2" />
                <BtnSpinner v-if="isConnectToThreads" class="inline mr-2" />Connect to
                Threads
              </button>
            </template>
            <button
              v-else
              :disabled="isDisconnectFromThreads"
              class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
              @click="doDisconnectThreads"
            >
              <BtnSpinner
                v-if="isDisconnectFromThreads"
                class="inline mr-2"
              /><ThreadsIcon class="w-6 inline mr-2" />

              Disconnect from Threads
            </button>
          </div>
        </ion-accordion>
        <ion-accordion value="settings">
          <ion-item slot="header" color="light">
            <ion-label>Feed Settings</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            <ion-list>
              <ion-item>
                Enabling feed personalization will make feeds to be tailored to your
                account.
              </ion-item>
              <ion-item>
                <ion-label>Enable Feed Personalization</ion-label>
                <ion-toggle
                  :key="updateKey"
                  slot="end"
                  aria-label="Enable Feed Personalization"
                  :checked="store?.settings?.personalizedFeeds"
                  @ion-change="changeSetting('personalizedFeeds')"
                ></ion-toggle>
              </ion-item>
              <ion-item>
                Enabling actions tracking will make feeds to be tailored to your account.
              </ion-item>
              <ion-item>
                <ion-label>Enabling actions tracking</ion-label>
                <ion-toggle
                  :key="updateKey"
                  slot="end"
                  aria-label="Enabling actions tracking"
                  :checked="store?.settings?.accountTracking"
                  @ion-change="changeSetting('accountTracking')"
                ></ion-toggle>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
        <ion-accordion value="push">
          <ion-item slot="header" color="light">
            <ion-label>Push Notifications</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            <ion-list v-for="type of PUSH_NOTIFICATION_TYPES">
              <ion-item>
                <ion-label style="text-transform: capitalize">{{ type }}</ion-label>
                <ion-toggle
                  :key="type"
                  slot="end"
                  :aria-label="`Enable push for ${type}`"
                  :disabled="
                    !store.pushNotifications ||
                    isPushLoading ||
                    disabledPush.includes(type)
                  "
                  :class="`${isPushLoading ? 'opacity-50 blink' : ''}`"
                  :checked="store.pushNotifications?.includes(type)"
                  @ion-change="changePush(type)"
                ></ion-toggle>
              </ion-item>
              <ion-item v-if="disabledPush?.length > 0">
                <small
                  >Not implemented yet on backend:
                  <span
                    v-for="disabled of disabledPush"
                    v-html="disabled"
                    :key="disabled"
                  />.</small
                >
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
        <ion-accordion value="delete">
          <ion-item slot="header" color="light">
            <ion-label>Irreversible Actions</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            <section class="body-font relative">
              <div class="container py-2 mx-auto flex">
                <div
                  class="glassCard rounded-lg p-4 flex flex-col md:ml-auto w-full mt-2 md:mt-0 relative shadow-md"
                >
                  <h2 class="text-lg mb-1 font-medium title-font">Delete Account</h2>
                  <button
                    v-if="!wasDelConfirmed"
                    :disabled="isDeleteLoading"
                    class="bg-red-500 border-0 py-2 px-6 focus:outline-none rounded text-lg"
                    @click="wasDelConfirmed = true"
                  >
                    <BtnSpinner v-if="isDeleteLoading" class="inline mr-2" />Delete
                  </button>
                  <template v-else>
                    <h2 class="text-lg mb-1 font-medium title-font">Are you sure?</h2>
                    <button
                      class="bg-red-500 border-0 py-2 px-6 focus:outline-none rounded text-lg"
                      @click="deleteAccount"
                    >
                      Yes</button
                    ><button
                      class="bg-gray-500 border-0 py-2 px-6 focus:outline-none rounded text-lg mt-4"
                      @click="wasDelConfirmed = false"
                    >
                      No
                    </button>
                  </template>
                </div>
              </div>
            </section>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <ion-toast
        :is-open="toastState"
        :message="toastMsg"
        :duration="1500"
        @didDismiss="toastState = false"
      ></ion-toast>
      <ion-loading
        :key="`loading-${loading}`"
        :is-open="loading"
        cssClass="my-custom-class"
        message="Please wait..."
        :duration="4000"
        @didDismiss="loading = false"
      >
      </ion-loading>
      <ion-alert
        :is-open="alertOpen"
        :header="alertHeader"
        :message="alertMsg"
        :buttons="['OK']"
        @didDismiss="alertOpen = false"
      ></ion-alert>

      <ion-modal :is-open="settingsModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Modal</ion-title>
            <ion-buttons slot="end">
              <ion-button
                @click="
                  () => {
                    closeSettingsModal();
                  }
                "
                >Close</ion-button
              >
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <template v-if="settingsModalContent === 'lens-dispatcher'">
            <h2 class="mt-2 p-4 text-[1.3rem]">Setting Dispatcher</h2>
            <p class="p-4 mb-4 text-[1.3rem]">
              Dispatcher is not set to lens dispatcher in order to connect your profile
              needs to have the dispatcher set to lens, do you want to continue?
            </p>
            <div class="flex">
              <CustomButton
                class="mx-auto"
                :icon="refGoTo"
                iconClass="transform rotate-180"
                text="Nay"
                @click="
                  () => {
                    closeSettingsModal();
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
                    closeSettingsModal();
                    resolvePromiseSetDispatcher(true);
                  }
                "
              />
            </div>
          </template>
          <template v-else-if="settingsModalContent === 'farcaster-connect'">
            <ion-segment
              style="width: auto"
              class=""
              :value="farcasterConnectTabs"
              mode="ios"
              @ion-change="segmentChangeFarcaster"
            >
              <ion-segment-button value="warpcast">
                <ProfileFarcasterIcon class="w-5 mr-2" />
                <ion-label>Use Warpcast</ion-label>
              </ion-segment-button>
              <ion-segment-button value="wallet">
                <WalletIcon class="w-5 mr-2" />
                <ion-label>Use Wallet</ion-label>
              </ion-segment-button>
            </ion-segment>
            <template v-if="farcasterConnectTabs === 'warpcast'">
              <div class="flex justify-center text-center flex-col">
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
                    <BtnSpinner v-if="isDeleteLoading" class="inline mr-2" />Cancel
                    operation
                  </button>
                </template>
              </div>
            </template>
            <template v-if="farcasterConnectTabs === 'wallet'">
              <div class="flex justify-center text-center flex-col">
                <small class="my-2"
                  >You need to sign with the custody address of farcaster account.</small
                >
                <small class="my-2"
                  >By sigining you'll enable yup backend to do casts on your
                  behalf.</small
                >
                <small class="my-2"
                  >If you didn't import that address yet into your wallet, you need to do
                  that first.</small
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
              </div>
            </template>
          </template>
          <template v-else-if="settingsModalContent === 'bsky-connect'">
            <div class="mx-8 flex flex-col">
              <p class="text-[1rem]">Conect to BlueSky</p>
              <small class="my-4">
                <ul>
                  <li>Credentials are required to connect to bsky</li>
                  <li>Identifier is your email or blueSky handle</li>
                  <li>
                    Password is either an app password(recommended) or your blue sky
                    account password.
                  </li>
                  <li>Login session will be forwarded to YUP API</li>
                </ul></small
              >
              <input
                v-model="bskyIdent"
                type="text"
                name="ident"
                placeholder="Identifier"
                class="mb-4 rounded p-2 text-[#e0e0e0]"
              />
              <input
                v-model="bskyPass"
                type="password"
                name="pass"
                placeholder="Password"
                class="mb-4 rounded p-2 text-[#e0e0e0]"
              />
              <button
                :disabled="isConnectedToBsky"
                class="bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg mt-4"
                @click="() => doBskyConnect()"
              >
                <BlueSkyIcon class="w-6 inline mr-2 bg-gray-200 rounded-full" />
                <BtnSpinner v-if="isConnectToBsky" class="inline mr-2" />Connect to
                BlueSky
              </button>
            </div>
          </template>
          <template v-else-if="settingsModalContent === 'threads-connect'">
            <div class="mx-8 flex flex-col">
              <p class="text-[1rem]">Conect to Threads</p>
              <small class="my-4">
                <ul>
                  <li>Credentials are required to connect to Threads</li>
                  <li>
                    Threads token will be saved by YUP API not the credentials entered
                    here.
                  </li>
                </ul></small
              >
              <input
                v-model="threadsUser"
                type="text"
                name="ident"
                placeholder="Username"
                class="mb-4 rounded p-2 text-[#e0e0e0]"
              />
              <input
                v-model="threadsPass"
                type="password"
                name="pass"
                placeholder="Password"
                class="mb-4 rounded p-2 text-[#e0e0e0]"
              />
              <button
                :disabled="isConnectToThreads"
                class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg mt-4"
                @click="() => doConnectThreads()"
              >
                <ThreadsIcon class="w-6 inline mr-2" />
                <BtnSpinner v-if="isConnectToThreads" class="inline mr-2" />Connect to
                Threads
              </button>
            </div>
          </template>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, computed, onMounted } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
  IonList,
  IonToggle,
  IonModal,
  IonSegment,
  IonSegmentButton,
  // IonInput,
  IonAccordion,
  IonAccordionGroup,
  // IonRadioGroup,
  // IonRadio,
  IonButtons,
  IonAlert,
  IonToast,
  modalController,
} from "@ionic/vue";

import BtnSpinner from "icons/src/btnSpinner.vue";
import { storage } from "@/utils/storage";

// import DangLoader from "components/vote-list/loader.vue";
// import CustomButton from 'components/functional/customButton.vue'
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "shared/src/store/alertStore";
// import { formatNumber } from "shared/src/utils/misc";
import { fetchWAuth } from "shared/src/utils/auth";
import { useMainStore } from "@/store/main";
import { editProfile, setConnected } from "shared/src/utils/requests/accounts";
import GoToIcon from "icons/src/goTo.vue";
const refGoTo = GoToIcon;
import type { IUserData } from "shared/src/types/account";
import { useRouter } from "vue-router";
import { linkTwitter, unlinkTwitter } from "shared/src/utils/requests/twitter";
import TwitterIcon from "icons/src/twitter.vue";
import { VACropper } from "vue-cup-avatar";
import { uploadAvatar } from "shared/src/utils/requests/accounts";
import { getTimeRemaining } from "shared/src/utils/time";
import { web3Libs, TWeb3Libs } from "shared/src/utils/evmTxs";
import {
  // getLensUserData,
  // authLens,
  // setDispatcher,
  // setAuthLens,
  disconnectLens,
  // setDispatcherWithBackend,
  // removeLocalLensAuth,
  connectLens,
} from "shared/src/utils/requests/lens";
import { CancelablePromise } from "shared/src/utils/misc";
import {
  connectToFarcaster,
  disconnectFromFarcaster,
} from "shared/src/utils/requests/farcaster";
import WalletIcon from "icons/src/walletIcon.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileLensIcon from "icons/src/profileLens.vue";
import "vue-cup-avatar/dist/style.css";
import CustomButton from "components/functional/customButton.vue";
import DangLoader from "components/vote-list/loader.vue";
import { connectBlueSky, disconnectBlueSky } from "shared/src/utils/requests/bsky";
import { PUSH_NOTIFICATION_TYPES, setPushSettings } from "@/utils/expo-push-not-re";
import BlueSkyIcon from "icons/src/bsky.vue";
import ThreadsIcon from "icons/src/threads.vue";
import { connectToThreads, disconnectThreads } from "shared/src/utils/requests/threads";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "SettingsModal",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButton,
    IonLoading,
    IonList,
    IonToggle,
    IonModal,
    // IonInput,
    IonAccordion,
    IonAccordionGroup,
    // IonRadioGroup,
    // IonRadio,
    IonButtons,
    IonAlert,
    IonToast,
    BtnSpinner,
    TwitterIcon,
    VACropper,
    IonSegment,
    IonSegmentButton,
    WalletIcon,
    ProfileFarcasterIcon,
    ProfileLensIcon,
    BlueSkyIcon,
    CustomButton,
    DangLoader,
    ThreadsIcon,
  },
  props: {
    userData: {
      type: Object as PropType<IUserData>,
      default: {} as IUserData,
    },
    defaultAccordionOpen: {
      type: String,
      default: "account",
    },
  },
  setup(props) {
    const loading = ref(false);
    const mpModal = ref(false);
    const updateKey = ref(0);
    const alertOpen = ref(false);
    const alertMsg = ref("");
    const toastState = ref(false);
    const toastMsg = ref("");
    const alertHeader = ref("Error");
    const noAccounts = ref(true);
    const defaultAccordionOpen = ref(props.defaultAccordionOpen);
    const radioTheme = ref("system") as Ref<"system" | "light" | "dark">;
    const wasDelConfirmed = ref(false);
    const store = useMainStore();
    const bio = ref(props.userData.bio);
    const fullName = ref(props.userData.fullname);
    const isEditLoading = ref(false);
    const isDeleteLoading = ref(false);
    const router = useRouter();
    const isConnectedToTwitter = ref(store.userData.connected?.twitter ?? false);
    const twFollowersAsKeywords = ref(false);
    const isLoadingTwitter = ref(false);
    const isTwitterCancel = ref(false);

    const isLoading = ref(true);
    const settingsModal = ref(false);
    const settingsModalContent = ref("farcaster-connect");
    const resolvePromiseSetDispatcher = ref(() => 42) as Ref<
      (a: unknown) => typeof a & void
    >;
    const avatar = ref(props.userData.avatar);
    const isConnectToFarcaster = ref(false);
    const isConnectedToFarcaster = ref(store.userData.connected?.farcaster ?? false);
    const isConnectedToBsky = ref(store.userData.connected?.bsky ?? false);
    const isDisconnectFromFarcaster = ref(false);
    const isDisconnectFromBlueSky = ref(false);
    const farcasterToken = ref("");
    const farcasterDeepLink = ref("");
    const farcasterTimeout = ref(600000);
    const farcasterConnecWarpCancel = ref(false);
    const farcasterTimeRemaing = computed(() =>
      getTimeRemaining(new Date(Date.now() + farcasterTimeout.value))
    );
    let farcasterConnectPromise: CancelablePromise | null = null;
    const isAvatarLoading = ref(false);
    const isConnectedToLens = ref(store.userData.connected?.lens ?? false);
    const isConnectToLens = ref(false);
    const isConnectToBsky = ref(false);
    const farcasterConnectTabs = ref("warpcast");
    const isPushLoading = ref(false);

    const Web3Libs = (ref(null) as unknown) as Ref<TWeb3Libs>;

    const bskyIdent = ref("");
    const bskyPass = ref("");

    const disabledPush = [] as string[];

    const isConnectedToThreads = ref(store.userData.connected?.threads ?? false);
    const isConnectToThreads = ref(false);
    const isDisconnectFromThreads = ref(false);

    const threadsUser = ref("");
    const threadsPass = ref("");

    const deleteAccount = async () => {
      isDeleteLoading.value = true;
      wasDelConfirmed.value = false;
      try {
        const req = await fetchWAuth(store, `${API_BASE}/accounts/delete`, {
          method: "DELETE",
        });
        if (req.ok) {
          await storage.clear();
          const logSig = await import("shared/src/utils/login-signup");
          try {
            await logSig.walletDisconnect();
          } catch (e) {
            console.error(e);
          }

          window?.localStorage?.clear();
          router.replace("/");
          stackAlertSuccess("Account deleted successfully");
        } else {
          stackAlertError("Error while deleting account: " + (await req.text()));
        }
      } catch {
        // ignore
      }
      isDeleteLoading.value = false;
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

    const close = () => {
      return modalController?.dismiss(null, "cancel");
    };

    const twitterLink = async () => {
      if (isLoadingTwitter.value) {
        return;
      }
      isLoadingTwitter.value = true;
      isTwitterCancel.value = false;
      const connect = await linkTwitter(
        store,
        twFollowersAsKeywords.value,
        true,
        isTwitterCancel
      );
      if (connect.error) {
        stackAlertError("Error while connecting to twitter");
      } else {
        stackAlertSuccess("Connected to twitter successfully");
        isConnectedToTwitter.value = true;
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
      }
      isLoadingTwitter.value = false;
    };

    const changeSetting = async (setting: unknown) => {
      if (store?.settings && setting) {
        ((store.settings[
          setting as keyof typeof store.settings
        ] as unknown) as boolean) = !store.settings[
          setting as keyof typeof store.settings
        ];
        store.settings;
        await storage.set("settings", { ...store.settings });
      }
    };

    const doConnectToFarcaster = async (type: string) => {
      let connectResult = null;
      if (type === "wallet") {
        farcasterConnectPromise = new CancelablePromise(
          connectToFarcaster({
            web3Libs: Web3Libs.value,
            isConnectedToFarcaster,
            isConnectToFarcaster,
            stackAlertError,
            stackAlertSuccess,
            store,
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
            web3Libs: Web3Libs.value,
            isConnectedToFarcaster,
            isConnectToFarcaster,
            stackAlertError,
            stackAlertSuccess,
            store,
            apiBase: API_BASE,
            withWarpCast: true,
            showQr: false,
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

    const doConnectLens = async (setTestDispatcher: boolean) => {
      const result = await connectLens({
        setTestDispatcher,
        stackAlertWarning,
        stackAlertSuccess,
        stackAlertError,
        store,
        Web3Libs,
        isConnectToLens,
        settingsModalContent,
        settingsModal,
        resolvePromiseSetDispatcher,
        isConnectedToLens,
      });
      if (result) {
        setConnected(store, "lens", true);
      }
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

    const doUploadAvatar = async (blob: Blob) => {
      if (isAvatarLoading.value) {
        return;
      }
      await uploadAvatar({
        blob,
        store,
        avatar,
        isAvatarLoading,
        stackAlertError,
        stackAlertSuccess,
      });
    };

    const segmentChangeFarcaster = async (value: any) => {
      farcasterConnectTabs.value = value.detail.value;
    };

    const doBskyConnect = async () => {
      const bsky = await connectBlueSky({
        bskyAppPassword: bskyPass.value,
        bskyUser: bskyIdent.value,
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
        isConnectedToBsky,
        isConnectToBsky,
        settingsModal,
      });
      if (bsky) {
        setConnected(store, "bsky", true);
      }
    };

    const doBskyDisconnect = async () => {
      const bsky = await disconnectBlueSky({
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
        isDisconnectFromBlueSky,
        isConnectedToBsky,
      });
      if (bsky) {
        setConnected(store, "bsky", false);
      }
    };

    const doConnectThreads = async () => {
      const threads = await connectToThreads({
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
        isConnectedToThreads,
        isConnectToThreads,
        threadsPassword: threadsPass.value,
        threadsUser: threadsUser.value,
        settingsModal,
      });
      if (threads) {
        setConnected(store, "threads", true);
      }
    };

    const doDisconnectThreads = async () => {
      const threads = await disconnectThreads({
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
        isDisconnectFromThreads,
        isConnectedToThreads,
      });
      if (threads) {
        setConnected(store, "threads", false);
      }
    };

    const openAlert = (msg: string) => {
      alertMsg.value = msg;
      alertOpen.value = true;
    };

    const changePush = async (type: string) => {
      if (isPushLoading.value) {
        return;
      }
      isPushLoading.value = true;
      const pushNotifications = store.pushNotifications || [];
      if (pushNotifications.includes(type)) {
        pushNotifications.splice(pushNotifications.indexOf(type), 1);
      } else {
        pushNotifications.push(type);
      }

      const result = await setPushSettings({
        notificationTypes: [type],
        store,
      });
      if (!result) {
        stackAlertError("Error while changing push settings");
        isPushLoading.value = false;
        return;
      }

      store.pushNotifications = pushNotifications;
      stackAlertSuccess("Push settings changed successfully");
      isPushLoading.value = false;
    };

    onMounted(async () => {
      Web3Libs.value = web3Libs();
      if (props.defaultAccordionOpen === "socials") {
        openAlert("Connect your socials in order to create posts on those platforms.");
      }
      isLoading.value = false;
    });

    return {
      loading,
      mpModal,
      updateKey,
      alertOpen,
      alertMsg,
      toastState,
      toastMsg,
      noAccounts,
      alertHeader,
      defaultAccordionOpen,
      radioTheme,
      deleteAccount,
      onEditProfile,
      bio,
      fullName,
      isEditLoading,
      isDeleteLoading,
      wasDelConfirmed,
      changeSetting,
      close,
      twitterUnlink,
      twitterLink,
      isConnectedToTwitter,
      isLoadingTwitter,
      store,
      doUploadAvatar,
      avatar,
      isAvatarLoading,
      isDisconnectFromFarcaster,
      doDisconnectFromFarcaster,
      isConnectedToFarcaster,
      isConnectToFarcaster,
      settingsModalContent,
      refGoTo,
      settingsModal,
      isConnectedToLens,
      doConnectLens,
      isConnectToLens,
      doDisconnectLens,
      resolvePromiseSetDispatcher,
      farcasterConnectTabs,
      segmentChangeFarcaster,
      doConnectToFarcaster,
      farcasterDeepLink,
      farcasterTimeRemaing,
      closeSettingsModal,
      isTwitterCancel,
      isConnectedToBsky,
      bskyIdent,
      bskyPass,
      doBskyConnect,
      isConnectToBsky,
      isDisconnectFromBlueSky,
      doBskyDisconnect,
      PUSH_NOTIFICATION_TYPES,
      changePush,
      isPushLoading,
      disabledPush,
      isConnectedToThreads,
      isConnectToThreads,
      isDisconnectFromThreads,
      doConnectThreads,
      doDisconnectThreads,
      threadsUser,
      threadsPass,
    };
  },
});
</script>
