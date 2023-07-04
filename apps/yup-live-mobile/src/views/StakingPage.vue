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
            <CustomButton class="max-w-[12rem] mx-auto" :icon="refStakeIcon" text="Stake" @click="onStake()" />
          </template>
          <template v-else>
            <NoInput v-model:input="inputValue" :max="polyStaked - 0.001" class="max-w-[22rem] mx-auto" />
            <CustomButton class="max-w-[12rem] mx-auto" :icon="refUnStakeIcon" text="Unstake" @click="onUnstake()" />
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
            @click="onReward"
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
import { getPolyContractAddresses } from "@yupio/contract-addresses";
import { uniPoolPABI } from "shared/src/partial-abis/uni-pool";
import { yupRewardsPABI } from "shared/src/partial-abis/yup-rewards";
import { useMainStore } from "@/store/main";
import YUPCollectIcon from "icons/src/yup-collect.vue";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import WalletIcon from "icons/src/walletIcon.vue";
import HeaderBar from "@/components/template/header-bar.vue";

const refStakeIcon = StakeIcon;
const refUnStakeIcon = NoStakeIcon;
const refYupRewardsIcon = YUPCollectIcon;
const refWalletIcon = WalletIcon;

const POLY_RPC = import.meta.env.VITE_POLYGON_RPC;
// const HISTORIC_REWARDS_ENDPOINT = 'https://yup-lp-historic-rewards.deno.dev'

const providerOptionsProm = import("shared/src/utils/evm");
const web3Mprom = import("web3modal");
const ethers = import("ethers");

const { POLY_LIQUIDITY_REWARDS, POLY_UNI_LP_TOKEN } = getPolyContractAddresses(137);

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
    const RW_API_BASE = "https://rewards-manager.yup.io";
    const loading = ref(true);
    const activeTabStake = ref("0") as Ref<string>;
    const aprs = ref({
      poly: 0,
      eth: 0,
    }) as Ref<Record<string, number>>;
    const rewards = ref(0);
    const polyStaked = ref(0);
    const polyUnstaked = ref(0);
    const store = useMainStore();
    const inputValue = ref("0");
    const poolShare = ref(0);
    const address = ref(store.userData.address);
    let rewardRatePoly = 0;
    let totalStakePoly = 0;
    let rewardsPoly = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ethersLib: any;
    let ethersProvider;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userProvider: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let w3Modal: any;
    let startNumberTimeout = 0;
    let rewardsRate = 0;

    store.$subscribe(() => {
      address.value = store.userData.address;
    });

    const activeTabStakeChange = async (value: any) => {
      activeTabStake.value = value.detail.value;
    };

    onUnmounted(() => {
      // do nothing
    });

    const getAprs = async () => {
      const req1 = fetch(`${RW_API_BASE}/aprs/eth`);
      const req2 = fetch(`${RW_API_BASE}/aprs/poly`);
      const [eth, poly] = await Promise.allSettled([req1, req2]);
      const aprs = {} as Record<string, string>;
      aprs.eth = "0";
      aprs.poly = "0";
      if(eth.status === 'fulfilled') {
        aprs.eth = Number(await eth.value.text()).toFixed(3);
      }
      if(poly.status === 'fulfilled') {
        aprs.poly = Number(await poly.value.text()).toFixed(3);
      }
      if(eth.status === 'rejected' || poly.status === 'rejected') {
        stackAlertWarning('APRs APIs are down right now.')
      }
      return aprs;
    };

    const startNumber = async (rate: number) => {
      startNumberTimeout = (setTimeout(() => {
        rewards.value += rate;
        startNumber(rate);
      }, 400) as unknown) as number;
    };

    const clearStartNumber = () => {
      if (startNumberTimeout && rewardsRate) {
        clearTimeout(startNumberTimeout);
      }
    };

    const prepareForTransaction = async () => {
      if (!userProvider) {
        try {
          const inst = await w3Modal.connect();
          userProvider = new ethersLib.providers.Web3Provider(inst);
        } catch {
          stackAlertWarning("User rejected connection");
          return false;
        }
      }
      const { chainId } = await userProvider.getNetwork();
      if (chainId !== 137) {
        stackAlertWarning(
          `You are on wrong network(${chainId}), please switch to polygon(137)`
        );
        return false;
      }
      return true;
    };

    const onStake = async () => {
      if (!(await prepareForTransaction())) {
        return;
      }

      try {
        const signer = await userProvider.getSigner();
        const approveAddress = POLY_LIQUIDITY_REWARDS;
        const contractLP = new ethersLib.Contract(POLY_UNI_LP_TOKEN, uniPoolPABI, signer);
        const contractRewards = new ethersLib.Contract(
          POLY_LIQUIDITY_REWARDS,
          yupRewardsPABI,
          signer
        );
        const amount = ethersLib.utils.parseEther(inputValue.value.toString());
        await contractLP.approve(approveAddress, amount);
        await contractRewards.stake(amount);
        stackAlertSuccess(`You staked ${inputValue.value} LPT successfuly`);
        fetchContractsData();
      } catch {
        stackAlertWarning("User rejected or tx failed");
      }
    };

    const onUnstake = async () => {
      if (!(await prepareForTransaction())) {
        return;
      }

      try {
        const signer = await userProvider.getSigner();

        const contractRewards = new ethersLib.Contract(
          POLY_LIQUIDITY_REWARDS,
          yupRewardsPABI,
          signer
        );
        const willSusbstractPoly = Number(inputValue.value);
        await contractRewards.unstake(
          ethersLib.utils.parseEther(inputValue.value.toString())
        );
        if (willSusbstractPoly > 0) {
          polyStaked.value -= willSusbstractPoly;
        }
        stackAlertSuccess(`You unstaked ${inputValue.value} LPT successfuly`);
        fetchContractsData();
      } catch {
        stackAlertWarning("User rejected or tx failed");
      }
    };

    const onReward = async () => {
      if (!(await prepareForTransaction())) {
        return;
      }

      try {
        const signer = await userProvider.getSigner();
        if (rewardsPoly > 0) {
          const contractRewardsPoly = new ethersLib.Contract(
            POLY_LIQUIDITY_REWARDS,
            yupRewardsPABI,
            signer
          );
          await contractRewardsPoly.getReward();
        }
        if (rewardsPoly > 0) {
          stackAlertSuccess(`You collected a reward of ${rewardsPoly}`);
          if (rewardsPoly > 0) {
            clearStartNumber();
            rewards.value = 0;
            rewardsPoly = 0;
            startNumber(rewardsRate);
          }
          fetchContractsData();
        } else {
          stackAlertWarning("You don't have anything to collect");
        }
      } catch {
        stackAlertWarning("User rejected the transaction");
      }
    };

    const fetchContractsData = () => {
      ethers.then(async (lib) => {
        ethersLib = lib.ethers;
        ethersProvider = new ethersLib.providers.JsonRpcProvider(POLY_RPC);
        const UNIContractPoly = new ethersLib.Contract(
          POLY_UNI_LP_TOKEN,
          uniPoolPABI,
          ethersProvider
        );
        const YUPRewardsPoly = new ethersLib.Contract(
          POLY_LIQUIDITY_REWARDS,
          yupRewardsPABI,
          ethersProvider
        );
        const utils = ethersLib.utils;

        if (!address.value && w3Modal.cachedProvider) {
          userProvider = new ethersLib.providers.Web3Provider(await w3Modal.connect());
          address.value = await userProvider.getSigner().getAddress();
        }
        // if (address.value) {
        //   getHistoricRewards(address.value)
        // }

        const arrProm = [
          UNIContractPoly.balanceOf(address.value),
          YUPRewardsPoly.balanceOf(address.value),
          YUPRewardsPoly.earned(address.value),
          YUPRewardsPoly.rewardRate(),
          UNIContractPoly.balanceOf(POLY_LIQUIDITY_REWARDS),
        ];

        Promise.all(arrProm).then((res) => {
          polyUnstaked.value = Number(utils.formatEther(res[0]));
          polyStaked.value = Number(utils.formatEther(res[1]));
          rewardsPoly = Number(utils.formatEther(res[2]));
          rewards.value = rewardsPoly;
          rewardRatePoly = Number(utils.formatEther(res[3]));
          totalStakePoly = Number(utils.formatEther(res[4]));
          rewardsRate = (rewardRatePoly * polyStaked.value) / totalStakePoly;
          startNumber(rewardsRate);
          if (polyStaked.value && totalStakePoly) {
            poolShare.value = (100 * polyStaked.value) / totalStakePoly;
          }
        });
      });
    };

    const connect = async () => {
      if (!userProvider) {
        try {
          const inst = await w3Modal.connect();
          userProvider = new ethersLib.providers.Web3Provider(inst);
        } catch {
          stackAlertWarning("User rejected connection");
          return false;
        }
        address.value = await userProvider.getSigner().getAddress();
        fetchContractsData();
      } else {
        address.value = await userProvider.getSigner().getAddress();
        fetchContractsData();
      }
    };

    onMounted(async () => {
      getAprs().then(async (res) => {
        aprs.value.eth = Number(res.eth);
        aprs.value.poly = Number(res.poly);
        loading.value = false;
      });
      providerOptionsProm.then((pLib) => {
        web3Mprom.then((lib) => {
          const { default: libDefault } = lib;
          w3Modal = new libDefault({
            network: "matic", // optional
            cacheProvider: false, // optional
            providerOptions: pLib.providerOptions, // required
            theme: store.theme,
          });
          fetchContractsData();
        });
      });
    });

    return {
      loading,
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
      onUnstake,
      onStake,
      onReward,
      address,
      connect,
      poolShare,
      activeTabStakeChange,
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
