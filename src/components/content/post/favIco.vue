<template>
<img 
            v-if="!isError"
            :key="source"
            class="rounded-lg rounded-b-none nftPreview"
            :src="source"
            :alt="alt"
            loading="lazy"
            @error="onError"
            @load="onLoad"
          />
  <template v-if="!isLoading && isError">
    <NoFavIco :color="color" :loading="isLoading" />
  </template>
  <BtnSpinner v-else-if="isLoading" />
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import NoFavIco from '../icons/noFavIco.vue'
import BtnSpinner from '../icons/btnSpinner.vue'

export default defineComponent({
  name: 'ImagePreview',
  components: {
    NoFavIco,
    BtnSpinner
  },
  props: {
    color: {
      required: false,
      type: String,
      default: '#020201'
    },
    link: {
      required: false,
      type: String,
      default: ''
    },
    alt: {
      required: false,
      type: String,
      default: 'thumbnail'
    },
  },
  setup(props) {
    const isError = ref(false)
    const isLoading = ref(true)
    const source = ref(null) as unknown as Ref<string>
    
    const makeFavIcoLink = () => {
      if (props?.link) {
        try{
            const url = new URL(props.link)
            source.value = `${url.origin}/favicon.ico`
            console.log('sourr', source.value)
        } catch (e) {
          isError.value = true
          isLoading.value = false
        }
      } else {
        isError.value = true
        isLoading.value = false
      }
    }

    const onError = () => {
      isError.value = true
      isLoading.value = false
    }

    const onLoad = () => {
      isLoading.value = false
    }

    onMounted(() => {
        makeFavIcoLink()
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      source
    }
  }
})
</script>
