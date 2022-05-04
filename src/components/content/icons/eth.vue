<template>
  <svg role="img" class="inline w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title />
    <path
      :fill="colorRef"
      d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
    />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'EthIcon',
  props: {
    color: {
      required: false,
      type: String,
      default: '#020201'
    }
  },
  setup(props) {
    const colorRef = ref(props.color)

    onMounted(() => {
      // nothing
    })

    return {
      colorRef
    }
  }
})
</script>
