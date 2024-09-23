<!-- eslint-disable vue/no-v-html -->
<template>
  <ion-page>
    <HeaderBar text="Rewards" :menu="true" />

    <ion-content :fullscreen="false">
      <div class="ion-padding mt-4">
        <ion-segment
          style="width: auto"
          :value="currentSegment"
          mode="ios"
          @ion-change="segmentChange"
        >
          <ion-segment-button value="yup">
            <ion-label>Yup</ion-label>
          </ion-segment-button>
          <ion-segment-button value="moxie">
            <ion-label>Moxie</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <div class="text-center" v-if="currentSegment === 'yup'">
        <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">CLAIM - Content rewards</h2>
        <template v-if="loading">
          <p class="p-4">Loading rewards claim data</p>
          <DangLoader :unset="true" />
        </template>
        <template v-else>
          <div class="my-4 thinSBox">
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
              size="medium"
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
              size="small"
              :class="`m-auto my-4`"
              @click="() => checkForRewards(true)"
            />
          </div>
        </template>
      </div>
      <div class="text-center" v-if="currentSegment === 'moxie'">
        <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">CLAIM - MOXIE Rewards</h2>
        <FcFrame
          url="https://moxie-frames.airstack.xyz/mb"
          post-id=""
          :cast-dep="castDep"
          :deps="deps"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import {
  IonContent,
  IonPage,
  IonLabel,
  onIonViewWillEnter,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import StakeIcon from "icons/src/stake.vue";
import NoStakeIcon from "icons/src/noStake.vue";
import YUPPOLY from "icons/src/yup-poly.vue";
import PolyIcon from "icons/src/poly.vue";
import NoInput from "components/staking/noInput.vue";
import CustomButton from "components/functional/customButton.vue";
import { useMainStore } from "@/store/main";
import YUPCollectIcon from "icons/src/yup-collect.vue";
import {
  stackAlertSuccess,
  stackAlertWarning,
  stackAlertError,
} from "@/store/alert-store";
import HeaderBar from "@/components/template/header-bar.vue";
import { fetchUnclaimedReward, onReward } from "shared/src/utils/claim";
import { TWeb3Libs, web3Libs, prepareForTransaction } from "shared/src/utils/evmTxs";
import type { TClaim } from "shared/src/types/claim";
import { formatEther } from "viem";
import RetryIcon from "icons/src/retry.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import FcFrame from "components/post/frame.vue";
import type { IMainStore } from "shared/src/types/store";
import type { IPostDeps } from "shared/src/types/post";

const refYupRewardsIcon = YUPCollectIcon;
const refRecheckIcon = RetryIcon;

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "RewardClaimPage",
  components: {
    DangLoader,
    CustomButton,
    BtnSpinner,
    StakeIcon,
    NoStakeIcon,
    YUPPOLY,
    PolyIcon,
    NoInput,
    IonContent,
    IonPage,
    HeaderBar,
    IonLabel,
    IonSegment,
    IonSegmentButton,
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
    const currentSegment = ref("yup");

    const segmentChange = (e: CustomEvent) => {
      currentSegment.value = e.detail.value;
    };

    const Web3Libs = (ref(null) as unknown) as Ref<TWeb3Libs>;

    const deps: IPostDeps = {
      stackAlertError,
      stackAlertSuccess,
      stackAlertWarning,
      useMainStore: (useMainStore as unknown) as () => IMainStore,
    } as IPostDeps;

    const castDep = {
      hash: "0x308e83977ec5d357eb387e1fca6281641e98364f",
      fid: "1791",
    };

    store.$subscribe(() => {
      address.value = store.userData.address;
      isLoggedIn.value = store.isLoggedIn;
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

    onIonViewWillEnter(async () => {
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
      segmentChange,
      currentSegment,
      castDep,
      deps,
    };
  },
});
</script>

<style lang="scss" scoped>
.thinSBox {
  border: 1px solid #181818;
  padding: 1rem;
  margin: 1rem;
}

.notBLine {
  border-right: 2px solid dimgrey;
  opacity: 0.5;
}

.page-stake {
  min-height: calc(100vh - 2rem);

  .nothead {
    position: sticky;
    text-orientation: upright;
    writing-mode: vertical-lr;
    transform: translateX(-1400%);
    transform: translate(-1400%, 6rem);
    height: 0;
  }

  .imgNotRadius {
    border-radius: 0.6rem;
    box-shadow: 3px 4px 5px 0px rgb(88 88 88 / 66%);
  }

  .o-tabs__nav {
    overflow-y: hidden;
  }

  .rewardsNumber {
    color: var(--stake-counter);
    display: block;
    font-size: calc(1rem + 2vh);
    position: relative;
    animation: 2s numanim infinite;
    padding: 1rem;
    transition: all 1s ease-in;
    height: 6rem;
  }
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
