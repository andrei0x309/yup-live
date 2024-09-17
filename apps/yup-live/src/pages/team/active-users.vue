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
        :data="activeUsers"
        :tableClass="`${isLoadingStats ? 'tableLoading' : ''}`"
        :loading="isLoadingStats"
      >
        <o-table-column field="timestamp" label="Period Interval">
          <DateIcon class="mr-2" />
          <div class="inline">
            {{ periods[timePeriod] }}
          </div>
        </o-table-column>

        <o-table-column v-slot="props" field="number" label="number">
          <div class="inline">
            {{ props.row.number }}
          </div>
          <UserIcon class="ml-2 -mt-1" />
        </o-table-column>

        <template #loading>
          <DangLoader v-if="isLoadingStats" />
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
  </div>
</template>

<script setup lang="ts">
// COMPONENT: active-users
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from "components/vote-list/loader.vue";
import { useMainStore } from "@/store/main";
import UserIcon from "icons/src/user.vue";
import DateIcon from "icons/src/date.vue";
// import BtnSpinner from "icons/src/btnSpinner.vue";
import { getStatsActiveUsers } from "shared/src/utils/requests/team";

import { onMounted, ref } from "vue";
// import type { T_CrossPostEvent } from "shared/src/utils/requests/team";
// import RadarIcon from "icons/src/radar.vue";

const periods = [
  "last day",
  "last 2 days",
  "last 5 days",
  "last 7 days",
  "last 14 days",
  "last 21 days",
  "last 30 days",
  "last 45 days",
  "last 60 days",
];
const periodsInDays = [1, 2, 5, 7, 14, 21, 30, 45, 60];
const timePeriod = ref(0);
const store = useMainStore();
const activeUsers = ref([
  {
    number: 0,
  },
]);

const apiError = ref(false);

const isLoadingStats = ref(false);

const getStatsData = async () => {
  isLoadingStats.value = true;
  const dateStart = new Date(
    Date.now() - periodsInDays[timePeriod.value] * 24 * 60 * 60 * 1000
  ).toISOString();
  const dateEnd = new Date(Date.now()).toISOString();

  const getStatsResult = await getStatsActiveUsers({
    store,
    dateStart,
    dateEnd,
  });

  if (!getStatsResult) {
    isLoadingStats.value = false;
    return;
  }

  activeUsers.value = [
    {
      number: getStatsResult.number,
    },
  ];
  isLoadingStats.value = false;
};

onMounted(async () => {
  getStatsData();
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
