<template>
  <div class="flex flex-col w-full">
  <div v-for="sender of notification.senders ?? []" :key="sender?._id" class="flex">
  <div :class="`notBLine inline-block p-1 mr-3`"></div>
  <div class="flex w-full">
    <div class="flex flex-col">
      <router-link :to="`/web3-profile/${sender?._id}`">
        <AvatarBtn
          :key="sender?.avatar"
          class="w-9 h-9 mx-auto mt-4"
          imgClass="w-9 h-9"
          :pSource="sender?.avatar"
          :isSelf="false"
          :isTwitter="false"
          :pAccount="sender?.handle"
        />
      </router-link>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex">
        <p class="ml-3 flex items-center pb-2 mt-4">
          <router-link :to="`/web3-profile/${sender?._id}`">
            <b class="mr-2 opacity-60">{{
              sender?.handle ||
              `${sender?._id?.slice(0, 6)}...`
            }}</b>
          </router-link>
          <template v-if="type === 'follow'">
            started following you
          </template>
          <template v-else-if="type === 'mention'">
            mentioned you in a post
          </template>
          <template v-else-if="type === 'repost'">
            reposted your post
          </template>
          <span v-if="notificationPlatforms.includes(notification?.platform as typeof notificationPlatforms[number] )">&nbsp;on
          <component
            :is="icons[notification.platform as typeof notificationPlatforms[number]]"
            class="inline-block w-4" /> 
          </span>
        </p>
      </div>
      <p class="ml-3 flex items-center mt-4 self-end">
        <ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}
      </p>
    </div>
  </div>
</div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
// import { useMainStore } from '@/store/main'
import { timeAgo } from "shared/src/utils/time";
import AvatarBtn from "../functional/avatarBtn.vue";
import ClockIcon from "icons/src/clock.vue";
import type { NotifType } from "shared/src/types/notification";
import { notificationPlatforms } from "shared/src/utils/notifications";
import { icons } from './notif-icons'

export default defineComponent({
  name: "FollowNotification",
  components: {
    ClockIcon,
    AvatarBtn,
  },
  props: {
    notification: {
      type: Object as PropType<NotifType>,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "follow",
    },
  },
  setup() {
    return {
      timeAgo,
      icons,
      notificationPlatforms
    };
  },
});
</script>
