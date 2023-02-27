<template>
  <div class="info-bar">
    <h6>{{ text }}</h6>
    <div class="bar">
      <p>{{ percentage }}</p>
      <div class="bar-fill"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'ProfileUseBar',
  props: {
    text: {
      required: false,
      type: String,
      default: ''
    },
    percentage: {
      required: false,
      type: String,
      default: '0%'
    }
  },
  setup() {
    onMounted(() => {
      // nothing
    })
  }
})
</script>

<style lang="scss">
.info-bar {
  h6 {
    font-weight: 400;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    margin-left: 0.5rem;
    margin-bottom: -0.1rem;
    margin-top: 0.4rem;
    text-align: left;
  }
  .fab {
    color: crimson;
    font-size: 14px;
  }
  .bar,
  .bar-fill {
    height: 0.93rem;
    border-radius: 1rem;
  }
  .bar {
    background: rgb(255 255 255 / 5%);
    width: 100%;
    p {
      font-size: 0.75rem;
      animation: fadeIn 2s;
      top: -0.11rem;
      z-index: 2;
      position: relative;
      color: rgba(243, 243, 243, 0.705);
      font-weight: bold;
      text-shadow: 0 0 0.1rem rgba(243, 243, 243, 0.705);
      background-color: rgba(0, 0, 0, 0.425);
      border-radius: 1rem;
    }
    .bar-fill {
      width: v-bind(percentage);
      background: #453f74;
      background: linear-gradient(269deg, #453f74, transparent), linear-gradient(5deg, var(--post-info-card-bottom-bg), transparent);
      position: relative;
      top: -1.14rem;
    }
  }
}

</style>
