<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color page-stake w-full mb-4 flex flex-col">
      <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">Staking</h2>
      <template v-if="loading">
        <p class="p-4">Loading staking data</p>
        <DangLoader :unset="true" />
      </template>
      <template v-if="!loading">
        <div v-if="!address" class="my-4">
          If you don't have an yup account to log-in, you can connect using an wallet by pressing the button:
          <CustomButton :icon="refWalletIcon" class="mx-auto my-4" text="Connect" @click="connect()" />
        </div>
        <div v-else class="my-4">
        Connected Address: <b>{{address}}</b>
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
          <o-tab-item value="1">
            <template #header>
              <ETHIcon class="w-6 inline mr-1" />
              <span>ETH</span>
            </template>
            <div class="flex flex-col p-4 thinSBox">
              <div class="flex">
                <div class="flex flex-col">
                  <YUPETH class="w-30 mt-5" />
                </div>
                <div class="flex flex-col text-[1.2rem] p-6 mb-4">
                  <p class="p-2">Stake YUP-ETH LP Tokens</p>
                  <p class="p-2">Uniswap V2 • Ethereum</p>
                  <p class="p-2">
                    [ APR: <span class="text-[1.3rem]">{{ aprs.eth }}%</span> ]
                  </p>
                </div>
              </div>
              <div class="p-2 mr-4">
                <p class="p-2 text-left flex items-center">
                  <span class="w-40 inline-block tracking-wide uppercase">Staked<br />amount</span
                  ><span class="text-[1.2rem]" v-html="ethStaked.toFixed(4)" />
                </p>
                <p class="p-2 text-left flex items-center">
                  <span class="w-40 inline-block tracking-wide uppercase">Unstaked<br />amount</span
                  ><span class="text-[1.2rem]" v-html="ethUnstaked.toFixed(4)" />
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
                  <NoInput v-model:input="inputValue" :max="ethUnstaked-0.001" />
                  <CustomButton :icon="refStakeIcon" text="Stake" @click="onStake('eth')" />
                </o-tab-item>

                <o-tab-item value="1">
                  <template #header>
                    <NoStakeIcon class="w-6 inline mr-1" />
                    <span> Unstake </span>
                  </template>
                  <NoInput v-model:input="inputValue" :max="ethStaked-0.001" />
                  <CustomButton :icon="refUnStakeIcon" text="Unstake" @click="onUnstake('eth')" />
                </o-tab-item>
              </o-tabs>
            </div>
          </o-tab-item>

          <o-tab-item value="0">
            <template #header>
              <PolyIcon class="w-6 inline mr-2" />
              <span> Poly </span>
            </template>
            <div class="flex flex-col p-4 thinSBox">
              <div class="flex row">
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
                  <CustomButton :icon="refStakeIcon" text="Stake" @click="onStake('poly')" />
                </o-tab-item>

                <o-tab-item value="1">
                  <template #header>
                    <NoStakeIcon class="w-6 inline mr-1" />
                    <span> Unstake </span>
                  </template>
                  <NoInput v-model:input="inputValue" :max="polyStaked-0.001" />
                  <CustomButton :icon="refUnStakeIcon" text="Unstake" @click="onUnstake('poly')" />
                </o-tab-item>
              </o-tabs>
            </div>
          </o-tab-item>
        </o-tabs>
        <div v-if="rewards > 0" class="p-4 thinSBox">
          <h2 class="text-[1.4rem] uppercase">Rewards to collect</h2>
          <span class="rewardsNumber">{{ rewards }}</span>
          <CustomButton :icon="refYupRewardsIcon" text="Collect" size="large" class="m-auto my-4" @click="onReward" />
        </div>
        <div v-if="historicETHReward > 0 || historicPolyReward > 0" class="p-4 thinSBox">
          <h2 class="text-[1.4rem] uppercase">Total Historic LP Rewards</h2>
          <ul>
            <li v-if="historicETHReward" class="pt-4">ETH LP Rewards: {{ historicETHReward.toFixed(4) }}</li>
            <li v-if="historicPolyReward" class="pt-4">Poly LP Rewards: {{ historicPolyReward.toFixed(4) }}</li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from '@/components/content/vote-list/loader.vue'
// import { useRoute } from 'vue-router'
import StakeIcon from '@/components/content/icons/stake.vue'
import NoStakeIcon from '@/components/content/icons/noStake.vue'
import YUPETH from '@/components/content/icons/yup-eth.vue'
import YUPPOLY from '@/components/content/icons/yup-poly.vue'
import ETHIcon from '@/components/content/icons/eth.vue'
import PolyIcon from '@/components/content/icons/poly.vue'
import NoInput from '@/components/content/staking/noInput.vue'
import CustomButton from '@/components/functional/customButton.vue'
import { getPolyContractAddresses } from '@yupio/contract-addresses'
import { uniPoolPABI } from '@/partial-abis/uni-pool'
import { yupRewardsPABI } from '@/partial-abis/yup-rewards'
import { useMainStore } from '@/store/main'
import YUPCollectIcon from '@/components/content/icons/yup-collect.vue'
import { stackAlertSuccess, stackAlertWarning } from '@/store/alertStore'
import WalletIcon from '@/components/content/icons/walletIcon.vue'


const refStakeIcon = StakeIcon
const refUnStakeIcon = NoStakeIcon
const refYupRewardsIcon = YUPCollectIcon
const refWalletIcon = WalletIcon

const POLY_RPC = import.meta.env.VITE_POLYGON_RPC
const HISTORIC_REWARDS_ENDPOINT = 'https://yup-lp-historic-rewards.deno.dev'

const providerOptionsProm = import('@/utils/evm')
const web3Mprom = import('web3modal')
const ethers = import('ethers')

const { POLY_LIQUIDITY_REWARDS, POLY_UNI_LP_TOKEN, ETH_UNI_LP_TOKEN, ETH_LIQUIDITY_REWARDS } = getPolyContractAddresses(137)

// import { useMainStore } from '@/store/main'
export default defineComponent({
  name: 'Staking',
  components: {
    DangLoader,
    StakeIcon,
    NoStakeIcon,
    YUPETH,
    YUPPOLY,
    ETHIcon,
    PolyIcon,
    NoInput,
    CustomButton
  },
  setup() {
    const RW_API_BASE = 'https://rewards-manager.yup.io'
    const loading = ref(true)
    const activeTab = ref('0') as Ref<string>
    const activeTabStake = ref('0') as Ref<string>
    const aprs = ref({
      poly: 0,
      eth: 0
    }) as Ref<Record<string, number>>
    const rewards = ref(0)
    const polyStaked = ref(0)
    const polyUnstaked = ref(0)
    const ethStaked = ref(0)
    const ethUnstaked = ref(0)
    const store = useMainStore()
    const inputValue = ref('0')
    const historicETHReward = ref(0)
    const historicPolyReward = ref(0)
    const address = ref(localStorage.getItem('address'))
    let rewardRateEth = 0
    let rewardRatePoly = 0
    let totalStakeEth = 0
    let totalStakePoly = 0
    let rewardsEth = 0
    let rewardsPoly = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ethersLib: any
    let ethersProvider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userProvider: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let w3Modal: any


    const siteData = reactive({
      title: ``,
      description: ``
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    const getAprs = async () => {
      const req1 = fetch(`${RW_API_BASE}/aprs/eth`)
      const req2 = fetch(`${RW_API_BASE}/aprs/poly`)
      const [eth, poly] = await Promise.all([req1, req2])
      const aprs = {} as Record<string, string>
      aprs.eth = Number(await eth.text()).toFixed(3)
      aprs.poly = Number(await poly.text()).toFixed(3)
      console.log(aprs)
      return aprs
    }

    const startNumer = async (rate: number) => {
      setTimeout(() => {
        rewards.value += rate
        startNumer(rate)
      }, 400) as unknown as number
    }

    const prepareForTransaction = async () => {
      if (!userProvider) {
        try {
          const inst = await w3Modal.connect()
          userProvider = new ethersLib.providers.Web3Provider(inst)
        } catch {
          stackAlertWarning('User rejected connection')
          return false
        }
      }
      const { chainId } = await userProvider.getNetwork()
      if (chainId !== 137) {
        stackAlertWarning(`You are on wrong network(${chainId}), please switch to polygon(137)`)
        return false
      }
      return true
    }

    const onStake = async (chain: string) => {
      if (!(await prepareForTransaction())) {
        return
      }

      try {
        const signer = await userProvider.getSigner()
        let contractLP
        let contractRewards
        let approveAddress
        if (chain === 'poly') {
          approveAddress = POLY_LIQUIDITY_REWARDS
          contractLP = new ethersLib.Contract(POLY_UNI_LP_TOKEN, uniPoolPABI, signer)
          contractRewards = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
        } else {
          approveAddress = ETH_LIQUIDITY_REWARDS
          contractLP = new ethersLib.Contract(ETH_UNI_LP_TOKEN, uniPoolPABI, signer)
          contractRewards = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
        }
        const amount = ethersLib.utils.parseEther(inputValue.value.toString())
        await contractLP.approve(approveAddress, amount)
        await contractRewards.stake(amount)
        stackAlertSuccess(`You staked ${inputValue.value} LPT successfuly`)
        fetchContractsData()
      } catch {
        stackAlertWarning('User rejected or tx failed')
      }
    }

    const onUnstake = async (chain: string) => {
      if (!(await prepareForTransaction())) {
        return
      }

      try {
        const signer = await userProvider.getSigner()
        let contractRewards
        let willSusbstractEth = 0
        let willSusbstractPoly = 0
        if (chain === 'poly') {
          contractRewards = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
          willSusbstractPoly = Number(inputValue.value)
        } else {
          contractRewards = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
          willSusbstractEth -= Number(inputValue.value)
        }
        await contractRewards.unstake(ethersLib.utils.parseEther(inputValue.value.toString()))
        if (willSusbstractEth > 0) {
          ethStaked.value -= willSusbstractEth
        }
        if (willSusbstractPoly > 0) {
          ethStaked.value -= willSusbstractPoly
        }
        stackAlertSuccess(`You unstaked ${inputValue.value} LPT successfuly`)
        fetchContractsData()
      } catch {
        stackAlertWarning('User rejected or tx failed')
      }
    }

    const onReward = async () => {
      if (!(await prepareForTransaction())) {
        return
      }

      try {
        const signer = await userProvider.getSigner()
        if (rewardsEth > 0) {
          const contractRewardsEth = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
          await contractRewardsEth.getReward()
        }
        if (rewardsPoly > 0) {
          const contractRewardsPoly = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
          await contractRewardsPoly.getReward()
        }
        if (rewardsEth > 0 || rewardsPoly > 0) {
          stackAlertSuccess(`You collected a reward of ${rewardsEth + rewardsPoly}`)
          if(rewardsEth > 0) {
            historicETHReward.value += rewardsEth
            rewards.value -= rewardsEth
          }
          if(rewardsPoly > 0){
            historicPolyReward.value += rewardsPoly
            rewards.value -= rewardsPoly
          }
          fetchContractsData()
        } else {
          stackAlertWarning("You don't have anything to collect")
        }
      } catch {
        stackAlertWarning('User rejected the transaction')
      }
    }

    const getHistoricRewards = async (address: string) => {
      try {
        let historicRewards
        try {
          historicRewards = localStorage.getItem('historicRewards')
          if (historicRewards) {
            historicRewards = JSON.parse(historicRewards)
            const expireDate = new Date(historicRewards.expire).getTime()
            if (expireDate < Date.now()) {
              localStorage.removeItem('historicRewards')
              getHistoricRewards(address)
              return
            }
          }
        } catch {
          localStorage.removeItem('historicRewards')
        }
        if (historicRewards) {
          historicETHReward.value = historicRewards?.eth
          historicPolyReward.value = historicRewards?.poly
          return
        }

        const reqEth = fetch(HISTORIC_REWARDS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chain: 'eth', address })
        })

        const rePoly = fetch(HISTORIC_REWARDS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chain: 'poly', address })
        })

        const reqResults = await Promise.all([reqEth, rePoly])
        const reqResultsJson = await Promise.all([reqResults[0].json(), reqResults[1].json()])
        const ethReward = reqResultsJson[0].data.get_result_by_result_id[0].data.Reward
        const polyReward = reqResultsJson[1].data.get_result_by_result_id[0].data.Reward
        localStorage.setItem(
          'historicRewards',
          JSON.stringify({
            eth: ethReward,
            poly: polyReward,
            expire: new Date().getTime() + 60 * 1000 * 120
          })
        )
        historicETHReward.value = ethReward
        historicPolyReward.value = polyReward
      } catch (e) {
        historicETHReward.value = 0
        historicPolyReward.value = 0
      }
    }

    const fetchContractsData = () => {
      ethers.then(async (lib) => {
      ethersLib = lib.ethers
        ethersProvider = new ethersLib.providers.JsonRpcProvider(POLY_RPC)
        const UNIContractETH = new ethersLib.Contract(ETH_UNI_LP_TOKEN, uniPoolPABI, ethersProvider)
        const UNIContractPoly = new ethersLib.Contract(POLY_UNI_LP_TOKEN, uniPoolPABI, ethersProvider)
        const YUPRewardsETH = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, ethersProvider)
        const YUPRewardsPoly = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, ethersProvider)
        const utils = ethersLib.utils

        if (!address.value && w3Modal.cachedProvider) {
          userProvider = new ethersLib.providers.Web3Provider(await w3Modal.connect())
          address.value = await userProvider.getSigner().getAddress()
        }
        if (address.value) {
          getHistoricRewards(address.value)
        }

        const arrProm = [
          UNIContractETH.balanceOf(address.value),
          UNIContractPoly.balanceOf(address.value),
          YUPRewardsETH.balanceOf(address.value),
          YUPRewardsPoly.balanceOf(address.value),
          YUPRewardsETH.earned(address.value),
          YUPRewardsPoly.earned(address.value),
          YUPRewardsETH.rewardRate(),
          YUPRewardsPoly.rewardRate(),
          UNIContractETH.balanceOf(ETH_LIQUIDITY_REWARDS),
          UNIContractPoly.balanceOf(POLY_LIQUIDITY_REWARDS)
        ]

        Promise.all(arrProm).then((res) => {
          ethUnstaked.value = Number(utils.formatEther(res[0]))
          polyUnstaked.value = Number(utils.formatEther(res[1]))
          ethStaked.value = Number(utils.formatEther(res[2]))
          polyStaked.value = Number(utils.formatEther(res[3]))
          rewardsEth = Number(utils.formatEther(res[4]))
          rewardsPoly = Number(utils.formatEther(res[5]))
          rewards.value = rewardsEth + rewardsPoly
          rewardRateEth = Number(utils.formatEther(res[6]))
          rewardRatePoly = Number(utils.formatEther(res[7]))
          totalStakeEth = Number(utils.formatEther(res[8]))
          totalStakePoly = Number(utils.formatEther(res[9]))
          startNumer((rewardRateEth * ethStaked.value) / totalStakeEth + (rewardRatePoly * polyStaked.value) / totalStakePoly)
        })
      })
    }

    
    const connect = async () => {
      if (!userProvider) {
        try {
          const inst = await w3Modal.connect()
          userProvider = new ethersLib.providers.Web3Provider(inst)
        } catch {
          stackAlertWarning('User rejected connection')
          return false
        }
        address.value =  await userProvider.getSigner().getAddress()
        fetchContractsData()
      } else {
        address.value =  await userProvider.getSigner().getAddress()
        fetchContractsData()
      }
    }

    onMounted(async () => {
      getAprs().then(async (res) => {
        aprs.value.eth = Number(res.eth)
        aprs.value.poly = Number(res.poly)
        loading.value = false
      })
      providerOptionsProm.then((pLib) => {
        web3Mprom.then((lib) => {
          const { default: libDefault } = lib
          w3Modal = new libDefault({
            network: 'matic', // optional
            cacheProvider: false, // optional
            providerOptions: pLib.providerOptions, // required
            theme: store.theme
          })
          fetchContractsData()
        })
      })
    })

    return {
      loading,
      activeTab,
      activeTabStake,
      aprs,
      rewards,
      polyStaked,
      polyUnstaked,
      ethStaked,
      ethUnstaked,
      refStakeIcon,
      refUnStakeIcon,
      refYupRewardsIcon,
      refWalletIcon,
      inputValue,
      onUnstake,
      onStake,
      onReward,
      historicETHReward,
      historicPolyReward,
      address,
      connect
    }
  }
})
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