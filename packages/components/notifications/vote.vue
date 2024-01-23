<template>
  <div :class="`notBLine inline-block p-1 mr-3`"></div>
  <div class="flex w-full">
    <div class="flex flex-col">
      <p class="ml-3 mr-1 mt-1 pb-4 flex items-center">
      <LikesIcon  class="w-6 opacity-70" :isSolid="true"/>
      </p>
      <div class="text-center">on: 
      <component
            :is="icons[notification.platform as typeof platforms[number]]"
            class="inline-block w-8 ml-auto" />
          </div>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex flex-col">
        <p class="ml-3 flex items-center pb-1">
          <b class="mr-2 opacity-60">by</b>
          <template v-if="notification?.senders?.length > 1">
            <template v-if="notification?.senders?.length <= 3">
              <template v-for="(not, index) of notification.senders" :key="index">
                <router-link :to="`/web3-profile/${not?._id}`">{{
                  not.handle
                }}</router-link>
                <template v-if="index !== notification?.senders?.length - 1">
                  <span class="opacity-60">,&nbsp;</span>
                </template>
              </template>
            </template>
            <template v-else>
              <template
                v-for="(not, index) of notification.senders.slice(0, 3)"
                :key="index"
              >
                <router-link :to="`/web3-profile/${not?._id}`">{{
                  not.handle
                }}</router-link>
                <template v-if="index !== 2">
                  <span class="opacity-60">,&nbsp;</span>
                </template>
              </template>
            </template>
          </template>
          <router-link v-else :to="`/web3-profile/${notification.senders[0]?._id}`">{{
            notification.senders[0]?.handle
          }}</router-link>
        </p>
        <template v-if="notification.count > 3">
                <span class="opacity-60 ml-2 flex items-center pb-1"
                  >&nbsp;and {{ notification.count - 3 }} more</span
                >
       </template>
      </div>
      <p class="ml-3 mt-3 flex items-center w-full">
        <span style="font-size: 0.78rem"
          ><router-link :to="`/post/${notification?.meta?.postId ?? notification?.yupPostId}`">
          Liked this post
          </router-link></span
        >
      </p>
      <p class="ml-3 flex items-center mt-4 self-end">
        <ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { timeAgo } from "shared/src/utils/time";
import ClockIcon from "icons/src/clock.vue";
import type { NotifType } from "shared/src/types/notification";
import ProfileLensIcon from "icons/src/profileLens.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileYupIcon from "icons/src/profileYup.vue";
import ProfileBlueSkyIcon from "icons/src/bsky.vue";
import LikesIcon from "icons/src/likes.vue"

const platforms = [ 'lens', 'farcaster', 'yup', 'bsky'] as const

const icons = {
  lens: ProfileLensIcon,
  farcaster: ProfileFarcasterIcon,
  yup: ProfileYupIcon,
  bsky: ProfileBlueSkyIcon,
} as const

export default defineComponent({
  name: "VoteNotification",
  components: {
    ClockIcon,
    LikesIcon
  },
  props: {
    notification: {
      type: Object as PropType<NotifType>,
      required: true,
    },
  },
  setup() {
    return {
      timeAgo,
      platforms,
      icons
    };
  },
});
</script>
