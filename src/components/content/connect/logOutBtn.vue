<template>
  <div class="flex flex-col content-center justify-center items-center">
    <BtnSpinner v-if="loading" />
    <svg class="log-out" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" @click="doLogOut">
      <title />
      <g>
        <path
          fill="currentColor"
          d="M16,26.09A9,9,0,0,1,12.35,8.86a1,1,0,1,1,.81,1.82,7,7,0,1,0,5.75,0,1,1,0,0,1-.49-1.33,1,1,0,0,1,1.32-.49A9,9,0,0,1,16,26.09Z"
        />
        <path fill="currentColor" d="M16,17a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0v9A1,1,0,0,1,16,17Z" />
        <path fill="currentColor" d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" />
        <path
          fill="currentColor"
          d="M18,27A13,13,0,0,1,5,14,9.71,9.71,0,0,1,8.31,6.63C5.35,9,3,11.9,3,16A13,13,0,0,0,16,29c4.1,0,8.91-2.94,10.13-6.44C24.34,24.81,21.08,27,18,27Z"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import { useMainStore } from '@/store/main'
import BtnSpinner from '../icons/btnSpinner.vue'

export default defineComponent({
  name: 'AvatarBtn',
  components: {
    BtnSpinner
  },
  setup() {
    const store = useMainStore()
    const loading = ref(false)

    const doLogOut = () => {
      loading.value = true
      localStorage.removeItem('avatar')
      localStorage.removeItem('signature')
      localStorage.removeItem('address')
      localStorage.removeItem('account')
      store.userData = {
        avatar: '',
        account: '',
        address: '',
        signature: '',
        weight: 1
      }
      store.isLoggedIn = false
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
