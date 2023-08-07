<template>
  <div :key="alertStore.alertStack.length" :class="`alert-stack ${mobile ? 'mobile': ''}`">
    <Alert :mobile="mobile" v-for="alert of alertStore.alertStack" :key="alert.id" :id="alert.id" :type="alert.type" :message="alert.message" :hidden="false" class="" @close="alertClose" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
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
    props.setAlertStack(alertStore)


    const alertClose = (id: string) => {
      alertStore.alertStack = alertStore.alertStack.filter((alert: AlertInfo) => alert.id !== id)
    }

    return {
      alertStore,
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
  min-width: 20rem;
  max-width: 90%;
  animation: slide-in 0.3s forwards;
  transform: translateX(+120%);
  z-index: 100;

  &.mobile {
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
