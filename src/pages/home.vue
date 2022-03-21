<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <TokenMetrics />
    <VoteList :pageNum="pageNum" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, reactive, computed, onUnmounted, Ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import TokenMetrics from '@/components/content/token-metrics.vue'
import VoteList from '@/components/content/vote-list.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  components: {
    TokenMetrics,
    VoteList
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const pageNum = ref(1)

    const siteData = reactive({
      title: `YUP Live - Vote explorer`,
      description: `Live voting data for YUP DApp...`
    })

    const setPageNum = (pageNo: number) => {
      if (pageNo) {
        if (pageNo > 5 || pageNo < 1) {
          router.push({ path: '/404' })
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

    return {
      pageNum
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
</style>
