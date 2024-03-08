<template>
  <button class="view-btn flex ml-2 h-6 w-14" @click="openCrossPostModal">
    <ReplyIcon class="inline-block w-4" />
    <span class="inline-block" style="margin-top: 0.2rem" >Reply</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useMainStore } from "@/store/main";
import ReplyIcon from "icons/src/reply.vue";
import { openPostModal } from "@/store/main";
import type { TPlatform, IReplyTo } from "shared/src/types/web3-posting";
import { PLATFORMS } from "shared/src/utils/requests/web3-posting";

export default defineComponent({
  name: "ReplyButton",
  components: {
    ReplyIcon,
  },
  props: {
    replyTo: {
      type: Object as PropType<IReplyTo | null>,
      required: false,
      default: null,
    },
    platforms: {
      type: Array as PropType<TPlatform[]>,
      required: false,
      default: () => PLATFORMS,
    },
  },
  setup(props) {
    const store = useMainStore();

    const openCrossPostModal = () => {
      openPostModal(store, props.replyTo, props.platforms);
    };

    return {
      openCrossPostModal,
    };
  },
});
</script>

<style lang="scss"></style>
