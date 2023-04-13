<template>
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
            <b class="mr-2 opacity-60">{{
              notification?.EVMRecipient?.handle ||
              `${notification.EVMRecipient?.address?.slice(0, 6)}...`
            }}</b>
          </router-link>
          {{ `${notification.action === "follow" ? "followed" : "unfollowed"}` }} you
        </p>
      </div>
      <p class="ml-3 flex items-center mt-4 self-end">
        <ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
// import { useMainStore } from '@/store/main'
import { timeAgo } from "shared/src/utils/time";
import AvatarBtn from "components/functional/avatarBtn.vue";
import ClockIcon from "icons/src/clock.vue";
import type { NotifType } from "shared/src/types/notification";

export default defineComponent({
  name: "FollowUnfollowNotification",
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
    };
  },
});
</script>
