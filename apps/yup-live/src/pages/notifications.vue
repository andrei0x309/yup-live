<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color page-not table-list w-full mb-4 flex flex-col">
      <h2 class="text-lg tracking-wide uppercase nothead">Notifications</h2>

      <o-tabs
        v-model="activeTab"
        :multiline="true"
        :expanded="true"
        type="default"
        position="centred"
        variant="warning"
        navTypeClass="boxed"
      >
        <o-tab-item value="0" label="ALL">
          <DangLoader v-if="loading" class="-mt-4" />
          <div v-if="!loading && !notifications?.length">
            <p class="text-center text-[1.4rem] mt-10">No notifications exists</p>
          </div>
          <div
            v-for="notification of notifications"
            v-else
            :key="notification._id"
            class="shadow-md p-4 flex flex-row rounded-lg relative notComp"
          >
            <template v-if="notification.action === 'vote'">
            <VoteNotification :notification="notification" />
            </template>
            <template v-else-if="notification.action === 'reward'">
              <RewardNotification :notification="notification" />
            </template>
            <template v-else-if="['follow', 'unfollow'].includes(notification.action)">
              <FollowUnfollowNotification :notification="notification" />
            </template>
          </div>
        </o-tab-item>

        <o-tab-item value="1" label="Votes">
          <DangLoader v-if="loading" class="-mt-4" />
          <div v-if="!loading && !notifications?.length">
            <p class="text-center text-[1.4rem] mt-10">No notifications exists</p>
          </div>
          <div
            v-for="notification of notifications"
            v-else
            :key="notification._id"
            class="shadow-md p-4 flex flex-row rounded-lg relative notComp"
          >
          <VoteNotification :notification="notification" />
          </div>
        </o-tab-item>
        <o-tab-item value="2" label="Rewards">
          <DangLoader v-if="loading" class="-mt-4" />
          <div v-if="!loading && !notifications?.length">
            <p class="text-center text-[1.4rem] mt-10">No notifications exists</p>
          </div>
          <div
            v-for="notification of notifications"
            v-else
            :key="notification._id"
            class="shadow-md p-4 flex flex-row rounded-lg relative notComp"
          >
          <RewardNotification :notification="notification" />
          </div>
        </o-tab-item>
        <o-tab-item value="3" label="Followers">
        <DangLoader v-if="loading" class="-mt-4" />
          <div v-if="!loading && !notifications?.length">
            <p class="text-center text-[1.4rem] mt-10">No followers notifications exists</p>
          </div>
          <div
            v-for="notification of notifications"
            v-else
            :key="notification._id"
            class="shadow-md p-4 flex flex-row rounded-lg relative notComp"
          >
          <FollowUnfollowNotification :notification="notification" />
          </div>
        </o-tab-item>
      </o-tabs>

      <!-- <input
          v-model="search"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="username or account id"
        /> -->

      <!-- <button
          type="button"
          class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100"
          :class="search.length > 0 ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
          :disabled="search.length == 0"
          @click="getUserData"
        >
          check
        </button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref, watch } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from 'components/vote-list/loader.vue'
import { useRoute } from 'vue-router'
import { getNotifications } from 'shared/src/utils/notifications'
import type { NotifType } from 'shared/src/types/notification'

import VoteNotification from '@/components/content/notifications/vote.vue'
import RewardNotification from '@/components/content/notifications/reward.vue'
import FollowUnfollowNotification from '@/components/content/notifications/followUnfollow.vue'

export default defineComponent({
  name: 'Notifications',
  components: {
    DangLoader,
    VoteNotification,
    RewardNotification,
    FollowUnfollowNotification
  },
  setup() {
    const loading = ref(false)
    // const search = ref("");
    // const store = useMainStore();



    const route = useRoute()
    const userId = route.params.userId as string
    const notifications = ref([]) as Ref<NotifType[]>
    const activeTab = ref('0') as Ref<string>

    const siteData = reactive({
      title: `YUP Live view your notifications`,
      description: `YUP Live view notifications about votes & rewards`
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: 'og:image',
          content: `/share/yup-live-ogs/og-yup-live-default.png`
        },
        {
          name: 'description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:type',
          content: 'website'
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
          name: 'og:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'twitter:description',
          content: computed(() => siteData.description)
        }
      ]
    } as unknown as Ref<HeadObject>)

    onUnmounted(() => {
      // do nothing
    })



    // const checkAccount = async () => {
    //   const reqAcc = await fetch(`${API_BASE}/accounts/${search.value}`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8",
    //     },
    //   });
    //   if (!reqAcc.ok) {
    //     apiErrorMsg.value = "Account not found, please check your spelling.";
    //     apiError.value = true;
    //     isDataLoading.value = false;
    //     return false;
    //   }
    //   const acc = await reqAcc.json();
    //   userId.value = acc._id;
    //   return acc._id;
    // };


    const getByActiveTab = async () => {
      if (activeTab.value === '0') {
        notifications.value = (await getNotifications({userId, type: null})).reverse()
      } else if (activeTab.value === '1') {
        notifications.value = (await getNotifications({userId, type: ['vote'] })).reverse()
      } else if (activeTab.value === '2') {
        notifications.value = (await getNotifications({userId, type: ['reward'] })).reverse()
      } else if (activeTab.value === '3') {
        notifications.value = (await getNotifications({userId, type: ['follow, unfollow'] })).reverse()
      }
    }

    watch(
      () => activeTab.value,
      async () => {
        loading.value = true
        await getByActiveTab()
        console.log(notifications.value)
        loading.value = false
      }
    )

    onMounted(async () => {
      loading.value = true
      await getByActiveTab()
      loading.value = false
    })

    return {
      notifications,
      userId,
      loading,
      activeTab
    }
  }
})
</script>

<style lang="scss">
.notComp {
  border: 1px solid #181818;
  margin-top: 2rem;
  font-size: 0.93rem;
  width: 100%;
  max-width: 46rem;
  word-break: break-all;
}

.notBLine {
  border-right: 2px solid dimgrey;
  opacity: 0.5;
}

.page-not {
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
    -moz-appearance: none;
    -webkit-appearance: none;
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
    min-height: calc(100vh - 2rem);
    display: flex;
    align-items: center;
  }

  .o-tabs {
    min-height: calc(100vh - 2rem);
  }

  .o-tabs__content {
    min-height: calc(100vh - 2rem);
  }

  .o-tab-item__content {
    display: contents;
  }
}
</style>
