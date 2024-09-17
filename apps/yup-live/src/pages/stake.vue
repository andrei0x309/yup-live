<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color page-stake w-full mb-4 flex flex-col">
      <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">Staking</h2>
      <template v-if="loading">
        <p class="p-4">Loading staking data</p>
        <DangLoader :unset="true" />
      </template>
      <template v-if="!loading">
        <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">
          YUP staking rewards on polygon have been permanently disabled. As yup moved to
          base layer 2 network.
        </h2>

        <div class="thinSBox flex flex-col justify-center items-center">
          <div v-if="address" class="my-4">
            <p>
              Connected Address: <b>{{ address }}</b>
            </p>
          </div>
          <p>
            If you have staked before on polygon you can use this button to exit staking.
          </p>
          <p>
            Detected staked balance
            <span class="text-[1.2rem]" v-html="polyStaked.toFixed(4)" />
          </p>

          <div class="max-w-30">
            <CustomButton :icon="refUnStakeIcon" text="Exit" @click="doExit()" />
          </div>
        </div>

        <!-- <div v-if="!address" class="my-4">
          If you don't have an yup account to log-in, you can connect using an wallet by pressing the button:
          <CustomButton :icon="refWalletIcon" class="mx-auto my-4" text="Connect" @click="doConnect()" />
        </div>
        <div v-else class="my-4">
        <p>Connected Address: <b>{{address}}</b></p>
        <p v-if="poolShare > 0">Your current pool share: <b>{{ `${poolShare.toFixed(4)}%` }}</b></p>
        </div>

        <o-tabs
          v-model="activeTab"
          :multiline="true"
          :expanded="true"
          type="default"
          position="centred"
          variant="warning"
          navTypeClass="boxed"
          :animated="false"
        >
          
          <o-tab-item value="0">
            <template #header>
              <PolyIcon class="w-6 inline mr-2" />
              <span> Poly </span>
            </template>
            <div class="flex flex-col p-4 thinSBox">
              <div class="flex row">
                <div class="flex flex-col">
                  <YUPPOLY class="w-32 mt-5" />
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
                <p class="p-2 text-left flex items-center">
                  <span class="w-40 inline-block tracking-wide uppercase">Staked<br />amount</span
                  ><span class="text-[1.2rem]" v-html="polyStaked.toFixed(4)" />
                </p>
                <p class="p-2 text-left flex items-center">
                  <span class="w-40 inline-block tracking-wide uppercase">Unstaked<br />amount</span
                  ><span class="text-[1.2rem]" v-html="polyUnstaked.toFixed(4)" />
                </p>
              </div>
              <o-tabs
                v-model="activeTabStake"
                :multiline="true"
                :expanded="true"
                type="default"
                position="centred"
                variant="warning"
                navTypeClass="boxed"
                :animated="false"
              >
                <o-tab-item value="0">
                  <template #header>
                    <StakeIcon class="w-6 inline mr-1" />
                    <span> Stake </span>
                  </template>
                  <NoInput v-model:input="inputValue" :max="polyUnstaked-0.001" />
                  <CustomButton :icon="refStakeIcon" text="Stake" @click="doStake()" />
                </o-tab-item>

                <o-tab-item value="1">
                  <template #header>
                    <NoStakeIcon class="w-6 inline mr-1" />
                    <span> Unstake </span>
                  </template>
                  <NoInput v-model:input="inputValue" :max="polyStaked-0.001" />
                  <CustomButton :icon="refUnStakeIcon" text="Unstake" @click="doUnstake()" />
                </o-tab-item>
              </o-tabs>
            </div>
          </o-tab-item>
        </o-tabs>
        <div v-if="rewards > 0" class="p-4 thinSBox">
          <h2 class="text-[1.4rem] uppercase">Rewards to collect</h2>
          <span class="rewardsNumber">{{ rewards }}</span>
          <CustomButton :icon="refYupRewardsIcon" text="Collect" size="large" class="m-auto my-4" @click="doReward" />
        </div>
        <div v-if="historicETHReward > 0 || historicPolyReward > 0" class="p-4 thinSBox">
          <h2 class="text-[1.4rem] uppercase">Total Historic LP Rewards</h2>
          <ul>
            <li v-if="historicETHReward" class="pt-4">ETH LP Rewards: {{ historicETHReward.toFixed(4) }}</li>
            <li v-if="historicPolyReward" class="pt-4">Poly LP Rewards: {{ historicPolyReward.toFixed(4) }}</li>
          </ul>
        </div> -->
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
import { useHead } from '@unhead/vue'
;
import DangLoader from "components/vote-list/loader.vue";
// import { useRoute } from 'vue-router'
import StakeIcon from "icons/src/stake.vue";
import NoStakeIcon from "icons/src/noStake.vue";
// import YUPPOLY from 'icons/src/yup-poly.vue'
// import PolyIcon from 'icons/src/poly.vue'
// import NoInput from 'components/staking/noInput.vue'
import CustomButton from "components/functional/customButton.vue";
import { TWeb3Libs, web3Libs } from "shared/src/utils/evmTxs";

import { useMainStore } from "@/store/main";
import YUPCollectIcon from "icons/src/yup-collect.vue";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import WalletIcon from "icons/src/walletIcon.vue";
import {
  connect,
  // getAprs,
  onStake,
  onUnstake,
  onExit,
  fetchContractsData,
  onReward,
} from "shared/src/utils/stake";

const refStakeIcon = StakeIcon;
const refUnStakeIcon = NoStakeIcon;
const refYupRewardsIcon = YUPCollectIcon;
const refWalletIcon = WalletIcon;

const BASE_URL = import.meta.env.VITE_BASE_URL;

// import { useMainStore } from '@/store/main'
export default defineComponent({
  name: "Staking",
  components: {
    DangLoader,
    // StakeIcon,
    // NoStakeIcon,
    // YUPPOLY,
    // PolyIcon,
    // NoInput,
    CustomButton,
  },
  setup() {
    const loading = ref(true);
    const activeTab = ref("0") as Ref<string>;
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
    const historicETHReward = ref(0);
    const historicPolyReward = ref(0);
    const poolShare = ref(0);
    const address = ref(localStorage.getItem("address"));

    const Web3Libs = (ref(null) as unknown) as Ref<TWeb3Libs>;

    store.$subscribe(() => {
      address.value = store.userData.address;
    });

    const siteData = reactive({
      title: `Yup Staking`,
      description: `Stake, unstake, collect yup liqudity rewards. And interact with the Yup liquidity rewards contracts.`,
      meta: [
        {
          name: "description",
          content: `Stake, unstake, collect yup liqudity rewards. And interact with the Yup liquidity rewards contracts.`,
        },
        {
          name: "og:image",
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-stake.png`,
        },
      ],
    });

    onUnmounted(() => {
      // do nothing
    });

    useHead({
      title: computed(() => siteData.title).value,
      meta: [
        {
          name: "description",
          content: computed(() => siteData.description).value,
        },
      ],
    });

    // const getHistoricRewards = async (address: string) => {
    //   try {
    //     let historicRewards
    //     try {
    //       historicRewards = localStorage.getItem('historicRewards')
    //       if (historicRewards) {
    //         historicRewards = JSON.parse(historicRewards)
    //         const expireDate = new Date(historicRewards.expire).getTime()
    //         if (expireDate < Date.now()) {
    //           localStorage.removeItem('historicRewards')
    //           getHistoricRewards(address)
    //           return
    //         }
    //       }
    //     } catch {
    //       localStorage.removeItem('historicRewards')
    //     }
    //     if (historicRewards) {
    //       historicETHReward.value = historicRewards?.eth
    //       historicPolyReward.value = historicRewards?.poly
    //       return
    //     }

    //     const reqEth = fetch(HISTORIC_REWARDS_ENDPOINT, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ chain: 'eth', address })
    //     })

    //     const rePoly = fetch(HISTORIC_REWARDS_ENDPOINT, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ chain: 'poly', address })
    //     })

    //     const reqResults = await Promise.all([reqEth, rePoly])
    //     const reqResultsJson = await Promise.all([reqResults[0].json(), reqResults[1].json()])
    //     const ethReward = reqResultsJson[0].data.get_result_by_result_id[0].data.Reward
    //     const polyReward = reqResultsJson[1].data.get_result_by_result_id[0].data.Reward
    //     localStorage.setItem(
    //       'historicRewards',
    //       JSON.stringify({
    //         eth: ethReward,
    //         poly: polyReward,
    //         expire: new Date().getTime() + 60 * 1000 * 120
    //       })
    //     )
    //     historicETHReward.value = ethReward
    //     historicPolyReward.value = polyReward
    //   } catch (e) {
    //     historicETHReward.value = 0
    //     historicPolyReward.value = 0
    //   }
    // }

    // connect, getAprs, onStake, onUnstake

    const doConnect = async () => {
      await connect({
        address: address as Ref<string>,
        loading,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
      });
    };

    const doStake = async () => {
      await onStake({
        address: address as Ref<string>,
        inputValue,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess,
      });
    };

    const doUnstake = async () => {
      await onUnstake({
        address: address as Ref<string>,
        inputValue,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess,
      });
    };

    const doExit = async () => {
      await onExit({
        address: address as Ref<string>,
        inputValue,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess,
      });
    };

    const doReward = async () => {
      await onReward({
        address: address as Ref<string>,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
        stackAlertWarning,
        stackAlertSuccess,
      });
    };

    onMounted(async () => {
      // getAprs({
      //   stackAlertWarning,
      // }).then(async (res) => {
      //   aprs.value.eth = Number(res.eth)
      //   aprs.value.poly = Number(res.poly)
      //   loading.value = false
      // })
      Web3Libs.value = web3Libs();
      fetchContractsData({
        address: address as Ref<string>,
        polyStaked,
        polyUnstaked,
        poolShare,
        rewards,
        Web3Libs,
      });
      loading.value = false;
    });

    return {
      loading,
      activeTab,
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
      historicETHReward,
      historicPolyReward,
      address,
      poolShare,
      doConnect,
      doStake,
      doUnstake,
      doReward,
      doExit,
    };
  },
});
</script>

<style lang="scss">
.thinSBox {
  border: 1px solid #181818;
  padding: 2rem;
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
