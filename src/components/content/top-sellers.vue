<template>
  <!-- :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :hoverable="isHoverable"
      :loading="isLoading"
      :focusable="isFocusable"
      :mobile-cards="hasMobileCards" -->

  <div class="bg-color table-list w-full mb-4 m-auto">
    <o-table :data="data" :tableClass="`${isTableLoading ? 'tableLoading' : ''}`" :loading="isTableLoading">
      <o-table-column v-slot="props" field="address" label="Address">
        <div class="inline">
          {{ props.row.address }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="account" label="USER">
        <div v-if="props.row.account === 'unknown'" class="inline">
          <UserIcon :key="iconsColor" :color="iconsColor" />
          {{ props.row.account }}
        </div>
        <div v-else class="inline">
          <a v-if="!props.row.account.includes(',')" :href="`https://app.yup.io/account/${props.row.account}`" rel="nofollow" target="_blank">
            <UserIcon :key="iconsColor" :color="iconsColor" />
            {{ props.row.account }}</a
          >
          <a
            v-for="acc of props.row.account.split(',')"
            v-else
            :key="acc"
            :href="`https://app.yup.io/${acc}`"
            rel="nofollow"
            target="_blank"
          >
            <UserIcon :key="iconsColor" :color="iconsColor" />
            {{ acc }}</a
          >
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="yupsold" label="YUP Sold">
        <div class="inline">
          <TokenIcon :key="iconsColor" :color="iconsColor" />
          {{ Number(props.row.yup_sold).toFixed(2) }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="ethRecived" label="ETH Received">
        <div class="inline">
          <ETHIcon :key="iconsColor" :color="iconsColor" />
          {{ Number(props.row.eth_recived).toFixed(2) }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="relatedAcc" label="Related Accounts">
        <o-tooltip
          v-if="String(props.row.related_accounts_full).length > 40"
          :triggers="['click']"
          :autoClose="['outside', 'escape']"
          :multiline="true"
        >
          <template #content>
            <div class="inline" style="font-size: 0.85rem">
              {{ props.row.related_accounts_full }}
            </div>
          </template>
          <div role="button" class="inline">
            {{ props.row.related_accounts }}
          </div>
        </o-tooltip>
        <div v-else class="inline">
          {{ props.row.related_accounts }}
        </div>
      </o-table-column>

      <template #loading>
        <DangLoader v-if="isTableLoading" />
      </template>
    </o-table>
    <hr class="hr" />
    <div class="pag">
      <router-link :to="`/sellers/page/${curPage - 1 > 0 ? curPage - 1 : 1}`">
        <o-button :class="`btn`" @click="curPage - 1 > 0 ? setCurentPage(curPage - 1) : null">⏴</o-button>
      </router-link>
      <router-link v-for="i in 5" :key="i" :to="`/sellers/page/${i}`">
        <o-button :class="`btn ${i === curPage ? 'active' : ''}`" @click="setCurentPage(i)">{{ i }}</o-button>
      </router-link>
      <router-link :to="`/sellers/page/${curPage + 1 > 4 ? 5 : curPage + 1}`">
        <o-button :class="`btn`" @click="curPage + 1 > 5 ? null : setCurentPage(curPage + 1)">⏵</o-button>
      </router-link>
    </div>
    <div class="mt-2">
      <button
        type="button"
        class="acbtn inline-flex items-center rounded-lg bg-yellow-500 hover:bg-pink-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.exportJson"
        @click="dwJson()"
      >
        <BtnSpinner v-if="btnLoaders.exportJson" />
        <FileDownloadIcon class="m-1" />
        <span class="font-medium font-bold">Download JSON for this period for top 100 users</span>
      </button>
      <button
        type="button"
        class="acbtn inline-flex items-center rounded-lg bg-yellow-500 hover:bg-pink-500 hover:to-yellow-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.exportCSV"
        @click="dwCSV()"
      >
        <BtnSpinner v-if="btnLoaders.exportCSV" />
        <FileDownloadIcon class="m-1" />
        <span class="font-medium font-bold">Download CSV for this period for top 100 users</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from '@/components/content/vote-list/loader.vue'
import UserIcon from '@/components/content/icons/user.vue'
import TokenIcon from '@/components/content/icons/tokenYup.vue'
import ETHIcon from '@/components/content/icons/eth.vue'
import FileDownloadIcon from '@/components/content/icons/fileDownload.vue'
import { useMainStore } from '@/store/main'
import { exportFile, convertToCSV } from '@/utils'

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  //   computed,
  onUnmounted,
  Ref
} from 'vue'

export default defineComponent({
  name: 'TopSellers',
  components: { DangLoader, UserIcon, ETHIcon, TokenIcon, FileDownloadIcon },
  props: {
    pageNum: {
      required: true,
      type: Number
    }
  },
  setup(props) {
    const API_BASE = `https://deno-yup-sellers-edge-fn.deno.dev`
    const isTableLoading = ref(false)
    const curPage = ref(Number(props.pageNum))
    const store = useMainStore()

    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')

    const data: Ref<Record<string, string | number | boolean>[]> = ref([])
    const allSellers: Ref<Record<string, string | number | boolean>[]> = ref([])

    const btnLoaders = ref({
      exportJson: false,
      exportCSV: false
    })

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
          address: 'loading...',
          yup_sold: 'loading...',
          eth_recived: 'loading...',
          account: 'loading...',
          related_accounts: 'loading...'
        })
      }
      return data
    }

    const prepareSellersObj = (item: Record<string, string | number>) => {
      let relAcc = item?.related_accounts ?? '[]'
      relAcc = (relAcc as string).length > 40 ? (relAcc as string).slice(0, 40) + '...' : relAcc
      return {
        address: item.address,
        yup_sold: item.yup_sold,
        eth_recived: item.eth_recived,
        account: item.account,
        related_accounts: relAcc,
        related_accounts_full: item.related_accounts
      }
    }

    const getSellers = async (page: number) => {
      if (!page || page < 1) {
        page = 1
      }

      const req = await fetch(`${API_BASE}/get-sellers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          page
        })
      })

      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }

      return (await req.json()).data.map(prepareSellersObj)
    }

    const getAllTopSellers = async () => {
      return new Promise<void>((resolve) => {
        const reqsPromises = []

        for (let i = 1; i <= 5; i++) {
          reqsPromises.push(getSellers(i))
        }
        Promise.all(reqsPromises).then((res) => {
          allSellers.value = res.reduce((acc, cur) => {
            return [...acc, ...cur]
          }, [])
          resolve()
        })
      })
    }

    const getTableData = async (pageNum: number) => {
      isTableLoading.value = true
      data.value = makeLoadingData()
      data.value = await getSellers(pageNum)
      isTableLoading.value = false
    }

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
    })

    const dwCSV = async () => {
      btnLoaders.value.exportCSV = true
      if (allSellers.value.length === 0) {
        await getAllTopSellers()
      }

      const withHeader = [{
        address: 'Address',
        yup_sold: 'YUP Sold',
        eth_recived: 'ETH Recived',
        account: 'Account',
        related_accounts: 'Related Accounts'
      }, ...allSellers.value]

      exportFile(`TOP Sellers.csv`, convertToCSV(withHeader.map( v => {
        v.account = (v.account as string).replace(/,/gm, ' ')
        v.related_accounts_full = (v.related_accounts_full as string).replace(/,/gm, ' ')
        return {
          address: v.address,
          yup_sold: v.yup_sold,
          eth_recived: v.eth_recived,
          account: v.account,
          related_accounts: v.related_accounts_full
        }
      })), 'csv')
      btnLoaders.value.exportCSV = false
    }

    const dwJson = async () => {
      btnLoaders.value.exportJson = true
      if (allSellers.value.length === 0) {
        await getAllTopSellers()
      }
      exportFile(`TOP Sellers.json`, JSON.stringify(allSellers.value, null, 2), 'json')
      btnLoaders.value.exportJson = false
    }

    onMounted(async () => {
      getTableData(curPage.value)
    })

    onUnmounted(() => {
      // do nothing
    })

    return { data, isTableLoading, curPage, setCurentPage, iconsColor, dwCSV, dwJson, btnLoaders }
  }
})
</script>

<style lang="scss">
.table-list {
  font-size: 0.9rem;
  .o-table__th {
    text-align: center;
  }
  .o-table__td {
    text-align: center;
  }

  .o-tip__content {
    word-break: break-all;
    min-width: 15rem;
    background-color: var(--glassBg);
    color: aliceblue;
    border-radius: 4px;
    padding: 0.5rem;
  }
}
</style>
