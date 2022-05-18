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
        <o-radio v-for="(wText, i) in weekText" :key="i" v-model="timePeriod" :native-value="i+1">{{wText}}</o-radio>
    </div>
    <DangLoader v-if="isDataLoading" />
    <div v-else>
    <template v-if="!apiError">
    <p class="p-2">Gini Index For all users that made more than 5 YUP/Week</p>
    <p class="p-4 bold">{{ giniIndex }}</p>
    <p class="p-2" >Population Aproximation:</p>
    </template>
    </div>
    <div :key="timePeriod" ref="graphRef" class="d3-component" />


    <div v-if="apiError && !isDataLoading" style="max-width: 40rem; margin: auto" class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300">
			<div class="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
				<span class="text-red-500">
					<svg
                         fill="currentColor"
						 viewBox="0 0 20 20"
						 class="h-6 w-6">
						<path
                                fill-rule="evenodd"
							  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							  clip-rule="evenodd"></path>
					</svg>
				</span>
			</div>
			<div class="alert-content ml-4">
				<div class="alert-title font-semibold text-lg text-red-800">
					Error
				</div>
				<div class="alert-description text-sm text-red-600">
					API didn't give any data, maybe API is down or you slected an period that dosen't have data.
				</div>
			</div>
		</div>
    
</div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from '@/components/content/vote-list/loader.vue'
import { useMainStore } from '@/store/main'
import * as d3 from 'd3'
import { interpolateRainbow } from 'd3-scale-chromatic'
import { useGrid } from 'vue-screen'

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  computed,
  watch,
  onUnmounted,
  Ref
} from 'vue'

export default defineComponent({
  name: 'VoteList',
  components: { DangLoader },
  setup() {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    // const API_BASE = "http://localhost:4001"

    const weekText = ['Last Week']
    for(let i = 2; i <= 12; i++) {
      weekText.push(`${i} Weeks Ago`)
    }
    
    const apiError = ref(false)
    const isDataLoading = ref(false)
    const store = useMainStore()
    const timePeriod = ref(1)
    const tableTimePeriod = ref('loading...')
    const giniIndex = ref(0)
    const grid = useGrid('tailwind')
    const initWidth = ref(detWidth())
    const initHeight = ref(detHeight())
    const graphRef = ref(null) as unknown as Ref<HTMLElement>

    function detWidth() {
      return grid['2xl'] ? 1100 : grid['xl'] ? 900 : grid['lg'] ? 650 : grid['md'] ? 550 : 450
    }

    function detHeight() {
      return grid['2xl'] ? 550 : grid['xl'] ? 450 : grid['lg'] ? 300 : grid['md'] ? 200 : 150
    }

    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')

    const data: Ref<Record<string, string | number | boolean>[]> = ref([])

    const svgWidth = computed(() => {
      return String(initWidth.value)
    })

    const svgHeight = computed(() => {
      return String(initHeight.value)
    })

    watch(
      () => grid.breakpoint,
      () => {
        initWidth.value = detWidth()
        initHeight.value = detHeight()
      }
    )

    const getGiniData = async () => {
 
      const req1Promise = fetch(
        `${API_BASE}/metrics/gini-index/week?week=${timePeriod.value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      )

      const req2Promise = fetch(
        `${API_BASE}/metrics/lorenz-curve/week?week=${timePeriod.value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      )

      const [ req1, req2 ] = await Promise.all([req1Promise, req2Promise])

      if (!req1.ok || !req2.ok) {
        apiError.value = true
        isDataLoading.value = false
        throw new Error(`Request failed with status req1=${req1.status} req2=${req2.status}`)
      }
      
      const [ giniData, lorenzData ] = await Promise.all([req1.json(), req2.json()])
      apiError.value = false
      return { giniData, lorenzData }
    }

    const makeGraphPop = (data: unknown[] | Iterable<unknown> | d3.ValueFn<SVGGElement, unknown, unknown[] | Iterable<unknown>>) => {
        
        console.log('g', data)
        
        const margin = { top: 20, right: 20, bottom: 20, left: 30 }
        const width = Number(svgWidth.value) - margin.left - margin.right
        const height = Number(svgHeight.value) + margin.top + margin.bottom

        console.log(height)

        const xScale = d3.scaleLinear()
			.domain([0, 1])
			.range([margin.left, width])

        const yScale = d3.scaleLinear()
			.domain([0, 1])
			.range([height, margin.top])
         
         const xAxis = d3.axisBottom(xScale)
         const yAxis = d3.axisLeft(yScale)

         const fillScale = d3.scaleSequential(interpolateRainbow)

          const svg = d3.select(graphRef.value)
          .append('svg').attr('width', width + height / (margin.right / 2 ))
            .attr('height', height +  height / (margin.top / 2 ))
          
  
  svg.append('g')
  		.attr('transform', `translate(0, ${height + height / (margin.top + margin.bottom)})`)
    	.call(xAxis);
  svg.append('g')
    	.attr('transform', `translate(${margin.left}, 0)`)
    	.call(yAxis);
    
  svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.7)
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", d => xScale((d as unknown as { x: number }).x))
      .attr("cy", d => yScale((d as unknown as { y: number }).y))
  	  .attr('fill', d => fillScale((d as unknown as { y: number }).y))
      .attr("r", 1.5);
    }
 

    const loadGiniData = async () => {
      isDataLoading.value = true
      const {giniData, lorenzData }  = await getGiniData()
      giniIndex.value = giniData.gini
      makeGraphPop(lorenzData.pcurve)
      console.log(giniData)
      console.log(lorenzData)
      isDataLoading.value = false
    }

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
    })

    watch(timePeriod, () => {
      loadGiniData()
    })

    onMounted(async () => {
      loadGiniData()
    })

    onUnmounted(() => {
      // do nothing
    })

    return { data,
     iconsColor, tableTimePeriod,
     timePeriod, giniIndex,
     weekText, isDataLoading,
     graphRef, apiError
     }
  }
})

 
</script>

<style lang="scss">
 .d3-component {
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
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWw6c3BhY2U9J3ByZXNlcnZlJyB4bWxuczpzZXJpZj0naHR0cDovL3d3dy5zZXJpZi5jb20vJyBzdHlsZT0nZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Jz48ZyB0cmFuc2Zvcm09J21hdHJpeCg0LjM4NTQ0LDAsMCw0LjM4NTQ0LC05NC40MzM2LC01OC45ODc2KSc+PHBhdGggZD0nTTMyLjkzNSwxMy42NzlDMzkuMTAyLDEzLjY3OSA0NC4xMDgsMTguNjg1IDQ0LjEwOCwyNC44NTJDNDQuMTA4LDMxLjAxOSAzOS4xMDIsMzYuMDI1IDMyLjkzNSwzNi4wMjVDMjYuNzY4LDM2LjAyNSAyMS43NjEsMzEuMDE5IDIxLjc2MSwyNC44NTJDMjEuNzYxLDE4LjY4NSAyNi43NjgsMTMuNjc5IDMyLjkzNSwxMy42NzlaTTMyLjc5OCwxNy4wNUMzNy4xMDUsMTcuMDUgNDAuNjAxLDIwLjU0NiA0MC42MDEsMjQuODUyQzQwLjYwMSwyOS4xNTggMzcuMTA1LDMyLjY1NSAzMi43OTgsMzIuNjU1QzI4LjQ5MiwzMi42NTUgMjQuOTk2LDI5LjE1OCAyNC45OTYsMjQuODUyQzI0Ljk5NiwyMC41NDYgMjguNDkyLDE3LjA1IDMyLjc5OCwxNy4wNVonIHN0eWxlPSdmaWxsOiNkZmJlMDQ7Jy8+PGNpcmNsZSBjeD0nMzIuODQnIGN5PScyNC44JyByPSc3LjknIHN0eWxlPSdmaWxsOnRyYW5zcGFyZW50OycvPjwvZz48L3N2Zz4=');
    }

    .o-radio__check--checked {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWw6c3BhY2U9J3ByZXNlcnZlJyB4bWxuczpzZXJpZj0naHR0cDovL3d3dy5zZXJpZi5jb20vJyBzdHlsZT0nZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Jz48ZyB0cmFuc2Zvcm09J21hdHJpeCgxMC4xMDMyLDAsMCwxMC4xMDMyLC0yNTUuMDY4LC0zMTMuMjk4KSc+PGNpcmNsZSBjeD0nMzAuMTk1JyBjeT0nMzUuOTU5JyByPSc0Ljg1JyBzdHlsZT0nZmlsbDojZGZiZTA0OycvPjwvZz48L3N2Zz4=');
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
