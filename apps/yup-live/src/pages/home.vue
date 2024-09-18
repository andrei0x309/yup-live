<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <TokenMetrics />
    <TableNav :key="`table-nav-${pageActive}`" :linkActive="pageActive" />
    <YupList
      v-if="pages.default === pageActive"
      :key="`vote-list-${pageActive}`"
      :pageNum="pageNum"
    />
    <Rewards
      v-if="pages.rewards === pageActive"
      :key="`rewards-${pageActive}`"
      :pageNum="pageNum"
      :type="(type as string)"
    />
    <Sellers
      v-if="pages.topSellers === pageActive"
      :key="`vote-list-${pageActive}`"
      :pageNum="pageNum"
    />
    <GiniWeeks v-if="pages.gini === pageActive" :key="`gini-${pageActive}`" />
    <GiniTrend v-if="pages.giniTrend === pageActive" :key="`gini-trend-${pageActive}`" />
    <VoteList
      v-if="pages.voteList === pageActive"
      :key="`vote-list-${pageActive}`"
      :pageNum="pageNum"
    />
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  ref,
  reactive,
  computed,
  onUnmounted,
  watch,
  defineAsyncComponent,
} from "vue";
import { useHead } from "@unhead/vue";

import TokenMetrics from "@/components/content/token-metrics.vue";
import YupList from "@/components/content/yup-list.vue";
import TableNav from "@/components/content/table-nav.vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore, openConnectModal } from "@/store/main";

import { getStaticMetaFrame } from "shared/src/utils/frame";

export default defineComponent({
  name: "HomePage",
  components: {
    TokenMetrics,
    YupList,
    TableNav,
    Rewards: defineAsyncComponent(
      () => import("@/components/content/rewards-earners.vue")
    ),
    Sellers: defineAsyncComponent(() => import("@/components/content/top-sellers.vue")),
    GiniWeeks: defineAsyncComponent(() => import("@/components/content/gini-weeks.vue")),
    GiniTrend: defineAsyncComponent(() => import("@/components/content/gini-trend.vue")),
    VoteList: defineAsyncComponent(() => import("@/components/content/vote-list.vue")),
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const pageNum = ref(route.params.pageNo ? Number(route.params.pageNo) : 1);
    const type = ref(
      route.params.type
        ? ["week", "month"].includes(route.params.type as string)
          ? route.params.type
          : "week"
        : "week"
    );
    const store = useMainStore();

    const pages = {
      rewards: "Top Rewards",
      topSellers: "Top Sellers",
      gini: "Rewards Gini Index",
      giniTrend: "Recent Gini Trend",
      voteList: "Vote List",
      default: "Yup Social",
    };

    const getPageActive = (path: string) => {
      path = `/${path.split("/")[1]}`;
      switch (path) {
        case "/rewards":
          return pages.rewards;
        case "/sellers":
          return pages.topSellers;
        case "/gini":
          return pages.gini;
        case "/gini-trend":
          return pages.giniTrend;
        case "/vote-list":
          return pages.voteList;
        case "/login": {
          setTimeout(() => {
            openConnectModal(store);
          }, 500);
          return pages.default;
        }
        case "/sign-up":
          {
            setTimeout(() => {
              openConnectModal(store, false);
            }, 500);
          }
          return pages.default;
        default:
          return pages.default;
      }
    };

    const pageActive = ref(getPageActive(route.path));

    const siteData = reactive({
      title: `YUP Live ${pageActive.value ?? ""}`,
      description: `YUP Live ${
        pageActive.value ?? ""
      } open-source light frontend for accessing YUP DApp.`,
    });

    useHead({
      title: computed(() => siteData.title).value,
      meta: [
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-default.png`,
        },
        {
          name: "description",
          content: computed(() => siteData.description).value,
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: computed(() => siteData.title).value,
        },
        {
          name: "og:description",
          content: computed(() => siteData.description).value,
        },
        {
          name: "og:url",
          content: computed(() => route.fullPath).value,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: computed(() => route.fullPath).value,
        },
        {
          name: "twitter:title",
          content: computed(() => siteData.title).value,
        },
        {
          name: "twitter:description",
          content: computed(() => siteData.description).value,
        },
        ...getStaticMetaFrame(`/share/yup-live-ogs/og-yup-live-default.png`),
      ],
    });

    const setPageNum = (pageNo: number) => {
      if (pageNo) {
        if (pageNo > 5 || pageNo < 1) {
          router.push({ path: "/error/code/404" });
        } else {
          pageNum.value = pageNo;
        }
      }
    };

    onMounted(async () => {
      setPageNum(Number(route.params.pageNo));
    });

    onUnmounted(async () => {
      // do nothing
    });

    watch(
      () => route.path,
      (newVal) => {
        pageActive.value = getPageActive(newVal);
      }
    );

    return {
      pageNum,
      type,
      pageActive,
      pages,
    };
  },
});
</script>

<style lang="scss">
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
    color: aliceblue;
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

.cat-emojy {
  font-size: 0.8rem;
  top: 0.02rem;
  position: relative;
}

.page {
  @media screen and (max-width: 1400px) {
    width: 98%;
  }
}
</style>
