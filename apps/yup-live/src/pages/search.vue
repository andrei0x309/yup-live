<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
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
              Relevant - 
              <o-switch :rounded="true" position="right" size="small" variant="warning" @change="changeSearchSort(searchSort)"
                >&nbsp;-  New</o-switch
              >
      <div class="block my-4">
      <o-checkbox v-for="platfrom of SearchPlatforms" :key="platfrom" v-model="searchPlarfroms" class="p-2" :native-value="platfrom">
        <span class="ml-2">{{ platfrom }}</span>
      </o-checkbox>
    </div>
      <div class="flex rounded bg-gray-200 max-w-[30rem] m-auto mt-2">
        <input
          v-model="searchInput"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="some keywords"
          @keypress="($event) => {
            if ($event.key === 'Enter') {
              makeSearch()
            }
          }"
        />

        <button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100"
          :class="searchInput.length > 0 ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
          :disabled="searchInput.length == 0"
          @click="() => {  makeSearch() }"
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
                <o-radio v-for="setting of FILTRED_FEED_SETTING" :key="setting" v-model="filtersSetting" :native-value="setting">{{ setting }}</o-radio>
                </div>

                Feed Index:
                <div class="block my-3">
                <o-radio v-for="index of FILTERED_FEED_INDEXES" :key="index" v-model="feedIndex" :native-value="index">{{ index }}</o-radio>
                </div>

              Sort: [ Created At -
              <o-switch :rounded="true" position="right" size="small" variant="warning" @change="changeFilterSortBy()"
                >&nbsp; - Yup Score ]</o-switch
              >
              [ Desc - 
              <o-switch :rounded="true" position="right" size="small" variant="warning" @change="changeFilterSortOrder()"
                >&nbsp;-  Asc ]</o-switch
              >
      <div class="block my-4">
      <o-checkbox v-for="platfrom of SearchPlatforms" :key="platfrom" v-model="filterPlatfroms" class="p-2" :native-value="platfrom">
        <span class="ml-2">{{ platfrom }}</span>
      </o-checkbox>
    </div>
    <div class="flex rounded bg-gray-200 max-w-[30rem] m-auto mt-2">

        <input
          v-model="filterCreators"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="web3Creators EVM addresses (comma seperated)"
        /> 
        </div>
        <div class="flex rounded bg-gray-200 max-w-[30rem] m-auto mt-2">
        <input
          v-model="filterInput"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="some keywords"
          @keypress="($event) => {
            if ($event.key === 'Enter') {
              makeFilter()
            }
          }"
        />

        <button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 bg-purple-500"
          @click="() => {  makeFilter() }"
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
      <InfScroll v-else :key="`${feedLoading}-loaded`" :postLoaded="true" @hit="onHit">
        <template #content>
          <div v-if="posts.length > 0" class="flex flex-row mx-auto">
            <div class="flex flex-col">
              <Post
                v-for="post of posts"
                :id="(post as Record<string, any>)._id.postid"
                :key="(post  as Record<string, any>)._id.postid"
                :post="(post as Record<string, any>)"
                :postTypesPromises="postTypesPromises"
                :isHidenInfo="(post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid"
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
            {{  searchStarted ? 'No results found' : 'Hit enter or Search to find results' }}
            </h2>
            <component :is="catComp" v-if="catComp !== null" class="max-w-80 mx-auto" />
          </div>
        </template>
      </InfScroll>

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
  watch
} from "vue";
import { useHead, HeadObject } from "@vueuse/head";
import DangLoader from "components/vote-list/loader.vue";
// import { useRoute } from 'vue-router'
import SearchIcon from "icons/src/search.vue";
import FilterIcon from "icons/src/filter.vue";
import { postTypesPromises } from 'components/post-types/post-types'
// import { useRoute } from 'vue-router'
// import CustomButton from "components/functional/customButton.vue";
// import { getPolyContractAddresses } from "@yupio/contract-addresses";
import { useMainStore, openConnectModal } from "@/store/main";
// import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
// import { search, getWithFilters  } from  'shared/utils/requests/searchFilters'
import { search, getWithFilters  } from  'shared/src/utils/requests/searchFilters'
import { SearchPlatforms, 
  FILTERED_FEED_INDEXES, 
  FILTRED_FEED_SETTING, 
  FILTERED_FEED_ALL,
  ISearchFilters,
  IFEED_SORT,
  IFEED_PLATFORM_SETTING
  
} from 'shared/src/types/search'
import Post from "@/components/content/post/post.vue";
import PostInfo from "@/components/content/post/postInfo.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import LineLoader from "components/functional/lineLoader.vue";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default defineComponent({
  name: "Search",
  components: {
    DangLoader,
    SearchIcon,
    FilterIcon,
    Post,
    PostInfo,
    InfScroll,
    LineLoader
  },
  setup() {
    const loading = ref(true);
    const feedLoading = ref(false);
    const searchLoading = ref(false);
    const activeTab = ref("0") as Ref<string>;
    const store = useMainStore();
    const posts = ref([]) as Ref<Array<unknown>>
    const searchStarted = ref(false)
    const isAuth = ref(store.isLoggedIn)

    const address = ref(localStorage.getItem("address"));
    const searchPlarfroms = ref(SearchPlatforms)
    const searchSort = ref('relevant')
    const searchInput = ref('')
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>
    const catComp = shallowRef(null) as Ref<unknown>
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    let getFeedPosts = async (start = 0) => [] as Array<unknown>

 
    const feedIndex = ref(FILTERED_FEED_ALL)
    const filterSortBySwitchCreated = ref('createdAt') as Ref< 'createdAt' | 'web3PreviewCreatorYupScore' >
    const filterSortBySwitchOrder = ref('desc') as Ref< 'asc' | 'desc' >
    const filtersSetting = ref(FILTRED_FEED_SETTING[0]) as Ref<IFEED_PLATFORM_SETTING>
    const filterPlatfroms = ref(SearchPlatforms)
    const filterCreators = ref('')
    const filterInput = ref('')

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn
    })

    watch(activeTab, () => {
      if(activeTab.value === '1') {
        if(!isAuth.value) {
          activeTab.value = '0'
          openConnectModal(store)
        }
      }
    })

    const doSearch = async (start = 0) => {
      const byRencency = searchSort.value === 'newest' ? 'desc' : ''
      return (await search({
       byRencency,
        input: searchInput.value,
        platforms: searchPlarfroms.value,
        limit: 10,
        offset: start
      }))
    }
    
    const makeSearch = async () => {
      searchLoading.value = true
      getFeedPosts = doSearch
      searchStarted.value = true
      postsIndex.value = 0
      const mewPosts = await doSearch()
      postInfo.value = mewPosts[0]
      posts.value = mewPosts
      postsIndex.value += posts.value.length
      searchLoading.value = false
    }
  
    const doFilter = async (start = 0) => {
      const query = {} as ISearchFilters
      if(filterPlatfroms.value.length) {
        query.tags = [...filterPlatfroms.value]
      }
      if(filterCreators.value) {
        if(filterCreators.value.includes(' ')) {
          query.web3Creators = filterCreators.value.split(' ').map((item: string) => item.trim()).filter((item: string) => item)
        } else if (filterCreators.value.includes(',')) {
          query.web3Creators = filterCreators.value.split(',').map((item: string) => item.trim()).filter((item: string) => item)
        } else {
          query.web3Creators = [filterCreators.value]
        }
      }

      if(filterInput.value) {
        query.keywords = filterInput.value.split(' ').map((item: string) => item.trim()).filter((item: string) => item) 
      }

      if(filterSortBySwitchCreated.value) {
        query.sortBy = {} as IFEED_SORT
        query.sortBy[filterSortBySwitchCreated.value] = filterSortBySwitchOrder.value
      }

      query.setting = filtersSetting.value || 'general'

      query.account = store.userData.account

      query.index = feedIndex.value
      const body = {
        limit: 10,
        start,
        query
      }
      return await getWithFilters(body) 
    }

    const makeFilter = async () => {
      searchLoading.value = true
      getFeedPosts = doFilter
      searchStarted.value = true
      postsIndex.value = 0
      const mewPosts = await doFilter()
      postInfo.value = mewPosts[0]
      posts.value = mewPosts
      postsIndex.value += posts.value.length
      searchLoading.value = false
    }
    


    const onHit = async (type: string) => {
      if(feedLoading.value) return
      if(!posts.value.length) return
      feedLoading.value = true
       if (type === 'down' && posts.value.length <= 30) {
        postsIndex.value += 10
        const newPosts = await getFeedPosts(postsIndex.value)
        posts.value = [...posts.value, ...newPosts]
      } else if (type === 'down' && posts.value.length >= 30) {
        postsIndex.value += 10
        const newPosts = await getFeedPosts(postsIndex.value)
        posts.value = [...posts.value.slice(10), ...newPosts]
      }
      feedLoading.value = false
    }

    store.$subscribe(() => {
      address.value = store.userData.address;
    });

    onUnmounted(() => {
      // do nothing
    });

    useHead(({
      title: 'Search | Yup Live',
      description: 'Search web3 data or use advanced filters to find content you might be interested in.',
      meta: [
        {
          name: 'description',
          content: 'Search web3 data or use advanced filters to find content you might be interested in.'
        },
        {
          name: 'og:image',
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-search.png`
        },
      ]
    } as unknown) as Ref<HeadObject>);
 
   
    const changeSearchSort = (sort: string) => {
      searchSort.value = sort === 'relevant' ? 'relevant' : 'newest'
    }

    const changeFilterSortBy = () => {
      filterSortBySwitchCreated.value = filterSortBySwitchCreated.value === 'createdAt' ? 'web3PreviewCreatorYupScore' : 'createdAt'
    }

    const changeFilterSortOrder = () => {
      filterSortBySwitchOrder.value = filterSortBySwitchOrder.value === 'asc' ? 'desc' : 'asc'
    }



    onMounted(async () => {
      ;(async () => (catComp.value = (await import('icons/src/catEmpty.vue')).default))()
            
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
      makeFilter
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
