<template>
  <svg viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165Z" />
    <path
      fill="currentColor"
      d="M128.5,74a9.67,9.67,0,0,0-14,0L100,88.5l-14-14a9.9,9.9,0,0,0-14,14l14,14-14,14a9.9,9.9,0,0,0,14,14l14-14,14,14a9.9,9.9,0,0,0,14-14l-14-14,14-14A10.77,10.77,0,0,0,128.5,74Z"
    />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteIcon',
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>

<style lang="scss"></style>