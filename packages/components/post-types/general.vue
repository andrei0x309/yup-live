<template>
    <div>
    <div class="flex justify-between mt-4 px-4" style="z-index: 1;z-index: 1;position: absolute;width: 100%;">
    <span class="flex mtime h-min space-x-1 items-center rounded-full text-xs font-medium mt-2">
      <ClockIcon class="w-5 h-5" />
      <p class="font-semibold text-xs">
        {{ post.createdAt }}
      </p>
    </span>
    <span class="flex mfavIco">
      <FavIco :key="post.url" :link="post.url" />
    </span>
  </div>
  <VideoPlayer v-if="post.isVideo" :key="`${post.image}-video`" :videoSource="post.image" />
  <ImagePreview v-else :key="post.image" :source="post.image" imgClass="min-w-60" :noLightbox="true"  />
  <div class="py-2 px-4" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
    <h1 class="text-xl font-medium leading-6 tracking-wide dark:text-gray-300 text-gray-900 cursor-pointer">
      {{ post.title }}
    </h1>
  </div>
  <div class="px-4 space-y-2" style="font-size: 0.9rem">
    <p class="font-normal leading-5 tracking-wide">
      {{ post.content }}
    </p>
  </div>
</div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import ImagePreview from 'components/post/imagePreview.vue'
import FavIco from 'components/post/favIco.vue'
import ClockIcon from 'icons/src/clock.vue'
import VideoPlayer from 'components/post/videoPlayer.vue'

export default defineComponent({
  name: 'PostGeneral',
  components: {
    VideoPlayer,
    ImagePreview,
    FavIco,
    ClockIcon
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>