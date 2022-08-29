
<template>
  <svg 
  enable-background="new 0 0 100 58" class="inline w-4"  version="1.1" viewBox="0 0 100 58" xml:space="preserve" 
  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g>
  <circle cx="31.452" cy="13.5" :fill="colorRef" r="13.5"/>
  <path 
  d="M32.153,56.771c2.661-10.485,7.516-19.379,13.92-25.685c-0.039-0.027-0.077-0.059-0.116-0.086h-29.01   C9.134,36.436,3.011,46.132,0,58h31.841L32.153,56.771z" 
  :fill="colorRef"/><g>
  <circle 
  cx="68.452" cy="13.5" 
  :fill="colorRef" r="13.5"/>
  <path 
  d="M82.957,31h-29.01C46.134,36.436,40.011,46.132,37,58h62.904C96.894,46.132,90.771,36.436,82.957,31z" 
  :fill="colorRef"/></g></g></svg>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Followers',
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
