<template>
  <div class="d-loader">
    <div class="row">
      <div class="arrow up outer outer-18"></div>
      <div class="arrow down outer outer-17"></div>
      <div class="arrow up outer outer-16"></div>
      <div class="arrow down outer outer-15"></div>
      <div class="arrow up outer outer-14"></div>
    </div>
    <div class="row">
      <div class="arrow up outer outer-1"></div>
      <div class="arrow down outer outer-2"></div>
      <div class="arrow up inner inner-6"></div>
      <div class="arrow down inner inner-5"></div>
      <div class="arrow up inner inner-4"></div>
      <div class="arrow down outer outer-13"></div>
      <div class="arrow up outer outer-12"></div>
    </div>
    <div class="row">
      <div class="arrow down outer outer-3"></div>
      <div class="arrow up outer outer-4"></div>
      <div class="arrow down inner inner-1"></div>
      <div class="arrow up inner inner-2"></div>
      <div class="arrow down inner inner-3"></div>
      <div class="arrow up outer outer-11"></div>
      <div class="arrow down outer outer-10"></div>
    </div>
    <div class="row">
      <div class="arrow down outer outer-5"></div>
      <div class="arrow up outer outer-6"></div>
      <div class="arrow down outer outer-7"></div>
      <div class="arrow up outer outer-8"></div>
      <div class="arrow down outer outer-9"></div>
    </div>
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import {
  onMounted,
  defineComponent,
  //   reactive,
  //   computed,
  onUnmounted
} from 'vue'

export default defineComponent({
  name: 'DangLoader',
  components: {},
  props: {
    color: {
      required: false,
      type: String,
      default: '#23ff22'
    },
    size: {
      required: false,
      type: String,
      default: '3rem'
    },
    unset: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  setup() {
    // props
    // const color = ref(props.color)
    // const size = ref(props.size)

    onMounted(async () => {
      // do nothing
    })

    onUnmounted(() => {
      // do nothing
    })

    return {}
  }
})
</script>

<style lang="scss">
@use 'sass:math';

$color: #c98d0b;
$size: 12px;
$time: 1;

.d-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: v-bind("unset ? 'unset' : 'absolute'");
  top: 45%;
  left: 45%;
  opacity: 1;
  .row {
    display: flex;
  }
}

.arrow {
  width: 0;
  height: 0;
  margin: 0 -6px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 21.6px solid #f3e29e;
  animation: blink 0.8s infinite;
  filter: drop-shadow(0 0 18px #000);

  &.down {
    transform: rotate(180deg);
  }

  @for $i from 1 through 18 {
    &.outer-#{$i} {
      animation-delay: math.div(-$time, 18) * $i + s;
    }
  }

  @for $i from 1 through 6 {
    &.inner-#{$i} {
      animation-delay: math.div(-$time, 6) * $i + s;
    }
  }
}
</style>
