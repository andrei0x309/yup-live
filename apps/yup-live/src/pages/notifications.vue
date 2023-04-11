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
              <div :class="`notBLine inline-block p-1 mr-3`"></div>
              <div class="flex w-full">
                <div class="flex flex-col">
                  <p class="ml-4 mt-1 pb-4 flex items-center">
                    <template v-if="notification.like">
                      <ThumbsUp class="w-6 opacity-70" :isSolid="true" />
                    </template>
                    <template v-else>
                      <ThumbsDown class="w-6 opacity-70" :isSolid="true" />
                    </template>
                  </p>
                  <ImagePreview
                    :source="notification.image"
                    :noPreviewParagraph="false"
                    :imgClass="`max-h-16 max-w-16 imgNotRadius`"
                    :previewClass="`max-h-16 max-w-16 imgNotRadius`"
                    :noPreviewClass="`max-h-16 max-w-16 min-h-16 min-max-w-16 imgNotRadius`"
                  />
                </div>
                <div class="flex flex-col w-full">
                  <div class="flex">
                    <p class="ml-3 flex items-center pb-2">
                      <b class="mr-2 opacity-60">by</b>
                      <router-link :to="`/profile/${notification.voter}`">{{ notification.voter }}</router-link>
                    </p>
                  </div>
                  <p class="ml-3 mt-3 flex items-center w-full">
                    <b class="mr-2 opacity-60" style="writing-mode: vertical-rl; text-orientation: upright">URL</b
                    ><span style="font-size: 0.78rem"
                      ><router-link :to="`/post/${notification?.post?.postid}`">{{ notification?.post?.url }}</router-link></span
                    >
                  </p>
                  <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
                </div>
              </div>
            </template>
            <template v-else-if="notification.action === 'reward'">
              <div :class="`notBLine inline-block p-1 mr-3`"></div>
              <div class="flex w-full">
                <div class="flex flex-col">
                  <p class="ml-3 mt-1 pb-4 flex items-center">You</p>
                  <ImagePreview
                    :source="notification.image"
                    :noPreviewParagraph="false"
                    :imgClass="`max-h-8 max-w-8 imgNotRadius`"
                    :previewClass="`max-h-8 max-w-8 imgNotRadius`"
                    :noPreviewClass="`max-h-8 max-w-8 min-h-8 min-max-w-8 imgNotRadius`"
                  />
                </div>
                <div class="flex flex-col w-full">
                  <div class="flex">
                    <p class="ml-3 flex items-center pb-2 mt-1"><b class="mr-2 opacity-60">were alocated a future reward of:</b></p>
                  </div>
                  <p class="ml-3 mt-3 flex items-center">
                    <b class="mr-2 opacity-60">{{ notification?.quantity ?? 'unknown' }}</b> YUP
                  </p>
                  <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
                </div>
              </div>
            </template>
            <template v-else-if="['follow', 'unfollow'].includes(notification.action)">
              <div :class="`notBLine inline-block p-1 mr-3`"></div>
            <div class="flex w-full">
              <div class="flex flex-col">
              <router-link :to="`/web3-profile/${notification.EVMRecipient?.address}`">
              <AvatarBtn
                :key="notification?.EVMRecipient?.avatar"
                class="w-9 h-9 mx-auto mt-4"
                imgClass="w-9 h-9"
                :pSource="notification?.EVMRecipient?.avatar"
                :isSelf="false"
                :isTwitter="false"
                :pAccount="notification?.EVMRecipient?.handle"
              />
            </router-link>
              </div>
              <div class="flex flex-col w-full">
                <div class="flex">
                  <p class="ml-3 flex items-center pb-2 mt-4">
                  <router-link :to="`/web3-profile/${notification.EVMRecipient?.address}`">
                  <b class="mr-2 opacity-60">{{ notification?.EVMRecipient?.handle || `${notification.EVMRecipient?.address?.slice(0, 6)}...` }}</b>
                  </router-link>
                   {{ `${notification.action === 'follow' ? 'followed' : 'unfollowed'}` }} you</p>
                </div>
                <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
              </div>
            </div>
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
            <div :class="`notBLine inline-block p-1 mr-3`"></div>
            <div class="flex w-full">
              <div class="flex flex-col">
                <p class="ml-4 mt-1 pb-4 flex items-center">
                  <template v-if="notification.like">
                    <ThumbsUp class="w-6" :isSolid="true" />
                  </template>
                  <template v-else>
                    <ThumbsDown class="w-6" :isSolid="true" />
                  </template>
                </p>
                <ImagePreview
                  :source="notification.image"
                  :noPreviewParagraph="false"
                  :imgClass="`max-h-16 max-w-16 imgNotRadius`"
                  :previewClass="`max-h-16 max-w-16 imgNotRadius`"
                  :noPreviewClass="`max-h-16 max-w-16 min-h-16 min-max-w-16 imgNotRadius`"
                />
              </div>
              <div class="flex flex-col w-full">
                <div class="flex">
                  <p class="ml-3 flex items-center pb-2">
                    <b class="mr-2 opacity-60">by</b>
                    <router-link :to="`/profile/${notification.voter}`">{{ notification.voter }}</router-link>
                  </p>
                </div>
                <p class="ml-3 mt-3 flex items-center w-full">
                  <b class="mr-2 opacity-60" style="writing-mode: vertical-rl; text-orientation: upright">URL</b
                  ><span style="font-size: 0.78rem"
                    ><router-link :to="`/post/${notification?.post?.postid}`">{{ notification?.post?.url }}</router-link></span
                  >
                </p>
                <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
              </div>
            </div>
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
            <div :class="`notBLine inline-block p-1 mr-3`"></div>
            <div class="flex w-full">
              <div class="flex flex-col">
                <p class="mt-4 ml-4 pb-4 flex items-center">You</p>
                <ImagePreview
                  :source="notification.image"
                  :noPreviewParagraph="false"
                  :imgClass="`max-h-16 max-w-16 imgNotRadius`"
                  :previewClass="`max-h-16 max-w-16 imgNotRadius`"
                  :noPreviewClass="`max-h-16 max-w-16 min-h-16 min-max-w-16 imgNotRadius`"
                />
              </div>
              <div class="flex flex-col w-full">
                <div class="flex">
                  <p class="ml-3 flex items-center pb-2 mt-4"><b class="mr-2 opacity-60">were alocated a future reward of:</b></p>
                </div>
                <p class="ml-6 flex items-center mt-6">
                  <b class="mr-2 opacity-60">{{ notification?.quantity ?? 'unknown' }}</b> YUP
                </p>
                <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
              </div>
            </div>
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
            <div :class="`notBLine inline-block p-1 mr-3`"></div>
            <div class="flex w-full">
              <div class="flex flex-col">
              <router-link :to="`/web3-profile/${notification.EVMRecipient?.address}`">
              <AvatarBtn
                :key="notification?.EVMRecipient?.avatar"
                class="w-9 h-9 mx-auto mt-4"
                imgClass="w-9 h-9"
                :pSource="notification?.EVMRecipient?.avatar"
                :isSelf="false"
                :pAccount="notification?.EVMRecipient?.handle"
              />
              </router-link>
              </div>
              <div class="flex flex-col w-full">
                <div class="flex">
                  <p class="ml-3 flex items-center pb-2 mt-4">
                  <router-link :to="`/web3-profile/${notification.EVMRecipient?.address}`">
                  <b class="mr-2 opacity-60">{{ notification?.EVMRecipient?.handle || `${notification.EVMRecipient?.address?.slice(0, 6)}...` }}</b>
                  </router-link>
                   {{ `${notification.action === 'follow' ? 'followed' : 'unfollowed'}` }} you</p>
                </div>
                <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
              </div>
            </div>
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
// import { useMainStore } from '@/store/main'
import { useRoute } from 'vue-router'
import { timeAgo } from 'shared/src/utils/time'
import ThumbsDown from 'icons/src/thumbsDown.vue'
import ThumbsUp from 'icons/src/thumbsUp.vue'
import ImagePreview from 'components/post/imagePreview.vue'
import ClockIcon from 'icons/src/clock.vue'
import { getNotifications } from 'shared/src/utils/notifications'
import type { NotifType } from 'shared/src/types/notification'
import AvatarBtn from 'components/functional/avatarBtn.vue'

export default defineComponent({
  name: 'Notifications',
  components: {
    DangLoader,
    ThumbsDown,
    ThumbsUp,
    ImagePreview,
    ClockIcon,
    AvatarBtn
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
        notifications.value = (await getNotifications({userId, type: 'all'})).reverse()
      } else if (activeTab.value === '1') {
        notifications.value = (await getNotifications({userId, type: 'vote' })).reverse()
      } else if (activeTab.value === '2') {
        notifications.value = (await getNotifications({userId, type: 'reward' })).reverse()
      } else if (activeTab.value === '3') {
        notifications.value = (await getNotifications({userId, type: 'follow' })).reverse()
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
      timeAgo,
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
