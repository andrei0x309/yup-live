<template>
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="far"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M0 56C0 42.75 10.75 32 24 32H480C493.3 32 504 42.75 504 56C504 69.25 493.3 80 480 80V432H488C501.3 432 512 442.7 512 456C512 469.3 501.3 480 488 480H336V336C336 291.8 300.2 256 256 256C211.8 256 176 291.8 176 336V480H24C10.75 480 0 469.3 0 456C0 442.7 10.75 432 24 432H32V80H24C10.75 80 0 69.25 0 56zM80 112H432V80H80V112zM80 160V432H128V336C128 265.3 185.3 208 256 208C326.7 208 384 265.3 384 336V432H432V160H80z"
    ></path>
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "ProfileFarcasterIcon",
  setup() {
    onMounted(() => {
      // nothing
    });
  },
});
</script>

<style lang="scss"></style>
