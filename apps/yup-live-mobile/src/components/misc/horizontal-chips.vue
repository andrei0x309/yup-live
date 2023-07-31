<template>
  <div class="horizontal-snap">
    <slot name="chips"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HorizontalChips",
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.horizontal-snap {
  margin: 0 auto;
  display: grid;
  grid-auto-flow: column;
  gap: 0;
  padding: 1rem;
  overflow-y: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
}

.horizontal-snap > ion-chip {
  scroll-snap-align: center;
}
</style>
