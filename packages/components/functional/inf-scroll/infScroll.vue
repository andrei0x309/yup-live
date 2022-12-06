<template>
  <div class="scroller">
    <div v-if="topDetection" ref="topHitbox" class="hit-box"></div>
    <slot name="content"> </slot>
    <div ref="bottomHitbox" class="hit-box"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, onBeforeUnmount, ref, Ref } from 'vue'

export default defineComponent({
  name: 'InfScroll',
  props: {
    postLoaded: {
      required: true,
      type: Boolean
    },
    topDetection: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const topHitbox = ref(null) as unknown as Ref<Element>
    const bottomHitbox = ref(null) as unknown as Ref<Element>
    const observerTop = ref(null) as unknown as Ref<IntersectionObserver>
    const observerBottom = ref(null) as unknown as Ref<IntersectionObserver>

    const { emit } = ctx

    const up = () => {
      emit('hit', 'up')
    }

    const down = () => {
      emit('hit', 'down')
    }

    onMounted(() => {
      if (props.postLoaded) {
        if(props.topDetection) {
        observerTop.value = new IntersectionObserver(
          ([entry]) => {
            if (entry && entry.isIntersecting) {
              up()
            }
          },
          { threshold: 0.5 }
        )

        observerTop.value.observe(topHitbox.value)
      }

        observerBottom.value = new IntersectionObserver(
          ([entry]) => {
            if (entry && entry.isIntersecting) {
              down()
            }
          },
          { threshold: 0.5 }
        )

        observerBottom.value.observe(bottomHitbox.value)
      }
    })

    onBeforeUnmount(() => {
      if (props.postLoaded) {
        if(props.topDetection) {
          observerTop.value.disconnect()
        }
        observerBottom.value.disconnect()
      }
    })

    return {
      topHitbox,
      bottomHitbox
    }
  }
})
</script>

<style lang="scss">
.scroller {
  display: flex;
  flex-direction: column;
  .hit-box {
    background-color: rgba(240, 248, 255, 0.014);
    height: 1px;
    width: 100%;
  }
}
</style>
}
