<template>
  <svg class="inline w-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125.61 193.86">
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <circle :fill="colorRef" cx="15.63" cy="15.86" r="15.63" />
        <path
          :fill="colorRef"
          d="M121,5.63,110.64.43a4,4,0,0,0-4.77.88,6.54,6.54,0,0,0-.64.82l-41,70.73-14.81,25-.21.48-.09.2c-.06.2-.12.39-.16.59l-.06.31v0c0,.38-.06.77-.08,1.15v88.27a5.1,5.1,0,0,0,5.08,4.94H69.66c2.39,0,4.53-2.5,4.53-5.27v-85.2a12.13,12.13,0,0,1,1.23-5.31l49.36-84.4C126.69,10.07,125.23,7.86,121,5.63Z"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ToeknYupIcon',
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
