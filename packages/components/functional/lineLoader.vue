<template>
  <div class="loader-line"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LineLoader'
})
</script>

<style scoped lang="scss">
.loader-line {
  height: 3px;
  position: relative;
  overflow: hidden;
  background-color: #ddd;
  margin: 1rem auto;
  border-radius: 20rem;
  box-shadow: 0px 0px 10px #222;
  opacity: 0.6;
}

.loader-line:before {
  content: '';
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: coral;
  -webkit-animation: lineAnim 1s linear infinite;
  -moz-animation: lineAnim 1s linear infinite;
  animation: lineAnim 1s linear infinite;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

@keyframes lineAnim {
  0% {
    left: -40%;
  }
  50% {
    left: 20%;
    width: 80%;
  }
  100% {
    left: 100%;
    width: 100%;
  }
}
</style>
