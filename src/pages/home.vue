<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <TokenMetrics />
    <TableNav :key="`table-nav-${isRewards}`" :linkActive="isRewards ? 'Top Rewards' : 'Vote List'" />
    <VoteList v-if="!isRewards" :key="`vote-list-${isRewards}`" :pageNum="pageNum" />
    <Rewards v-if="isRewards" :key="`rewards-${isRewards}`" :pageNum="pageNum" :type="(type as string)" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, reactive, computed, onUnmounted, Ref, watch } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import TokenMetrics from '@/components/content/token-metrics.vue'
import VoteList from '@/components/content/vote-list.vue'
import TableNav from '@/components/content/table-nav.vue'
import Rewards from '@/components/content/rewards-earners.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  components: {
    TokenMetrics,
    VoteList,
    Rewards,
    TableNav
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isRewards = ref(route.path.startsWith('/rewards'))
    const pageNum = ref(route.params.pageNo ? Number(route.params.pageNo) : 1)
    const type = ref(route.params.type ? (['week', 'month'].includes(route.params.type as string) ? route.params.type : 'week') : 'week')

    const siteData = reactive({
      title: isRewards.value ? `YUP Live - Rewards explorer` : `YUP Live - Vote explorer`,
      description: isRewards.value ? `Live rewards data for YUP DApp...` : `Live voting data for YUP DApp...`
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

    // const showAlertError = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "error";
    // };

    // const showAlertSuccess = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "success";
    // };

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
        if (newVal.startsWith('/rewards')) {
          isRewards.value = true
        } else {
          isRewards.value = false
        }
      }
    )

    return {
      pageNum,
      type,
      isRewards
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
