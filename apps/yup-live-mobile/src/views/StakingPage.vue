<!-- eslint-disable vue/no-v-html -->
<template>
  <ion-page>
    <HeaderBar text="Staking" :menu="true" />

    <ion-content :fullscreen="false" class="mt-2">
    <div class="text-center">
      <h2 class="text-[1.2rem] p-6 tracking-wide uppercase">Staking</h2>
      <template v-if="loading">
        <p class="p-4">Loading staking data</p>
        <DangLoader :unset="true" />
      </template>
      <template v-if="!loading">
        <div class="my-4">
          <p>
            Connected Address: <b>{{ address }}</b>
          </p>
          <p v-if="poolShare > 0">
            Your current pool share: <b>{{ `${poolShare.toFixed(4)}%` }}</b>
          </p>
        </div>

        <PolyIcon class="w-6 inline mr-2" />
        <span> Polygon Chain </span>

        <div class="flex flex-col p-4 thinSBox text-center">
          <div class="flex row mx-auto">
            <div class="flex flex-col">
              <YUPPOLY class="w-30 mt-5" />
            </div>
            <div class="flex flex-col text-[1.2rem] p-6 mb-4">
              <p class="p-2">Stake YUP-WETH LP Tokens</p>
              <p class="p-2">Quickswap • Polygon</p>
              <p class="p-2">
                [ APR: <span class="text-[1.3rem]">{{ aprs.poly }}%</span> ]
              </p>
            </div>
          </div>
          <div class="p-2 mr-4">
            <p class="p-2 text-left flex items-center justify-center">
              <span class="w-40 inline-block tracking-wide uppercase"
                >Staked<br />amount</span
              ><span class="text-[1.2rem]" v-html="polyStaked.toFixed(4)" />
            </p>
            <p class="p-2 text-left flex items-center justify-center">
              <span class="w-40 inline-block tracking-wide uppercase"
                >Unstaked<br />amount</span
              ><span class="text-[1.2rem]" v-html="polyUnstaked.toFixed(4)" />
            </p>
          </div>

          <ion-segment
            style="width: auto"
            class=""
            :value="activeTabStake"
            mode="ios"
            @ion-change="activeTabStakeChange"
          >
            <ion-segment-button value="0">
              <StakeIcon class="w-6 inline mr-1" /> <ion-label>Stake</ion-label>
            </ion-segment-button>
            <ion-segment-button value="1">
              <NoStakeIcon class="w-6 inline mr-1" />
              <ion-label>Unstake</ion-label>
            </ion-segment-button>
          </ion-segment>

          <template v-if="activeTabStake === '0'">
            <NoInput v-model:input="inputValue" :max="polyUnstaked - 0.001" class="max-w-[22rem] mx-auto" />
            <CustomButton class="max-w-[12rem] mx-auto" :icon="refStakeIcon" text="Stake" @click="doStake()" />
          </template>
          <template v-else>
            <NoInput v-model:input="inputValue" :max="polyStaked - 0.001" class="max-w-[22rem] mx-auto" />
            <CustomButton class="max-w-[12rem] mx-auto" :icon="refUnStakeIcon" text="Unstake" @click="doUnstake()" />
          </template>
        </div>
        <div v-if="rewards > 0" class="p-4 thinSBox">
          <h2 class="text-[1.4rem] uppercase">Rewards to collect</h2>
          <span class="rewardsNumber">{{ rewards }}</span>
          <CustomButton
            :icon="refYupRewardsIcon"
            text="Collect"
            size="large"
            class="m-auto my-4"
            @click="doReward"
          />
        </div>
      </template>
    </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { onMounted, defineComponent, onUnmounted, Ref, ref } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import { IonContent, IonSegment, IonSegmentButton, IonPage, IonLabel } from "@ionic/vue";
import StakeIcon from "icons/src/stake.vue";
import NoStakeIcon from "icons/src/noStake.vue";
import YUPPOLY from "icons/src/yup-poly.vue";
import PolyIcon from "icons/src/poly.vue";
import NoInput from 'components/staking/noInput.vue';
import CustomButton from "components/functional/customButton.vue";
import { useMainStore } from "@/store/main";
import YUPCollectIcon from "icons/src/yup-collect.vue";
import { stackAlertSuccess, stackAlertWarning } from "shared/src/store/alertStore";
import WalletIcon from "icons/src/walletIcon.vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { connect, getAprs, onStake, onUnstake, fetchContractsData, onReward  } from 'shared/src/utils/stake'
import {TWeb3Libs, web3Libs } from 'shared/src/utils/evmTxs'

const refStakeIcon = StakeIcon;
const refUnStakeIcon = NoStakeIcon;
const refYupRewardsIcon = YUPCollectIcon;
const refWalletIcon = WalletIcon;

 

// import { useMainStore } from '@/store/main'
export default defineComponent({
  name: "StakePage",
  components: {
    DangLoader,
    StakeIcon,
    NoStakeIcon,
    YUPPOLY,
    PolyIcon,
    NoInput,
    CustomButton,
    IonContent,
    IonPage,
    HeaderBar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  },
  setup() {
    const loading = ref(true);
    const activeTabStake = ref("0") as Ref<string>;
      const aprs = ref({
      poly: 0,
      eth: 0
    }) as Ref<Record<string, number>>
    const rewards = ref(0)
    const polyStaked = ref(0)
    const polyUnstaked = ref(0)
    const store = useMainStore()
    const inputValue = ref('0')
    const poolShare = ref(0)
    const address = ref(localStorage.getItem('address'))


    const Web3Libs = ref(null) as unknown as Ref<TWeb3Libs>;

    store.$subscribe(() => {
      address.value = store.userData.address;
    });

    const activeTabStakeChange = async (value: any) => {
      activeTabStake.value = value.detail.value;
    };

    onUnmounted(() => {
      // do nothing
    });
    const doConnect = async() => {
      await connect({
        address: address as Ref<string>,
        loading,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
      })
    }

    const doStake = async() => {
      await onStake({
        address: address as Ref<string>,
        inputValue,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess
      })
    }

    const doUnstake = async() => {
      await onUnstake({
        address: address as Ref<string>,
        inputValue,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess
      })
    }

    const doReward = async() => {
      await onReward({
        address: address as Ref<string>,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess
      })
    }


    onMounted(async () => {
      getAprs({
        stackAlertWarning,
      }).then(async (res) => {
        aprs.value.eth = Number(res.eth)
        aprs.value.poly = Number(res.poly)
        loading.value = false
      })
      Web3Libs.value = web3Libs();
      fetchContractsData({
        address: address as Ref<string>,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs
      })
    })

    return {
      loading,
      activeTabStakeChange,
      activeTabStake,
      aprs,
      rewards,
      polyStaked,
      polyUnstaked,
      refStakeIcon,
      refUnStakeIcon,
      refYupRewardsIcon,
      refWalletIcon,
      inputValue,
      address,
      poolShare,
      doConnect,
      doStake,
      doUnstake,
      doReward
    }
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
