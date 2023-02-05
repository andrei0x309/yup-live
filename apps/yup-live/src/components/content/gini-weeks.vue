<template>
  <!-- :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :hoverable="isHoverable"
      :loading="isLoading"
      :focusable="isFocusable"
      :mobile-cards="hasMobileCards" -->

  <div class="bg-color table-list w-full mb-4 m-auto">
    <div class="control">
      <o-radio
        v-for="(wText, i) in weekText"
        :key="i"
        v-model="timePeriod"
        :native-value="i + 1"
        >{{ wText.controlDate }}</o-radio
      >
    </div>
    <DangLoader v-if="isDataLoading" class="min-h-[80vh]" :unset="true" />
      <p class="p-2">Gini Index For all users that made more than 5 YUP/Week</p>
      <p class="p-4 bold">{{ giniIndex }}</p>
      <p class="p-2 text-[1.3rem] mb-4">Population Aproximation</p>
      <p class="p-2 text-[1.2rem] mb-4">Date interval: {{ weekText[timePeriod].displayDate  }}</p>
      <div class="mt-2">
        <div :key="timePeriod" ref="graphRef" class="d3-component mb-4"></div>
        <button
          type="button"
          class="inline-flex items-center rounded-lg opacity-60 bg-gray-700 hover:bg-gray-500 px-4 py-2 text-white m-2"
          @click="dwJson()"
        >
          <FileDownloadIcon class="m-1" />
          <span class="font-medium font-bold"
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

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from "components/vote-list/loader.vue";
import { useMainStore } from "@/store/main";
import * as d3 from "d3";
import { interpolateRainbow } from "d3-scale-chromatic";
import FileDownloadIcon from "@/components/content/icons/fileDownload.vue";
import { exportFile } from "@/utils";

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  watch,
  onUnmounted,
  Ref,
} from "vue";

export default defineComponent({
  name: "GiniWeeks",
  components: { DangLoader, FileDownloadIcon },
  setup() {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE;
    // const API_BASE = "http://localhost:4001"

    const makeDateString = (dateStart: Date, dateEnd: Date) => ({
      controlDate: `D:${dateStart.getUTCDate()} M:${
        dateStart.getUTCMonth() + 1
      } - D:${dateEnd.getUTCDate()} M:${dateEnd.getUTCMonth() + 1}`,
      displayDate: `Period: ${dateStart.toDateString()} - ${dateEnd.toDateString()}`,
    })
      

    const weekText = [makeDateString(new Date(), new Date(Date.now() - 7 * 8.64e7))];
    for (let i = 1; i <= 11; i++) {
      weekText.push(
        makeDateString(
          new Date(Date.now() - 7 * 8.64e7 * i),
          new Date(Date.now() - 7 * 8.64e7 * (i + 1))
        )
      );
    }

    const apiError = ref(false);
    const isDataLoading = ref(false);
    const store = useMainStore();
    const timePeriod = ref(1);
    const tableTimePeriod = ref("loading...");
    const giniIndex = ref(0);
    const graphRef = (ref(null) as unknown) as Ref<HTMLElement>;

    const iconsColor = ref(store.theme === "dark" ? "#ccc" : "#020201");

    const data: Ref<Record<string, string | number | boolean>[]> = ref([]);

    const getGiniData = async () => {
      const req1Promise = fetch(
        `${API_BASE}/metrics/gini-index/week?week=${timePeriod.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );

      const req2Promise = fetch(
        `${API_BASE}/metrics/lorenz-curve/week?week=${timePeriod.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );

      const [req1, req2] = await Promise.all([req1Promise, req2Promise]);

      if (!req1.ok || !req2.ok) {
        apiError.value = true;
        isDataLoading.value = false;
        throw new Error(
          `Request failed with status req1=${req1.status} req2=${req2.status}`
        );
      }

      const [giniData, lorenzData] = await Promise.all([req1.json(), req2.json()]);
      apiError.value = false;
      return { giniData, lorenzData };
    };

    const makeGraphPop = (
      data:
        | unknown[]
        | Iterable<unknown>
        | d3.ValueFn<SVGGElement, unknown, unknown[] | Iterable<unknown>>
    ) => {

      const width = 400;
      const height = 180;

      const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);

      const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const fillScale = d3.scaleSequential(interpolateRainbow);

      const svg = d3
        .select(graphRef.value)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);

      svg
        .append("g")
        .attr(
          "transform",
          `translate(43, 151), scale(0.8, 0.8)`
        )
        .call(xAxis);
      svg.append("g").attr("transform", `translate(40, 5), scale(0.8, 0.8)`).call(yAxis);

      svg
        .append("g")
        .attr("stroke", "#777")
        .attr("stroke-opacity", 0.1)
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(((d as unknown) as { x: number }).x))
        .attr("cy", (d) => yScale(((d as unknown) as { y: number }).y))
        .attr("fill", (d) => fillScale(((d as unknown) as { y: number }).y))
        .attr("r", 1.3)
        .attr(
          "transform",
          `translate(45, 3), scale(0.8, 0.8)`
        )
    };

    const loadGiniData = async () => {
      isDataLoading.value = true;
      const { giniData, lorenzData } = await getGiniData();
      giniIndex.value = giniData.gini;
      makeGraphPop(lorenzData.pcurve);
      isDataLoading.value = false;
    };

    const dwJson = async () => {
      await getGiniData();
      const { lorenzData } = await getGiniData();
      exportFile(`Gini Lorenz.json`, JSON.stringify(lorenzData.pcurve, null, 2), "json");
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

    return {
      data,
      iconsColor,
      tableTimePeriod,
      timePeriod,
      giniIndex,
      weekText,
      isDataLoading,
      graphRef,
      apiError,
      dwJson,
    };
  },
});
</script>

<style lang="scss">
.d3-component {
  overflow: overlay;
  svg {
    margin: auto;
  }
}
.control {
  text-align: left;
  padding: 2rem;
  font-size: 0.9rem;
  // color: #dfbe04;

  .o-radio {
    padding: 1rem;

    .o-radio__check {
      margin-right: 0.2rem;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWw6c3BhY2U9J3ByZXNlcnZlJyB4bWxuczpzZXJpZj0naHR0cDovL3d3dy5zZXJpZi5jb20vJyBzdHlsZT0nZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Jz48ZyB0cmFuc2Zvcm09J21hdHJpeCg0LjM4NTQ0LDAsMCw0LjM4NTQ0LC05NC40MzM2LC01OC45ODc2KSc+PHBhdGggZD0nTTMyLjkzNSwxMy42NzlDMzkuMTAyLDEzLjY3OSA0NC4xMDgsMTguNjg1IDQ0LjEwOCwyNC44NTJDNDQuMTA4LDMxLjAxOSAzOS4xMDIsMzYuMDI1IDMyLjkzNSwzNi4wMjVDMjYuNzY4LDM2LjAyNSAyMS43NjEsMzEuMDE5IDIxLjc2MSwyNC44NTJDMjEuNzYxLDE4LjY4NSAyNi43NjgsMTMuNjc5IDMyLjkzNSwxMy42NzlaTTMyLjc5OCwxNy4wNUMzNy4xMDUsMTcuMDUgNDAuNjAxLDIwLjU0NiA0MC42MDEsMjQuODUyQzQwLjYwMSwyOS4xNTggMzcuMTA1LDMyLjY1NSAzMi43OTgsMzIuNjU1QzI4LjQ5MiwzMi42NTUgMjQuOTk2LDI5LjE1OCAyNC45OTYsMjQuODUyQzI0Ljk5NiwyMC41NDYgMjguNDkyLDE3LjA1IDMyLjc5OCwxNy4wNVonIHN0eWxlPSdmaWxsOiNkZmJlMDQ7Jy8+PGNpcmNsZSBjeD0nMzIuODQnIGN5PScyNC44JyByPSc3LjknIHN0eWxlPSdmaWxsOnRyYW5zcGFyZW50OycvPjwvZz48L3N2Zz4=");
    }

    .o-radio__check--checked {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWw6c3BhY2U9J3ByZXNlcnZlJyB4bWxuczpzZXJpZj0naHR0cDovL3d3dy5zZXJpZi5jb20vJyBzdHlsZT0nZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Jz48ZyB0cmFuc2Zvcm09J21hdHJpeCgxMC4xMDMyLDAsMCwxMC4xMDMyLC0yNTUuMDY4LC0zMTMuMjk4KSc+PGNpcmNsZSBjeD0nMzAuMTk1JyBjeT0nMzUuOTU5JyByPSc0Ljg1JyBzdHlsZT0nZmlsbDojZGZiZTA0OycvPjwvZz48L3N2Zz4=");
    }
  }

  label {
    top: 0.2rem;

    .o-switch__check {
      background-color: var(--glassBg);
    }
  }
}
</style>
