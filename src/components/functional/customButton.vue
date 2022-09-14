<template>
  <button :class="`customBtn px-4 py-2 rounded-lg flex  ${size}`">
    <component :is="icon" :class="`w-8 inline mr-3 -ml-1 ${size} ${iconClass}`" />
    <span :class="`pl-1 table ${size}`" v-html="text"></span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomButton',
  props: {
    icon: {
      type: Object,
      default: () => ({})
    },
    text: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
.customBtn.large {
  font-size: 1.8rem;
  height: 4rem;
  line-height: 2.8rem;

  &::before {
    content: '';
    width: 4.3rem;
    height: 4rem;
  }
  .large {
    width: 3rem;
  }
  span.large {
    padding-left: 0.4rem;
  }
}

.customBtn {
  background-color: var(--glass-menu-bg);
  color: var(--glassTxt);
  position: relative;
  transition: 0.3s cubic-bezier(0.895, 0.03, 0.685, 0.22);
  line-height: 1.8rem;

  &:hover,
  &:active {
    font-weight: bold;
    transform: translate(0, 0.15rem) scale(1.02);
  }

  &:active {
    transition: 0.01s cubic-bezier(0.895, 0.03, 0.685, 0.22);
    filter: hue-rotate(90deg);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3.3rem;
    height: 3rem;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    background-color: rgba(58, 58, 58, 0.315);
  }
}
</style>