<template>
  <div v-if="!hiddenLocal" class="shadow-md p-4 flex flex-row rounded-lg relative alertCmp">
    <div
      :class="`${
        typeLocal === 'warning' ? 'bg-yellow-500' : typeLocal === 'error' ? 'bg-red-500' : 'bg-green-500'
      } inline-block rounded-lg p-1 mr-1`"
    ></div>
    <b class="p-1 flex items-center">{{ titleLocal }}</b>
    <p class="p-1 mr-1 flex items-center">{{ messageLocal }}</p>
    <a class="h-5 w-5 text-gray-500 inline-block p-1" aria-label="close alert" @click="close()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 absolute"
        style="right: 0.4rem; top: 0.4rem"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Alert',
  props: {
    hidden: {
      type: Boolean,
      required: false,
      default: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'success'
    }
  },
  setup(props, ctx) {
    const hiddenLocal = ref(props.hidden)
    const titleLocal = ref(props.title)
    const messageLocal = ref(props.message)
    const typeLocal = ref(props.type)

    const close = () => {
      hiddenLocal.value = true
    }

    const showMsg = (t: string, m: string) => {
      hiddenLocal.value = false
      titleLocal.value = t
      messageLocal.value = m
    }

    const showErr = (err: string) => {
      showMsg('Error', err)
      typeLocal.value = 'error'
    }

    const showWarn = (warn: string) => {
      showMsg('Warning', warn)
      typeLocal.value = 'warrning'
    }

    const showSuccess = (success: string) => {
      showMsg('Success', success)
      typeLocal.value = 'success'
    }

    ctx.expose({
      close,
      showErr,
      showWarn,
      showSuccess
    })

    return {
      close,
      hiddenLocal,
      titleLocal,
      messageLocal,
      typeLocal
    }
  }
})
</script>

<style lang="scss">
.alertCmp {
  border: 1px solid #777;
  margin-top: 2rem;
  background-color: var(--glass-menu-bg);
  color: var(--glassTxt);
}
</style>