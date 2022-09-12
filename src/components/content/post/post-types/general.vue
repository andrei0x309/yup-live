<template>
  <VideoPlayer v-if="post.isVideo" :key="`${post.image}-video`" :videoSource="post.image" />
  <ImagePreview v-else :key="post.image" :source="post.image" imgClass="min-w-60" />
  <div class="flex justify-between -mt-2 px-4" style="z-index: 1">
    <span class="inline-block favIco"><FavIco :key="post.url" :link="post.url" /> </span>
    <span class="flex time h-min space-x-1 items-center rounded-full text-xs font-medium">
      <ClockIcon class="w-5 h-5" />
      <p class="font-semibold text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
  <div class="py-2 px-4" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
    <h1 class="text-xl font-medium leading-6 tracking-wide text-gray-300 hover:text-blue-500 cursor-pointer">
      <router-link v-if="!full" :to="`/post/${post.id}`">{{ post.title }}</router-link>
      <template v-else>{{ post.title }}</template>
    </h1>
  </div>
  <div class="px-4 space-y-2" style="font-size: 0.9rem">
    <p class="font-normal leading-5 tracking-wide">
      {{ post.content }}
    </p>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import ImagePreview from '@/components/content/post/ImagePreview.vue'
import FavIco from '@/components/content/post/favIco.vue'
import ClockIcon from '@/components/content/icons/clock.vue'
import VideoPlayer from '@/components/content/post/videoPlayer.vue'

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