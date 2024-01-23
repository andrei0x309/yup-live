<template>
  <div
    class="flex flex-col content-center justify-center items-center linkPreview" style="margin-top: 1.5rem;"
    @click="openLink(linkPreview.url)"
  >
    <div class="text-[0.8rem] description">
      <p class="flex"><component v-if="EmbedIcon" :is="EmbedIcon" class="w-8 inline ml-auto" /></p>
      <p v-if="linkPreview.title" class="pl-4 mb-2 font-semibold -mt-2">
        {{ truncateText(linkPreview.title, 60) }}
      </p>
      <p v-if="linkPreview.description" class="pb-3 text-[0.75rem]">
        {{ linkPreview.description }}
      </p>
      <p class="pt-1 text-[0.7rem] opacity-80">
        <GotTo class="w-4 mx-1 inline-block -mt-[0.2rem]" />{{
          truncateText(linkPreview.url, 60)
        }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType } from "vue";
import type { linkPreviewTypeEx } from "shared/src/types/post";
import { truncateText, openLink } from "shared/src/utils/misc";
import GotTo from "icons/src/goTo.vue";
import LensIcon from "icons/src/lens.vue";
import FarcasterIcon from "icons/src/farcaster.vue";
import TwitterIcon from "icons/src/twitter.vue";

export default defineComponent({
  name: "SocialWeb3PreviewEmebed",
  components: {
    GotTo,
  },
  props: {
    linkPreview: {
      type: Object as PropType<linkPreviewTypeEx>,
      required: true,
    },
    type: {
      type: String as PropType<"twitter" | "farcaster" | "lens">,
      required: true,
    },
  },
  setup(props) {
    const icons = {
      twitter: TwitterIcon,
      farcaster: FarcasterIcon,
      lens: LensIcon,
    };

    const EmbedIcon = icons?.[props?.type as keyof typeof icons] ?? null

    onMounted(() => {
      // nothing
    });

    return { EmbedIcon, truncateText, openLink };
  },
});
</script>

<style scoped lang="scss">
.linkPreview {
  margin: 0.5rem;
  position: relative;
  min-width: 16rem;
  .description {
    padding: 0.8rem;
    min-width: 16rem;
    width: 100%;
    color: aliceblue;
    line-height: 1.1rem;
    border-radius: 0.3rem;
    margin-top: -0.2rem;
    background: linear-gradient(253deg, rgba(33, 33, 33, 0.14), rgb(24, 24, 24)),
      linear-gradient(161deg, rgba(29, 18, 49, 0.43), rgba(2, 2, 2, 0.79));
    box-shadow: 1px 1px #262d30;
    border: 2px solid #4f4f4fad;
    position: relative;
    top: -0.5rem;
  }
}
.linkPreview:hover {
  cursor: pointer;
  filter: brightness(1.2);
}
.linkPreview:active {
  filter: brightness(0.8);
}
</style>
