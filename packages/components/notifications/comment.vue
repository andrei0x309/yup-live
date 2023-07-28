<template>
  <div class="flex flex-col w-full">
    <div v-for="sender of notification.senders?.slice(0,1) ?? []" :key="sender?._id" class="flex">
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
          <div class="flex flex-col">
            <div class="flex">
            <p class="ml-3 flex items-center pb-2 mt-4">
              <router-link :to="`/web3-profile/${sender?._id}`">
                <b class="mr-2 opacity-60">{{
                  sender?.handle || `${sender?._id?.slice(0, 6)}...`
                }}</b>
              </router-link>
              commented on your post
              <span
                v-if="notificationPlatforms.includes(notification?.platform as typeof notificationPlatforms[number] )"
                >&nbsp;&nbsp;on
                <component
                  :is="icons[notification.platform as typeof notificationPlatforms[number]]"
                  class="inline-block w-4 ml-2"
                />
              </span>
            </p>
            </div>
            <p class="m-l-4 p-1 text-left">{{ truncateText(notification?.meta?.content ?? "", 200) }}</p>
            <div v-if="notification?.senders?.length > 1">
            <p>Other comentators</p>
            <div class="grid grid-cols-2 gap-4">
            <template v-for="sender of notification.senders.slice(1)" :key="sender?._id">
              <AvatarBtn
              class="w-9 h-9 mx-auto mt-4"
              imgClass="w-9 h-9"
              :pSource="sender?.avatar"
              :isSelf="false"
              :isTwitter="false"
              :pAccount="sender?.handle"
             />
             <div>{{  sender?.handle || `${sender?._id?.slice(0, 6)}...`  }}</div>
            </template>
          </div>
            </div>
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
import { truncateText } from 'shared/src/utils/misc'


export default defineComponent({
  name: "CommentNotification",
  components: {
    ClockIcon,
    AvatarBtn,
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
      icons,
      notificationPlatforms,
      truncateText
    };
  },
});
</script>
