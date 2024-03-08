
<template>
<button class="glow-button">
  <span>{{text}}</span>
    <div class="gradient"></div>
</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
name: 'CustomButton',
props: {
  text: {
    type: String,
    default: ''
  }
},
setup() {
  return {}
}
})
</script>


<style>
.glow-button {
  --button-background: #383040bd;
  --button-color: #fff;
  --button-shadow: rgb(0 0 0 / 20%);
    --button-shine-left: rgba(120, 0, 245, 0.5);
    --button-shine-right: rgb(31 2 62 / 65%);
  --button-glow-start: #B000E8;
  --button-glow-end: #009FFD;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  outline: none;
  border: none;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  border-radius: 11px;
  position: relative;
  line-height: 24px;
  cursor: pointer;
  color: var(--button-color);
  padding: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background: none;
  z-index: 1;
  box-shadow: 0 8px 20px var(--button-shadow);
}
.glow-button .gradient {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  transform: scaleY(1.02) scaleX(1.005) rotate(-0.35deg);
}
.glow-button .gradient:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform: scale(1.05) translateY(-44px) rotate(0deg) translateZ(0);
  padding-bottom: 100%;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--button-shine-left), var(--button-shine-right));
  -webkit-animation: rotate linear 2s infinite;
          animation: rotate linear 2s infinite;
}
.glow-button span {
  z-index: 1;
  position: relative;
  display: block;
  padding: 10px 0;
  width: 132px;
  border-radius: inherit;
  background-color: var(--button-background);
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
}
.glow-button span:before {
  content: "";
  position: absolute;
  left: -16px;
  top: -16px;
  transform: translate(var(--pointer-x, 0px), var(--pointer-y, 0px)) translateZ(0);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--button-glow, transparent);
  opacity: var(--button-glow-opacity, 0);
  transition: opacity var(--button-glow-duration, 0.5s);
  filter: blur(20px);
}
.glow-button:hover {
  --button-glow-opacity: 1;
  --button-glow-duration: .25s;
}

@-webkit-keyframes rotate {
  to {
    transform: scale(1.05) translateY(-44px) rotate(360deg) translateZ(0);
  }
}

@keyframes rotate {
  to {
    transform: scale(1.05) translateY(-44px) rotate(360deg) translateZ(0);
  }
}

</style>
