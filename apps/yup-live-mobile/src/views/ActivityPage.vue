<template>
  <ion-page>
    <HeaderBar text="METRICS" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
      <div class="bg-color table-list w-full mb-4">
        <ion-list
          v-for="vote of data"
          :key="(vote.url as string)"
          :class="`${isTableLoading ? 'tableLoading' : ''}`"
          :loading="isTableLoading"
          class="mx-y"
          style="border-bottom: 1px solid #fcfcfc96"
        >
          <ion-item>
            <router-link  class="inline mr-2 text-[0.8rem]" :to="`/tabs/account/${vote.voter}`">
              <UserIcon :key="iconsColor" :color="'#ccc'" />
              {{ limitUrlSize(vote.voter as string, 12) }}
            </router-link> at 

            <div class="inline text-[0.8rem]">
              <DateIcon class="ml-2" :key="iconsColor" :color="'#ccc'" />
              {{ vote.timestamp }}
            </div>
          </ion-item>

 

          <ion-item field="url" label="CONTENT">
            <div>
            <div>
              <Thumbs
                :key="`dot-${vote.voter}-${vote.like}-${vote.rating}`"
                :vote="vote"
                class="mr-2"
              /> on
              <span class="ml-2">{{ limitUrlSize(vote.url as string) }}</span>
              
            </div>
            <div>
              <a :href="(vote.url as string)" rel="nofollow" target="_blank">
              <ion-chip>Go to Website</ion-chip>
            </a>
            <router-link  class="inline" :to="`/tabs/post/${vote.postid}`">
            <ion-chip>Go to Post</ion-chip>
          </router-link>
            </div>
            </div>
          </ion-item>

        </ion-list>
        <hr class="hr" />
        <div class="pag flex justify-center">
            <ion-button
              :class="`btn`"
              :buttonType="'clear'"
              @click="curPage - 1 > 0 ? setCurentPage(curPage - 1) : null"
              >⏴</ion-button
            >
          <div v-for="i in 5" :key="i" >
            <ion-button
              :class="`btn ${i === curPage ? 'active' : ''}`"
              @click="setCurentPage(i)"
              :buttonType="'clear'"
              >{{ i }}</ion-button
            >
          </div>
            <ion-button
              :class="`btn`"
              :buttonType="'clear'"
              @click="curPage + 1 > 5 ? null : setCurentPage(curPage + 1)"
              >⏵</ion-button
            >
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import Thumbs from "components/vote-list/thumbs.vue";
// import CatEmoji from '@/components/content/vote-list/category.vue'
import DangLoader from "components/vote-list/loader.vue";
import UserIcon from "icons/src/user.vue";
import DateIcon from "icons/src/date.vue";
import { useMainStore } from "@/store/main";

import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonChip,
} from "@ionic/vue";
import HeaderBar from "@/components/template/header-bar.vue";

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  //   computed,
  onUnmounted,
  Ref,
} from "vue";

import { config } from "shared/dist/utils/config";
const { API_BASE } = config;

export default defineComponent({
  name: "VoteList",
  components: {
    Thumbs,
   // DangLoader,
    UserIcon,
    DateIcon,
    IonPage,
    IonContent,
    HeaderBar,
    IonList,
    IonItem,
    IonButton,
    IonChip
  },
  props: {
    pageNum: {
      required: false,
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const isTableLoading = ref(false);
    const curPage = ref(Number(props.pageNum));
    const store = useMainStore();

    const iconsColor = ref(store.theme === "dark" ? "#ccc" : "#020201");

    const data: Ref<Record<string, string | number | boolean>[]> = ref([]);

    const setCurentPage = (page: number) => {
      if (page !== curPage.value) {
        curPage.value = page;
        getTableData(curPage.value);
      }
    };

    const makeLoadingData = () => {
      const data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          timestamp: new Date().toLocaleString(),
          voter: "loading...",
          url: `https://loading...${' '.repeat(i)}`,
          rating: "1",
          category: "popularity",
          like: true,
          tag: "loading...",
        });
      }
      return data;
    };

    const limitUrlSize = (url: string, size=30) => {
      if (url.length > size) {
        return `${url.slice(0, size)}...`;
      }
      return url;
    };

    const getVoteList = async (page: number) => {
      if (!page || page < 1) {
        page = 1;
      }

      const req = await fetch(`${API_BASE}/votes/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          skip: (page - 1) * 10,
        }),
      });

      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`);
      }
      const votesData = await req.json();
      const postidArr = Array.from(
        new Set(votesData.map((item: { postid: string }) => item.postid))
      );

      const req2 = await fetch(`${API_BASE}/posts/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          ids: postidArr,
        }),
      });

      if (!req2.ok) {
        throw new Error(`Request failed with status ${req2.status}`);
      }
      const postsData = await req2.json();
      const optPosts = postsData.reduce(
        (
          agg: { [key: string]: unknown },
          item: Record<string, unknown & Record<string, string>>
        ) => {
          agg[item._id.postid] = { ...item };
          return agg;
        },
        {}
      );
      const mergeVotes = votesData.map(
        (item: Record<string, unknown & Record<string, string>>) => {
          return {
            ...item,
            post: optPosts[(item.postid as unknown) as string],
          };
        }
      );
      return mergeVotes;
    };

    const getTableData = async (pageNum: number) => {
      isTableLoading.value = true;
      data.value = makeLoadingData();
      const votes = await getVoteList(pageNum);
      data.value = votes.map((vote: unknown) => {
        return {
          timestamp: new Date(
            Number((vote as { timestamp: string }).timestamp)
          ).toLocaleString(),
          rating: (vote as { rating: number }).rating,
          tag: (vote as { post: { tag: string } }).post.tag,
          url: (vote as { post: { url: string } }).post.url,
          category: (vote as { category: string }).category,
          voter: (vote as { voter: string }).voter,
          like: (vote as { like: boolean }).like,
          postid: (vote as { postid: string }).postid
        };
      });
      isTableLoading.value = false;
    };

    const urlHash = (url: string) => {
      const hash = Array(9).fill(0);
      const charArr = url
        .slice(url.indexOf("//") + 2)
        .toLocaleLowerCase()
        .split("");
      let c = 0;
      while (charArr.length) {
        const cat = charArr.shift()?.charCodeAt(0);
        if (!cat) break;
        const char = (cat % 26) + 97;
        hash[hash.length % c] = char;
        c++;
      }
    };

    store.$subscribe(() => {
      if (store.theme === "dark") {
        iconsColor.value = "#ccc";
      } else {
        iconsColor.value = "#020201";
      }
    });

    onMounted(async () => {
      getTableData(curPage.value);
    });

    onUnmounted(() => {
      // do nothing
    });

    return {
      data,
      isTableLoading,
      limitUrlSize,
      curPage,
      setCurentPage,
      iconsColor,
      urlHash,
    };
  },
});
</script>

<style lang="scss" scoped>

.tableLoading {
 animation: blink 1s linear infinite;
}

.pag {
  justify-self: end;
  margin-top: 0.6rem;

  .btn {
    padding: 0.2rem 0.4rem;
    margin: 0.2rem;
    border-radius: 0.2rem;
    background-color: #0202029a;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .btn.active {
    box-shadow: inset 0 0 0.5rem 0.2rem #bd9d0ea4;
  }

  .btn:hover {
    box-shadow: inset 0 0 0.5rem 0.2rem #bd9d0ea4;
  }
}

.hr {
  background: #c98d0b;
  opacity: 0.6;
  margin-top: 0.5rem;
}

</style>
