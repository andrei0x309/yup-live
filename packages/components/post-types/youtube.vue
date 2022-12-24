<template>
  <div>
  <BtnSpinner v-if="loading" />
  <iframe
    class="w-full min-h-60"
    :src="`https://www.youtube-nocookie.com/embed/${videoId}`"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
  <div class="flex justify-between -mt-2 px-4" style="z-index: 1">
    <span class="inline-block favIco"><YoutubeIcon class="w-6" /> </span>
    <span class="flex mtime h-min space-x-1 items-center rounded-full text-xs font-medium">
      <ClockIcon class="w-5 h-5" />
      <p class="font-semibold text-xs">
        {{ post.createdAt }}
      </p>
    </span>
  </div>
  <div class="py-2 px-4" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
    <h1 class="text-xl font-medium leading-6 tracking-wide text-gray-300 hover:text-blue-500 cursor-pointer">
      <a href="blog/detail">{{ post.title }}</a>
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
import { onMounted, defineComponent, ref } from 'vue'
import YoutubeIcon from 'icons/src/youtube.vue'
import ClockIcon from 'icons/src/clock.vue'
import BtnSpinner from 'icons/src/btnSpinner.vue'

export default defineComponent({
  name: 'PostYoutube',
  components: {
    YoutubeIcon,
    ClockIcon,
    BtnSpinner
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const loading = ref(false)
    const videoId = ref('')
    onMounted(() => {
      console.log('pppp', props.post.url)
      const match = /v=(.*?)$/.exec(props.post.url.split('&')[0])
      if (match) {
        videoId.value = match[1]
      }
      console.log('adsasa', videoId.value)
    })

    return {
      loading,
      videoId
    }
  }
})
</script>
