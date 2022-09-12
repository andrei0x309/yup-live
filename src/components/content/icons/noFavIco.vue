<template>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5,16.5h-6a1,1,0,0,1-1-1v-6h-2v6a3,3,0,0,0,3,3h6Z" fill="currentColor" />
    <path
      d="M20.5,16.5h-2v-8a3,3,0,0,0-3-3h-8v-2a1,1,0,0,0-2,0v2h-2a1,1,0,0,0,0,2h12a1,1,0,0,1,1,1v12a1,1,0,0,0,2,0v-2h2a1,1,0,0,0,0-2Z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'NoFavIcon',
  setup() {
    onMounted(() => {
      // nothing
    })
    return {}
  }
})
</script>
