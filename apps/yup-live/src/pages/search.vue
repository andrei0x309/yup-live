<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color page-stake w-full mb-4 flex flex-col">
      <h2 class="text-[1.3rem] p-6 tracking-wide uppercase mt-2">Search & Filters</h2>
      <template v-if="loading">
        <p class="p-4">Loading Search data</p>
        <DangLoader :unset="true" />
      </template>
      <template v-if="!loading">
        <o-tabs
          v-model="activeTab"
          :multiline="true"
          :expanded="true"
          type="default"
          position="centred"
          variant="warning"
          navTypeClass="boxed"
          :animated="false"
        >
          <o-tab-item value="0">
            <template #header>
              <SearchIcon class="w-6 inline mr-2" />
              <span> Search </span>
            </template>
            <div class="flex flex-col p-4 thinSBox">
              <div class="control">
                Search for:
                <div class="block my-3">
                  <o-radio
                    v-for="searchFor of searchForOptions"
                    :key="searchFor"
                    v-model="searchForModel"
                    :native-value="searchFor"
                    >{{ searchFor }}</o-radio
                  >
                </div>
                <template v-if="searchForModel === 'posts'">
                  Relevant -
                  <o-switch
                    :rounded="true"
                    position="right"
                    size="small"
                    variant="warning"
                    @change="changeSearchSort(searchSort)"
                    >&nbsp;- New</o-switch
                  >
                  <div class="block my-4">
                    <o-checkbox
                      v-for="platfrom of SearchPlatforms"
                      :key="platfrom"
                      v-model="searchPlarfroms"
                      class="p-2"
                      :native-value="platfrom"
                    >
                      <span class="ml-2">{{ platfrom }}</span>
                    </o-checkbox>
                  </div>
                </template>
                <div
                  class="flex rounded bg-gray-200 max-w-[30rem] m-auto mt-2 border border-stone-400"
                >
                  <input
                    v-model="searchInput"
                    type="search"
                    class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                    placeholder="some keywords"
                    @keypress="
                      ($event) => {
                        if ($event.key === 'Enter') {
                          if (searchForModel === 'posts') {
                            makeSearch();
                          } else {
                            makeSearchProfiles();
                          }
                        }
                      }
                    "
                  />

                  <button
                    type="button"
                    class="m-2 rounded px-4 py-2 font-semibold text-gray-100"
                    :class="
                      searchInput.length > 0
                        ? 'bg-purple-500'
                        : 'bg-gray-500 cursor-not-allowed'
                    "
                    :disabled="searchInput.length == 0"
                    @click="
                      () => {
                        if (searchForModel === 'posts') {
                          makeSearch();
                        } else {
                          makeSearchProfiles();
                        }
                      }
                    "
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </o-tab-item>
          <o-tab-item value="1">
            <template #header>
              <FilterIcon class="w-6 inline mr-2" />
              <span> Custom Filters </span>
            </template>
            <div class="flex flex-col p-4 thinSBox">
              <div class="control">
                Feed Setting:
                <div class="block my-3">
                  <o-radio
                    v-for="setting of FILTRED_FEED_SETTING"
                    :key="setting"
                    v-model="filtersSetting"
                    :native-value="setting"
                    >{{ setting }}</o-radio
                  >
                </div>

                Feed Index:
                <div class="block my-3">
                  <o-radio
                    v-for="index of FILTERED_FEED_INDEXES"
                    :key="index"
                    v-model="feedIndex"
                    :native-value="index"
                    >{{ index }}</o-radio
                  >
                </div>

                Sort: [ Created At -
                <o-switch
                  :rounded="true"
                  position="right"
                  size="small"
                  variant="warning"
                  @change="changeFilterSortBy()"
                  >&nbsp; - Yup Score ]</o-switch
                >
                [ Desc -
                <o-switch
                  :rounded="true"
                  position="right"
                  size="small"
                  variant="warning"
                  @change="changeFilterSortOrder()"
                  >&nbsp;- Asc ]</o-switch
                >
                <div class="block my-4">
                  <o-checkbox
                    v-for="platfrom of SearchPlatforms"
                    :key="platfrom"
                    v-model="filterPlatfroms"
                    class="p-2"
                    :native-value="platfrom"
                  >
                    <span class="ml-2">{{ platfrom }}</span>
                  </o-checkbox>
                </div>
                <div
                  class="flex rounded bg-gray-200 max-w-[30rem] m-auto mt-2 border border-stone-400"
                >
                  <input
                    v-model="filterCreators"
                    type="search"
                    class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                    placeholder="web3Creators EVM addresses (comma seperated)"
                  />
                </div>
                <div
                  class="flex rounded bg-gray-200 max-w-[30rem] m-auto mt-2 border border-stone-400"
                >
                  <input
                    v-model="filterInput"
                    type="search"
                    class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                    placeholder="some keywords"
                    @keypress="
                      ($event) => {
                        if ($event.key === 'Enter') {
                          makeFilter();
                        }
                      }
                    "
                  />

                  <button
                    type="button"
                    class="m-2 rounded px-4 py-2 font-semibold text-gray-100 bg-purple-500"
                    @click="
                      () => {
                        makeFilter();
                      }
                    "
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
          </o-tab-item>
        </o-tabs>

        <template v-if="searchLoading">
          <p class="p-4">Loading Data</p>
          <DangLoader :unset="true" />
        </template>
        <template v-else>
          <template v-if="searchForModel === 'posts'">
            <InfScroll :key="`${feedLoading}-loaded`" :postLoaded="true" @hit="onHit">
              <template #content>
                <div v-if="posts.length > 0" class="flex flex-row mx-auto">
                  <div class="flex flex-col">
                    <Post
                      v-for="post of posts"
                      :id="(post as Record<string, any>)._id.postid"
                      :key="(post  as Record<string, any>)._id.postid"
                      :post="post"
                      :postTypesPromises="postTypesPromises"
                      :isHidenInfo="(post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid"
                      :crossPost="
                        () => import('@/components/content/post/replyButton.vue')
                      "
                      :deps="postDeps"
                      @updatepostinfo="
                  (postid: string) => {
                    postInfo = posts.find((p: any): boolean => postid === p._id.postid)
                  }
                "
                    />
                    <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
                  </div>
                  <PostInfo
                    :key="(postInfo as Record<string, any>)._id.postid"
                    class="hidden lg:flex"
                    :post="(postInfo as Record<string, any>)"
                  />
                </div>
                <div v-else>
                  <h2 class="text-[1.3rem] mt-2 uppercase">
                    {{
                      searchStarted
                        ? "No results found"
                        : "Hit enter or Search to find results"
                    }}
                  </h2>
                  <component
                    :is="(catComp as unknown)"
                    v-if="catComp !== null"
                    class="max-w-80 mx-auto"
                  />
                </div>
              </template>
            </InfScroll>
          </template>
          <template v-else>
            <InfScroll
              :key="`${feedLoading}-loaded`"
              :postLoaded="true"
              @hit="onHitProfiles"
            >
              <template #content>
                <div v-if="profiles.length > 0" class="flex flex-row mx-auto">
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[60rem] mb-8"
                  >
                    <Web3ProfileCard
                      v-for="userdata of profiles"
                      :key="userdata._id"
                      :web3Profile="userdata"
                      :deps="web3Deps"
                      :addViewBtn="true"
                    />
                    <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
                  </div>
                </div>
                <div v-else>
                  <h2 class="text-[1.3rem] mt-2 uppercase">
                    {{
                      searchStarted
                        ? "No results found"
                        : "Hit enter or Search to find results"
                    }}
                  </h2>
                  <component
                    :is="(catComp as unknown)"
                    v-if="catComp !== null"
                    class="max-w-80 mx-auto"
                  />
                </div>
              </template>
            </InfScroll>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  onUnmounted,
  Ref,
  ref,
  shallowRef,
  watch,
} from "vue";
import { useHead } from '@unhead/vue'
;
import DangLoader from "components/vote-list/loader.vue";
// import { useRoute } from 'vue-router'
import SearchIcon from "icons/src/search.vue";
import FilterIcon from "icons/src/filter.vue";
import { postTypesPromises } from "components/post-types/post-types";
// import { useRoute } from 'vue-router'
// import CustomButton from "components/functional/customButton.vue";
// import { getPolyContractAddresses } from "@yupio/contract-addresses";
// import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
// import { search, getWithFilters  } from  'shared/utils/requests/searchFilters'
import {
  search,
  getWithFilters,
  searchProfiles,
} from "shared/src/utils/requests/searchFilters";
import {
  SearchPlatforms,
  FILTERED_FEED_INDEXES,
  FILTRED_FEED_SETTING,
  FILTERED_FEED_ALL,
  ISearchFilters,
  IFEED_SORT,
  IFEED_PLATFORM_SETTING,
} from "shared/src/types/search";
import Post from "components/post/post.vue";
import PostInfo from "@/components/content/post/postInfo.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import LineLoader from "components/functional/lineLoader.vue";
import {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
} from "@/store/alertStore";
import { useMainStore, openConnectModal } from "@/store/main";
import { IPostDeps } from "shared/src/types/post";
import type { IPost } from "shared/src/types/post";
import type { IMainStore } from "shared/src/types/store";
import PostMenu from "@/components/content/post/menu/postMenu.vue";
import CollectMenu from "@/components/content/post/menu/collectMenu.vue";
import { OTooltip } from "@oruga-ui/oruga-next";
import { getProfilesData } from "shared/src/utils/requests/web3Profiles";
import Web3ProfileCard from "components/profile/web3ProfileCard.vue";
import type { IWeb3Profile } from "shared/src/types/web3Profile";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const searchForOptions = ["profiles"];

const postDeps: IPostDeps = {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
  openConnectModal,
  useMainStore: (useMainStore as unknown) as () => IMainStore,
  apiBase: API_BASE,
  PostMenu: PostMenu,
  CollectMenu: CollectMenu,
  ToolTip: OTooltip,
};

const web3Deps = {
  openConnectModal,
  useMainStore: (useMainStore as unknown) as () => IMainStore,
  stackAlertWarning,
  stackAlertSuccess,
  apiBase: API_BASE,
};

export default defineComponent({
  name: "Search",
  components: {
    DangLoader,
    SearchIcon,
    FilterIcon,
    Post,
    PostInfo,
    InfScroll,
    LineLoader,
    Web3ProfileCard,
  },
  setup() {
    const loading = ref(true);
    const feedLoading = ref(false);
    const searchLoading = ref(false);
    const activeTab = ref("0") as Ref<string>;
    const store = useMainStore();
    const posts = ref([]) as Ref<Array<IPost>>;
    const profiles = ref([]) as Ref<Array<IWeb3Profile>>;
    const searchStarted = ref(false);
    const isAuth = ref(store.isLoggedIn);

    const address = ref(localStorage.getItem("address"));
    const searchPlarfroms = ref(SearchPlatforms);
    const searchSort = ref("relevant");
    const searchInput = ref("");
    const itemIndex = ref(0);
    const postInfo = ref(null) as Ref<unknown>;
    const catComp = shallowRef(null) as Ref<unknown>;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    let getFeedPosts = async (start = 0) => [] as Array<IPost>;
    const searchForModel = ref(searchForOptions[0]);

    const feedIndex = ref(FILTERED_FEED_ALL);
    const filterSortBySwitchCreated = ref("createdAt") as Ref<
      "createdAt" | "web3PreviewCreatorYupScore"
    >;
    const filterSortBySwitchOrder = ref("desc") as Ref<"asc" | "desc">;
    const filtersSetting = ref(FILTRED_FEED_SETTING[0]) as Ref<IFEED_PLATFORM_SETTING>;
    const filterPlatfroms = ref(SearchPlatforms);
    const filterCreators = ref("");
    const filterInput = ref("");
    const noMorePosts = ref(false);

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn;
    });

    watch(activeTab, () => {
      if (activeTab.value === "1") {
        if (!isAuth.value) {
          activeTab.value = "0";
          openConnectModal(store);
        }
      }
    });

    watch(searchForModel, () => {
      if (searchForModel.value === "posts") {
        itemIndex.value = posts.value.length;
      } else {
        itemIndex.value = profiles.value.length;
      }
    });

    const doSearch = async (start = 0) => {
      const byRencency = searchSort.value === "newest" ? "desc" : "";
      return await search({
        byRencency,
        input: searchInput.value,
        platforms: searchPlarfroms.value,
        limit: 10,
        offset: start,
      });
    };

    const makeSearch = async () => {
      searchLoading.value = true;
      getFeedPosts = doSearch;
      searchStarted.value = true;
      itemIndex.value = 0;
      const mewPosts = await doSearch();
      postInfo.value = mewPosts[0];
      posts.value = mewPosts;
      itemIndex.value += posts.value.length;
      if (mewPosts.length < 10) {
        noMorePosts.value = true;
      }
      searchLoading.value = false;
    };

    const makeSearchProfiles = async () => {
      searchLoading.value = true;
      searchStarted.value = true;
      itemIndex.value = 0;
      const newProfileAddresses = (
        await searchProfiles({ input: searchInput.value, start: itemIndex.value })
      ).map((item) => item._id);
      const newProfiles = await getProfilesData(newProfileAddresses);
      itemIndex.value += newProfileAddresses.length;
      profiles.value = newProfiles;
      if (newProfiles.length < 10) {
        noMorePosts.value = true;
      }

      itemIndex.value += posts.value.length;
      searchLoading.value = false;
    };

    const doFilter = async (start = 0) => {
      const query = {} as ISearchFilters;
      if (filterPlatfroms.value.length) {
        query.tags = [...filterPlatfroms.value];
      }
      if (filterCreators.value) {
        if (filterCreators.value.includes(" ")) {
          query.web3Creators = filterCreators.value
            .split(" ")
            .map((item: string) => item.trim())
            .filter((item: string) => item);
        } else if (filterCreators.value.includes(",")) {
          query.web3Creators = filterCreators.value
            .split(",")
            .map((item: string) => item.trim())
            .filter((item: string) => item);
        } else {
          query.web3Creators = [filterCreators.value];
        }
      }

      if (filterInput.value) {
        query.keywords = filterInput.value
          .split(" ")
          .map((item: string) => item.trim())
          .filter((item: string) => item);
      }

      if (filterSortBySwitchCreated.value) {
        query.sortBy = {} as IFEED_SORT;
        query.sortBy[filterSortBySwitchCreated.value] = filterSortBySwitchOrder.value;
      }

      query.setting = filtersSetting.value || "general";

      query.account = store.userData.account;

      query.index = feedIndex.value;
      const body = {
        limit: 10,
        start,
        query,
      };
      return await getWithFilters(body);
    };

    const makeFilter = async () => {
      searchLoading.value = true;
      getFeedPosts = doFilter;
      searchStarted.value = true;
      itemIndex.value = 0;
      const mewPosts = await doFilter();
      postInfo.value = mewPosts[0];
      posts.value = mewPosts;
      itemIndex.value += posts.value.length;
      searchLoading.value = false;
    };

    const onHit = async (type: string) => {
      if (feedLoading.value) return;
      if (!posts.value.length) return;
      feedLoading.value = true;
      if (type === "down" && posts.value.length <= 30) {
        const newPosts = await getFeedPosts(itemIndex.value);
        itemIndex.value += newPosts.length;
        posts.value = [...posts.value, ...newPosts];
      } else if (type === "down" && posts.value.length >= 30) {
        const newPosts = await getFeedPosts(itemIndex.value);
        itemIndex.value += newPosts.length;
        posts.value = [...posts.value.slice(10), ...newPosts];
      }
      feedLoading.value = false;
    };

    const onHitProfiles = async (type: string) => {
      if (feedLoading.value) return;
      if (!posts.value.length) return;
      feedLoading.value = true;
      if (type === "down" && posts.value.length <= 30) {
        const newProfileAddresses = (
          await searchProfiles({ input: searchInput.value, start: itemIndex.value })
        ).map((item) => item._id);
        const newProfiles = await getProfilesData(newProfileAddresses);
        itemIndex.value += newProfileAddresses.length;
        profiles.value = [...profiles.value, ...newProfiles];
      } else if (type === "down" && posts.value.length >= 30) {
        const newProfileAddresses = (
          await searchProfiles({ input: searchInput.value, start: itemIndex.value })
        ).map((item) => item._id);
        const newProfiles = await getProfilesData(newProfileAddresses);
        itemIndex.value += newProfileAddresses.length;
        profiles.value = [...profiles.value.slice(10), ...newProfiles];
      }
      feedLoading.value = false;
    };

    store.$subscribe(() => {
      address.value = store.userData.address;
    });

    onUnmounted(() => {
      // do nothing
    });

    useHead({
      title: "Search | Yup Live",
      meta: [
        {
          name: "description",
          content:
            "Search web3 data or use advanced filters to find content you might be interested in.",
        },
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-search.png`,
        },
      ],
    });

    const changeSearchSort = (sort: string) => {
      searchSort.value = sort === "relevant" ? "relevant" : "newest";
    };

    const changeFilterSortBy = () => {
      filterSortBySwitchCreated.value =
        filterSortBySwitchCreated.value === "createdAt"
          ? "web3PreviewCreatorYupScore"
          : "createdAt";
    };

    const changeFilterSortOrder = () => {
      filterSortBySwitchOrder.value =
        filterSortBySwitchOrder.value === "asc" ? "desc" : "asc";
    };

    onMounted(async () => {
      (async () => (catComp.value = (await import("icons/src/catEmpty.vue")).default))();

      loading.value = false;
    });

    return {
      loading,
      activeTab,
      searchSort,
      changeSearchSort,
      searchPlarfroms,
      searchInput,
      posts,
      postTypesPromises,
      postInfo,
      feedLoading,
      onHit,
      catComp,
      makeSearch,
      SearchPlatforms,
      searchStarted,
      searchLoading,
      FILTERED_FEED_INDEXES,
      changeFilterSortBy,
      changeFilterSortOrder,
      feedIndex,
      filterPlatfroms,
      filterCreators,
      filterInput,
      filtersSetting,
      FILTRED_FEED_SETTING,
      makeFilter,
      postDeps,
      searchForModel,
      searchForOptions,
      profiles,
      onHitProfiles,
      makeSearchProfiles,
      web3Deps,
    };
  },
});
</script>

<style lang="scss">
.thinSBox {
  border: 1px solid #181818;
  padding: 2rem;
  margin: 1rem;
}

.notBLine {
  border-right: 2px solid dimgrey;
  opacity: 0.5;
}

.page-stake {
  min-height: calc(100vh - 2rem);

  .nothead {
    position: sticky;
    text-orientation: upright;
    writing-mode: vertical-lr;
    transform: translateX(-1400%);
    transform: translate(-1400%, 6rem);
    height: 0;
  }

  .imgNotRadius {
    border-radius: 0.6rem;
    box-shadow: 3px 4px 5px 0px rgb(88 88 88 / 66%);
  }

  .o-tabs__nav {
    overflow-y: hidden;
  }

  .o-tabs__nav-item-default {
    outline: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
    background-color: transparent;
    align-items: center;
    line-height: 1.5;
    font-size: 1.15rem;
    border-bottom-color: var(--color-text-faded2);
    border-bottom-style: solid;
    border-bottom-width: 0.15rem;
    display: flex;
    justify-content: center;
    margin-bottom: -1px;
    padding: 1rem 1rem;
    vertical-align: top;
    cursor: pointer;
    text-decoration: none;
  }

  .o-tabs__nav-item-default--active {
    border-bottom-color: var(--glassTxt);
    color: var(--glassTxt);
    border-bottom-width: 0.28rem;
  }

  .o-tabs__content {
    display: flex;
    align-items: center;
  }

  .o-tab-item__content {
    display: contents;
  }
}

.control {
  text-align: left;
  padding: 2rem;
  font-size: 0.9rem;
  // color: #dfbe04;

  label {
    top: 0.2rem;

    .o-switch__check {
      background-color: rgb(98 98 98 / 93%);
      border: 1px solid var(--bg);
    }
  }
}
.acbtn {
  opacity: 0.85;
}
</style>
