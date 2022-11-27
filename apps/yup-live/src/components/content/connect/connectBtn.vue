<template>
  <button v-if="!isAuth" class="connectButton" @click="connectModal">
    <p>Connect</p>
    <div>
      <WalletIcon class="w-7 ml-3 wicon" />
    </div>
  </button>
  <button v-else class="logo loggedBtn">
    <AvatarBtn class="mr-2" />
    <NotifBtn class="mr-2" />
    <LogOutBtn class="mr-2" />
  </button>
  <o-modal v-model:active="refConnectMod" contentClass="modal-body" @close="modalWasClosed">
    <template v-if="libWallLoading">
      <p class="p-4">{{ loadingMessage }}</p>
      <DangLoader />
    </template>
    <component
      :is="!libWallLoading ? refDynLogComp : undefined"
      :key="libWallLoading"
      :loadState="compLoadState"
      :loginState="refLoginState"
      :setAlert="setAlert"
      :alertProps="alertProps"
    />
  </o-modal>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, shallowRef, onUnmounted } from 'vue'
import WalletIcon from '@/components/content/icons/walletIcon.vue'
import DangLoader from 'components/vote-list/loader.vue'
import type { dComponent } from 'shared/dist/types/vue'
import { useMainStore } from '@/store/main'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import NotifBtn from './notifBtn.vue'
import LogOutBtn from './logOutBtn.vue'

export default defineComponent({
  name: 'ConnectButton',
  components: {
    WalletIcon,
    DangLoader,
    AvatarBtn,
    NotifBtn,
    LogOutBtn
  },
  setup() {
    const refConnectMod = ref(false)
    const refLoginState = ref(true)
    const libWallLoading = ref(false)
    const refDynLogComp: Ref<dComponent> = shallowRef(undefined)
    const alertProps = {
      hidden: true,
      title: '',
      message: '',
      type: 'error'
    }
    const mainStore = useMainStore()
    const isAuth = ref(mainStore.isLoggedIn)
    const loadingMessage = ref('')

    mainStore.$subscribe(() => {
      isAuth.value = mainStore.isLoggedIn
      if (mainStore.openConnectModal) {
        connectModal()
      }
    })

    const compLoadState = (state: string, message: string) => {
      loadingMessage.value = message
      if (state === 'start') {
        libWallLoading.value = true
      } else if (state === 'end') {
        libWallLoading.value = false
      } else if (state === 'close') {
        refConnectMod.value = false
      }
    }

    const setAlert = (aProps: { hidden: boolean; title: string; message: string; type: string }) => {
      alertProps.hidden = false
      alertProps.title = aProps.type
      alertProps.message = aProps.message
      alertProps.type = aProps.type
    }

    const connectModal = async () => {
      libWallLoading.value = true
      refConnectMod.value = true
      refLoginState.value = mainStore.modalLoginState
      refDynLogComp.value = (await import('./loginSignup.vue')).default
      libWallLoading.value = false
    }

    const closeModal = () => {
      refConnectMod.value = false
    }

    const modalWasClosed = () => {
      alertProps.hidden = true
      mainStore.openConnectModal = false
    }

    onUnmounted(() => {
      refDynLogComp?.value.removeEventListener('loading', compLoadState)
    })

    onMounted(() => {
      // nothing
    })

    return {
      connectModal,
      refConnectMod,
      libWallLoading,
      refDynLogComp,
      compLoadState,
      closeModal,
      alertProps,
      setAlert,
      modalWasClosed,
      isAuth,
      loadingMessage,
      refLoginState
    }
  }
})
</script>

<style lang="scss">
header .loggedBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
  top: 0.1rem;
  box-shadow: inset -1px -1px 3rem 2px var(--logoBg), -2px 2px 2px 2px var(--logoBg), 2px -2px 2px 2px var(--logoBg);
}

.connectButton {
  display: flex;
  border-radius: 0.8rem;
  height: 2rem;
  width: 8rem;
  margin-right: 1.5rem;
  box-shadow: 2px 1px 3px 0px #a447c345;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: radial-gradient(ellipse at bottom, #282828 0%, #000000d6 100%);
  position: relative;
  &:active {
    transform: scale(0.95);
    box-shadow: 0 1px 4px -1px var(--shadow);
  }
  p {
    font-size: 0.8rem;
    padding: 0.5rem 0.5rem 0.5rem 0.9rem;
    color: #f1f1f1;
    text-transform: uppercase;
  }
  & > div {
    position: absolute;
    height: 2.5rem;
    width: 3.3rem;
    right: -0.5rem;
    top: -0.25rem;
    border-radius: 67.6rem;
    background: radial-gradient(ellipse at bottom, #bb86eb 0%, rgba(2, 3, 6, 0.82) 100%);
    z-index: 2;
  }
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
  }
  &:before {
    border-radius: 1px;
    width: 2px;
    top: 50%;
    left: 50%;
    height: 17px;
    margin: -8px 0 0 -1px;
    background: var(--arrow);
  }
  &:after {
    width: 60px;
    height: 60px;
    transform-origin: 50% 100%;
    border-radius: 80% 80% 0 0;
    background: var(--success);
    top: 0;
    left: 0;
    transform: scaleY(0);
  }
}

.wicon {
  margin-top: 0.5rem;
}

#WEB3_CONNECT_MODAL_ID {
  .web3modal-modal-lightbox {
    z-index: 45;
  }
}

</style>