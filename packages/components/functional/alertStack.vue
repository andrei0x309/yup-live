<template>
  <div :key="localStack.length" :class="`alert-stack ${mobile ? 'mobile': ''}`">
    <Alert :mobile="mobile" v-for="(alert, i) of localStack" :key="i" :type="alert.type" :message="alert.message" :hidden="false" class="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue'
import Alert from './alert.vue'
import type { AlertInfo } from 'shared/dist/types/common'

export default defineComponent({
  name: 'AlertStack',
  props: {
    setAlertStack: {
      type: Function,
      required: true
    },
    useAlertStack: {
      type: Function,
      required: true
    },
    mobile: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Alert
  },
  setup(props) {
    const alertStore = props.useAlertStack()
    const localStack = ref(alertStore.alertStack) as unknown as Ref<Array<AlertInfo>>
      props.setAlertStack(alertStore)

    alertStore.$subscribe(() => {
      localStack.value = alertStore.alertStack
      setTimeout(() => {
        alertStore.alertStack.shift()
      }, 4500)
    })

    onMounted(() => {
      // const interval = setInterval(() => {
      //   alertStore.alertStack.push({
      //     type: 'info',
      //     message: 'Test alert system'
      //   })
      //   console.log(alertStore.alertStack, 'pushing alert')
      // }, 1200)
      // setTimeout(() => clearInterval(interval), 6000)
    })

    return {
      localStack
    }
  }
})
</script>

<style scoped lang="scss">
.alert-stack {
  position: fixed;
  bottom: 0.9vh;
  right: 1vw;
  width: 20rem;
  animation: slide-in 0.3s forwards;
  transform: translateX(+120%);

  &.mobile {
    z-index: 20;
    bottom: 3.8rem;
    width: 98%;
  }
}

@keyframes slide-in {
  100% {
    transform: translateX(0%);
  }
}
</style>
