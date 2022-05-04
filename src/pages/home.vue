<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <TokenMetrics />
    <TableNav :key="`table-nav-${pageActive}`" :linkActive="pageActive" />
    <VoteList v-if="pages.default === pageActive" :key="`vote-list-${pageActive}`" :pageNum="pageNum" />
    <Rewards v-if="pages.rewards === pageActive" :key="`rewards-${pageActive}`" :pageNum="pageNum" :type="(type as string)" />
    <Sellers v-if="pages.topSellers === pageActive" :key="`vote-list-${pageActive}`" :pageNum="pageNum" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, reactive, computed, onUnmounted, Ref, watch } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import TokenMetrics from '@/components/content/token-metrics.vue'
import VoteList from '@/components/content/vote-list.vue'
import Sellers from '@/components/content/top-sellers.vue'
import TableNav from '@/components/content/table-nav.vue'
import Rewards from '@/components/content/rewards-earners.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  components: {
    TokenMetrics,
    VoteList,
    Rewards,
    Sellers,
    TableNav
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const pageNum = ref(route.params.pageNo ? Number(route.params.pageNo) : 1)
    const type = ref(route.params.type ? (['week', 'month'].includes(route.params.type as string) ? route.params.type : 'week') : 'week')
    
    const pages = {
      rewards: 'Top Rewards',
      topSellers: 'Top Sellers',
      default: 'Vote List'
    }

    const getPageActive = (path: string) => {
      if (path.startsWith('/rewards')) return pages.rewards
      if (path.startsWith('/sellers')) return pages.topSellers
      return pages.default
    }
    
    
    const pageActive = ref(getPageActive(route.path))

    const siteData = reactive({
      title:  `YUP Live - ${pageActive.value} explorer`,
      description: `Live ${pageActive.value} data for YUP DApp...` 
    })

    const setPageNum = (pageNo: number) => {
      if (pageNo) {
        if (pageNo > 5 || pageNo < 1) {
          router.push({ path: '/error/code/404' })
        } else {
          pageNum.value = pageNo
        }
      }
    }
 
    onMounted(async () => {
      setPageNum(Number(route.params.pageNo))
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    watch(
      () => route.path,
      (newVal) => {
        pageActive.value = getPageActive(newVal)
      }
    )

    return {
      pageNum,
      type,
      pageActive,
      pages
    }
  }
})
</script>

<style lang="scss">
.blinkTxt {
  animation: blink 2s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
.table-list {
  padding: 1rem;
  margin-top: 0.2rem;
  min-height: 18rem;
  color: #1b1b1b;
  font-size: 0.96rem;
  font-weight: bold;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0.2rem 0.5rem 0rem;
  grid-template-columns: 1fr;

  table tr td {
    padding-bottom: 0.7rem;
    padding-top: 0.7rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
}

.tableLoading {
  opacity: 0.4;
}

.pag {
  justify-self: end;
  margin-top: 0.6rem;

  .btn {
    padding: 0.4rem 0.8rem;
    margin: 0.2rem;
    border-radius: 0.2rem;
    background-color: #0202029a;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .btn.active {
    box-shadow: inset 0 0 0.5rem 0.2rem #434343;
  }

  .btn:hover {
    box-shadow: inset 0 0 0.5rem 0.2rem #ebc80080;
  }
}

.hr {
  background: #c98d0b;
  opacity: 0.6;
  margin-top: 0.5rem;
}

html[class='dark'] .table-list {
  color: #d9d9d9;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;

  .o-table__wrapper--mobile tr:not(.o-table__tr--selected) {
    background-color: #1b1b1b;
  }
}

.cat-emojy {
  font-size: 0.8rem;
  top: 0.02rem;
  position: relative;
}
</style>
