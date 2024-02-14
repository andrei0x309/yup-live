<template>
   <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      :fill="isSolid ? '#0ca50ca2' :'currentColor'"
      d="M5 4a2 2 0 0 0-2 2v6H0l4 4 4-4H5V6h7l2-2H5zm10 4h-3l4-4 4 4h-3v6a2 2 0 0 1-2 2H6l2-2h7V8z"
    />
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "RepostIcon",
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

<style lang="scss"></style>
