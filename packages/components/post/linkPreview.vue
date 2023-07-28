<template>
  <div
    class="flex flex-col content-center justify-center items-center linkPreview"
    @click="openLink(linkPreview.url)"
  >
    <template v-if="!noImage && linkPreview?.img">
      <ImagePreview :source="[linkPreview.img]" :noPreviewParagraph="false" :noLightbox="true" />
      <div class="absolute text-[0.8rem] description">
        <p v-if="linkPreview.title" class="pl-4 mb-2 font-semibold">
          {{ truncateText(linkPreview.title, 60) }}
        </p>
        <p v-if="linkPreview.description" class="pb-3 text-[0.75rem]">
          {{ truncateText(linkPreview.description, 160) }}
        </p>
        <p class="pt-1 text-[0.7rem] opacity-80">
          <GotTo class="w-4 mx-1 inline-block -mt-[0.2rem]" />{{
            truncateText(linkPreview.url, 60)
          }}
        </p>
      </div>
    </template>
    <template v-else>
      <div class="text-[0.8rem] description">
        <p v-if="linkPreview.title" class="pb-3 my-4 pl-4 font-semibold">
          {{ truncateText(linkPreview.title, 60) }}
        </p>
        <p class="pt-1 text-[0.7rem] opacity-80">
          <GotTo class="w-4 mx-1 inline-block -mt-[0.2rem]" />{{
            truncateText(linkPreview.url, 60)
          }}
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType } from "vue";
import ImagePreview from "./imagePreview.vue";
import type { OpenGraphPreview } from "shared/src/types/post";
import { truncateText, openLink } from "shared/src/utils/misc";
import GotTo from "icons/src/goTo.vue";

export default defineComponent({
  name: "LinkPreview",
  components: {
    ImagePreview,
    GotTo,
  },
  props: {
    linkPreview: {
      type: Object as PropType<OpenGraphPreview>,
      required: true,
    },
    noImage: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    onMounted(() => {
      // nothing
    });

    return { truncateText, openLink };
  },
});
</script>

<style scoped lang="scss">
.linkPreview {
  margin: 0.5rem;
  margin-top: 0;
  position: relative;
  .description {
    bottom: 0.5rem;
    padding: 0.8rem;
    width: 98%;
    color: aliceblue;
    line-height: 1.1rem;
    border-radius: 0.3rem;
    margin-top: 1rem;
    background: linear-gradient(
        234deg,
        rgba(80, 76, 76, 0.1411764706),
        rgba(24, 24, 24, 0.5490196078)
      ),
      linear-gradient(39deg, rgba(98, 92, 92, 0.432), rgba(32, 31, 31, 0.788));
    box-shadow: 1px 1px #262d30;
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
