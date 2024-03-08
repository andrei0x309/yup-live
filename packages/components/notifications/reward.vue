<template>
  <div :class="`notBLine inline-block p-1 mr-3`"></div>
  <div class="flex w-full">
    <div class="flex flex-col min-w-10">
      <p class="ml-3 mt-1 pb-4 flex items-center">You</p>
      <ImagePreview
        :source="['/res/reward_optimized.png']"
        :noPreviewParagraph="false"
        :imgClass="`max-h-8 max-w-8 imgNotRadius aspect-square`"
        :previewClass="`max-h-8 max-w-8 imgNotRadius aspect-square`"
        :noPreviewClass="`max-h-8 max-w-8 min-h-8 min-max-w-8 imgNotRadius *:aspect-square`"
        :noLightbox="true"
        :noBorder="true"
      />
    </div>
    <div class="flex flex-col w-full">
      <div class="flex">
        <p class="ml-3 flex items-center pb-2 mt-1">
          <b class="mr-2 opacity-60">were alocated a future reward of:</b>
        </p>
      </div>
      <p class="ml-3 mt-3 flex items-center">
        <b class="mr-2 opacity-60">{{ notification?.meta.quantity ?? "unknown" }}</b> YUP
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
import ImagePreview from "../post/imagePreview.vue";
import ClockIcon from "icons/src/clock.vue";
import type { NotifType } from "shared/src/types/notification";

export default defineComponent({
  name: "RewardNotification",
  components: {
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
