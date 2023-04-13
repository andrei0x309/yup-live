<template>
  <ion-page>
    <HeaderBar text="YupScore" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
        <div class="bg-color search-controls w-full">
          <form @submit.prevent="() => searchUser()">
            <ion-searchbar
              v-model="search"
              :animated="true"
              enterkeyhint="search"
              placeholder="0x.... or name.eth"
            ></ion-searchbar>
          </form>
          <ion-button class="search-btn" fill="clear" @click="() => searchUser()"
            >Check Score</ion-button
          >
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
                    <b>{{
                      yupAccount.data.score_data?.poh?.registered ? "Yes" : "No"
                    }}</b>
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
                    Balance:
                    <b>{{ yupAccount.data.score_data.polygon_balance.balance }}</b>
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
                    Activity:
                    <b>{{ yupAccount.data.score_data.eth_activity.activity }}</b>
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

      <ion-loading
        :key="`loading-${isDataLoading}`"
        :is-open="isDataLoading"
        message="Loading..."
        :duration="3000"
        @didDismiss="isDataLoading = false"
      >
      </ion-loading>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonSearchbar,
//   IonRadioGroup,
//   IonRadio,
//   IonSelectOption,
//   IonSelect,
  IonButton,
//   IonLabel,
  IonLoading,
//   IonSegment,
//   IonSegmentButton,
} from "@ionic/vue";
import HeaderBar from "@/components/template/header-bar.vue";
import {
  stackAlertWarning,
} from "@/store/alertStore";
import {
  onMounted,
  defineComponent,
  Ref,
  ref,
} from "vue";
import DangLoader from "components/vote-list/loader.vue";
import { useRoute } from "vue-router";
import { isValidAddress, formatNumber, truncteEVMAddr } from "shared/src/utils/misc";
import { parseIpfs } from "shared/src/utils/web3/ipfs";
import { getYupData, isValidENS } from "shared/src/utils/requests/yup-score";
import type { YUPScoreData } from "shared/src/types/web3/yup-score";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "TokenMetrics",
  components: {
    IonPage,
    IonContent,
    IonSearchbar,
    HeaderBar,
    // IonRadioGroup,
    // IonRadio,
    // IonSelectOption,
    // IonSelect,
    IonButton,
    // InfScroll,
    // LineLoader,
    // Post,
    // IonLabel,
    IonLoading,
    DangLoader
    // IonSegment,
    // IonSegmentButton,
    // AvatarBtn,
  },
  setup() {
    const route = useRoute();
    const addr = ref((route.params.addr as string) ?? "");
    const search = ref(addr.value);
    const yupAccount = (ref(null) as unknown) as Ref<YUPScoreData>;
    const isDataLoading = ref(false);

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
      formatNumber,
      truncteEVMAddr,
      parseIpfs,
    };
  },
});
</script>

<style scoped lang="scss">
.search-controls {
  margin-top: 0.5rem;
  min-height: 7.4rem;
  color: #818181;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0 0 20rem rgba(0, 0, 0, 0.623);
  grid-template-columns: 1fr;

  h2 {
    display: inline-block;
  }

  .box {
    border: 1px solid #222;
    padding: 1rem;
  }
}

.fadeIn {
  animation: 1s linear fadein;
}
.search-btn {
  color: rgba(240, 248, 255, 0.829);
  background-color: rgba(240, 248, 255, 0.021);
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
}
</style>
