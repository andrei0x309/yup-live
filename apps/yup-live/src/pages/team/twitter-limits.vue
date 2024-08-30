<template>
  <div class="bg-color table-list w-full mb-4 m-auto">
    <div class="control flex flex-row items-center">
      <div class="block">
        <label class="text-[1.1rem] mr-4">Select time period:</label>
        <o-radio
          v-for="(wText, i) in options"
          :key="i"
          v-model="activeOption"
          :native-value="i"
          @change="getStatsData"
          >{{ options[i] }}</o-radio
        >
      </div>
    </div>
    <template v-if="!apiError">
      <h2 v-if="activeOption === 0" class="text-lg mt-4 mb-1 font-medium title-font">
        Non-pro users that hit limit
      </h2>
      <h2 v-else class="text-lg mt-4 mb-1 font-medium title-font">
        Top pro users consumers
      </h2>
      <hr class="hr" />

      <o-table
        v-if="foundResults"
        :data="rareLimit"
        :tableClass="`${isLoadingStats ? 'tableLoading' : ''}`"
        :loading="isLoadingStats"
      >
        <o-table-column v-slot="props" field="postCount" label="Porst Count">
          <div class="inline">
            {{ props.row.postCount }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="user" label="User">
          <router-link :to="`/profile/${props.row._id}`" class="hover:scale-110">
            <div class="inline">
              <UserIcon />
              {{ props.row._id }}
            </div>
          </router-link>
        </o-table-column>

        <o-table-column v-slot="props" field="createdAt" label="Created At">
          <div class="inline">
            {{ props.row.createdAt }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="expiration" label="Expire At">
          <div class="inline">
            {{ props.row.expiration }}
          </div>
        </o-table-column>

        <template #loading>
          <DangLoader v-if="isLoadingStats" />
        </template>
      </o-table>
      <div v-else class="text-center text-[#e0e0e0]">
        No user limits found to match the criteria
      </div>
    </template>
    <template v-else>
      <div
        style="max-width: 40rem; margin: auto"
        class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300"
      >
        <div
          class="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full"
        >
          <span class="text-red-500">
            <svg fill="currentColor" viewBox="0 0 20 20" class="h-6 w-6">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </div>
        <div class="alert-content ml-4">
          <div class="alert-title font-semibold text-lg text-red-800">Error</div>
          <div class="alert-description text-sm text-red-600">
            API didn't give any data, maybe API is down or you selected a period that
            doesn't have data.
          </div>
        </div>
      </div>
    </template>

    <o-modal v-model:active="fullStatusModal" contentClass="modalDefault">
      <template v-if="fullStatusModal">
        <div class="add-channel m-4">
          <h2 class="text-lg mb text-[#e0e0e0] font-medium title-font">Full Status</h2>
          <textarea
            class="mb-4 rounded p-2 text-[#e0e0e0] bg-stone-800 border-purple-800 border-2"
            rows="30"
            cols="50"
            :value="fullStatus"
            readonly
          ></textarea>
          <o-button @click="fullStatusModal = false">Close</o-button>
        </div>
      </template>
    </o-modal>
  </div>
</template>

<script setup lang="ts">
// COMPONENT: cross-post-events
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from "components/vote-list/loader.vue";
import { useMainStore } from "@/store/main";
import {
  getTwitterRateLimitHitters,
  getTwitterRateLimitTopProConsumers,
} from "shared/src/utils/requests/team";

import { onMounted, ref, Ref } from "vue";
import type { T_TW_RateLimit } from "shared/src/utils/requests/team";
import UserIcon from "icons/src/user.vue";

const options = ["non pro that hit the limit", "pro top consumers"];
const activeOption = ref(0);
const store = useMainStore();

const rareLimit = ref([]) as Ref<T_TW_RateLimit[]>;
const fullStatusModal = ref(false);
const apiError = ref(false);
const fullStatus = ref("");
const foundResults = ref(true);

const isLoadingStats = ref(false);

const getHittersData = async () => {
  foundResults.value = true;
  isLoadingStats.value = true;
  rareLimit.value =
    (await getTwitterRateLimitHitters({
      store,
      limit: 100,
    })) || [];
  if (rareLimit?.value?.length === 0) {
    foundResults.value = false;
  }
  isLoadingStats.value = false;
};

const getTopConsumersData = async () => {
  foundResults.value = true;
  isLoadingStats.value = true;
  rareLimit.value =
    (await getTwitterRateLimitTopProConsumers({
      store,
      limit: 100,
    })) || [];
  if (rareLimit?.value?.length === 0) {
    foundResults.value = false;
  }
  isLoadingStats.value = false;
};

const getStatsData = async () => {
  if (activeOption.value === 0) {
    await getHittersData();
  } else {
    await getTopConsumersData();
  }
};

onMounted(async () => {
  await getHittersData();
});
</script>

<style lang="scss">
.table-list {
  .o-table__th {
    text-align: center;
  }
  .o-table__td {
    text-align: center;
  }
}
.control {
  text-align: left;
  padding: 2rem;
  font-size: 0.9rem;
  // color: #dfbe04;

  label {
    top: 0.2rem;
  }
}
.acbtn {
  opacity: 0.85;
}
</style>
