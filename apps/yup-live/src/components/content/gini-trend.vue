<template>
  <!-- :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :hoverable="isHoverable"
      :loading="isLoading"
      :focusable="isFocusable"
      :mobile-cards="hasMobileCards" -->

  <div class="bg-color table-list w-full mb-4 m-auto">
    <DangLoader v-if="isDataLoading" />
    <div v-else>
      <template v-if="!apiError">
        <p class="p-2">Gini Recent trend:</p>
      </template>
    </div>
    <ChartD3
      :key="`${giniTrend.length}-${gradient.toString()}`"
      svgWidth="900"
      svgHeight="510"
      :gradient="gradient"
      :chartData="giniTrend"
      :my="-30"
      :mx="40"
      :maxPoint="1"
    />

    <div class="mt-2">
      <button
        type="button"
        class="inline-flex items-center rounded-lg opacity-60 bg-gray-700 hover:bg-gray-500 px-4 py-2 text-white m-2"
        @click="dwJson()"
      >
        <FileDownloadIcon class="m-1" />
        <span class="font-bold"
          >Download JSON for this period for top 100 users</span
        >
      </button>
    </div>

    <div
      v-if="apiError && !isDataLoading"
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
  </div>
</template>

<script setup lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from "components/vote-list/loader.vue";
import { useMainStore } from "@/store/main";
import ChartD3 from "@/components/content/chart-d3.vue";
import { exportFile } from "@/utils";
import FileDownloadIcon from 'icons/src/fileDownload.vue'


import {
  onMounted,
  ref,
  watch,
  onUnmounted,
  Ref,
} from "vue";

 
    const API_BASE = import.meta.env.VITE_YUP_API_BASE;

    const weekText = ["Last Week"];
    for (let i = 2; i <= 12; i++) {
      weekText.push(`${i} Weeks Ago`);
    }

    const apiError = ref(false);
    const isDataLoading = ref(false);
    const store = useMainStore();
    const timePeriod = ref(1);
    const giniTrend: Ref<Array<Record<string, unknown>>> = ref([]);
    const lightGradient = [
      "#0f53b5",
      "#0d52b6",
      "#0a4aa7",
      "#094090",
      "#052c65",
      "#03275d",
    ];
    const darkGradient = [
      "#4af759",
      "#38e647",
      "#2dd03b",
      "#1db62b",
      "#169a23",
      "#096c13",
    ];
    const gradient = ref(store.theme === "dark" ? darkGradient : lightGradient);

    const iconsColor = ref(store.theme === "dark" ? "#ccc" : "#020201");
 

    const getGiniData = async () => {
      const giniDataReqP = [];

      for (let i = 1; i <= 11; i++) {
        giniDataReqP.push(fetch(`${API_BASE}/metrics/gini-index/week?week=${i}`));
      }

      const giniDataReq = await Promise.all(giniDataReqP);
      if (giniDataReq.some((r) => r.status !== 200)) {
        apiError.value = true;
        isDataLoading.value = false;
        throw new Error(`At least one request failed`);
      }

      const giniRaw = await Promise.all(giniDataReq.map((r) => r.json()));
      let int = 0;
      giniTrend.value = giniRaw.map((r) => {
        int++;
        const date = new Date(Date.now() - 7 * 8.64e7 * (int + 1));
        return {
          date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          value: Number(Number(r.gini).toFixed(4)),
        };
      });
      apiError.value = false;
    };

    const loadGiniData = async () => {
      isDataLoading.value = true;
      await getGiniData();
      isDataLoading.value = false;
    };

    const dwJson = async () => {
      if (!giniTrend.value) {
        await getGiniData();
      }
      exportFile(`Gini Trend.json`, JSON.stringify(giniTrend.value, null, 2), "json");
    };

    store.$subscribe(() => {
      if (store.theme === "dark") {
        iconsColor.value = "#ccc";
      } else {
        iconsColor.value = "#020201";
      }
    });

    watch(timePeriod, () => {
      loadGiniData();
    });

    onMounted(async () => {
      loadGiniData();
    });

    onUnmounted(() => {
      // do nothing
    });

</script>

<style lang="scss">
.myArea {
  fill: url(#area-gradient);
  stroke-width: 0px;
}
.d3-component {
  overflow: overlay;
  svg {
    margin: auto;
  }
}
</style>
