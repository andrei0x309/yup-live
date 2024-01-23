<template>
  <template v-for="(key, index) of Object.keys(icons)" :key="key">
    <component :is="icons[key]" :class="`w-4 h-4 mfavIco`" />
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { PostBodyProcessed } from "shared/src/types/post";

import LensIcon from "icons/src/lens.vue";
import FarcasterIcon from "icons/src/farcaster.vue";
import TwitterIcon from "icons/src/twitter.vue";
import BskyIcon from "icons/src/bsky.vue";

export default defineComponent({
  name: "CrossIconGroup",
  components: {},
  props: {
    post: {
      type: Object as PropType<PostBodyProcessed>,
      required: true,
    },
  },
  setup(props) {
    const iconComp = {
      lens: LensIcon,
      farcaster: FarcasterIcon,
      twitter: TwitterIcon,
      bsky: BskyIcon,
    } as Record<string, typeof LensIcon>;

    const icons = Object.keys(props.post?.crossPostGroup ?? {}).reduce((acc, key) => {
      if (props.post?.crossPostGroup?.[key]) {
        acc[key] = iconComp[key];
      }
      return acc;
    }, {} as Record<string, typeof LensIcon>);

    return {
      icons,
    };
  },
});
</script>
