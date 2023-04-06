<template>
  <div class="flex flex-col content-center justify-center items-center">
    <BtnSpinner v-if="isLoading" />
    <img :key="source" :class="`avatarImg ${imgClass}`" :src="source" :alt="altImg" loading="lazy" @error="onError" @load="onLoad" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import { makeRandAvatar } from 'shared/src/utils/accounts'

export default defineComponent({
  name: 'AvatarBtn',
  components: {
    BtnSpinner
  },
  props: {
    pSource: {
      required: false,
      type: String,
      default: ''
    },
    pAccount: {
      required: false,
      type: String,
      default: ''
    },
    isSelf: {
      required: false,
      type: Boolean,
      default: true
    },
    imgClass: {
      required: false,
      type: String,
      default: ''
    },
    useMainStore: {
      required: false,
      type: Function,
      default: () => undefined
    }
  },
  setup(props) {
    const store = props?.useMainStore ? props?.useMainStore() : null
    const source = ref(!props.isSelf ? props.pSource : store?.userData?.avatar)
    const user = ref(!props.isSelf ? props.pAccount : store?.userData?.account)
    const altImg = ref(!props.isSelf ? `avatar of ${props.pAccount}` : `avatar of ${store.userData.account}`)
    const isLoading = ref(true)

    const onError = () => {
      source.value = makeRandAvatar(!props.isSelf ? props.pAccount : store?.userData?.account)
      isLoading.value = false
    }

    const onLoad = () => {
      isLoading.value = false
    }

    onMounted(() => {
      if (!props.pSource && !props.isSelf) {
        onError()
      }
    })

    return {
      source,
      onError,
      onLoad,
      isLoading,
      altImg,
      user    
    }
  }
})
</script>

<style lang="scss">
.avatarImg {
  border-radius: 50%;
  border: 2px solid;
  object-fit: cover;
  // transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}
.avatarImg:hover {
  transform: rotate3d(0, 40, 1, 160deg);
}
</style>
