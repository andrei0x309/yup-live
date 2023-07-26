<template>
  <div class="imgPreview flex flex-col content-center justify-center items-center">
    <BtnSpinner v-if="isLoading" :key="`loading-${isLoading}`" />
    <div class="grid">
    <div class="area">
    <div v-for="source of refSources" :key="source">
    <img
      v-if="!isError"
      :key="source"
      :class="`imagePreview  ${imgClass}`"
      :src="source"
      :alt="alt"
      loading="lazy"
      @error="onError"
      @load="onLoad"
    />
    <div v-else-if="!isLoading && showPlaceholder" :class="`noPreview w-full ${noPreviewClass}`">
      <img :class="`imagePreview ${imgClass} postBkImg`" alt="random image" :src="makeRandomPreview(true)" loading="lazy" />
      <NoImg class="noImg opacity-70" />
      <p v-if="noPreviewParagraph" class="-mt-7 mb-7 text-lg">No image preview available</p>
    </div>
  </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType, Ref } from 'vue'
import NoImg from 'icons/src/noImg.vue'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import { makeRandomPreview } from 'shared/src/utils/misc'

export default defineComponent({
  name: 'ImagePreview',
  components: {
    NoImg,
    BtnSpinner
  },
  props: {
    source: {
      required: false,
      type: Object as PropType<String | String[]>,
      default: ''
    },
    alt: {
      required: false,
      type: String,
      default: 'thumbnail'
    },
    imgClass: {
      required: false,
      type: String,
      default: ''
    },
    noPreviewClass: {
      required: false,
      type: String,
      default: ''
    },
    noPreviewParagraph: {
      required: false,
      type: Boolean,
      default: true
    },
    showPlaceholder: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const isError = ref(false)
    const isLoading = ref(true)
    const isErrorBackup = ref(false)
    const refSources = ref(Array.isArray(props.source) ? props.source : [props.source]) as Ref<string[]>

    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const onError = () => {
      isError.value = true
      isLoading.value = false
    }

    const onLoad = () => {
      isLoading.value = false
    }

    onMounted(() => {
      // nothing
      if (!props.source) {
        isError.value = true
        isLoading.value = false
      }
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      isErrorBackup,
      randomInt,
      makeRandomPreview,
      refSources
    }
  }
})
</script>

<style scoped lang="scss">
.imagePreview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 0;
  max-height: 20rem;
}
.noImg {
  width: 35%;
  z-index: 2;
  padding: 1rem;
  
  p {
    z-index: 2;
  }
}

.noPreview {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 0.4rem;
}

.postBkImg {
  position: absolute;
  opacity: 0.4;
}

.grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: repeat(5, 1fr);
grid-column-gap: 3px;
grid-row-gap: 4px;
}

.area { grid-area: 1 / 1 / 6 / 3; }

</style>