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
            :disabled="isConnectToFarcaster || !checkedConnectToFarcaster"
            class="bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg"
            @click="connectToFarcaster"
          >
            <BtnSpinner v-if="isConnectToFarcaster" class="inline mr-2" />Connect to
            Farcaster
          </button>
        </template>
          <button
            v-else
            :disabled="isDisconnectFromFarcaster"
            class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
            @click="disconnectFromFarcaster"
            >            <BtnSpinner v-if="isDisconnectFromFarcaster" class="inline mr-2" />Disconnect from Farcaster</button>

        <button v-if="!isConnectedToTwitter" class="mt-4 bg-sky-500 border-0 py-2 px-6 focus:outline-none hover:bg-sky-700 rounded text-lg" @click="twitterLink"><TwitterIcon class="w-6 inline" /> <BtnSpinner v-if="isLoadingTwitter" class="inline mr-2" /> Connect to Twitter</button>
        <button
        v-else
        class="mt-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
         @click="twitterUnlink"><TwitterIcon class="w-6 inline" /> <BtnSpinner v-if="isLoadingTwitter" class="inline mr-2" /> Disconnect from Twitter</button>

        </div>
      </div>
    </section>
    <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Edit Account Details</h2>
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
              class="w-full  text-gray-600 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
              class="w-full text-gray-600 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-22 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
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
import { editProfile } from "shared/src/utils/login-signup";
const refGoTo = GoToIcon;
import type { IUserData } from "shared/src/types/account";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { useRouter } from "vue-router";
import { getFidByToken } from 'shared/src/utils/farcaster'
import TwitterIcon from "icons/src/twitter.vue";
import { claimAndLinkTwitter, twitterCheckAndUnlink } from "shared/src/utils/requests/twitter";

const providerOptionsProm = import('shared/src/utils/evm')
const web3Mprom = import("web3modal");
const ethers = import("ethers");
const canonicalize = import("canonicalize");
const buffer = import("buffer/");

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const EIP_191_PREFIX = "eip191:";

export default defineComponent({
  name: "SettingsPage",
  components: { DangLoader, CustomButton, BtnSpinner, TwitterIcon },
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
    const isEditLoading = ref(false);
    const isDeleteLoading = ref(false);
    const isConnectToFarcaster = ref(false);
    const checkedConnectToFarcaster = ref(false);
    const isConnectedToFarcaster = ref(false);
    const isConnectedToTwitter = ref(props.userData.twitterInfo?.userId ? true : false);
    const isLoadingTwitter = ref(false);
    const isDisconnectFromFarcaster = ref(false);
    const router = useRouter();
    const farcasterToken = ref("");
    const feedPersonalization = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ethersLib: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userProvider: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let w3Modal: any;

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


    const signChallenge = async (payload: Record<string, unknown>, signer: unknown) => {
      const canFn = (await canonicalize).default;
      let signature;
      try {
        signature = await (signer as {
          signMessage: (a: string) => typeof a;
        }).signMessage(canFn(payload) as string);
      } catch (error) {
        return;
      }
      return signature;
    };

    //   const verifyCustodyBearer = async (custodyBearerToken: string, payload: any, address: string) => {
    //     const bufferLib = (await buffer).Buffer;
    //     const canFn = (await canonicalize).default;
    //   const recoveredAddress = ethersLib.utils.recoverAddress(
    //     ethersLib.utils.hashMessage(canFn(payload)),
    //     ethersLib.utils.hexlify(bufferLib.from(custodyBearerToken.split(':')[1], 'base64'))
    //   );
    //   return recoveredAddress === address;
    // }

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
     

    const connectToFarcaster = async () => {
      try {
        isConnectToFarcaster.value = true;
        await web3Mprom;
        const inst = await w3Modal.connect();
        ethersLib = await ethers;
        userProvider = new ethersLib.providers.Web3Provider(inst);
        const signer = userProvider.getSigner();
        const timestamp = Date.now();
        const payload = {
        method: "generateToken",
        params: {
          timestamp,
        },
      };
        const sig = await signChallenge(payload, signer);
        if (!sig) {
          stackAlertError(
            "Error while connecting to farcaster, user rejected signature request"
          );
          isConnectToFarcaster.value = false;
          return false;
        }

        const bufferLib = (await buffer).Buffer;
        const signatureString = bufferLib
          .from(ethersLib.utils.arrayify(sig)).toString('base64');
        const cusAuth = EIP_191_PREFIX + signatureString;

        const req = await fetch(`${API_BASE}/proxy/farcaster/v2/auth`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cusAuth}`,
          },
          body: JSON.stringify(payload),
        });
        if (req.ok) {
          const data = await req.json();
          const token = data?.result?.token?.secret;
          if (token) {
            const dataTosend = {
              social: {
                platforms: {
                  farcaster: token,
                },
              },
            };
            getFidByToken(token, API_BASE).then(fid => {
              if(fid) {
                store.fid = fid as string;
                localStorage.setItem("fid", fid as string);
              }
            } )
            const req = await fetchWAuth(store, `${API_BASE}/accounts/social`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataTosend),
            });
            if (req.ok) {
              stackAlertSuccess("Connected to farcaster successfully");
              isConnectedToFarcaster.value = true;
              store.farcaster = token;
              localStorage.setItem("farcaster", token);
            } else {
              stackAlertError("Error while connecting to farcaster: " + (await req.text()));
            }
          } else {
            stackAlertError("Error while connecting to farcaster: " + (await req.text()));
          }
        } else {
          stackAlertError("Error while connecting to farcaster: " + (await req.text()));
        }
        isConnectToFarcaster.value = false;
      } catch {
        isConnectToFarcaster.value = false;
        stackAlertError(
          "Error while connecting to farcaster: User rejected connect request"
        );
      }
    };

    const disconnectFromFarcaster = async () => {
      try {
        if(!isConnectedToFarcaster.value) {
          stackAlertError("You are not connected to farcaster");
          return;
        }
        isDisconnectFromFarcaster.value = true;
        const payload = {
          method: "revokeToken",
          params: {
            timestamp:  Date.now(),
          }
        }
        const req = await fetch(`${API_BASE}/proxy/farcaster/v2/auth`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${farcasterToken.value}`,
          },
          body: JSON.stringify(payload),
        });
        if (!req.ok) {
          stackAlertError("Error while disconnecting from farcaster: " + (await req.text()));
          return;
        }
        const delBody = {
          social: {
            platforms: ['farcaster']
          },
        }
        const reqDel = await fetchWAuth(store, `${API_BASE}/accounts/social`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(delBody),
        });
        if (reqDel.ok) {
          localStorage.removeItem("farcaster");
          localStorage.removeItem("fid");
          store.farcaster = "";
          store.fid = "";
          stackAlertSuccess("Disconnected from farcaster successfully");
          isConnectedToFarcaster.value = false;
        } else {
          // stackAlertError("Error while disconnecting from farcaster: " + (await req.text()));
        }
        isDisconnectFromFarcaster.value = false;
      } catch (e) {
        stackAlertError(
          "Error while disconnecting from farcaster: User rejected connect request"
        );
        isDisconnectFromFarcaster.value = false;
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

    const checkConnectedToFarcaster = async () => {
      const req = await fetchWAuth(store, `${API_BASE}/accounts/social/list`, {
        method: "GET",
      });
      if (req.ok) {
        const data = await req.json();
        const farcaster = data?.social?.farcaster;
        if (farcaster) {
          isConnectedToFarcaster.value = true;
          farcasterToken.value = farcaster;
        }
      }
      checkedConnectToFarcaster.value = true;
    };

    const twitterLink = async () => {
      if(isLoadingTwitter.value) {
        return;
      }
      isLoadingTwitter.value = true;
      const connect = await claimAndLinkTwitter(store)
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
      providerOptionsProm.then((pLib) => {
        web3Mprom.then((lib) => {
          const { default: libDefault } = lib
          w3Modal = new libDefault({
            network: 'matic', // optional
            cacheProvider: false, // optional
            providerOptions: pLib.providerOptions, // required
            theme: store.theme
          })
        })
      })
      feedPersonalization.value = !!(localStorage.getItem("feedPersonalization") || "")
      checkConnectedToFarcaster()
      isLoading.value = false;
    });

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
      checkedConnectToFarcaster,
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
    };
  },
});
</script>

<style lang="scss">
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
