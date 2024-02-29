<template>
  <div class="flex flex-col content-center justify-center items-center">
    <BtnSpinner v-if="loading" />
    <LogOutIcon class="log-out" @click="doLogOut"/>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import { useMainStore } from '@/store/main'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import LogOutIcon from 'icons/src/logout.vue'
import { walletDisconnect } from 'shared/src/utils/login-signup'

export default defineComponent({
  name: 'LogOutBtn',
  components: {
    BtnSpinner,
    LogOutIcon
  },
  setup() {
    const store = useMainStore()
    const loading = ref(false)

    const doLogOut = () => {
      loading.value = true
      localStorage.clear()
      store.userData = {
        avatar: '',
        account: '',
        address: '',
        signature: '',
        weight: 1,
        authToken: '',
        fid: ''
      }
      store.isLoggedIn = false
      try {
        walletDisconnect()
      } catch (e) {
        console.error(e)
      }
      loading.value = false
    }

    onMounted(() => {
      // do something
    })

    return {
      loading,
      doLogOut
    }
  }
})
</script>

<style lang="scss">
.log-out {
  width: 1.9rem;
  color: var(--color-text-faded);
}
.log-out:hover {
  transform: scale(1.1);
}
</style>
