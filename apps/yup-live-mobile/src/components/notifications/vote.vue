<template>
  <div :class="`notBLine inline-block p-1 mr-3`"></div>
  <div class="flex w-full">
    <div class="flex flex-col min-w-10">
      <p class="ml-4 mt-1 pb-4 flex items-center">
        <template v-if="notification.like">
          <ThumbsUp class="w-6 opacity-70" :isSolid="true" />
        </template>
        <template v-else>
          <ThumbsDown class="w-6 opacity-70" :isSolid="true" />
        </template>
      </p>
      <ImagePreview
        v-if="typeof notification.image === 'string'"
        :source="notification.image"
        :noPreviewParagraph="false"
        :imgClass="`max-h-16 max-w-16 rounded-[0.2rem]`"
        :previewClass="`max-h-16 max-w-16 rounded-[0.2rem]`"
        :noPreviewClass="`max-h-16 max-w-16 min-h-16 min-max-w-16 imgNotRadius`"
      />
      <component :is="notification.image" v-else />
    </div>
    <div class="flex flex-col w-full">
      <div class="flex">
        <p class="ml-3 flex items-center pb-2 text-[0.7rem] mt-4">
          <b class="mr-2 opacity-60">by</b>
          <template v-if="notification?.notifications?.length > 1">
            <template v-if="notification.notifications.length <= 3">
              <template v-for="(not, index) of notification.notifications" :key="index">
                <router-link :to="`/profile/${not.voter}`">{{
                  not.VoterHandle
                }}</router-link>
                <template v-if="index !== notification.notifications.length - 1">
                  <span class="opacity-60">,&nbsp;</span>
                </template>
              </template>
            </template>
            <template v-else>
              <template
                v-for="(not, index) of notification.notifications.slice(0, 3)"
                :key="index"
              >
                <router-link :to="`/profile/${not.voter}`">{{
                  not.VoterHandle
                }}</router-link>
                <template v-if="index !== 2">
                  <span class="opacity-60">,&nbsp;</span>
                </template>
              </template>
              <template v-if="notification.count > 3">
                <span class="opacity-60"
                  >&nbsp;and {{ notification.count - 3 }} more</span
                >
              </template>
            </template>
          </template>
          <router-link v-else :to="`/profile/${notification.voter}`">{{
            notification.VoterHandle
          }}</router-link>
        </p>
      </div>
      <p class="ml-3 mt-3 flex items-center w-full">
        <b class="mr-2 opacity-60" style="transform: rotate(90deg); width: 2.5rem">URL</b
        ><span style="font-size: 0.78rem"
          ><router-link :to="`/tabs/post/${notification?.post?.postid}`">{{
            notification?.post?.url?.length > 30
              ? notification?.post?.url?.slice(0, 28) + "..."
              : notification?.post?.url?.length
          }}</router-link></span
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
import ThumbsDown from "icons/src/thumbsDown.vue";
import ThumbsUp from "icons/src/thumbsUp.vue";
import ImagePreview from "components/post/imagePreview.vue";
import ClockIcon from "icons/src/clock.vue";
import type { NotifType } from "shared/src/types/notification";

export default defineComponent({
  name: "VoteNotification",
  components: {
    ThumbsDown,
    ThumbsUp,
    ImagePreview,
    ClockIcon,
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
