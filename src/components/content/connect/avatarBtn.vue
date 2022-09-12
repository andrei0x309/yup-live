<template>
  <div class="flex flex-col content-center justify-center items-center">
    <BtnSpinner v-if="isLoading" />
    <router-link v-if="!isTwitter" class="contents" :to="`/profile/${user}`">
      <img :key="source" class="avatarImg" :src="source" :alt="altImg" loading="lazy" @error="onError" @load="onLoad" />
    </router-link>
    <img v-else :key="source" class="avatarImg" :src="source" :alt="altImg" loading="lazy" @error="onError" @load="onLoad" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import { useMainStore } from '@/store/main'
import BtnSpinner from '@/components/content/icons/btnSpinner.vue'
import { makeRandAvatar } from '@/utils/accounts'

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
    isTwitter: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useMainStore()
    const source = ref(!props.isSelf ? props.pSource : store.userData.avatar)
    const user = ref(!props.isSelf ? props.pAccount : store.userData.account)
    const altImg = ref(!props.isSelf ? `avatar of ${props.pAccount}` : `avatar of ${store.userData.account}`)
    const isLoading = ref(false)

    const onError = () => {
      source.value = makeRandAvatar(!props.isSelf ? props.pAccount : store.userData.account)
      isLoading.value = false
    }

    const onLoad = () => {
      isLoading.value = false
    }

    onMounted(() => {
      isLoading.value = true
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
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  border: 2px solid;
  max-height: 2.3rem;
  object-fit: cover;
  // transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}
.avatarImg:hover {
  transform: rotate3d(0, 40, 1, 160deg);
}
</style>
