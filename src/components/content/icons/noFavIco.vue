<template>
 <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path d="M14.5,16.5h-6a1,1,0,0,1-1-1v-6h-2v6a3,3,0,0,0,3,3h6Z" :fill="colorRef"/>
 <path 
 d="M20.5,16.5h-2v-8a3,3,0,0,0-3-3h-8v-2a1,1,0,0,0-2,0v2h-2a1,1,0,0,0,0,2h12a1,1,0,0,1,1,1v12a1,1,0,0,0,2,0v-2h2a1,1,0,0,0,0-2Z" 
 :fill="colorRef"/></svg>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NoImg',
  props: {
    color: {
      required: false,
      type: String,
      default: '#020201'
    },
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

