<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color page-claim w-full mb-4 flex flex-col">
      <h2 class="text-[1.3rem] p-6 tracking-wide uppercase">Content rewards claim</h2>
      <template v-if="loading">
        <p class="p-4">Loading rewards claim data</p>
        <DangLoader :unset="true" />
      </template>
      <template v-if="!loading">
        <div v-if="!address" class="my-4">
          If you don't have an yup account you can't claim rewards. Please connect to your
          account.
        </div>
        <div v-else class="my-4">
          <p>
            Connected Address: <b>{{ address }}</b>
          </p>
        </div>
        <div class="p-4 thinSBox">
          <h2 class="text-[1.4rem] uppercase mb-4">Rewards to collect</h2>
          <span class="claimNumber">{{
            rewards > 0 ? rewards + " YUP" : "No rewards to collect, check later"
          }}</span>
          <BtnSpinner v-if="rewardLoading" />
          <CustomButton
            :icon="refYupRewardsIcon"
            text="Collect"
            size="large"
            :class="`m-auto my-4 ${
              rewards <= 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`"
            :disabled="rewardLoading || rewards <= 0"
            @click="doOnReward"
          />

          <CustomButton
            :icon="refYupRewardsIcon"
            text="AddR"
            size="large"
            :class="`m-auto my-4`"
            @click="addReward"
          />
        </div>
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
import { useHead } from "unhead";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from "components/functional/customButton.vue";
import { TWeb3Libs, web3Libs } from "shared/src/utils/evmTxs";
import { useMainStore } from "@/store/main";
import YUPCollectIcon from "icons/src/yup-collect.vue";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import { fetchClaimString, fetchUnclaimedReward, onReward } from "shared/src/utils/claim";
import { prepareForTransaction } from "shared/src/utils/evmTxs";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { fetchWAuth } from "shared/src/utils/auth";

const refYupRewardsIcon = YUPCollectIcon;

const API_BASE = import.meta.env.VITE_YUP_API_BASE;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// import { useMainStore } from '@/store/main'
export default defineComponent({
  name: "Staking",
  components: {
    DangLoader,
    CustomButton,
    BtnSpinner,
  },
  setup() {
    const loading = ref(true);
    const rewardLoading = ref(false);
    const rewards = ref(0);
    const store = useMainStore();
    const address = ref(
      store?.userData?.address || localStorage.getItem("address") || ""
    );

    const Web3Libs = (ref(null) as unknown) as Ref<TWeb3Libs>;

    store.$subscribe(() => {
      address.value = store.userData.address;
    });

    const siteData = reactive({
      title: `Yup Content rewards claim`,
      description: `Interact with the Yup content rewards contracts.`,
      meta: [
        {
          name: "description",
          content: `Interact with the Yup content rewards contracts.`,
        },
        {
          name: "og:image",
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-default.png`,
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

    onMounted(async () => {
      Web3Libs.value = web3Libs();
      rewards.value = (await fetchUnclaimedReward(API_BASE, address.value)).unclaimedYUP;
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

        const claimString = await fetchClaimString(API_BASE, store);
        if (!claimString) {
          stackAlertWarning("Error fetching claim string");
          return;
        }

        const success = await onReward({
          claimString,
          stackAlertSuccess,
          stackAlertWarning,
          Web3Libs,
          rewardLoading,
        });

        if (success) {
          rewards.value = 0;
        }
      } else {
        stackAlertWarning("No rewards to claim");
      }
    };

    const addReward = () => {
      fetchWAuth(
        store,
        API_BASE.replace("api.", "dev.api.") + "/rewards/test/add-rewards",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };

    return {
      loading,
      rewards,
      refYupRewardsIcon,
      address,
      rewardLoading,
      doOnReward,
      addReward,
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
