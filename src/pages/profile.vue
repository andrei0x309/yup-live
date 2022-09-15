<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto mb-8">
    <div class="bg-color flex flex-col">
      <div class="profile w-full mb-4 flex flex-row">
        <DangLoader v-if="isLoadingUser" class="mt-28" :unset="true" />
        <template v-else>
          <ProfileCard :userData="userData" />
          <ProfileInfoCard class="mt-8" :bio="userData.bio" :fields="userFields" />
        </template>
        <div
          v-if="apiError && !isLoadingUser"
          style="max-width: 40rem; margin: auto"
          class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300"
        >
          <div class="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
            <span class="text-red-500">
              <svg fill="currentColor" viewBox="0 0 20 20" class="h-6 w-6">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
          <div class="alert-content ml-4">
            <div class="alert-title font-semibold text-lg text-red-800">Error</div>
            <div class="alert-description text-sm text-red-600">
              {{ apiErrorMsg }}
            </div>
          </div>
        </div>
      </div>
      <ProfileMenu :isAuth="isAuth" :currentMenuTab="currentMenuTab" @change="menuChange" />
    </div>
    <div class="bg-color table-list profile w-full mb-4 flex flex-col">
      <template v-if="currentMenuTab === MENU_BUTTONS.feed && !postLoaded">
        <p>Loading user feed</p>
        <DangLoader :unset="true" />
      </template>
      <InfScroll
        v-if="currentMenuTab === MENU_BUTTONS.feed && postLoaded"
        :key="`${postLoaded}-loaded`"
        :postLoaded="postLoaded"
        @hit="onHit"
      >
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
            <h2 class="text-[1.3rem] mt-2 uppercase">This feed is empty :(</h2>
            <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
          </div>
        </template>
      </InfScroll>
      <CollectionsPage
        v-if="currentMenuTab === MENU_BUTTONS.collections"
        :accountId="userId"
        :collections="collectionsPageCollections"
        :collectionPromise="collectionsPagePromise"
      />
      <FollowersPage v-if="currentMenuTab === MENU_BUTTONS.followers" :followersList="followers" :account="userData.username" />
      <WalletPage
        v-if="currentMenuTab === MENU_BUTTONS.wallet"
        :key="userData.evmAddress"
        :accountId="userId"
        :accountEVMAddr="userData.evmAddress"
      />
      <div v-if="currentMenuTab === MENU_BUTTONS.settings">
        <p class="text-[1.3rem] mt-2 uppercase">THIS TAB IS NOT IMPLEMENTED YET</p>
      </div>
      <!-- <InfScroll
        v-if="currentMenuTab === MENU_BUTTONS.web3 && postLoaded"
        :key="`${postLoaded}-loaded`"
        :postLoaded="postLoaded"
        @hit="onHit"
      >
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
            <h2 class="text-[1.3rem] mt-2 uppercase">This feed is empty :(</h2>
            <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
          </div>
        </template>
      </InfScroll> -->
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref, watch } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from '@/components/content/vote-list/loader.vue'
import ProfileCard from '@/components/content/profile/profileCard.vue'
import ProfileInfoCard from '@/components/content/profile/infoCard.vue'
import InfScroll from '@/components/functional/inf-scroll/infScroll.vue'
import ProfileMenu from '@/components/content/profile/menu.vue'
import { useMainStore } from '@/store/main'
import { useRoute } from 'vue-router'
import Post from '@/components/content/post/post.vue'
import { wait } from '@/utils/time'
import { useCollectionStore, useCollectionStoreEx, getCollections } from '@/store/collections'
import { MENU_BUTTONS } from '@/components/content/profile/menuButtonEnums'
import CollectionsPage from '@/components/content/profile/collectionsPage.vue'
import { postTypesPromises } from '@/utils/post'
import PostInfo from '@/components/content/post/postInfo.vue'
import LineLoader from '@/components/functional/lineLoader.vue'
import { getUserFollowers, createActionUsage, createUserData } from '@/utils/requests/accounts'
import type { NameValue } from '@/types/account'
import type { ICollection } from '@/types/store'
import FollowersPage from '@/components/content/profile/followersPage.vue'
import WalletPage from '@/components/content/profile/walletPage.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE

export default defineComponent({
  name: 'ProfilePage',
  components: {
    DangLoader,
    ProfileCard,
    ProfileInfoCard,
    ProfileMenu,
    Post,
    InfScroll,
    CollectionsPage,
    PostInfo,
    LineLoader,
    FollowersPage,
    WalletPage
  },
  setup() {
    const route = useRoute()
    const userId = route.params.userId as string
    const accountRoute = route.params.accountRoute as string
    const search = ref('')
    const store = useMainStore()
    const apiError = ref(false)
    const apiErrorMsg = ref('')
    const isLoadingUser = ref(true)
    const influence: Ref<null | string> = ref(null)
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([])
    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')
    const userFields = ref([]) as Ref<Array<NameValue>>
    const posts = ref([]) as Ref<Array<unknown>>
    const postsIndex = ref(0)
    const postLoaded = ref(false)
    const feedLoading = ref(false)
    const currentMenuTab = ref(
      Object.keys(MENU_BUTTONS).includes(accountRoute) ? (MENU_BUTTONS as { [key: string]: string })[accountRoute] : MENU_BUTTONS.feed
    )
    const catComp = ref(null) as Ref<unknown>

    const collections = useCollectionStore()
    const collectionsEx = useCollectionStoreEx()
    const postInfo = ref(null) as Ref<unknown>
    const followers = ref([]) as Ref<string[]>
    const isAuth = ref(store.isLoggedIn)

    const userData = ref({
      username: '',
      followers: 0,
      following: 0,
      totalVotes: 0,
      balance: '',
      balanceNum: 0,
      weight: '',
      avatar: '',
      bio: '',
      score: '',
      cum_deposit_time: 0,
      nextReset: '',
      evmAddress: '',
      actionBars: {
        vote: '',
        deleteVote: '',
        follow: ''
      }
    }) as unknown as Ref<Awaited<ReturnType<typeof createUserData>>['data']['userData']>
    // const router = useRouter()

    const siteData = reactive({
      title: `YUP Profile - ${userData.value?.username ?? ''}`,
      description: `Check my web3 YUP social profile --- yup.info.gf`
    })

    store.$subscribe(async () => {
      isAuth.value = store.isLoggedIn

      if (store.deletePost) {
        const el = document?.getElementById(store.deletePost)
        if (el) {
          el.style.opacity = '0'
        }
        await wait(600)
        posts.value = posts.value.filter((p) => (p as { _id: { postid: string } })._id.postid !== store.deletePost)
      }

      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
    })

    watch(currentMenuTab, (newValue) => {
      // const oldValue = currentMenuTab.value
      currentMenuTab.value = newValue
      // if (oldValue !== newValue) {
      //   if (newValue === MENU_BUTTONS.FEED) {
      //     // do nothing
      //   } else if (oldValue === MENU_BUTTONS.COLLECTIONS) {
      //   }
      // }
    })

    const getActionUsage = (userId: string) => {
      createActionUsage(userId, userData.value.balanceNum).then((d) => {
        if (!d.error) {
          userData.value.nextReset = d.nextReset as string
          userData.value.actionBars.deleteVote = d.actionBars?.deleteVote as string
          userData.value.actionBars.follow = d.actionBars?.follow as string
          userData.value.actionBars.vote = d.actionBars?.vote as string
        }
      })
    }

    const getHomeFeedPosts = async (start = 0) => {
      const res = await fetch(`${API_BASE}/feed/account/${userId}?start=${start}&limit=10`)
      const data = await res.json()
      return data.posts
    }

    // const getCreatedFeedPosts = async (start = 0) => {
    //   const res = await fetch(`${API_BASE}/feed/account/${userId}/web3?start=${start}&limit=10`)
    //   const data = await res.json()
    //   return data.posts
    // }

    let getFeedPosts = getHomeFeedPosts

    const scrollIntoView = (id: string) => {
      const el = document.getElementById(id)
      console.log(el)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }

    const onHit = async (type: string) => {
      feedLoading.value = true
      if (type === 'up' && posts.value.length <= 30) {
        return
      } else if (type === 'up' && postsIndex.value >= 30) {
        postsIndex.value -= 10
        const newPosts = await getHomeFeedPosts(postsIndex.value - 30)
        posts.value = [...newPosts, ...posts.value.slice(-30)]
        try {
          scrollIntoView((posts.value[20] as Record<string, { postid: string }>)?._id?.postid)
        } catch (error) {
          console.log(error)
        }
      } else if (type === 'down' && posts.value.length <= 30) {
        postsIndex.value += 10
        const newPosts = await getHomeFeedPosts(postsIndex.value)
        posts.value = [...posts.value, ...newPosts]
      } else if (type === 'down' && posts.value.length >= 30) {
        postsIndex.value += 10
        const newPosts = await getHomeFeedPosts(postsIndex.value)
        posts.value = [...posts.value.slice(10), ...newPosts]
      }
      feedLoading.value = false
    }

    const resetPosts = async () => {
      posts.value = []
      postLoaded.value = false
      getFeedPosts().then((res) => {
        posts.value = res
        if (!postInfo.value) {
          postInfo.value = posts.value[0]
        }
        postLoaded.value = true
      })
    }

    const menuChange = (tabId: string) => {
      currentMenuTab.value = tabId
      if (currentMenuTab.value === MENU_BUTTONS.feed) {
        getFeedPosts = getHomeFeedPosts
        resetPosts()
      }
      // else if (currentMenuTab.value === MENU_BUTTONS.web3) {
      //   getFeedPosts = getCreatedFeedPosts
      //   resetPosts()
      // }
    }

    const collectionsPageCollections = computed(() => {
      if (userId !== store.userData.account) {
        return collectionsEx.collections
      } else {
        return collections.collections
      }
    })

    const collectionsPagePromise = computed(() => {
      if (userId !== store.userData.account) {
        return collectionsEx.collectionsPromise as Promise<ICollection[]>
      } else {
        return collections.collectionsPromise as Promise<ICollection[]>
      }
    })

    onMounted(async () => {
      getUserFollowers(userId).then((r) => {
        if (!r.error) {
          userData.value.followers = r?.data?.length
          followers.value = r?.data ?? []
        } else {
          console.error(r.msg)
        }
      })
      createUserData(userId, true).then((uD) => {
        if (uD.error) {
          console.error('API error')
        } else {
          userData.value = Object.assign(userData.value, uD.data?.userData)
          userFields.value = uD.data?.userFields ?? []
          getActionUsage(userId)
        }
        isLoadingUser.value = false
      })

      if (userId !== store.userData.account) {
        collectionsEx.collectionsPromise = getCollections(collectionsEx, userId, true) as Promise<ICollection[]>
      } else {
        collections.collectionsPromise = getCollections(collections, userId) as Promise<ICollection[]>
      }
      if (currentMenuTab.value === MENU_BUTTONS.feed) {
        getFeedPosts = getHomeFeedPosts
      } else if (currentMenuTab.value === MENU_BUTTONS.wallet) {
        // getFeedPosts = getCreatedFeedPosts
      }
      resetPosts().then(async () => {
        if (posts.value.length < 1) {
          catComp.value = (await import('@/components/content/icons/catEmpty.vue')).default
        }
      })
      console.log(accountRoute)
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: 'description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'og:description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:image',
          content: computed(() => userData.value?.avatar)
        }
      ]
    } as unknown as Ref<HeadObject>)

    onUnmounted(() => {
      // do nothing
    })

    return {
      search,
      apiError,
      apiErrorMsg,
      userData,
      userId,
      influence,
      historicInfluence,
      iconsColor,
      isLoadingUser,
      userFields,
      posts,
      onHit,
      postLoaded,
      menuChange,
      currentMenuTab,
      MENU_BUTTONS,
      collectionsPageCollections,
      collectionsPagePromise,
      postTypesPromises,
      postInfo,
      feedLoading,
      followers,
      catComp,
      isAuth
    }
  }
})
</script>

<style lang="scss">
.profile {
  justify-content: space-evenly;
}
</style>