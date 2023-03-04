<template>
  <div class="page lg:max-width-90 md:max-width-60  py-2 mx-auto">
    <div class="bg-color page-claim w-full mb-4">
      <h2>Claim Existing Account that does not have an address</h2>
      <p class="claimText">
        You'll be prompted to sign with a message,
        <b>the address used to sign will be linked</b> to your account and you can use it
        later to log-in with that account.
      </p>
      <template v-if="stage === 'initial'">
        <div :key="accountType" class="control postCard">
          Acount Made with
          <o-switch
            class="p-4"
            :trueValue="accountType === 'EOS'"
            position="right"
            size="medium"
            variant="warning"
            :rounded="false"
            @change="changeAccountType(accountType)"
            ><EOSIcon v-if="accountType === 'EOS'" class="mx-4 w-6" /><TwitterIcon v-else class="mx-4 w-6 inline" />&nbsp;&nbsp;{{
              accountType === "EOS" ? "EOS" : "Twitter"
            }}</o-switch>
        </div>
        <div
          v-if="accountType === 'EOS'"
          key="accountType"
          class="lg:w-5/12 md:6/12 w-10/12 shadow-3xl mx-auto"
        >
          <div
            class="bg-gray-200 dark:bg-gray-600 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8"
          >
            <EOSIcon class="w-8" />
          </div>
          <div class="p-12 md:p-24 postCard">
            <div class="flex items-center text-lg mb-6 md:mb-8">
              <svg class="absolute ml-3" width="24" viewBox="0 0 24 24">
                <path
                  d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"
                />
              </svg>
              <input
                v-model="searchEos"
                type="text"
                class="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full text-sky-400"
                placeholder="username or accountId or eosname"
              />
            </div>
            <div class="flex items-center text-lg mb-6 md:mb-8">
              <svg class="absolute ml-3" viewBox="0 0 24 24" width="24">
                <path
                  d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"
                />
              </svg>
              <input
                v-model="eosPass"
                type="password"
                class="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full text-sky-400"
                placeholder="Password"
              />
            </div>
            <button
              type="button"
              :class="`m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 
              ${
                searchEos.length > 0 ? 'bg-purple-800' : 'bg-gray-500 cursor-not-allowed'
              }`"
              :disabled="searchEos.length == 0 || isDataLoading"
              @click="claimAndLinkEOS"
            >
              Claim with EOS
            </button>
          </div>
        </div>
        <div
          v-else
          class="lg:w-5/12 md:6/12 w-10/12 shadow-3xl mx-auto"
        >
          <div
            class="bg-gray-200 dark:bg-gray-600 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8"
          >
            <TwitterIcon class="w-8" />
          </div>
          <div class="p-12 md:p-24 postCard">
            <button
              type="button"
              :class="`m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 bg-purple-800`"
              :disabled="isDataLoading"
              @click="claimAndLinkTwitter"
            >
            Claim with Twitter
            </button>
          </div>
        </div>
      </template>
      <template v-if="stage === 'eosSuccess'">
      <div style="width: 90%" class="postCard my-16 mx-auto">
        <h2 style="margin-top: 3rem; margin-bottom: 3rem;"><EOSIcon class="w-10" /> Account claimed using EOS successfully address linked: <b>{{ address }}</b></h2>
        <router-link to="/login" ><button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 bg-purple-800 mb-8"
        >
          Back To Login
        </button>
      </router-link>
      </div>
      </template>
      <template  v-if="stage === 'twitterSuccess'">
        <div style="width: 90%" class="postCard my-16 mx-auto">
          <h2 style="margin-top: 3rem; margin-bottom: 3rem;" class="my-8"><TwitterIcon class="w-10 inline" /> Account claimed using Twitter successfully address linked: <b>{{ address }}</b></h2>
          <router-link to="/login" ><button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 bg-purple-800 mb-8"
        >
          Back To Login
        </button>
        </router-link>
        </div>
      </template>
      <template v-if="stage === 'waitingTwitter'">
        Waiting for user to approve Twitter request.
        <button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 bg-purple-800"
          @click="cancelTwitterWait"
        >
          Cancel Waiting User Approve
        </button>
      </template>
      <DangLoader v-if="isDataLoading" class="mt-4" :unset="true" />

      <div
        v-if="claimError && !isDataLoading"
        style="max-width: 40rem;"
        class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300 justify-center mt-8 mx-auto"
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
            {{ claimErrorMsg }}
          </div>
        </div>
      </div>
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
} from "vue";
import { useHead, HeadObject } from "@vueuse/head";
import DangLoader from "components/vote-list/loader.vue";
import { useMainStore } from "@/store/main";
import { wait } from "shared/src/utils/time";
import { useRoute } from 'vue-router'
import EOSIcon from "icons/src/eos.vue";
import TwitterIcon from "icons/src/twitter.vue";
import { digestSha256 } from "shared/src/utils/misc";

const providerOptionsProm = import("shared/src/utils/evm");
const web3Mprom = import("web3modal");
const ethers = import("ethers");

export default defineComponent({
  name: "ClaimPage",
  components: {
    DangLoader,
    TwitterIcon,
    EOSIcon,
  },
  setup() {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE;
    const accountType = ref("EOS") as Ref<"EOS" | "Twitter">;
    const stage = ref("initial") as Ref<
      "initial" | "waitingTwitter" | "twitterSuccess" | "eosSuccess"
    >;
    const searchEos = ref("");
    const eosPass = ref("");
    const store = useMainStore();
    const claimError = ref(false);
    const claimErrorMsg = ref("");
    const userId = ref("");
    const isDataLoading = ref(false);
    const influence: Ref<null | string> = ref(null);
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([]);
    const iconsColor = ref(store.theme === "dark" ? "#ccc" : "#020201");
    const address = ref("");
    const signature = ref("");
    const route = useRoute()
    let isTwitterCheckOn = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ethersLib: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userProvider: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let w3Modal: any;

    const siteData = reactive({
      title: `YUP Claim account made with Twitter`,
      description: `YUP Claim old account made with Twitter or EOS`
    })

    useHead({
      title: computed(() => siteData.title),
      meta: [
        {
          name: 'description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'og:description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'twitter:description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:image',
          content: `/share/yup-live-ogs/og-yup-live-changelog.png`
        },
      ]
    } as unknown as Ref<HeadObject>)




    onMounted(async () => {
      providerOptionsProm.then((pLib) => {
        web3Mprom.then((lib) => {
          const { default: libDefault } = lib;
          w3Modal = new libDefault({
            network: "matic", // optional
            cacheProvider: false, // optional
            providerOptions: pLib.providerOptions, // required
            theme: store.theme,
          });
        });
      });
    });

    onUnmounted(() => {
      // do nothing
    });

    const signChallenge = async (address: string, signer: unknown) => {
      const req = await fetch(`${API_BASE}/v1/eth/challenge?address=${address}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await req.json();
      const challenge = res.data;
      let signature;
      try {
        signature = await (signer as {
          signMessage: (a: string) => typeof a;
        }).signMessage(challenge);
      } catch (error) {
        return;
      }
      return signature;
    };

    const getSignature = async () => {
      if (!userProvider) {
        try {
          await web3Mprom;
          const inst = await w3Modal.connect();
          ethersLib = await ethers;
          userProvider = new ethersLib.providers.Web3Provider(inst);
          const signer = userProvider.getSigner();
          const addr = await signer.getAddress();
          const sig = await signChallenge(addr, signer);
          if (!sig) {
            claimErrorMsg.value = "User rejected connect request.";
            claimError.value = true;
            isDataLoading.value = false;
            return false;
          }
          signature.value = sig;
          address.value = addr;
          return sig;
        } catch {
          claimErrorMsg.value = "User rejected connect request.";
          claimError.value = true;
          isDataLoading.value = false;
          return false;
        }
      }
    };

    const checkAccount = async (search: string) => {
      const reqAcc = await fetch(`${API_BASE}/accounts/${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (reqAcc.ok) {
        return await reqAcc.json();
      }
    };

    const checkAlreadyLinked = async (address: string) => {
      const reqAcc = await fetch(`${API_BASE}/accounts/eth?address=${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      return reqAcc.ok;
    };

    const checkAccountAndGetSignature = async (skipEosSearch = false) => {
      let acc = true
      if (!skipEosSearch) {
       acc = await checkAccount(searchEos.value);
        if (!acc) {
          claimErrorMsg.value = "Account not Found";
          claimError.value = true;
          return false;
        }
      }
        if (!(await getSignature())) {
          return false;
        }
        if (await checkAlreadyLinked(address.value)) {
          claimErrorMsg.value = `Account with address ${address.value} is already linked`;
          claimError.value = true;
          isDataLoading.value = false;
          return false;
        }
        return acc as unknown as { _id: string }
    }

    const claimAndLinkEOS = async () => {
      try {
        isDataLoading.value = true;
        const acc = await checkAccountAndGetSignature()
        if(!acc) return

        const passwordHash = await digestSha256(eosPass.value);
        const reqClaim = await fetch(`${API_BASE}/accounts/claim`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            passwordHash,
            eosname: acc._id,
            address: address.value,
            signature: signature.value,
          }),
        });

        if (reqClaim.ok) {
          stage.value = "eosSuccess";
          isDataLoading.value = false;
        } else {
          claimErrorMsg.value = "Wrong Password.";
          claimError.value = true;
          isDataLoading.value = false;
        }
      } catch {
        claimErrorMsg.value = "Network Error API DOWN, please try again later.";
        claimError.value = true;
        isDataLoading.value = false;
        return false;
      }
    };

    const twitterAuthCheck = async (
      verificationId: string,
      verificationToken: string
    ) => {
      try {
        isDataLoading.value = true;
        const reqTwitterAuth = await fetch(
          `${API_BASE}/v1/auth/oauth-challenge?verificationId=${verificationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        );
        const data = await reqTwitterAuth.json();
        if (data?.confirmed) {
          const reqTwitterClaim = await fetch(`${API_BASE}/accounts/twitter/claim`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
              verificationId,
              verificationToken,
              address: address.value,
              signature: signature.value,
            }),
          });
          if (reqTwitterClaim.ok) {
            stage.value = "twitterSuccess";
            isDataLoading.value = false;
          } else {
            stage.value = "initial";
            isDataLoading.value = false;
            claimErrorMsg.value =
              "Claiming account using Twitter failed, please try again later.";
            claimError.value = true;
            return false;
          }
        } else {
          if (isTwitterCheckOn) {
            await wait(350);
            await twitterAuthCheck(verificationId, verificationToken);
          }
        }
      } catch {
        claimErrorMsg.value = "Network Error API DOWN, please try again later.";
        claimError.value = true;
        isDataLoading.value = false;
        return false;
      }
    };

    const claimAndLinkTwitter = async () => {
      try {
        isDataLoading.value = true;
        const acc = await checkAccountAndGetSignature(true)
        if(!acc) return
        stage.value = "waitingTwitter";
        const reqTwitterChallenge = await fetch(`${API_BASE}/v1/auth/oauth-challenge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            domain: "twitter.com",
          }),
        });
        if (!reqTwitterChallenge.ok) {
          claimErrorMsg.value =
            "Error generating twitter challenge, please try again later.";
          isDataLoading.value = false;
          stage.value = "initial";
          claimError.value = true;
          return false;
        }
        const {
          token: verificationToken,
          _id: verificationId,
        } = await reqTwitterChallenge.json();

        const reqTwitterAuth = await fetch(`${API_BASE}/v1/auth/twitter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            verificationToken,
            verificationId,
            oauthReferrer: "onboarding",
          }),
        });
        if (!reqTwitterAuth.ok) {
          claimErrorMsg.value =
            "Error on auth of Twitter challenge, please try again later.";
          isDataLoading.value = false;
          stage.value = "initial";
          claimError.value = true;
          return false;
        }
        const oauthRes = await reqTwitterAuth.json();
        window.open(oauthRes.redirectPath, "_blank");
        isTwitterCheckOn = true;
        twitterAuthCheck(verificationId, verificationToken);
      } catch (err) {
        isDataLoading.value = false;
        stage.value = "initial";
      }
    };

    const changeAccountType = (type: string) => {
      const types = ["EOS", "Twitter"];
      const dic: Record<string, string> = {
        EOS: types[0] as "EOS",
        Twitter: types[1] as "Twitter",
      };
      if (types.includes(type) && accountType.value === type) {
        accountType.value = dic[type] === "EOS" ? "Twitter" : "EOS"
      }
    };

    const cancelTwitterWait = () => {
      isTwitterCheckOn = false;
      isDataLoading.value = false;
      stage.value = "initial";
    };

    return {
      searchEos,
      claimError,
      claimErrorMsg,
      isDataLoading,
      userId,
      influence,
      historicInfluence,
      iconsColor,
      accountType,
      changeAccountType,
      stage,
      eosPass,
      claimAndLinkEOS,
      cancelTwitterWait,
      claimAndLinkTwitter,
      address,
    };
  },
});
</script>

<style lang="scss">
.page-claim {
  min-height: calc(100vh - 2rem);

  h2 {
    margin-left: auto;
    margin-right: auto;
    margin-top: 3rem;
    margin-bottom: 1rem;
    font-size: 1.35rem;
  }

  .claimText {
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.3rem;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .control {
    margin-left: auto;
    margin-right: auto;
    font-size: 1.1rem;
    max-width: 20rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
    text-align: center;
  }

  .postCard {
  background-color: var(--post-card-bg);
  border: 1px solid #00000047;
  border-radius: 0.5rem;
  box-shadow: 2px 0 0 #0a0a0ab3;
  height: min-content;
  position: relative;
}
}
</style>
