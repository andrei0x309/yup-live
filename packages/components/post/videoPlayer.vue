<template>
  <video v-if="!isError" class="w-full rounded-t-lg md:min-w-[24rem]" controls playsinline preload="auto" @canplay="canPlay">
    <source :key="videoType" :src="videoSource" :type="`video/mp4`" @error="error" />
  </video>
  <div v-else-if="!loading && isError" :class="`noPreview rounded-t-lg ${noPreviewClass}`">
    <img class="postBkImg md:min-w-[24rem]" alt="random image" :src="makeRandomPreview(true)" loading="lazy" />
    <YoutubeIcon class="noImgIcon" />
    <p class="noImg-txt">Video is not available</p>
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

<style lang="scss" scoped>

.noImgIcon {
  width: 12rem;
    height: 12rem;
    margin: 0 auto;
    display: block;
    position: absolute;
    top: 3rem;
    left: calc(70% - 14rem);
}

.noImg-txt {
  text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
    position: absolute;
    top: 15rem;
    left: calc(50% - 10rem);
    width: 20rem;
}

</style>