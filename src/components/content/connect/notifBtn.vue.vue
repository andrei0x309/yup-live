<template>
  <div class="flex flex-col content-center justify-center items-center">
    <router-link :to="`/notifications/${user}`">
      <svg v-if="!hasNewNot" class="not-bell" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M28.7071,19.293,26,16.5859V13a10.0136,10.0136,0,0,0-9-9.9492V1H15V3.0508A10.0136,10.0136,0,0,0,6,13v3.5859L3.2929,19.293A1,1,0,0,0,3,20v3a1,1,0,0,0,1,1h7v.7768a5.152,5.152,0,0,0,4.5,5.1987A5.0057,5.0057,0,0,0,21,25V24h7a1,1,0,0,0,1-1V20A1,1,0,0,0,28.7071,19.293ZM19,25a3,3,0,0,1-6,0V24h6Zm8-3H5V20.4141L7.707,17.707A1,1,0,0,0,8,17V13a8,8,0,0,1,16,0v4a1,1,0,0,0,.293.707L27,20.4141Z"
        />
        <rect fill="none" />
      </svg>
      <div v-else class="flex">
        <svg class="not-bell" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M26,16.5859V14H24v3a1,1,0,0,0,.293.707L27,20.4141V22H5V20.4141L7.707,17.707A1,1,0,0,0,8,17V13A7.9854,7.9854,0,0,1,20,6.0825V3.8467a9.896,9.896,0,0,0-3-.7959V1H15V3.0508A10.0136,10.0136,0,0,0,6,13v3.5859L3.293,19.293A1,1,0,0,0,3,20v3a1,1,0,0,0,1,1h7v1a5,5,0,0,0,10,0V24h7a1,1,0,0,0,1-1V20a1,1,0,0,0-.293-.707ZM19,25a3,3,0,0,1-6,0V24h6Z"
          />
          <circle class="not-circle" cx="26" cy="8" r="4" />
          <rect fill="none" />
        </svg>
        <p v-if="hasNewNot">{{ notDisplay }}</p>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import { useMainStore } from '@/store/main'

export default defineComponent({
  name: 'AvatarBtn',
  components: {},
  setup() {
    interface notType {
      seen: boolean
    }

    const store = useMainStore()
    const user = ref(store.userData.account)
    const hasNewNot = ref(false)
    const notNum = ref(0)
    const notDisplay = ref('')

    onMounted(() => {
      if (store.userData.account) {
        fetch(`https://api.yup.io/notifications/${store.userData.account}`).then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              notNum.value = data.filter((not: notType) => not.seen === false).length
              hasNewNot.value = notNum.value > 0
              if (notNum.value > 9) {
                notDisplay.value = '9+'
              } else {
                notDisplay.value = notNum.value.toString()
              }
            })
          }
        })
      }
    })

    return {
      hasNewNot,
      notNum,
      notDisplay,
      user
    }
  }
})
</script>

<style lang="scss">
.not-bell {
  width: 1.9rem;
  color: var(--color-text-faded);
}

.not-bell:hover {
  transform: scale(1.1);
}

.not-circle {
  animation: notBlink 1s infinite;
  transition: all 0.5s ease;
}

@keyframes notBlink {
  0% {
    transform: scale(1) translate(-0.2rem, 0);
    fill: rgb(156, 18, 18);
  }
  50% {
    transform: scale(1.2) translate(-0.1, 0);
    fill: rgb(228, 41, 41);
  }
  100% {
    transform: scale(1) translate(0rem, 0);
    fill: rgb(156, 18, 18);
  }
}
</style>
