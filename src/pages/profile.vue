<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color flex flex-col">
      <div class="profile w-full mb-4 flex flex-row">
        <DangLoader v-if="isLoadingUser" class="mt-28" :unset="true" />
        <ProfileCard v-else :userData="userData" :color="iconsColor" />
        <ProfileInfoCard class="mt-8" :bio="userData.bio" :fields="userFields" />
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
      <ProfileMenu @change="menuChange" />
    </div>
    <div class="bg-color table-list profile w-full mb-4 flex flex-column">
      <InfScroll v-if="currentMenuTab === MENU_BUTTONS.FEED" :key="`${postLoaded}-loaded`" :postLoaded="postLoaded" @hit="onHit">
        <template #content>
          <template v-for="post of posts" :key="post._id.postid">
            <Post
              :id="(post  as Record<string, any>)._id.postid"
              :post="(post as Record<string, any>)"
              :postTypesPromises="postTypesPromises"
            />
          </template>
        </template>
      </InfScroll>
      <CollectionsPage
        v-if="currentMenuTab === MENU_BUTTONS.COLLECTIONS"
        :accountId="userId"
        :collections="collectionsPageCollections"
        :collectionPromise="collectionsPagePromise"
      />
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
import { getNormalizedValue, getMaxVote, MAX_DELETE_VOTE, MAX_FOLLOW_USAGE, makePercentage, makeRandAvatar } from '../utils/misc'
import Post from '@/components/content/post/post.vue'
import type { NameValue } from '@/types/common'
import type { ICollection } from '@/types/store'
import { wait } from '@/utils/time'
import { useCollectionStore, useCollectionStoreEx, getCollections } from '@/store/collections'
import { MENU_BUTTONS } from '@/components/content/profile/menuButtonEnums'
import CollectionsPage from '@/components/content/profile/collectionsPage.vue'

const postTypesPromises = {
  preloadGeneral: import(`@/components/content/post/post-types/general.vue`),
  preloadYoutube: import(`@/components/content/post/post-types/youtube.vue`),
  preLoadTweet: import(`@/components/content/post/post-types/tweet.vue`)
}

export default defineComponent({
  name: 'ProfilePage',
  components: {
    DangLoader,
    ProfileCard,
    ProfileInfoCard,
    ProfileMenu,
    Post,
    InfScroll,
    CollectionsPage
  },
  setup() {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    const search = ref('')
    const store = useMainStore()
    const apiError = ref(false)
    const apiErrorMsg = ref('')
    const isLoadingUser = ref(true)
    const influence: Ref<null | string> = ref(null)
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([])
    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')
    const route = useRoute()
    const userFields = ref([]) as Ref<Array<NameValue>>
    const posts = ref([]) as Ref<Array<unknown>>
    const postsIndex = ref(0)
    const postLoaded = ref(false)
    const currentMenuTab = ref(MENU_BUTTONS.FEED)
    const collections = useCollectionStore()
    const collectionsEx = useCollectionStoreEx()

    const userData = reactive({
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
      actionBars: {
        vote: '',
        deleteVote: '',
        follow: ''
      }
    })
    // const router = useRouter()
    const userId = route.params.userId as string

    const siteData = reactive({
      title: `YUP Profile - ${userData.username}`,
      description: `Check my web3 YUP social profile --- yup.info.gf`
    })

    store.$subscribe(async () => {
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

    const noBio = (username: string) => `Hi there I am ${username} I signed up on YUP DApp but I haven't written anything about myself yet.`

    const getUserData = async (userId: string) => {
      const res = await fetch(`${API_BASE}/accounts/${userId}`)
      const data = await res.json()
      const {
        _id,
        username,
        balance,
        total_vote_value,
        total_claimed_rewards,
        weight,
        lastAddRewardTxDateCreator,
        lastAddRewardTxDateCurator,
        score,
        avatar,
        twitterInfo,
        cum_deposit_time,
        bio,
        createdAt,
        ethInfo
      } = data
      userData.username = username
      userData.balance = formatNumber(balance.YUP)
      userData.balanceNum = balance.YUP
      userData.weight = formatNumber(weight)
      userData.score = formatNumber(score)
      userData.avatar = avatar ? (avatar.startsWith('https://ipfs2.yup.io') ? makeRandAvatar(_id) : avatar) : makeRandAvatar(_id)
      userData.cum_deposit_time = cum_deposit_time
      !bio ? (userData.bio = noBio(username)) : (userData.bio = bio)
      const userInfoFields = [
        {
          name: 'Created At:',
          value: createdAt
        },
        {
          name: 'Cumulative Deposit Time',
          value: formatNumber(cum_deposit_time)
        },
        {
          name: 'Total Rewards Claimed',
          value: formatNumber(total_claimed_rewards)
        },
        {
          name: 'Total Vote Value',
          value: formatNumber(total_vote_value)
        },
        {
          name: 'Last Curator Reward',
          value: lastAddRewardTxDateCurator
        },
        {
          name: 'Total Creator Reward',
          value: lastAddRewardTxDateCreator
        }
      ]
      if (ethInfo?.address) {
        userInfoFields.splice(1, 0, {
          name: 'Linked ETH Address',
          value: ethInfo.address.substring(0, 5) + '...' + ethInfo.address.substring(ethInfo.address.length - 3)
        })
      } else {
        userInfoFields.splice(1, 0, {
          name: 'Linked ETH Address',
          value: 'Not linked'
        })
      }
      if (ethInfo?.isMirror) {
        userInfoFields.splice(2, 0, {
          name: 'Mirror Account',
          value: 'Yes'
        })
      } else {
        userInfoFields.splice(2, 0, {
          name: 'Mirror Account',
          value: 'No'
        })
      }
      if (twitterInfo?.userId) {
        userInfoFields.push({
          name: 'Twitter ID',
          value: twitterInfo.userId
        })
      } else {
        userInfoFields.push({
          name: 'Twitter ID',
          value: 'Not linked'
        })
      }
      userFields.value = userInfoFields
    }

    const formatNumber = (num: number) => {
      return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 0
      }).format(num)
    }

    const getUserFollowers = (userId: string) => {
      fetch(`${API_BASE}/followers/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          userData.followers = data.length
        })
    }

    const getActionUsage = (userId: string) => {
      fetch(`${API_BASE}/accounts/actionusage/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          userData.nextReset = new Date(data.lastReset + 864e5).toLocaleString()
          userData.actionBars.deleteVote = makePercentage(getNormalizedValue(MAX_DELETE_VOTE - data.deleteVoteCount, 0, MAX_DELETE_VOTE))
          userData.actionBars.follow = makePercentage(getNormalizedValue(MAX_FOLLOW_USAGE - data.followCount, 0, MAX_FOLLOW_USAGE))
          const MAX_VOTE = getMaxVote(userData.balanceNum)
          userData.actionBars.vote = makePercentage(getNormalizedValue(MAX_VOTE - data.createVoteCount, 0, MAX_VOTE))
          console.log(
            userData.actionBars,
            data,
            makePercentage(getNormalizedValue(data.createVoteCount, 0, MAX_VOTE)),
            MAX_VOTE,
            data.createVoteCount,
            getNormalizedValue(MAX_VOTE - data.createVoteCount, 0, 100)
          )
        })
    }

    const getHomeFeedPosts = async (start = 0) => {
      const res = await fetch(`${API_BASE}/feed/account/${userId}?start=${start}&limit=10`)
      const data = await res.json()
      return data.posts
    }

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
      // console.log(postsIndex.value, (posts.value[0] as {_id: any})._id, posts.value.length)
    }

    const menuChange = (tabId: string) => {
      currentMenuTab.value = tabId
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
      getUserFollowers(userId)
      getUserData(userId).then(() => {
        getActionUsage(userId)
        isLoadingUser.value = false
      })
      getHomeFeedPosts().then((res) => {
        posts.value = res
        console.log(res)
        postLoaded.value = true
      })
      if (userId !== store.userData.account) {
        collectionsEx.collectionsPromise = getCollections(collectionsEx, userId) as Promise<ICollection[]>
      } else {
        collections.collectionsPromise = getCollections(collections, userId) as Promise<ICollection[]>
      }
      console.log(collectionsPageCollections)
      console.log(collectionsPagePromise)
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
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
          content: computed(() => userData.avatar)
        }
      ]
    } as unknown as Ref<HeadObject>)

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
      postTypesPromises
    }
  }
})
</script>

<style lang="scss">
.profile {
  justify-content: space-evenly;
}
</style>