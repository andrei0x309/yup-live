<template>
  <svg viewBox="0 0 32 32" v-if="!isSolid">
    <g data-name="Layer 54" id="Layer_54">
      <path
        fill="currentColor"
        d="M16,28.72a3,3,0,0,1-2.13-.88L3.57,17.54a8.72,8.72,0,0,1-2.52-6.25,8.06,8.06,0,0,1,8.14-8A8.06,8.06,0,0,1,15,5.68l1,1,.82-.82h0a8.39,8.39,0,0,1,11-.89,8.25,8.25,0,0,1,.81,12.36L18.13,27.84A3,3,0,0,1,16,28.72ZM9.15,5.28A6.12,6.12,0,0,0,4.89,7a6,6,0,0,0-1.84,4.33A6.72,6.72,0,0,0,5,16.13l10.3,10.3a1,1,0,0,0,1.42,0L27.23,15.91A6.25,6.25,0,0,0,29,11.11a6.18,6.18,0,0,0-2.43-4.55,6.37,6.37,0,0,0-8.37.71L16.71,8.8a1,1,0,0,1-1.42,0l-1.7-1.7a6.28,6.28,0,0,0-4.4-1.82Z"
      />
    </g>
  </svg>
  <svg
    v-else
    viewBox="0 0 24 24"
  >
    <g id="info" />
    <g id="icons">
      <path
        fill="#971e1e"
        d="M22.2,4.1c2.7,2.7,2.4,6.9-0.4,9.5l-8.4,7.9c-0.8,0.7-2.1,0.7-2.9,0l-8.4-7.9c-2.7-2.6-3-6.8-0.4-9.5   C4.6,1.4,9.2,1.3,12,4C14.8,1.3,19.4,1.4,22.2,4.1z"
        id="like"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "LikesIcon",
  props: {
    isSolid: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    onMounted(() => {
      // nothing
    });
  },
});
</script>

<style lang="scss">
</style>
