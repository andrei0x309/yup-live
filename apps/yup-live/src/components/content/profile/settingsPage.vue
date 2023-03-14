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
          <small class="mt-2">You need to sign with the custody address of farcaster address.</small>
          <button
            :disabled="isConnectToFarcaster"
            class="bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg"
            @click="doConnectToFarcaster"
          > 
            <ProfileFarcasterIcon class="w-6 inline mr-2" /> 
            <BtnSpinner v-if="isConnectToFarcaster" class="inline mr-2" />Connect to
            Farcaster
          </button>
          <o-checkbox v-model="sendFarcasterConnectMsg" class="p-2" :native-value="true">
        <span class="ml-2">Send cast to my profile to confirm connection.</span>
      </o-checkbox>
        </template>
          <button
            v-else
            :disabled="isDisconnectFromFarcaster"
            class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
            @click="doDisconnectFromFarcaster"
            >            <BtnSpinner v-if="isDisconnectFromFarcaster" class="inline mr-2" /><ProfileFarcasterIcon class="w-6 inline mr-2" /> 

            Disconnect from Farcaster</button>
      <template  v-if="!isConnectedToTwitter">
        <button class="mt-4 bg-sky-500 border-0 py-2 px-6 focus:outline-none hover:bg-sky-700 rounded text-lg" @click="twitterLink"><TwitterIcon class="w-6 inline" /> <BtnSpinner v-if="isLoadingTwitter" class="inline mr-2" /> Connect to Twitter</button>
        <o-checkbox v-model="twFollowersAsKeywords" class="p-2" :native-value="true">
        <span class="ml-2">Insert my twitter followers into personal keywords.</span>
      </o-checkbox>
    </template>
        <button
        v-else
        class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
         @click="twitterUnlink"><TwitterIcon class="w-6 inline" /> <BtnSpinner v-if="isLoadingTwitter" class="inline mr-2" /> Disconnect from Twitter</button>

        <template  v-if="!isConnectedToLens">
          <span class="ml-2">Connect to lens is disabled due to being in development.</span>
         <button
         disabled
        class="mt-4 bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
        @click="doConnectLens"
        >
        <ProfileLensIcon class="w-6 inline mr-2" /> <BtnSpinner v-if="isConnectToLens" class="inline mr-2" /> Connect to Lens
        </button>
        </template>
        <template v-else>
        <button
        class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
        @click="doDisconnectLens"
        > <ProfileLensIcon class="w-6 inline mr-2" /> <BtnSpinner v-if="isConnectToLens" class="inline mr-2" /> Disconnect from Lens</button>
        <button class="view-btn" @click="doTestLensPost">Do test lens POST</button>
      </template>
      

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
          <DangLoader v-if="isAvatarLoading" />
          <VACropper v-else class="mb-4" :avatar="avatar" @cropped="uploadAvatar" />
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
              class="w-full dark:bg-stone-800 dark:text-gray-300 text-gray-600 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
      <o-switch v-model="feedPersonalization" :rounded="true" position="right" size="small" variant="warning" @change="changeFeedPersonalization"
        >&nbsp;&nbsp;{{ feedPersonalization ? 'Disable' : 'Enable' }}</o-switch
      ></div>
       
        <div class="block my-3">
                <span class="block my-2">Home Feed on yup profile</span>
                <o-radio v-for="feed of Object.entries(mapFeeds)" :key="feed[0]" v-model="defaultAccountFeed" :native-value="feed[0]" @change="changeDefaultFeed">{{ feed[1] }}</o-radio>
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
            @click="confirmDeleteModal = true"
          >
            <BtnSpinner v-if="isDeleteLoading" class="inline mr-2" />Delete
          </button>
        </div>
      </div>
    </section>
  </div>
  <o-modal
    v-model:active="confirmDeleteModal"
    contentClass="modal-body grid grid-cols-1 gap-4 content-center"
    @close="confirmDeleteModal = true"
  >
    <h2 class="mt-2 p-4 text-[1.3rem]">Delete Account</h2>
    <h2 class="mt-2 p-4 text-[1.3rem]">Action is irreversible</h2>
    <p class="p-4 mb-4 text-[1.3rem]">Are you sure?</p>
    <div class="flex">
      <CustomButton
        class="mx-auto"
        :icon="refGoTo"
        iconClass="transform -rotate-180"
        text="Nay"
        @click="confirmDeleteModal = false"
      />
      <CustomButton
        class="mx-auto"
        :icon="refGoTo"
        iconClass="transform rotate-90"
        text="Yup"
        @click="deleteAccount"
      />
    </div>
  </o-modal>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from "components/functional/customButton.vue";
import { stackAlertError, stackAlertSuccess } from "@/store/alertStore";
import { formatNumber } from "shared/src/utils/misc";
import { fetchWAuth } from "shared/src/utils/auth";
import { useMainStore } from "@/store/main";
import GoToIcon from "icons/src/goTo.vue";
import { editProfile } from "shared/src/utils/requests/accounts";
const refGoTo = GoToIcon;
import type { IUserData } from "shared/src/types/account";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { useRouter } from "vue-router";
import TwitterIcon from "icons/src/twitter.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileLensIcon from "icons/src/profileLens.vue";
import { claimAndLinkTwitter, twitterCheckAndUnlink } from "shared/src/utils/requests/twitter"
import { web3Libs } from "shared/src/utils/evmTxs";
import { uploadAvatar } from "shared/src/utils/requests/accounts";
import { connectToFarcaster, disconnectFromFarcaster } from "shared/src/utils/requests/farcaster";
import { VACropper } from 'vue-cup-avatar'
import { ethersLib, getWeb3Modal, web3Modal, userProvider } from "shared/src/utils/evmTxs";
import { getLensUserData, authLens, setDispatcher, setAuthLens, disconnectLens } from "shared/src/utils/requests/lens"
//setDispatcherYup

import 'vue-cup-avatar/dist/style.css'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export default defineComponent({
  name: "SettingsPage",
  components: { DangLoader, CustomButton, BtnSpinner, TwitterIcon, ProfileFarcasterIcon, VACropper, ProfileLensIcon },
  props: {
    userData: {
      type: Object as PropType<IUserData>,
      default: {} as IUserData,
    },
  },
  setup(props) {
    const isLoading = ref(true);
    const confirmDeleteModal = ref(false);
    const store = useMainStore();
    const bio = ref(props.userData.bio);
    const fullName = ref(props.userData.fullname);
    const avatar = ref(props.userData.avatar)
    const isEditLoading = ref(false);
    const isDeleteLoading = ref(false);
    const isConnectToFarcaster = ref(false);
    const isConnectedToFarcaster = ref(store.farcaster ? true : false);
    const isConnectedToTwitter = ref(props.userData.twitterInfo?.userId ? true : false);
    const isLoadingTwitter = ref(false);
    const isDisconnectFromFarcaster = ref(false);
    const router = useRouter();
    const farcasterToken = ref("");
    const feedPersonalization = ref(false);
    const sendFarcasterConnectMsg = ref(false)
    const twFollowersAsKeywords = ref(false)
    const isAvatarLoading = ref(false)
    const isConnectedToLens = ref(localStorage.getItem('lensRefreshToken') ? true : false)
    const isConnectToLens = ref(false)
    const mapFeeds = {
      'likes': 'Likes',
      'content': 'Web3 created Content',
    }
    const defaultAccountFeed = ref(localStorage.getItem('defaultAccountFeed') || 'likes')

    const { ethers, providerOptionsProm, web3Mprom } = web3Libs();

    const deleteAccount = async () => {
      isDeleteLoading.value = true;
      confirmDeleteModal.value = false;
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

    const doConnectLens = async () => {
      if(isConnectToLens.value) {
        return
      }
      isConnectToLens.value = true
      const user = await getLensUserData(store.userData.address)
      if(!user) {
        stackAlertError("No lens user found, please set your default account in lens")
        isConnectToLens.value = false
        return
      }
      const profileId = user.data.defaultProfile.id
      const auth = await authLens({
      depUserProvider: userProvider,
      ethers,
      ethersLib,
      w3Modal: web3Modal,
      web3Mprom
      })
      if(!auth) {
        stackAlertError("Error while authenticating lens")
        isConnectToLens.value = false
        return
      }
      const { accessToken:authToken, refreshToken } = auth
      const sigDisp = await setDispatcher(
      { 
        profileId,
        authToken,
        userProvider
      })
      if(!sigDisp) {
        stackAlertError("Error while signing dispatcher")
        isConnectToLens.value = false
        return
      }
      // const yupSetDis = setDispatcherYup({
      //   store,
      //   apiBase: API_BASE,
      //   ...sigDisp
      // })
      // if(!yupSetDis) {
      //   stackAlertError("Error while sending TX for dispatcher")
      //   isConnectToLens.value = false
      //   return
      // }
      await setAuthLens({
        store,
        apiBase: API_BASE,
        accessToken: authToken,
        refreshToken
      })
      isConnectedToLens.value = true
      isConnectToLens.value = false
      stackAlertSuccess("Successfully connected to lens")
    }

    const doConnectToFarcaster = async () => {
      await connectToFarcaster({
        ethers,
        ethersLib,
        isConnectedToFarcaster,
        isConnectToFarcaster,
        sendFarcasterConnectMsg,
        stackAlertError,
        stackAlertSuccess,
        store,
        userProvider,
        w3Modal: web3Modal,
        web3Mprom,
        apiBase: API_BASE,
      })
    };

    const doDisconnectFromFarcaster = async () => {
      await disconnectFromFarcaster({
        farcasterToken,
        isConnectedToFarcaster,
        isDisconnectFromFarcaster,
        stackAlertError,
        stackAlertSuccess,
        store,
        apiBase: API_BASE,
      })
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
    }
     

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
      if(isLoadingTwitter.value) {
        return;
      }
      isLoadingTwitter.value = true;
      const connect = await claimAndLinkTwitter(store, twFollowersAsKeywords.value)
      if(connect.error) {
        stackAlertError("Error while connecting to twitter");
        
      } else {
        stackAlertSuccess("Connected to twitter successfully");
        isConnectedToTwitter.value = true;
      }
      isLoadingTwitter.value = false;
    }

    const twitterUnlink = async () => {
      if(isLoadingTwitter.value) {
        return;
      }
      isLoadingTwitter.value = true;
      const req = await twitterCheckAndUnlink(store)
      if(req.error) {
        stackAlertError("Error while disconnecting from twitter");
        
      } else {
        stackAlertSuccess("Disconnected from twitter successfully");
        isConnectedToTwitter.value = false;
      }
      isLoadingTwitter.value = false;
    }

    onMounted(async () => {
      getWeb3Modal({
        providerOptionsProm,
        web3Mprom,
        theme: store.theme as 'dark' | 'light',
        disableInjectedProvider: false,
      }
      ).then((w3m) => {
        web3Modal.value = w3m;
      });
      feedPersonalization.value = !!(localStorage.getItem("feedPersonalization") || "")
      isLoading.value = false;
    });

   
    const changeDefaultFeed = () => {
      localStorage.setItem("defaultAccountFeed", defaultAccountFeed.value)
    }

    const doDisconnectLens = async () => {
      const req = await disconnectLens({
        store,
        apiBase: API_BASE,
      })
      if(!req) {
        stackAlertError("Error while disconnecting from lens");
      } else {
        stackAlertSuccess("Disconnected from lens successfully");
        isConnectedToLens.value = false;
      }
    }

    const doTestLensPost = async () => {
      const req = await fetchWAuth(store, `${API_BASE}/lens/create-test-post`, {
        method: "POST",
      });
      if(!req) {
        stackAlertError("Error while posting to lens");
      } else {
        stackAlertSuccess("Posted to lens successfully");
      }
    }

    return {
      isLoading,
      formatNumber,
      confirmDeleteModal,
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
      sendFarcasterConnectMsg,
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
      doTestLensPost
    };
  },
});
</script>

<style scoped lang="scss">
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
