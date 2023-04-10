<template>
  <svg height="24" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M8,17.4142136 L3.70710678,21.7071068 L2.29289322,20.2928932 L6.58578644,16 L3,16 L3,14 L10,14 L10,21 L8,21 L8,17.4142136 Z M17,17 L17,12 L19,12 L19,19 L12,19 L12,17 L17,17 Z M7,7 L7,12 L5,12 L5,5 L12,5 L12,7 L7,7 Z M21,8 L21,10 L14,10 L14,3 L16,3 L16,6.58578644 L20.2928932,2.29289322 L21.7071068,3.70710678 L17.4142136,8 L21,8 Z"
      fill-rule="evenodd"
    />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "MinimizeIcon",
  setup() {
    onMounted(() => {
      // nothing
    });
  },
});
</script>

<style lang="scss"></style>
