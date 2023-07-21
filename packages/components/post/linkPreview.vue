<template>
  <div class="flex flex-col content-center justify-center items-center linkPreview">
    <ImagePreview :source="linkPreview.img" :noPreviewParagraph="false" />
    <div class="absolute text-[0.8rem] description">
      <p class="mb-2 text-bold">{{ linkPreview.title }}</p>
      <p class="p-1">{{ linkPreview.description }}</p>
      <p class="mt-1"><a :href="linkPreview.url" _target="_blank" rel="noopener noreferrer nofollow">Link</a></p>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, PropType } from 'vue'
import ImagePreview from './imagePreview.vue'
import type { OpenGraphPreview } from 'shared/src/types/post'

export default defineComponent({
  name: 'LinkPreview',
  components: {
    ImagePreview
  },
  props: {
    linkPreview: {
      type: Object as PropType<OpenGraphPreview>,
      required: true
    },
    noImage: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    onMounted(() => {
      // nothing
    })

    return {}
  }
})
</script>

<style lang="scss">
.linkPreview {
  max-width: 90%;
  margin: auto;
  margin: 0.5rem;
  position: relative;
  .description {
    bottom: 0.1rem;
    background-color: rgba(0, 0, 0, 0.336);
    padding: 0.6rem;
  }
}
</style>
