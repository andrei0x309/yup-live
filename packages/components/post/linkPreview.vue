<template>
  <div
    class="flex flex-col content-center justify-center items-center linkPreview"
    @click="openLink(linkPreview.url)"
  >
    <template v-if="!noImage && linkPreview?.img">
      <div class="text-[0.8rem] description">
        <ImagePreview
        :source="[linkPreview.img]"
        imgClass="min-h-[14rem] rounded-lg"
        style="object-fit: cover;"
        :noPreviewParagraph="false"
        :noLightbox="true"
        :noBorder="true"
      />
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
  margin-top: 2rem;
  margin-right: 1rem;
  position: relative;
  .description {
    padding: 0.8rem;
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
