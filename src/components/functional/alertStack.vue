<template>
  <div :key="localStack.length" class="alert-stack">
    <Alert v-for="(alert, i) of localStack" :key="i" :type="alert.type" :message="alert.message" :hidden="false" class="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue'
import Alert from './alert.vue'
import { setAlertStack, useAlertStack } from '@/store/alertStore'
import type { AlertInfo } from '@/types/common'

export default defineComponent({
  name: 'AlertStack',
  components: {
    Alert
  },
  setup() {
    const alertStore = useAlertStack()
    const localStack = ref(alertStore.alertStack) as unknown as Ref<Array<AlertInfo>>
    setAlertStack(alertStore)

    alertStore.$subscribe(() => {
      localStack.value = alertStore.alertStack
      console.log(localStack.value.length)
      setTimeout(() => {
        alertStore.alertStack.shift()
      }, 2500)
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
}

@keyframes slide-in {
  100% {
    transform: translateX(0%);
  }
}
</style>
