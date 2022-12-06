<template>
  <div :key="localStack.length" :class="`alert-stack ${mobile ? 'mobile': ''}`">
    <Alert :mobile="mobile" v-for="alert of localStack" :key="alert.id" :type="alert.type" :message="alert.message" :hidden="false" class="" @close="alertClose" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import Alert from './alert.vue'
import type { AlertInfo } from 'shared/src/types/common'

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


    const alertClose = (id: string) => {
      console.log(id)
      alertStore.alertStack = localStack.value.filter((alert) => alert.id === id)
      localStack.value = alertStore.alertStack
    }

    return {
      localStack,
      alertClose
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
