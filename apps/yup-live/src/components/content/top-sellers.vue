<template>
  <!-- :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :hoverable="isHoverable"
      :loading="isLoading"
      :focusable="isFocusable"
      :mobile-cards="hasMobileCards" -->

  <div class="bg-color table-list sellers w-full mb-4 m-auto">
    <o-table :data="data" :tableClass="`${isTableLoading ? 'tableLoading' : ''}`" :loading="isTableLoading">
      <o-table-column v-slot="props" field="address" label="Address">
        <div class="inline">
          {{ props.row.address }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="accounts" label="USER">
        <div class="inline">
          <template v-if="props.row.accounts[0] === 'loading...'">
            {{ props.row.accounts[0] }}
          </template>
          <a v-else-if="props.row.accounts !== 'unknown'" :href="`/profile/${props.row.accounts[0]}`" rel="nofollow" target="_blank">
            <UserIcon :key="iconsColor" class="sIcon" :color="iconsColor" />
            {{ props.row.accounts[0] }}
          </a>
          <template v-else>
            <UserIcon :key="iconsColor" class="sIcon" :color="iconsColor" />
            {{ props.row.accounts[0] }}
          </template>
          <span v-if="props.row.accounts.length > 1">
            <o-tooltip v-if="props.row.related_accounts.no > 0" :triggers="['click']" :autoClose="['outside', 'escape']" :multiline="true">
              <template #content>
                <div class="inline" style="font-size: 0.81rem">
                  <p class="p-2">Other accounts asociated with this address:</p>
                  <p v-for="acc of props.row.accounts.slice(1)" :key="acc">{{ acc }}</p>
                </div>
              </template>
              <div role="button" class="inline">&nbsp;<InfoIcon :key="iconsColor" class="sIcon" :color="iconsColor" /></div>
            </o-tooltip>
          </span>
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="yupsold" label="YUP Sold">
        <div class="inline">
          <TokenIcon :key="iconsColor" class="sIcon" :color="iconsColor" />
          {{ Number(props.row.yup_sold).toFixed(2) }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="ethRecived" label="ETH Received">
        <div class="inline">
          <ETHIcon :key="iconsColor" class="sIcon" :color="iconsColor" />
          {{ Number(props.row.eth_recived).toFixed(2) }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="relatedAcc" label="Related Acc">
        <o-tooltip v-if="props.row.related_accounts.no > 0" :triggers="['click']" :autoClose="['outside', 'escape']" :multiline="true">
          <template #content>
            <div class="inline" style="font-size: 0.81rem">
              <p class="p-2">Accounts that have sent/recived yup from this account:</p>
              <p v-for="acc of props.row.related_accounts.items" :key="acc">{{ acc }}</p>
            </div>
          </template>
          <div role="button" class="inline">
            {{ props.row.related_accounts.no }} <InfoIcon :key="iconsColor" class="sIcon" :color="iconsColor" />
          </div>
        </o-tooltip>
        <div v-else class="inline">
          {{ props.row.related_accounts.no }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="relatedAddr" label="Related Addr">
        <o-tooltip v-if="props.row.related_addresses.no > 0" :triggers="['click']" :autoClose="['outside', 'escape']" :multiline="true">
          <template #content>
            <div class="inline" style="font-size: 0.81rem">
              <p class="p-2">Addresses that have sent/recived yup from this account:</p>
              <p v-for="addr of props.row.related_addresses.items" :key="addr">{{ addr }}</p>
            </div>
          </template>
          <div role="button" class="inline">
            {{ props.row.related_addresses.no }} <InfoIcon :key="iconsColor" class="sIcon" :color="iconsColor" />
          </div>
        </o-tooltip>
        <div v-else class="inline">
          {{ props.row.related_addresses.no }}
        </div>
      </o-table-column>

      <template #loading>
        <DangLoader v-if="isTableLoading" />
      </template>
    </o-table>
    <hr class="hr" />
    <div class="pag">
      <p v-if="lastBlockProcesed && blockTime" class="time" style="top: 1rem; right: 20rem">
        <QuickSwapIcon class="sIcon" style="width: 1.14rem" /> QuickSwap sells get processed from time to time, last block processed:
        <b>{{ lastBlockProcesed }}</b> at <b>{{ blockTime }}</b>
      </p>
      <div class="pages">
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
    </div>
    <div class="mt-2">
      <button
        type="button"
        class="inline-flex items-center rounded-lg opacity-60 bg-gray-700 hover:bg-gray-500 px-4 py-2 text-white m-2"
        :disabled="btnLoaders.exportJson"
        @click="dwJson()"
      >
        <BtnSpinner v-if="btnLoaders.exportJson" />
        <FileDownloadIcon class="m-1" />
        <span class="font-medium font-bold">Download JSON for this period for top 100 users</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-lg opacity-60 bg-gray-700 hover:bg-gray-500 px-4 py-2 text-white m-2"
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
import DangLoader from 'components/vote-list/loader.vue'
import UserIcon from 'icons/src/user.vue'
import InfoIcon from 'icons/src/infoIcon.vue'
import { useMainStore } from '@/store/main'
import { exportFile, convertToCSV } from '@/utils'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import TokenIcon from 'icons/src/tokenYup.vue'
import ETHIcon from 'icons/src/eth.vue'
import FileDownloadIcon from 'icons/src/fileDownload.vue'
import QuickSwapIcon from 'icons/src/quickSwap.vue'
import { OTooltip } from '@oruga-ui/oruga-next'

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
  components: { DangLoader, UserIcon, ETHIcon, TokenIcon, FileDownloadIcon, InfoIcon, QuickSwapIcon, BtnSpinner, OTooltip },
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

    const data: Ref<Record<string, string | number | boolean | string[]>[]> = ref([])
    const allSellers: Ref<Record<string, string | number | boolean>[]> = ref([])
    const lastBlockProcesed = ref('')
    const blockTime = ref('')

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
          accounts: ['loading...'],
          related_accounts: 'loading...',
          related_addresses: 'loading...'
        })
      }
      return data
    }

    const prepareSellersObj = (item: Record<string, string | number>) => {
      const relAcc = ((item?.related_accounts ?? '[]') as string)
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .filter((item) => item !== '')
      let relAccProc
      const relAddr = ((item?.related_addresses ?? '[]') as string)
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .filter((item) => item !== '')
      let relAddrProc
      if (relAcc.length > 0) {
        relAccProc = {
          items: relAcc.map((acc) => acc.trim()),
          no: relAcc.length
        }
      } else {
        relAccProc = {
          items: [],
          no: 0
        }
      }
      console.log(relAccProc)

      if (relAddr.length > 0) {
        relAddrProc = {
          items: relAddr.map((acc) => acc.trim()),
          no: relAddr.length
        }
      } else {
        relAddrProc = {
          items: [],
          no: 0
        }
      }

      let accounts = [] as string[]
      const accs = item.account as string
      if (accs.includes(',')) {
        accounts = accs.split(',')
        if (accounts.length > 1) {
          if (accounts.includes('unknown')) {
            accounts.splice(accounts.indexOf('unknown'), 1)
          }
        }
      } else {
        accounts = [accs]
      }
      return {
        address: item.address,
        yup_sold: item.yup_sold,
        eth_recived: item.eth_recived,
        accounts,
        related_accounts: relAccProc,
        related_addresses: relAddrProc
      }
    }

    const getLastBlock = async () => {
      const req = await fetch(`${API_BASE}/get-block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })

      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }

      return (await req.json()).data[0]
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

      const withHeader = [
        {
          address: 'Address',
          yup_sold: 'YUP Sold',
          eth_recived: 'ETH Recived',
          account: 'Account',
          related_accounts: 'Related Accounts'
        },
        ...allSellers.value
      ]

      exportFile(
        `TOP Sellers.csv`,
        convertToCSV(
          withHeader.map((v) => {
            v.account = (v.account as string).replace(/,/gm, ' ')
            v.related_accounts_full = (v.related_accounts_full as string).replace(/,/gm, ' ')
            return {
              address: v.address,
              yup_sold: v.yup_sold,
              eth_recived: v.eth_recived,
              account: v.account,
              related_accounts: v.related_accounts_full,
              related_addresss: v.related_addresss
            }
          })
        ),
        'csv'
      )
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
      getLastBlock().then((res) => {
        lastBlockProcesed.value = res.block
        blockTime.value = res.block_time
      })
    })

    onUnmounted(() => {
      // do nothing
    })

    return { data, isTableLoading, curPage, setCurentPage, iconsColor, dwCSV, dwJson, btnLoaders, lastBlockProcesed, blockTime }
  }
})
</script>

<style lang="scss">
.table-list.sellers {
  font-size: 0.8rem;

  .sIcon {
    position: relative;
    top: -0.1rem;
  }

  .pag {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;

    .time {
      padding-left: 2rem;
      padding-top: 1rem;
    }
  }

  .o-table__th {
    text-align: center;
  }
  .o-table__td {
    text-align: center;
  }
}
</style>
