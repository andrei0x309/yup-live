<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
      <h2>Check YUP Score Details:</h2>
      <div class="flex rounded bg-gray-200 w-max-[30rem] mx-auto my-2">
        <input
          v-model="search"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="0x.... OR name.eth"
        />

        <button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100"
          :class="search.length > 0 ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
          :disabled="search.length == 0 || isDataLoading"
          @click="searchUser"
        >
          check
        </button>
      </div>
      <template v-if="isDataLoading">
        <p>Loading YUP Score Details...</p>
        <DangLoader :unset="true" />
      </template>
      <div v-else class="flex flex-wrap mx-auto mt-6 max-w-[40rem] w-full">
        <div
          class="grid grid-cols-1 lg:grid-cols-1 gap-4 justify-center yup-score w-full"
        >
          <template v-if="yupAccount">
            <div class="grid-missing flex flex-col p-4 glassCard">
              <h2>
                Computed Score <b>{{ yupAccount.data.yup_score.toFixed(3) }}</b>
              </h2>
              <p>
                Next Refresh: <b>{{ yupAccount.data.expiration }}</b>
              </p>
              <p>
                Blacklisted: <b>{{ yupAccount.data.blacklisted ? "Yes" : "No" }}</b>
              </p>
              <p>
                Is score partial?:
                <b>{{ yupAccount.data.score_data.partial ? "Yes" : "No" }}</b>
              </p>
              <hr class="my-2" />
              <h2>Sub - Scores</h2>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>ENS</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.ens.score }}</b>
                </p>
                <p>
                  Count: <b>{{ yupAccount.data.score_data.ens.count }}</b>
                </p>
                <p>
                  Primary: <b>{{ yupAccount.data.score_data.ens.primary }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>Proof of Humanity</h3>
                <p>
                  Registerd:
                  <b>{{ yupAccount.data.score_data?.poh?.registered ? "Yes" : "No" }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>ETH Balance</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.eth_balance.score }}</b>
                </p>
                <p>
                  Balance: <b>{{ yupAccount.data.score_data.eth_balance.balance }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>Polygon Balance</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.polygon_balance.score }}</b>
                </p>
                <p>
                  Balance: <b>{{ yupAccount.data.score_data.polygon_balance.balance }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>NFTs</h3>
                <hr class="my-2" />
                <h4>ETH NFTs</h4>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.eth_nfts.score }}</b>
                </p>
                <hr class="my-2" />
                <h4>Polygon NFTs</h4>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.polygon_nfts.score }}</b>
                </p>
                <hr class="my-2" />
                <h4>Gnosis NFTs</h4>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.gnosis_nfts.score }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>ETH ERC20 Tokens</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.eth_erc20_tokens.score }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>Snapshot</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.snapshot_votes.score }}</b>
                </p>
                <p>
                  Count: <b>{{ yupAccount.data.score_data.snapshot_votes.count }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>ETH TX Count</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.eth_txn_count.score }}</b>
                </p>
                <p>
                  Count: <b>{{ yupAccount.data.score_data.eth_txn_count.count }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>ETH Age</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.eth_age.score }}</b>
                </p>
                <p>
                  Age: <b>{{ yupAccount.data.score_data.eth_age.age }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>ETH Activity</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.eth_activity.score }}</b>
                </p>
                <p>
                  Activity: <b>{{ yupAccount.data.score_data.eth_activity.activity }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>Polygon TX Count</h3>
                <p>
                  Score: <b>{{ yupAccount.data.score_data.poly_txn_count.score }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>Eth Recent Tx</h3>
                <p>
                  Score:
                  <b>{{ yupAccount.data.score_data.recent_eth_transfers.score }}</b>
                </p>
              </div>
              <div class="grid-missing flex flex-col p-4 glassCard">
                <h3>Polygon Recent Tx</h3>
                <p>
                  Score:
                  <b>{{ yupAccount.data.score_data.recent_polygon_transfers.score }}</b>
                </p>
              </div>
            </div>
          </template>
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
import { useRoute } from "vue-router";
import { isValidAddress, formatNumber, truncteEVMAddr } from "shared/src/utils/misc";
import { parseIpfs } from "shared/src/utils/web3/ipfs";
import { stackAlertWarning } from "@/store/alertStore";
import { getYupData, isValidENS } from "shared/src/utils/requests/yup-score";
import type { YUPScoreData } from "shared/src/types/web3/yup-score";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "YUPScore",
  components: {
    DangLoader,
  },
  setup() {
    const route = useRoute();
    const addr = ref((route.params.addr as string) ?? "");
    const search = ref(addr.value);
    const yupAccount = (ref(null) as unknown) as Ref<YUPScoreData>;
    const isDataLoading = ref(false);
    const store = useMainStore();
    const isLoggedIn = ref(store.isLoggedIn);

    store.$subscribe(() => {
      isLoggedIn.value = store.isLoggedIn;
    });

    const siteData = reactive({
      title: `YUP Live - Check YUP SCORE`,
      description: `Find yup score of EVM address`,
    });

    useHead(({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-score.png`,
        },
        {
          name: "description",
          content: computed(() => siteData.description),
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: computed(() => siteData.title),
        },
        {
          name: "og:description",
          content: computed(() => siteData.description),
        },
        {
          name: "og:url",
          content: computed(() => route.fullPath),
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: computed(() => route.fullPath),
        },
        {
          name: "twitter:title",
          content: computed(() => siteData.title),
        },
        {
          name: "twitter:description",
          content: computed(() => siteData.description),
        },
      ],
    } as unknown) as Ref<HeadObject>);

    onUnmounted(() => {
      // do nothing
    });


    const searchUser = async () => {
      if (!isValidAddress(search.value) && !isValidENS(search.value)) {
        stackAlertWarning("Invalid EVM address or ENS name");
        return;
      }
      isDataLoading.value = true;
      yupAccount.value = await getYupData({
          address: search.value,
          apiBase: API_BASE,
          stackAlertWarning
        });
      isDataLoading.value = false;
    };

    onMounted(async () => {
      isDataLoading.value = true;
      if (addr.value) {
        yupAccount.value = await getYupData({
          address: addr.value,
          apiBase: API_BASE,
          stackAlertWarning
        });
      }
      isDataLoading.value = false;
    });

    return {
      yupAccount,
      isDataLoading,
      addr,
      search,
      searchUser,
      isLoggedIn,
      formatNumber,
      truncteEVMAddr,
      parseIpfs,
    };
  },
});
</script>

<style scoped lang="scss">
.table-list {
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0.5rem;
  }

  table {
    margin-top: 2rem;
  }

  table tr td {
    padding-bottom: 0.7rem;
    padding-top: 0.7rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
}
.yup-score {
  // .glassCard {
  //   background: var(--glass-menu-bg);
  //   color: var(--glassTxt);
  //   box-shadow: 0 8px 32px 0 var(--glassShadow);
  //   backdrop-filter: blur(4px);
  //   -webkit-backdrop-filter: blur(4px);
  //   border-radius: 10px;
  //   border: 1px solid rgb(255 255 255 / 12%);
  //   margin: 0.7rem;
  // }

  h3 {
    font-size: 1.15rem;
    font-weight: 500;
    margin: 0.5rem;
  }
}
</style>
