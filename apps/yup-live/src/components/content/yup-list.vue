<template>
  <!-- :bordered="isBordered"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :hoverable="isHoverable"
        :loading="isLoading"
        :focusable="isFocusable"
        :mobile-cards="hasMobileCards" -->

  <div class="bg-color table-list w-full mb-4">
    <div>
      <div v-if="data[0] || data[1]" class="flex justify-center flex-col lg:flex-row">
        <div>
        <h3>YUP Recent Tweet</h3>
        <Post :post="data[0]" :deps="deps" :postTypesPromises="postTypesPromises" :isHidenInfo="true" />
        </div>
        <div>
        <h3>YUP Recent Cast</h3>
        <Post :post="data[1]" :deps="deps" :postTypesPromises="postTypesPromises" :isHidenInfo="true" />
        </div>
      </div>
      <div v-if="isDataLoading" class="min-h-[20rem]">
        <DangLoader :unset="true" class="mt-8" />
      </div>
    </div>

    <hr class="hr" />
    <div class="pag">
      <router-link :to="`/page/${curPage - 1 > 0 ? curPage - 1 : 1}`">
        <o-button
          :class="`btn`"
          @click="curPage - 1 > 0 ? setCurentPage(curPage - 1) : null"
          >⏴</o-button
        >
      </router-link>
      <router-link v-for="i in 5" :key="i" :to="`/page/${i}`">
        <o-button
          :class="`btn ${i === curPage ? 'active' : ''}`"
          @click="setCurentPage(i)"
          >{{ i }}</o-button
        >
      </router-link>
      <router-link :to="`/page/${curPage + 1 > 4 ? 5 : curPage + 1}`">
        <o-button
          :class="`btn`"
          @click="curPage + 1 > 5 ? null : setCurentPage(curPage + 1)"
          >⏵</o-button
        >
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
// import Thumbs from "components/vote-list/thumbs.vue";
// // import CatEmoji from '@/components/content/vote-list/category.vue'
import DangLoader from "components/vote-list/loader.vue";
// import UserIcon from "icons/src/user.vue";
// import DateIcon from "icons/src/date.vue";
// import LinkIcon from "icons/src/link.vue";
// import RadarIcon from "icons/src/radar.vue";
import Post from "components/post/post.vue";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alertStore";
import { useMainStore, openConnectModal } from "@/store/main";
import { postTypesPromises } from "components/post-types/post-types";

// import { useMainStore } from '@/store/main'

import { IPostDeps } from "shared/src/types/post";
import type { IPost } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import PostMenu from "@/components/content/post/menu/postMenu.vue";
import CollectMenu from "@/components/content/post/menu/collectMenu.vue";
import { onMounted, defineComponent, ref, onUnmounted, Ref } from "vue";
import { OTooltip } from '@oruga-ui/oruga-next'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "SocialList",
  //   components: { Thumbs, DangLoader, UserIcon, DateIcon, LinkIcon, RadarIcon },
  components: { DangLoader, Post },
  props: {
    pageNum: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const isDataLoading = ref(false);
    const curPage = ref(Number(props.pageNum));
    const store = useMainStore();
    const deps: IPostDeps = {
    stackAlertError,
    stackAlertSuccess,
    stackAlertWarning,
    openConnectModal,
    useMainStore: (useMainStore as unknown) as () => IMainStore,
    apiBase: API_BASE,
    PostMenu: PostMenu,
    CollectMenu: CollectMenu,
    ToolTip: OTooltip
  };


    const iconsColor = ref(store.theme === "dark" ? "#ccc" : "#020201");

    const data = (ref([]) as unknown) as Ref<IPost>;

    const setCurentPage = (page: number) => {
      if (page !== curPage.value) {
        curPage.value = page;
        // getTableData(curPage.value);
      }
    };

    // const makeLoadingData = () => {
    //   const data = [];
    //   for (let i = 0; i < 10; i++) {
    //     data.push({
    //       timestamp: new Date().toLocaleString(),
    //       voter: "loading...",
    //       url: "https://loading...",
    //       rating: "1",
    //       category: "popularity",
    //       like: true,
    //       tag: "loading...",
    //       postId: "",
    //     });
    //   }
    //   return data;
    // };

    const limitUrlSize = (url: string) => {
      if (url.length > 45) {
        return `${url.slice(0, 45)}...`;
      }
      return url;
    };

    // const getVoteList = async (page: number) => {
    //   if (!page || page < 1) {
    //     page = 1;
    //   }

    //   const req = await fetch(`${API_BASE}/votes/list`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8",
    //     },
    //     body: JSON.stringify({
    //       skip: (page - 1) * 10,
    //     }),
    //   });

    //   if (!req.ok) {
    //     throw new Error(`Request failed with status ${req.status}`);
    //   }
    //   const votesData = await req.json();
    //   const postidArr = Array.from(
    //     new Set(votesData.map((item: { postid: string }) => item.postid))
    //   );

    //   const req2 = await fetch(`${API_BASE}/posts/list`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8",
    //     },
    //     body: JSON.stringify({
    //       ids: postidArr,
    //     }),
    //   });

    //   if (!req2.ok) {
    //     throw new Error(`Request failed with status ${req2.status}`);
    //   }
    //   const postsData = await req2.json();
    //   const optPosts = postsData.reduce(
    //     (
    //       agg: { [key: string]: unknown },
    //       item: Record<string, unknown & Record<string, string>>
    //     ) => {
    //       agg[item._id.postid] = { ...item };
    //       return agg;
    //     },
    //     {}
    //   );
    //   const mergeVotes = votesData.map(
    //     (item: Record<string, unknown & Record<string, string>>) => {
    //       return {
    //         ...item,
    //         post: optPosts[(item.postid as unknown) as string],
    //       };
    //     }
    //   );
    //   return mergeVotes;
    // };

    const getPageData = async (pageNum: number) => {
      isDataLoading.value = true;
      const req1 = fetch(`${API_BASE}/posts/yup/twitter`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      const req2 = fetch(`${API_BASE}/posts/yup/farcaster`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      const posts = await Promise.all([req1, req2]).then((res) => {
        return Promise.all(res.map((r) => r.json()));
      });

      const pData = ([posts[0][pageNum - 1], posts[1][pageNum - 1]] as unknown) as IPost;

      data.value = pData;

      isDataLoading.value = false;
    };

    onMounted(async () => {
      getPageData(curPage.value);
    });

    onUnmounted(() => {
      // do nothing
    });

    return {
      data,
      isDataLoading,
      limitUrlSize,
      curPage,
      setCurentPage,
      iconsColor,
      deps,
      postTypesPromises,
    };
  },
});
</script>

<style lang="scss"></style>
