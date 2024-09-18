<template>
  <div class="bg-color table-list w-full mb-4 m-auto">
    <div class="control flex flex-row items-center">
      <div class="block">
        <label class="text-[1.1rem] mr-4">Select time period:</label>
        <o-radio
          v-for="(wText, i) in periodsInDays"
          :key="i"
          v-model="timePeriod"
          :native-value="i"
          @change="getStatsData"
          >{{ periods[i] }}</o-radio
        >
      </div>
    </div>
    <template v-if="!apiError">
      <h2 class="text-lg mt-4 mb-1 font-medium title-font">Cross Post Events Stats</h2>
      <hr class="hr" />

      <o-table
        :data="failStats"
        :tableClass="`${isLoadingStats ? 'tableLoading' : ''}`"
        :loading="isLoadingStats"
      >
        <o-table-column field="timestamp" label="Period Interval">
          <div class="inline">
            {{ periods[timePeriod] }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="attepmts" label="attepmts">
          <div class="inline">
            {{ props.row.attempts }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="success" label="succeeded">
          <div class="inline">
            {{ props.row.attempts - props.row.failed }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="faild" label="failed">
          <div class="inline">
            {{ props.row.failed }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="failRate" label="failRate">
          <div class="inline">
            {{ props.row.failRate }}
          </div>
        </o-table-column>

        <template #loading>
          <DangLoader v-if="isLoadingStats" />
        </template>
      </o-table>

      <h2 class="text-lg mt-4 mb-1 font-medium title-font">Failed Cross Post Events</h2>
      <hr class="hr" />

      <o-table
        :data="failList"
        :tableClass="`${isLoadingFailed ? 'tableLoading' : ''}`"
        :loading="isLoadingFailed"
      >
        <o-table-column v-slot="props" field="platforms" label="Platforms Sent">
          <div class="inline">
            {{ props.row.platforms }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="platformsFalied" label="Platforms Failed">
          <div class="inline">
            {{ props.row.platformsFailed }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="user" label="User">
          <router-link :to="`/profile/${props.row.owner}`" class="hover:scale-110">
            <div class="inline">
              <UserIcon />
              {{ props.row.owner }}
            </div>
          </router-link>
        </o-table-column>

        <o-table-column v-slot="props" field="occuredAt" label="Occured At">
          <div class="inline">
            <DateIcon />
            {{ props.row.createdAt }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="details" label="Details">
          <div class="inline hover:scale-110">
            <RadarIcon class="w-3 inline" />
            <button @click="showDetails(props.row)">Details</button>
          </div>
        </o-table-column>

        <template #loading>
          <DangLoader v-if="isLoadingFailed" />
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center">
            <div class="text-2xl font-semibold text-gray-500">No data</div>
            <div class="text-sm text-gray-400">No failed cross post events</div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-center">
            <o-button
              class="acbtn"
              :loading="isLoadingFailed"
              :icon="isLoadingFailed ? BtnSpinner : ''"
              :icon-right="true"
              @click="getFailList((failList as any)?.length)"
              >Load more</o-button
            >
          </div>
        </template>
      </o-table>
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
import UserIcon from "icons/src/user.vue";
import DateIcon from "icons/src/date.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { getStats, listFailed } from "shared/src/utils/requests/team";

import { onMounted, ref, Ref } from "vue";
import type { T_CrossPostEvent } from "shared/src/utils/requests/team";
import RadarIcon from "icons/src/radar.vue";

const periods = ["last day", "last 7 days", "last 14 days", "last 30 days"];
const periodsInDays = [1, 7, 14, 30];
const timePeriod = ref(0);
const store = useMainStore();
const failStats = ref([
  {
    failed: 0,
    attempts: 0,
    failRate: 0,
  },
]);

const failList = ref([]) as Ref<T_CrossPostEvent[]>;
const fullStatusModal = ref(false);
const apiError = ref(false);
const fullStatus = ref("");

const isLoadingFailed = ref(false);
const isLoadingStats = ref(false);

const getStatsData = async () => {
  isLoadingStats.value = true;
  const dateStart = new Date(
    Date.now() - periodsInDays[timePeriod.value] * 24 * 60 * 60 * 1000
  ).toISOString();
  const dateEnd = new Date(Date.now()).toISOString();

  const getStatsResult = await getStats({
    store,
    dateStart,
    dateEnd,
  });

  if (!getStatsResult) {
    isLoadingStats.value = false;
    return;
  }

  failStats.value = [
    {
      failed: getStatsResult.failed,
      attempts: getStatsResult.attempts,
      failRate: getStatsResult.failRate,
    },
  ];
  isLoadingStats.value = false;
};

const getFailList = async (offset: 0) => {
  isLoadingFailed.value = true;
  const getFailListResult = await listFailed({
    store,
    offset,
  });

  if (!getFailListResult) {
    isLoadingFailed.value = false;
    apiError.value = true;
    return;
  }

  failList.value = [...failList.value, ...getFailListResult];
  isLoadingFailed.value = false;
};

const showDetails = (row: T_CrossPostEvent) => {
  fullStatus.value = row.fullStatus || "";
  fullStatusModal.value = true;
};

onMounted(async () => {
  getStatsData();
  getFailList(0);
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
