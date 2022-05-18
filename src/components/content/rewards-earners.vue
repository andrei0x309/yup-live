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
      Period Type
      <o-switch :rounded="true" position="right" size="small" variant="warning" @change="changeType(periodType)"
        >&nbsp;&nbsp;{{ periodType === 'week' ? 'Week' : 'Month' }}</o-switch
      >

      <div v-if="periodType === 'week'" class="block">
        <o-radio v-for="(wText, i) in weekText" :key="i" v-model="timePeriod" :native-value="i + 1">{{ wText }}</o-radio>
      </div>
      <div v-else class="block">
        <o-radio v-for="(mText, i) in monthText" :key="i" v-model="timePeriod" :native-value="i + 1">{{ mText }}</o-radio>
      </div>
    </div>
    <template v-if="!apiError">
    <o-table :data="data" :tableClass="`${isTableLoading ? 'tableLoading' : ''}`" :loading="isTableLoading">
      <o-table-column field="timestamp" label="Time Interval">
        <div class="inline">
          <DateIcon :key="iconsColor" :color="iconsColor" />
          {{ tableTimePeriod }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="account" label="USER">
        <a :href="`https://app.yup.io/${props.row.account}`" rel="nofollow" target="_blank">
          <UserIcon :key="iconsColor" :color="iconsColor" />
          {{ props.row.account }}</a
        >
      </o-table-column>

      <o-table-column v-slot="props" field="amount" label="Rewards Amount">
        <div class="inline">
          <TokenIcon :key="iconsColor" :color="iconsColor" />
          {{ Number(props.row.amount).toFixed(2) }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="influence" label="Raw Influence">
        <div class="inline">
          💪
          {{ Number(props.row.influence).toFixed(2) === '0.00' ? 'BANNED' : Number(props.row.influence).toFixed(2) }}
        </div>
      </o-table-column>

      <template #loading>
        <DangLoader v-if="isTableLoading" />
      </template>
    </o-table>
    <hr class="hr" />
    <div class="pag">
      <router-link :to="`/rewards/type/${type}/page/${curPage - 1 > 0 ? curPage - 1 : 1}`">
        <o-button :class="`btn`" @click="curPage - 1 > 0 ? setCurentPage(curPage - 1) : null">⏴</o-button>
      </router-link>
      <router-link v-for="i in 5" :key="i" :to="`/rewards/type/${type}/page/${i}`">
        <o-button :class="`btn ${i === curPage ? 'active' : ''}`" @click="setCurentPage(i)">{{ i }}</o-button>
      </router-link>
      <router-link :to="`/rewards/type/${type}/page/${curPage + 1 > 4 ? 5 : curPage + 1}`">
        <o-button :class="`btn`" @click="curPage + 1 > 5 ? null : setCurentPage(curPage + 1)">⏵</o-button>
      </router-link>
    </div>
    <div class="mt-2">
      <button
        type="button"
        class="acbtn inline-flex items-center rounded-lg bg-yellow-500 hover:bg-pink-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.gini"
        @click="calculateGiniIndex()"
      >
        <BtnSpinner v-if="btnLoaders.gini" />
        <span v-if="giniIndex===0" class="font-medium font-bold">Get Gini for this perioad for all top 100 users</span>
        <span v-else class="font-medium font-bold">Gini Index: {{ giniIndex }}</span>
      </button>
      <button
        type="button"
        class="acbtn inline-flex items-center rounded-lg bg-yellow-500 hover:bg-pink-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.plotPop"
        @click="openGiniDialog()"
      >
        <BtnSpinner v-if="btnLoaders.plotPop" />
        <span class="font-medium font-bold">🗠 Plot population using python</span>
      </button>
      <button
        type="button"
        class="acbtn inline-flex items-center rounded-lg bg-yellow-500 hover:bg-pink-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.exportJson"
        @click="dwJson()"
      >
        <BtnSpinner v-if="btnLoaders.exportJson" />
        <FileDownloadIcon class="m-1" />
        <span class="font-medium font-bold">Download JSON for this period forl all top 100 users</span>
      </button>
      <button
        type="button"
        class="acbtn inline-flex items-center rounded-lg bg-yellow-500 hover:bg-pink-500 hover:to-yellow-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.exportCSV"
        @click="dwCSV()"
      >
        <BtnSpinner v-if="btnLoaders.exportCSV" />
        <FileDownloadIcon  class="m-1" />
        <span class="font-medium font-bold">Download CSV for this period forl all top 100 users</span>
      </button>
    </div>
  </template>
  <template v-else>
   <div style="max-width: 40rem; margin: auto" class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300">
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
					API didn't give any data, maybe API is down or you selected a period that doesn't have data.
				</div>
			</div>
		</div>
  </template>
  </div>
  <o-modal v-model:active="giniDialog" contentClass="pyModal">
       <DangLoader v-if="pyCompNotLoaded" />
      <component :is="!pyCompNotLoaded ? refDynComp : undefined" :data="giniDataValues" />
  </o-modal>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from '@/components/content/vote-list/loader.vue'
import UserIcon from '@/components/content/icons/user.vue'
import DateIcon from '@/components/content/icons/date.vue'
import TokenIcon from '@/components/content/icons/tokenYup.vue'
import BtnSpinner from '@/components/content/icons/btnSpinner.vue'
import FileDownloadIcon from '@/components/content/icons/fileDownload.vue'
import { useMainStore } from '@/store/main'
import { gini, exportFile, convertToCSV } from '@/utils'

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  //   computed,
  watch,
  onUnmounted,
  Ref,
  shallowRef
} from 'vue'

export default defineComponent({
  name: 'VoteList',
  components: { DangLoader, UserIcon, DateIcon, TokenIcon, BtnSpinner, FileDownloadIcon },
  props: {
    pageNum: {
      required: true,
      type: Number
    },
    type: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    // const API_BASE = "http://localhost:4001"

    const weekText = ['Last Week']
    for (let i = 2; i <= 12; i++) {
      weekText.push(`${i} Weeks Ago`)
    }
    const monthText = ['Last Month']
    for (let i = 2; i <= 4; i++) {
      monthText.push(`${i} Months Ago`)
    }

    const isTableLoading = ref(false)
    const curPage = ref(Number(props.pageNum))
    const periodType = ref(props.type)
    const store = useMainStore()
    const timePeriod = ref(1)
    const tableTimePeriod = ref('loading...')
    const giniIndex = ref(0)
    const giniDialog = ref(false)
    const giniData: Ref<Array<unknown>> = ref([])
    const giniDataValues: Ref<Array<number>> = ref([])
    type dComponent = undefined | ReturnType<typeof defineComponent>
    const refDynComp: Ref<dComponent> = shallowRef(undefined)
    const pyCompNotLoaded = ref(true)
    const apiError = ref(false)

    const btnLoaders = ref({
      gini: false,
      exportJson: false,
      exportCSV: false,
      plotPop: false
    })

    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')

    const data: Ref<Record<string, string | number | boolean>[]> = ref([])

    const setCurentPage = (page: number) => {
      if (page !== curPage.value) {
        curPage.value = page
        getTableData(curPage.value)
      }
    }

    const makeLoadingData = () => {
      const data = []
      for (let i = 0; i < 20; i++) {
        data.push({
          account: 'loading...',
          amount: 'loading...',
          influence: 'loading...'
        })
      }
      return data
    }

    const getVoteList = async (page: number) => {
      apiError.value = false
      
      if (!page || page < 1) {
        page = 1
      }

      const req = await fetch(
        `${API_BASE}/metrics/top-earners/${periodType.value}?limit=20&page=${curPage.value}&${periodType.value}=${timePeriod.value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      )

      if (!req.ok) {
        apiError.value = true
        throw new Error(`Request failed with status ${req.status}`)
      }

      return await req.json() || []
    }

    const getGiniData = async () => {
      apiError.value = false
      const reqs = []
      for (let i = 1; i <= 5; i++) {
        reqs.push(
          fetch(`${API_BASE}/metrics/top-earners/${periodType.value}?limit=20&page=${i}&${periodType.value}=${timePeriod.value}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          })
        )
      }
      const req = await Promise.allSettled(reqs)
      const data: Array<Record<string, unknown>> = []
      for (let i = 0; i < req.length; i++) {
        if (req[i].status === 'fulfilled') {
          data.push(...(await (req[i] as unknown as { value: { json: () => [] } }).value.json()))
        } else {
          apiError.value = true
          throw new Error(`Request failed with status ${req[i].status}`)
        }
      }
      return data || []
    }

    const calculateGiniIndex = async () => {
      btnLoaders.value.gini = true
      if (giniData.value.length === 0) {
        giniData.value = await getGiniData()
      }
      giniDataValues.value = giniData.value.map((item) => Number((item as unknown as { amount: string }).amount))
      giniIndex.value = gini(giniDataValues.value)
      btnLoaders.value.gini = false
    }

    const getTableData = async (pageNum: number) => {
      isTableLoading.value = true
      data.value = makeLoadingData()
      let startDate = new Date()
      let endDate = new Date()
      switch (periodType.value) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7 * Number(timePeriod.value))
          endDate.setDate(endDate.getDate() - 7 * (Number(timePeriod.value) - 1))
          break
        case 'month':
          startDate.setDate(startDate.getDate() - 30 * Number(timePeriod.value))
          endDate.setDate(endDate.getDate() - 30 * (Number(timePeriod.value) - 1))
          break
        default:
          break
      }
      tableTimePeriod.value = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      data.value = await getVoteList(pageNum)
      if(data.value.length === 0) {
        apiError.value = true
      }
      isTableLoading.value = false
    }

    const dwCSV = async () => {
      btnLoaders.value.exportCSV = true
      if (giniData.value.length === 0) {
        giniData.value = await getGiniData()
      }
      exportFile(`Rewards ${tableTimePeriod.value}.csv`, convertToCSV(giniData.value), 'csv')
      btnLoaders.value.exportCSV = false
    }

    const dwJson = async () => {
      btnLoaders.value.exportJson = true
      if (giniData.value.length === 0) {
        giniData.value = await getGiniData()
      }
      exportFile(`Rewards ${tableTimePeriod.value}.json`, JSON.stringify(giniData.value, null, 2 ), 'json')
      btnLoaders.value.exportJson = false
    }

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
    })

    const changeType = (type: string) => {
      const dic: Record<string, string> = {
        week: 'month',
        month: 'week'
      }
      if (['week', 'month'].includes(type) && periodType.value === type) {
        periodType.value = dic[type]
        getTableData(1)
      }
    }

    const openGiniDialog = async () => {
      giniDialog.value = true
      btnLoaders.value.plotPop = true
      pyCompNotLoaded.value = true
      if (giniData.value.length === 0) {
        giniData.value = await getGiniData()
      }
      if(giniDataValues.value.length === 0) {
        giniDataValues.value = giniData.value.map((item) => Number((item as unknown as { amount: string }).amount))
      }
      refDynComp.value = (await import('@/components/content/python-curve-modal.vue')).default
      pyCompNotLoaded.value = false
      btnLoaders.value.plotPop = false
    }

    watch(timePeriod, () => {
      giniData.value = []
      giniIndex.value = 0
      getTableData(1)
    })

    onMounted(async () => {
      getTableData(curPage.value)
    })

    onUnmounted(() => {
      // do nothing
    })

    return {
      data,
      isTableLoading,
      curPage,
      setCurentPage,
      weekText,
      monthText,
      giniData,
      refDynComp,
      btnLoaders,
      iconsColor,
      periodType,
      tableTimePeriod,
      calculateGiniIndex,
      pyCompNotLoaded,
      changeType,
      timePeriod,
      dwCSV,
      dwJson,
      giniIndex,
      giniDialog,
      openGiniDialog,
      apiError,
      giniDataValues
    }
  }
})
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
.acbtn {
  opacity: 0.85;
}
.pyModal {
  background: transparent;
  min-width: 60vw;
  max-width: 90vw;
  min-height: 50vh;
  color: var(--textColor);
}
</style>
