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
    @load="loading = false"
  ></iframe>
</div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from "vue";
import BtnSpinner from 'icons/src/btnSpinner.vue'

export default defineComponent({
  name: 'YoutubeEmbed',
  components: { BtnSpinner },
  props: {
    source: {
      type: String,
      required: true    
    },
  },
  setup(props) {
    const loading = ref(true)
    const videoId = ref('')
    onMounted(() => {
      if(!props.source) return
      if(props.source.includes('shorts/')) {
        videoId.value = props.source.split('shorts/')[1].split('?')[0].trim()
        return
      }

      const ilegalChars = ['&', '?', 'v=', '"', "'", ' ']

      const match = /v=(.*?)$/.exec(props.source.split('&')[0])
      if (match) {
        videoId.value = match[1]
      }
      ilegalChars.forEach(char => {
        videoId.value = videoId.value.replace(char, '')
      })
    })

    return {
      loading,
      videoId
    }
  }
})
</script>
 


