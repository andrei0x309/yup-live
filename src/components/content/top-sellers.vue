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
        <a :href="`https://app.yup.io/${props.row.account}`" rel="nofollow" target="_blank">
          <UserIcon :key="iconsColor" :color="iconsColor" />
          {{ props.row.account }}</a
        >
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
        <o-tooltip v-if="String(props.row.related_accounts_full).length > 40"  :triggers="['click']" :autoClose="['outside', 'escape']" :multiline="true">
          <template #content>
            <div class="inline" style=" font-size: 0.85rem">
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
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import DangLoader from '@/components/content/vote-list/loader.vue'
import UserIcon from '@/components/content/icons/user.vue'
import TokenIcon from '@/components/content/icons/tokenYup.vue'
import ETHIcon from '@/components/content/icons/eth.vue'
import { useMainStore } from '@/store/main'

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
  components: { DangLoader, UserIcon, ETHIcon, TokenIcon },
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

      return (await req.json()).data.map((item: Record<string, string & number>) => {
        return {
          address: item.address,
          yup_sold: item.yup_sold,
          eth_recived: item.eth_recived,
          account: item.account,
          related_accounts:
            (item.related_accounts as string).length > 40 ? `${(item.related_accounts as string).slice(0, 40)}...` : item.related_accounts,
          related_accounts_full: item.related_accounts,
        }
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

    onMounted(async () => {
      getTableData(curPage.value)
    })

    onUnmounted(() => {
      // do nothing
    })

    return { data, isTableLoading, curPage, setCurentPage, iconsColor }
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
