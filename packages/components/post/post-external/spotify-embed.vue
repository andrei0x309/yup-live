<template>
  <div class="mt-2">
    <BtnSpinner v-if="isLoading" class="inline mr-2" />
    <div v-html="html"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from "vue";
import BtnSpinner from 'icons/src/btnSpinner.vue'


export default defineComponent({
  name: 'SpotifyEmbed',
  components: { BtnSpinner },
  props: {
    source: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const html = ref('')
    const isLoading = ref(false)
   
    const getEmbed = async () => {
      const res = await fetch(`https://open.spotify.com/oembed?url=${props.source}`)
      const data = await res.json()
      html.value = data.html
    }

    onMounted(async () => {
        isLoading.value = true
        await getEmbed()
        isLoading.value = false
    })

 
    return {
      html,
      isLoading
    }
  }
})
</script>
 


