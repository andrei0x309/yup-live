<template>
  <svg
    enable-background="new 0 0 64 64"
    viewBox="0 0 64 64"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <polyline fill="none" points="61,44 61,55 1,55 1,15 61,15 61,26 " stroke="currentColor" stroke-miterlimit="10" stroke-width="2" />
    <polyline fill="none" points="6,9 54,9 54,15 " stroke="currentColor" stroke-miterlimit="10" stroke-width="2" />
    <path d="M6,9c-2.762,0-5,2.239-5,5" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2" />
    <path
      d="M43.125,26c-4.972,0-9,4.029-9,9c0,4.97,4.028,9,9,9  H63V26H43.125z"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-width="2"
    />
    <circle cx="44" cy="35" fill="none" r="3" stroke="currentColor" stroke-miterlimit="10" stroke-width="2" />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'WalletIcon',
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>