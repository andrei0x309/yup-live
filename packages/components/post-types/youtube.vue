<template>
  <div>
  <YoutubeEmbed :source="post.url" />
  <div class="flex justify-between -mt-2 px-4" style="z-index: 1">
    <span class="inline-block favIco"><YoutubeIcon class="w-6" /> </span>
    <span class="flex mtime h-min space-x-1 items-center rounded-full text-xs font-medium mt-2">
      <ClockIcon class="w-5 h-5" />
      <p class="font-semibold text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
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
import { defineComponent } from 'vue'
import YoutubeIcon from 'icons/src/youtube.vue'
import ClockIcon from 'icons/src/clock.vue'
import YoutubeEmbed from 'components/post/post-external/youtube-embed.vue'

export default defineComponent({
  name: 'PostYoutube',
  inheritAttrs: false,
  components: {
    YoutubeIcon,
    ClockIcon,
    YoutubeEmbed
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    return {}
  }
})
</script>
