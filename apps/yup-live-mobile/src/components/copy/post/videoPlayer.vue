<template>
  <video v-if="!isError" class="w-full rounded-t-lg" controls playsinline preload="auto" @canplay="canPlay">
    <source :key="videoType" :src="videoSource" :type="`video/mp4`" @error="error" />
  </video>
  <div v-else-if="!loading && isError" :class="`noPreview rounded-t-lg ${noPreviewClass}`">
    <img class="postBkImg" alt="random image" :src="makeRandomPreview(true)" loading="lazy" />
    <YoutubeIcon class="noImg" />
    <p class="-mt-7 mb-7 text-lg">Video is not available</p>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import { makeRandomPreview } from 'shared/src/utils/misc'
import YoutubeIcon from 'icons/src/youtube.vue'

export default defineComponent({
  name: 'VideoPlayer',
  components: {
    YoutubeIcon
  },
  props: {
    videoSource: {
      required: false,
      type: String,
      default: ''
    },
    noPreviewClass: {
      required: false,
      type: String,
      default: ''
    }
  },
  setup(props) {
    const videoType = ref('')
    const loading = ref(true)
    const isError = ref(false)

    const canPlay = () => {
      loading.value = false
    }

    const isNotValidString = (str: string) => {
      return str === undefined || str === null || str === ''
    }

    const getMediaType = (source: string) => {
      const type = source.split('.').pop() || 'mp4'
      if (type.includes('?')) {
        return type.split('?')[0]
      }
      return type
    }

    const error = () => {
      console.log('trigeered')
      isError.value = true
      loading.value = false
    }

    onMounted(() => {
      if (!isNotValidString(props.videoSource)) {
        videoType.value = getMediaType(props.videoSource)
      } else {
        isError.value = true
      }
    })

    return {
      canPlay,
      loading,
      error,
      videoType,
      makeRandomPreview,
      isError
    }
  }
})
</script>
