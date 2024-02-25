<template>
  <div>
    <div class="ctrl">
      <div class="ctrl__button ctrl__button--decrement" @click="decNum">&ndash;</div>
      <div class="ctrl__counter flex flex-col items-center">
        <button class="btnMax" @click="onMax">MAX</button>
        <input class="ctrl__counter-num" type="number" :value="num" @input="(e) => onChange(e as any)" />
      </div>
      <div class="ctrl__button ctrl__button--increment" @click="incNum">+</div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'InputNum',
  props: {
    value: {
      type: Number,
      default: 0,
      required: false
    },
    max: {
      type: Number,
      default: 100,
      required: false
    }
  },
  emits: ['update:input'],
  setup(props, ctx) {
    const num = ref(props.value)

    const emitChange = () => ctx.emit('update:input', num.value)

    const incNum = () => {
      num.value = num.value + 1
      emitChange()
    }

    const onChange = (e: { target: { value: string } }) => {
      num.value = Number(e?.target?.value)
      emitChange()
    }

    const decNum = () => {
      if (num.value - 1 >= 0) {
        num.value = num.value - 1
        emitChange()
      }
    }

    const onMax = () => {
      if (num.value > props.max) {
        // nth
      } else {
        // down
      }
      num.value = Number(props.max.toFixed(4))
      emitChange()
    }

    onMounted(() => {
      // nothing
    })

    return {
      num,
      incNum,
      decNum,
      onMax,
      onChange
    }
  }
})
</script>

<style lang="scss">
.btnMax {
  border: 1px solid rgba(192, 157, 112, 0.541);
  font-size: 0.8rem;
  padding: 0.4rem;
}

.ctrl {
  flex: 0 0 auto;
  display: flex;
  background-color: #70707021;
  border-radius: 0.2rem;
  font-size: 2rem;
  padding: 0.6rem;
  margin-top: 2rem;
  margin-bottom: 1.6rem;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
}
.ctrl__counter {
  max-width: 14rem;
  height: 8rem;
}
.ctrl__counter-num {
  opacity: 1;
  background-color: transparent;
  transition: opacity 1000ms ease-in;
  width: 8rem;
  text-align: center;
  margin-top: 0.8rem;
  outline: none;
  user-select: none;
}

.ctrl__button {
  max-width: 5rem;
  min-width: 2.5rem;
  line-height: 7rem;
  text-align: center;
  cursor: pointer;
  background-color: #3e3e3e66;
  transition: background-color 100ms ease-in;
  user-select: none;
}

.ctrl__counter.is-input .ctrl__counter-num {
  opacity: 0;
  transition: opacity 100ms ease-in;
}
.ctrl__counter.is-input .ctrl__counter-input {
  opacity: 1;
  transition: opacity 100ms ease-in;
}

.ctrl__counter-num.is-increment-hide {
  opacity: 0;
  transform: translateY(-50px);
  animation: increment-prev 100ms ease-in;
}
.ctrl__counter-num.is-increment-visible {
  opacity: 1;
  transform: translateY(0);
  animation: increment-next 100ms ease-out;
}
.ctrl__counter-num.is-decrement-hide {
  opacity: 0;
  transform: translateY(50px);
  animation: decrement-prev 100ms ease-in;
}
.ctrl__counter-num.is-decrement-visible {
  opacity: 1;
  transform: translateY(0);
  animation: decrement-next 100ms ease-out;
}

.ctrl__button:hover {
  background-color: #3e3e3e8f;
  transition: background-color 100ms ease-in;
}
.ctrl__button:active {
  background-color: #3e3e3e8f;
  transition: background-color 100ms ease-in;
}
.ctrl__button--decrement {
  border-radius: 5px 0 0 5px;
}
.ctrl__button--increment {
  border-radius: 0 5px 5px 0;
}

@keyframes decrement-prev {
  from {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes decrement-next {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
}
@keyframes increment-prev {
  from {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes increment-next {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
}
</style>
