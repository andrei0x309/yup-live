<template>
  <svg style="enable-background: new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xml:space="preserve">
    <g id="grid_system" />
    <g id="_icons">
      <g>
        <path
          fill="currentColor"
          d="M17.6,4.3l-5.2-2.2c-0.3-0.1-0.5-0.1-0.8,0L6.4,4.3C5,4.9,4,6.4,4,8v1c0,5.3,2.9,10.3,7.5,12.9C11.7,22,11.8,22,12,22    s0.3,0,0.5-0.1c4.6-2.6,7.5-7.6,7.5-12.9V8C20,6.4,19,4.9,17.6,4.3z M18,8.9c0,4.4-2.3,8.5-6,10.9c-3.7-2.4-6-6.5-6-10.9V8    c0-0.8,0.5-1.5,1.2-1.8L12,4.1l4.8,2.1C17.5,6.5,18,7.2,18,8V8.9z"
        />
        <path fill="currentColor" d="M12,7c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1s1-0.4,1-1V8C13,7.4,12.6,7,12,7z" />
        <circle fill="currentColor" cx="12" cy="15" r="1" />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'YoutubeIcon',
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>

<style scoped lang="scss"></style>
