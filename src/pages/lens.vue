<template>
  <br />
  <!-- <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color page-stake w-full mb-4 flex flex-col">
      <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">Lens Test</h2>
      <CustomButton :icon="refLensIcon" text="Auth Test" size="large" class="m-auto my-4" @click="onLens" />
      <CustomButton :icon="refLensIcon" text="Unfollow Test" size="large" class="m-auto my-4" @click="onUnfollow" />
    </div>
  </div> -->
</template>

<script lang="ts">
// import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
// import { useHead, HeadObject } from '@vueuse/head'
// // import DangLoader from '@/components/content/vote-list/loader.vue'
// import LensIcon from '@/components/content/icons/lens.vue'
// import CustomButton from '@/components/functional/customButton.vue'
// // import { getPolyContractAddresses } from '@yupio/contract-addresses'
// import { useMainStore } from '@/store/main'
// import { providerOptions } from '@/utils/evm'
// import W3Modal from 'web3modal'
// import { stackAlertSuccess, stackAlertWarning } from '@/store/alertStore'

// const refLensIcon = LensIcon

/*
query Challenge {
  challenge(request: { address: "0xdfd7D26fd33473F475b57556118F8251464a24eb" }) {
    text
  }
}
*/

// const POLY_RPC = import.meta.env.VITE_POLYGON_RPC
// const ethers = import('ethers')
// const HISTORIC_REWARDS_ENDPOINT = 'https://yup-lp-historic-rewards.deno.dev'

// const lensGraphQl = 'https://api.lens.dev'

// import { useMainStore } from '@/store/main'
// export default defineComponent({
//   name: 'LensTest',
//   components: {
//     CustomButton
//   },
//   setup() {
//     // const RW_API_BASE = 'https://rewards-manager.yup.io'
//     const loading = ref(true)
//     const activeTab = ref('0') as Ref<string>
//     const activeTabStake = ref('0') as Ref<string>
//     const aprs = ref({
//       poly: 0,
//       eth: 0
//     }) as Ref<Record<string, number>>
//     const rewards = ref(0)
//     const polyStaked = ref(0)
//     const polyUnstaked = ref(0)
//     const ethStaked = ref(0)
//     const ethUnstaked = ref(0)
//     const store = useMainStore()
//     const inputValue = ref('0')
//     const historicETHReward = ref(0)
//     const historicPolyReward = ref(0)
//     const w3Modal = new W3Modal({
//       network: 'polygon', // optional
//       cacheProvider: true, // optional
//       providerOptions, // required
//       theme: store.theme
//     })
//     // let rewardRateEth = 0
//     // let rewardRatePoly = 0
//     // let totalStakeEth = 0
//     // let totalStakePoly = 0
//     // let rewardsEth = 0
//     // let rewardsPoly = 0
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let ethersLib: any
//     // let ethersProvider
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let userProvider: any

//     const siteData = reactive({
//       title: ``,
//       description: ``
//     })

//     onUnmounted(() => {
//       // do nothing
//     })

//     useHead({
//       title: computed(() => siteData.title),
//       description: computed(() => siteData.description)
//     } as unknown as Ref<HeadObject>)

//     // const getAprs = async () => {
//     //   const req1 = fetch(`${RW_API_BASE}/aprs/eth`)
//     //   const req2 = fetch(`${RW_API_BASE}/aprs/poly`)
//     //   const [eth, poly] = await Promise.all([req1, req2])
//     //   const aprs = {} as Record<string, string>
//     //   aprs.eth = Number(await eth.text()).toFixed(3)
//     //   aprs.poly = Number(await poly.text()).toFixed(3)
//     //   console.log(aprs)
//     //   return aprs
//     // }

//     const prepareForTransaction = async () => {
//       if (!userProvider) {
//         try {
//           const inst = await w3Modal.connect()
//           ethersLib = await ethers
//           userProvider = new ethersLib.providers.Web3Provider(inst)
//         } catch {
//           stackAlertWarning('User rejected connection')
//           return false
//         }
//       }
//       const { chainId } = await userProvider.getNetwork()
//       if (chainId !== 137) {
//         stackAlertWarning(`You are on wrong network(${chainId}), please switchto polygon(137)`)
//         return false
//       }
//       return true
//     }

//     const onLens = async () => {
//       const req = await fetch(`${lensGraphQl}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: `query Challenge {
//   challenge(request: { address: "0x50cca5ed8b4455fbe316785269fc82500b67fd48" }) {
//     text
//   }
// }`
//         })
//       })
//       if (req.ok) {
//         const {
//           data: {
//             challenge: { text }
//           }
//         } = await req.json()
//         await prepareForTransaction()
//         const signer = await userProvider.getSigner()
//         let signature
//         try {
//           signature = await signer.signMessage(text)
//         } catch (error) {
//           return
//         }
//         if (signature) {
//           const req = await fetch(`${lensGraphQl}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               query: `mutation Authenticate {
//   authenticate(request: {
//     address: "0x50cca5ed8b4455fbe316785269fc82500b67fd48",
//     signature: "${signature}"
//   }) {
//     accessToken
//     refreshToken
//   }
// }`
//             })
//           })

//           if (req.ok) {
//             const {
//               data: {
//                 authenticate: { accessToken, refreshToken }
//               }
//             } = await req.json()
//             localStorage.setItem('lensAuthToken', accessToken)
//             localStorage.setItem('lensRefreshToken', refreshToken)
//             stackAlertSuccess('auth set')
//           }
//         }
//       }
//     }

//     const onUnfollow = async () => {
//       {
//         const req = await fetch(`${lensGraphQl}`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', 'x-access-token': 'Bearer ' + localStorage.getItem('lensAuthToken') },
//           body: JSON.stringify({
//             query: `mutation ProxyAction($request: ProxyActionRequest!) {\n  proxyAction(request: $request)\n}`,
//             operationName: 'ProxyAction',
//             variables: {
//               request: {
//                 follow: {
//                   freeFollow: {
//                     profileId: '0xd4d7'
//                   }
//                 }
//               }
//             }
//           })
//         })
//         if (req.ok) {
//           stackAlertSuccess('follow ok')
//         }
//       }
//     }

// const startNumer = async (rate: number) => {
//   setTimeout(() => {
//     rewards.value += rate
//     startNumer(rate)
//   }, 400) as unknown as number
// }

// const onStake = async (chain: string) => {
//   if (!(await prepareForTransaction())) {
//     return
//   }

//   try {
//     const signer = await userProvider.getSigner()
//     let contractLP
//     let contractRewards
//     let approveAddress
//     if (chain === 'poly') {
//       approveAddress = POLY_LIQUIDITY_REWARDS
//       contractLP = new ethersLib.Contract(POLY_UNI_LP_TOKEN, uniPoolPABI, signer)
//       contractRewards = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
//     } else {
//       approveAddress = ETH_LIQUIDITY_REWARDS
//       contractLP = new ethersLib.Contract(ETH_UNI_LP_TOKEN, uniPoolPABI, signer)
//       contractRewards = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
//     }
//     const amount = ethersLib.utils.parseEther(inputValue.value.toString())
//     await contractLP.approve(approveAddress, amount)
//     await contractRewards.stake(amount)
//     stackAlertSuccess(`You staked ${inputValue.value} LPT successfuly`)
//   } catch {
//     stackAlertWarning('User rejected or tx failed')
//   }
// }

// const onUnstake = async (chain: string) => {
//   if (!(await prepareForTransaction())) {
//     return
//   }

//   try {
//     const signer = await userProvider.getSigner()
//     let contractRewards
//     let willSusbstractEth = 0
//     let willSusbstractPoly = 0
//     if (chain === 'poly') {
//       contractRewards = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
//       willSusbstractPoly = Number(inputValue.value)
//     } else {
//       contractRewards = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
//       willSusbstractEth -= Number(inputValue.value)
//     }
//     await contractRewards.unstake(ethersLib.utils.parseEther(inputValue.value.toString()))
//     if (willSusbstractEth > 0) {
//       ethStaked.value -= willSusbstractEth
//     }
//     if (willSusbstractPoly > 0) {
//       ethStaked.value -= willSusbstractPoly
//     }
//     stackAlertSuccess(`You unstaked ${inputValue.value} LPT successfuly`)
//   } catch {
//     stackAlertWarning('User rejected or tx failed')
//   }
// }

// const onReward = async () => {
//   if (!(await prepareForTransaction())) {
//     return
//   }

//   try {
//     const signer = await userProvider.getSigner()
//     signer.get

//     if (rewardsEth > 0) {
//       const contractRewardsEth = new ethersLib.Contract(POLY_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
//       await contractRewardsEth.getReward()
//     }
//     if (rewardsPoly > 0) {
//       const contractRewardsPoly = new ethersLib.Contract(ETH_LIQUIDITY_REWARDS, yupRewardsPABI, signer)
//       await contractRewardsPoly.getReward()
//     }
//     if (rewardsEth > 0 || rewardsPoly > 0) {
//       stackAlertSuccess(`You collected a reward of ${rewardsEth + rewardsPoly}`)
//     } else {
//       stackAlertWarning("You don't have anything to collect")
//     }
//   } catch {
//     stackAlertWarning('User rejected the transaction')
//   }
// }

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

// onMounted(async () => {
//   getAprs().then(async (res) => {
//     console.log(res)
//     aprs.value.eth = Number(res.eth)
//     aprs.value.poly = Number(res.poly)
//     loading.value = false
//   })
//   ethers.then(async (lib) => {
//     ethersLib = lib.ethers
//     // ethersProvider = new ethersLib.providers.JsonRpcProvider(POLY_RPC)
//     // const utils = ethersLib.utils
//     let address = localStorage.getItem('address')
//     if (!address && w3Modal.cachedProvider) {
//       userProvider = new ethersLib.providers.Web3Provider(await w3Modal.connect())
//       address = await userProvider.getSigner().getAddress()
//     }
//     if (address) {
//       getHistoricRewards(address)
//     }
//   })
//     })

//     return {
//       loading,
//       activeTab,
//       activeTabStake,
//       aprs,
//       rewards,
//       polyStaked,
//       polyUnstaked,
//       ethStaked,
//       ethUnstaked,
//       refLensIcon,
//       onLens,
//       inputValue,
//       historicETHReward,
//       historicPolyReward,
//       onUnfollow
//     }
//   }
// })
</script>

<style lang="scss">
// .thinSBox {
//   border: 1px solid #181818;
//   padding: 2rem;
//   margin: 1rem;
// }

// .notBLine {
//   border-right: 2px solid dimgrey;
//   opacity: 0.5;
// }

// .page-stake {
//   min-height: calc(100vh - 2rem);

//   .nothead {
//     position: sticky;
//     text-orientation: upright;
//     writing-mode: vertical-lr;
//     transform: translateX(-1400%);
//     transform: translate(-1400%, 6rem);
//     height: 0;
//   }

//   .imgNotRadius {
//     border-radius: 0.6rem;
//     box-shadow: 3px 4px 5px 0px rgb(88 88 88 / 66%);
//   }

//   .o-tabs__nav {
//     overflow-y: hidden;
//   }

//   .o-tabs__nav-item-default {
//     outline: 0;
//     width: 100%;
//     margin: 0;
//     padding: 0;
//     border: 1px solid transparent;
//     background-color: transparent;
//     align-items: center;
//     line-height: 1.5;
//     font-size: 1.15rem;
//     border-bottom-color: var(--color-text-faded2);
//     border-bottom-style: solid;
//     border-bottom-width: 0.15rem;
//     display: flex;
//     justify-content: center;
//     margin-bottom: -1px;
//     padding: 1rem 1rem;
//     vertical-align: top;
//     cursor: pointer;
//     text-decoration: none;
//   }

//   .o-tabs__nav-item-default--active {
//     border-bottom-color: var(--glassTxt);
//     color: var(--glassTxt);
//     border-bottom-width: 0.28rem;
//   }

//   .o-tabs__content {
//     display: flex;
//     align-items: center;
//   }

//   .o-tab-item__content {
//     display: contents;
//   }
// }

// .rewardsNumber {
//   color: var(--stake-counter);
//   display: block;
//   font-size: calc(1rem + 2vh);
//   position: relative;
//   animation: 2s numanim infinite;
//   padding: 1rem;
//   transition: all 1s ease-in;
//   height: 6rem;
// }

// @keyframes numanim {
//   0% {
//     font-size: calc(1rem + 2vh);
//     font-weight: 0;
//   }
//   50% {
//     font-size: calc(1rem + 2.1vh);
//     font-weight: 800;
//   }
//   100% {
//     font-size: calc(1rem + 2vh);
//     font-weight: 0;
//   }
// }
</style>