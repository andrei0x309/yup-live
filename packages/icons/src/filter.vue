<template>
  <svg
    viewBox="0 0 48 48"
  >
    <path fill="currentColor" d="M47,12a2,2,0,0,0-2-2H24a2,2,0,0,0,0,4H45A2,2,0,0,0,47,12Z" />
    <path
    fill="currentColor"
      d="M3,14H8.35a6,6,0,1,0,0-4H3a2,2,0,0,0,0,4Zm11-4a2,2,0,1,1-2,2A2,2,0,0,1,14,10Z"
    />
    <path
    fill="currentColor"
      d="M45,22H37.65a6,6,0,1,0,0,4H45a2,2,0,0,0,0-4ZM32,26a2,2,0,1,1,2-2A2,2,0,0,1,32,26Z"
    />
    <path fill="currentColor" d="M22,22H3a2,2,0,0,0,0,4H22a2,2,0,0,0,0-4Z" />
    <path fill="currentColor" d="M45,34H28a2,2,0,0,0,0,4H45a2,2,0,0,0,0-4Z" />
    <path
      fill="currentColor"
      d="M18,30a6,6,0,0,0-5.65,4H3a2,2,0,0,0,0,4h9.35A6,6,0,1,0,18,30Zm0,8a2,2,0,1,1,2-2A2,2,0,0,1,18,38Z"
    />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "FilterIcon",
  setup() {
    onMounted(() => {
      // nothing
    });
  },
});
</script>

<style lang="scss"></style>
