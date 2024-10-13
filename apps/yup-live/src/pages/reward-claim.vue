<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto rewards">
    <div class="bg-color page-claim w-full mb-4 flex flex-col">
      <o-tabs
        v-model="rewardsTab"
        :multiline="true"
        :expanded="false"
        type="default"
        position="centred"
        variant="warning"
        navTypeClass="boxed"
        class="mt-4 mx-auto"
      >
        <o-tab-item value="yup">
          <template #header>
            <span class="text-[0.94rem]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 mx-auto inline-flex"
                style="opacity: 0.75"
                viewBox="0 0 366 366"
                fill="none"
              >
                <path
                  d="M182.911 366C82.1487 366 0 283.851 0 182.911C0 81.9697 82.1487 0 182.911 0C283.672 0 365.821 82.1487 365.821 182.911C365.821 283.672 283.851 366 182.911 366ZM182.911 17.3604C91.6342 17.3604 17.1814 91.6342 17.1814 183.089C17.1814 274.545 91.4553 348.819 182.911 348.819C274.366 348.819 348.64 274.545 348.64 183.089C348.64 91.6342 274.366 17.3604 182.911 17.3604Z"
                  fill="currentColor"
                />
                <path
                  d="M129.218 156.959C105.952 156.959 86.8018 139.241 84.4751 116.69C84.1172 114.185 86.2649 111.858 88.9495 111.858H97.0033C99.5089 111.858 101.657 113.827 102.014 116.332C104.162 129.576 115.616 139.599 129.397 139.599C143.178 139.599 154.633 129.576 156.78 116.332C157.138 113.827 159.286 111.858 161.792 111.858H169.845C172.53 111.858 174.499 114.185 174.32 116.69C171.635 139.241 152.306 156.959 129.218 156.959Z"
                  fill="currentColor"
                />
                <path
                  d="M277.05 148.19H268.997C266.491 148.19 264.343 146.221 263.985 143.715C261.838 130.471 250.383 120.449 236.602 120.449C222.822 120.449 211.367 130.471 209.22 143.715C208.862 146.221 206.714 148.19 204.208 148.19H196.155C193.47 148.19 191.501 145.863 191.68 143.357C194.186 120.807 213.336 103.089 236.424 103.089C259.511 103.089 278.84 120.807 281.167 143.357C281.883 145.863 279.735 148.19 277.05 148.19Z"
                  fill="currentColor"
                />
                <path
                  d="M185.058 306.939C115.616 308.192 58.8818 250.204 58.8818 180.763V178.615C58.8818 176.289 60.8505 174.32 63.1772 174.32H302.464C304.791 174.32 306.76 176.289 306.76 178.615V182.911C306.939 250.562 252.531 305.865 185.058 306.939ZM79.8217 191.68C78.2109 191.68 76.7791 193.112 76.9581 194.723C82.8642 248.057 128.144 289.579 182.91 289.579C237.676 289.579 282.956 248.057 288.862 194.723C289.041 193.112 287.788 191.68 285.999 191.68H79.8217Z"
                  fill="currentColor"
                />
              </svg>
              Yup Rewards</span
            >
          </template>
        </o-tab-item>

        <o-tab-item value="moxie">
          <template #header>
            <span class="text-[0.94rem]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 146 36"
                width="145px"
                class="relative max-sm:w-[116px]"
              >
                <path
                  fill="#E8DDFF"
                  d="M5.846 26.309H2.923v2.923H0v5.846h8.77v-5.846H5.846zM32.155 26.309v2.923h-2.923v-2.923h-2.923v8.77h8.77v-8.77z"
                ></path>
                <path
                  fill="#8E55FF"
                  d="M14.616 5.845v2.923h-2.923v2.923H8.77V8.769H5.846v2.923H0v-8.77h2.923v2.924H8.77V2.922h2.923v2.923zM32.154 5.845V2.922H29.23v2.923h-2.924V2.922h-2.923v2.923h-2.923v2.923h2.923v2.923h2.923V8.769h5.847v2.923h2.923V5.845z"
                ></path>
                <path fill="#8E55FF" d="M20.464 8.77h-5.847v2.923h5.847z"></path>
                <path
                  fill="#6A2DE0"
                  d="M8.77 0v5.846H2.923V2.923H0V0zM26.309 0v5.846h2.923V2.923h2.923v2.923h2.923V0z"
                ></path>
                <path
                  fill="#A577FF"
                  d="M35.079 11.693v5.846h-2.923v-2.923h-2.924v2.923H26.31v-2.923h-2.923v2.923h-5.847v-2.923h-2.923v2.923h-2.923v-2.923H8.77v2.923H2.923v-2.923H0v-2.923h5.846V8.77H8.77v2.923h2.923V8.77h2.923v2.923h5.847V8.77h2.923v2.923h2.923V8.77h5.847v2.923z"
                ></path>
                <path
                  fill="#B9F"
                  d="M11.693 14.617H8.77v2.923h2.923zM17.542 17.54v-2.923h-2.924v2.923h-2.923v2.924h2.923v2.923h5.847v-2.923h2.923V17.54zM32.155 17.54v-2.923h-2.923v2.923h-2.923v5.847h2.923v-2.923h2.923v2.923h2.923V17.54z"
                ></path>
                <path
                  fill="#B9F"
                  d="M26.306 14.617h-2.923v2.923h2.923zM2.923 17.54v-2.923H0v8.77h5.846v-2.923H8.77V17.54z"
                ></path>
                <path
                  fill="#D2BBFF"
                  d="M32.155 23.384v-2.923h-2.923v2.923h-2.923v2.923h2.923v2.924h2.923v-2.924h2.923v-2.923zM5.846 23.384H0v5.8469999999999995h2.923v-2.924h2.923v2.924H8.77v-8.77H5.846z"
                ></path>
                <path
                  fill="#6A2DE0"
                  d="M45.785 6.395h7.2l4.766 6.742h.238l4.767-6.742h7.199v22.253h-7.1V16.533h-.179L58 22.7h-.238l-4.677-6.167h-.179v12.115h-7.1V6.395zM73.781 17.537c0-1.599.308-3.118.914-4.538a12 12 0 0 1 2.502-3.724 11.8 11.8 0 0 1 3.724-2.502c1.42-.616 2.94-.914 4.538-.914s3.118.308 4.538.914q2.13.924 3.724 2.502A11.8 11.8 0 0 1 96.223 13c.616 1.42.914 2.94.914 4.538a11.5 11.5 0 0 1-.914 4.538 12 12 0 0 1-2.502 3.724 11.8 11.8 0 0 1-3.724 2.502c-1.42.616-2.94.914-4.538.914s-3.118-.308-4.538-.914a12 12 0 0 1-3.724-2.502 11.8 11.8 0 0 1-2.502-3.724c-.616-1.42-.914-2.94-.914-4.538m7.01 0q-.002.969.368 1.817a4.8 4.8 0 0 0 1.003 1.49c.427.427.914.754 1.49 1.003a4.5 4.5 0 0 0 1.817.367q.968.002 1.817-.367a4.8 4.8 0 0 0 1.49-1.003 4.7 4.7 0 0 0 1.002-1.49 4.5 4.5 0 0 0 .368-1.817q.002-.968-.368-1.817a4.8 4.8 0 0 0-1.003-1.49 4.7 4.7 0 0 0-1.489-1.003 4.5 4.5 0 0 0-1.817-.367q-.969-.002-1.817.367a4.8 4.8 0 0 0-1.49 1.003 4.7 4.7 0 0 0-1.003 1.49 4.5 4.5 0 0 0-.367 1.817"
                ></path>
                <path
                  fill="#6A2DE0"
                  d="M102.974 17.143 97.066 6.398h7.775l2.006 3.635 2.006-3.635h7.805l-5.909 10.745 6.336 11.509h-7.775l-2.473-4.44-2.433 4.44h-7.775l6.335-11.51zM119.602 6.398h7.536v22.254h-7.536zM131.471 6.398h14.299v5.84h-7.199v2.472h7.1v5.54h-7.1v2.573h7.427v5.839h-14.537V6.407z"
                ></path>
              </svg>
            </span>
          </template>
        </o-tab-item>
      </o-tabs>

      <template v-if="rewardsTab === 'yup'">
        <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">CLAIM - Content rewards</h2>
        <template v-if="loading">
          <p class="p-4">Loading rewards claim data</p>
          <DangLoader :unset="true" />
        </template>
        <template v-else-if="!loading && !isLoggedIn">
          <div class="p-4 thinSBox justify-center items-center flex-col flex">
            <p class="p-4">Claiming rewards is available only for logged in users</p>
            <ConnectButton />
          </div>
        </template>
        <template v-else>
          <div v-if="!address" class="my-4">
            If you don't have an yup account you can't claim rewards. Please connect to
            your account.
          </div>
          <div class="my-4">
            <p>
              Connected Address: <b>{{ address }}</b>
            </p>
          </div>
          <div class="p-4 thinSBox">
            <h2 class="text-[1.4rem] uppercase mb-4">Rewards to collect</h2>
            <span class="claimNumber">{{
              rewards > 0 ? rewards.toFixed(6) + " YUP" : "No rewards to collect yet."
            }}</span>
            <BtnSpinner v-if="rewardLoading" />
            <CustomButton
              :icon="refYupRewardsIcon"
              text="Collect"
              size="large"
              :class="`m-auto my-4 ${
                rewards <= 0 || rewardLoading
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer'
              }`"
              :disabled="rewardLoading || rewards <= 0"
              @click="doOnReward"
            />

            <CustomButton
              :icon="refRecheckIcon"
              text="ReCheck Now"
              size="medium"
              :class="`m-auto my-4`"
              @click="() => checkForRewards(true)"
            />
          </div>
        </template>
      </template>
      <template v-else-if="rewardsTab === 'moxie'">
        <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">CLAIM - Moxie rewards</h2>
        <FcFrame
          url="https://moxie-frames.airstack.xyz/mb"
          post-id=""
          :cast-dep="castDep"
          :deps="deps"
        />
      </template>
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
import { useHead } from "@unhead/vue";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from "components/functional/customButton.vue";
import { TWeb3Libs, web3Libs, prepareForTransaction } from "shared/src/utils/evmTxs";
import { useMainStore, openConnectModal } from "@/store/main";
import YUPCollectIcon from "icons/src/yup-collect.vue";
import RetryIcon from "icons/src/retry.vue";
import {
  stackAlertSuccess,
  stackAlertWarning,
  stackAlertError,
} from "@/store/alertStore";
import { fetchUnclaimedReward, onReward } from "shared/src/utils/claim";
import BtnSpinner from "icons/src/btnSpinner.vue";
import type { TClaim } from "shared/src/types/claim";
import type { IMainStore } from "shared/src/types/store";
import ConnectButton from "@/components/content/connect/connectBtn.vue";
import { formatEther } from "viem";
import FcFrame from "components/post/frame.vue";
import type { IPostDeps } from "shared/src/types/post";
import { getStaticMetaFrame } from "shared/src/utils/frame";

const refYupRewardsIcon = YUPCollectIcon;
const refRecheckIcon = RetryIcon;

const API_BASE = import.meta.env.VITE_YUP_API_BASE;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// import { useMainStore } from '@/store/main'
export default defineComponent({
  name: "RewardClaimPage",
  components: {
    DangLoader,
    CustomButton,
    BtnSpinner,
    ConnectButton,
    FcFrame,
  },
  setup() {
    const loading = ref(true);
    const rewardLoading = ref(false);
    const rewardData = ref({
      value: "0",
      deadline: "",
      nonce: "",
      recipient: "",
      signature: "",
    }) as Ref<TClaim>;
    const rewards = ref(0);
    const store = useMainStore();
    const address = ref(
      store?.userData?.address || localStorage.getItem("address") || ""
    );
    const isLoggedIn = ref(store.isLoggedIn);

    const Web3Libs = (ref(null) as unknown) as Ref<TWeb3Libs>;
    const rewardsTab = ref("yup");

    store.$subscribe(() => {
      address.value = store.userData.address;
      isLoggedIn.value = store.isLoggedIn;
    });

    const deps: IPostDeps = {
      stackAlertError,
      stackAlertSuccess,
      stackAlertWarning,
      openConnectModal,
      useMainStore: (useMainStore as unknown) as () => IMainStore,
    } as IPostDeps;

    const castDep = {
      hash: "0x308e83977ec5d357eb387e1fca6281641e98364f",
      fid: "1791",
    };

    const siteData = reactive({
      title: `Yup Content rewards claim`,
    });

    onUnmounted(() => {
      // do nothing
    });

    useHead({
      title: computed(() => siteData.title).value,
      meta: [
        {
          name: "description",
          content: `Interact with the Yup content rewards contracts.`,
        },
        {
          name: "og:image",
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-default.png`,
        },
        ...getStaticMetaFrame(`${BASE_URL}/share/yup-live-ogs/og-yup-live-default.png`),
      ],
    });

    const checkForRewards = async (check = false) => {
      if (isLoggedIn.value) {
        rewardLoading.value = true;
        try {
          rewardData.value = await fetchUnclaimedReward(API_BASE, store);
          rewards.value = Number(formatEther(BigInt(rewardData.value.value)));
          if (check) {
            if (rewards.value > 0) {
              stackAlertSuccess("You have rewards to claim");
            } else {
              stackAlertWarning("No rewards to claim");
            }
          }
        } catch (e) {
          console.error(e);
          stackAlertWarning("Error fetching rewards");
        } finally {
          rewardLoading.value = false;
        }
      }
    };

    onMounted(async () => {
      Web3Libs.value = web3Libs();
      await checkForRewards();
      loading.value = false;
    });

    const doOnReward = async () => {
      if (rewards.value > 0) {
        const wgamiLib = await prepareForTransaction({
          localWeb3Libs: Web3Libs.value,
          stackAlertWarning,
        });

        if (!wgamiLib) {
          return null;
        }

        const success = await onReward({
          reward: rewardData.value,
          stackAlertSuccess,
          stackAlertWarning,
          Web3Libs,
          rewardLoading,
        });

        if (success) {
          rewards.value = 0;
        }
        rewardLoading.value = false;
      } else {
        stackAlertWarning("No rewards to claim");
      }
    };

    return {
      loading,
      isLoggedIn,
      rewards,
      refYupRewardsIcon,
      address,
      rewardLoading,
      doOnReward,
      checkForRewards,
      refRecheckIcon,
      rewardsTab,
      castDep,
      deps,
    };
  },
});
</script>

<style lang="scss">
.rewards {
  justify-content: center;

  .o-tabs__nav {
    overflow-y: hidden;
  }

  table {
    margin-top: 2rem;
  }

  table tr {
    border-bottom: #a85d4e89 2px solid;
  }

  table tr td {
    padding-bottom: 1.3rem;
    padding-top: 0.7rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-bottom: #a3a3a32d 1px solid;
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

.thinSBox {
  border: 1px solid #181818;
  padding: 2rem;
  margin: 1rem;
}

.notBLine {
  border-right: 2px solid dimgrey;
  opacity: 0.5;
}

.page-claim {
  min-height: calc(100vh - 2rem);
}

.claimNumber {
  color: var(--stake-counter);
  display: inline-block;
  font-size: calc(1rem + 2vh);
  position: relative;
  animation: 2s numanim infinite;
  transition: all 1s ease-in;
}

@keyframes numanim {
  0% {
    font-size: calc(1rem + 2vh);
    font-weight: 0;
  }
  50% {
    font-size: calc(1rem + 2.1vh);
    font-weight: 800;
  }
  100% {
    font-size: calc(1rem + 2vh);
    font-weight: 0;
  }
}
</style>
