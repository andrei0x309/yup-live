<template>
  <button v-if="!isAuth" class="connectButton" @click="connectModal">
    <p>Connect</p>
    <div>
      <WalletIcon class="w-7 ml-3 wicon" />
    </div>
  </button>
  <button v-else class="logo loggedBtn">
    <router-link :to="`/profile/${mainStore.userData.account}`" aria-label="profile" >
      <AvatarBtn
        :key="avatarKey"
        :useMainStore="useMainStore"
        class="mr-2"
        style="width: 2.3rem; height: 2.3rem"
      />
    </router-link>
    <NotifBtn class="mr-2" aria-label="notifications" />
    <router-link :to="`/profile/${mainStore.userData.account}/settings`" aria-label="profile settings" >
    <SettingsIcon class="w-6 h-6 mr-2 connectBtnBar" aria-label="settings" />
    </router-link>
    <LogOutBtn class="mr-2" aria-label="logout"  />
  </button>
  <o-modal
    v-model:active="refConnectMod"
    contentClass="modal-body"
    @close="modalWasClosed"
  >
    <template v-if="libWallLoading">
      <p class="p-4">{{ loadingMessage }}</p>
      <DangLoader />
    </template>
    <component
      :is="refDynLogComp ? refDynLogComp : undefined"
      v-show="!libWallLoading"
      :loadState="compLoadState"
      :loginState="refLoginState"
    />
  </o-modal>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, shallowRef, onUnmounted } from "vue";
import WalletIcon from "icons/src/walletIcon.vue";
import DangLoader from "components/vote-list/loader.vue";
import type { dComponent } from "shared/src/types/vue";
import { useMainStore } from "@/store/main";
import AvatarBtn from "components/functional/avatarBtn.vue";
import NotifBtn from "./notifBtn.vue";
import LogOutBtn from "./logOutBtn.vue";
import SettingsIcon from 'icons/src/settings.vue'


export default defineComponent({
  name: "ConnectButton",
  components: {
    WalletIcon,
    DangLoader,
    AvatarBtn,
    NotifBtn,
    LogOutBtn,
    SettingsIcon
  },
  setup() {
    const mainStore = useMainStore();
    const refConnectMod = ref(false);
    const refLoginState = ref(mainStore.modalLoginState ?? true);
    const libWallLoading = ref(false);
    const refDynLogComp: Ref<dComponent> = shallowRef(undefined);
    const alertProps = {
      hidden: true,
      title: "",
      message: "",
      type: "error",
    };
    const isAuth = ref(mainStore.isLoggedIn);
    const loadingMessage = ref("");
    const avatarKey = ref(0);
    const userAvatar = ref(mainStore.userData.avatar);

    mainStore.$subscribe(() => {
      isAuth.value = mainStore.isLoggedIn;
      if (mainStore.openConnectModal) {
        connectModal();
      }
      if (mainStore.userData.avatar !== userAvatar.value) {
        avatarKey.value++;
        userAvatar.value = mainStore.userData.avatar;
      }
    });

    const compLoadState = (state: string, message: string) => {
      loadingMessage.value = message;
      if (state === "start") {
        libWallLoading.value = true;
      } else if (state === "end") {
        libWallLoading.value = false;
      } else if (state === "close") {
        refConnectMod.value = false;
      }
    };

    const connectModal = async () => {
      libWallLoading.value = true;
      refConnectMod.value = true;
      refLoginState.value = mainStore.modalLoginState as boolean;
      if (!refDynLogComp.value) {
        refDynLogComp.value = (await import("./loginSignup.vue")).default;
      }
      libWallLoading.value = false;
    };

    const closeModal = () => {
      refConnectMod.value = false;
    };

    const modalWasClosed = () => {
      alertProps.hidden = true;
      mainStore.openConnectModal = false;
    };

    onUnmounted(() => {
      refDynLogComp?.value.removeEventListener("loading", compLoadState);
    });

    onMounted(() => {
      // nothing
    });

    return {
      connectModal,
      refConnectMod,
      libWallLoading,
      refDynLogComp,
      compLoadState,
      closeModal,
      modalWasClosed,
      isAuth,
      loadingMessage,
      refLoginState,
      useMainStore,
      mainStore,
      avatarKey
    };
  },
});
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
  box-shadow: inset -1px -1px 3rem 2px var(--logoBg), -2px 2px 2px 2px var(--logoBg),
    2px -2px 2px 2px var(--logoBg);
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
    content: "";
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

.login-form textarea {
  margin: 0rem 2rem;
}

.connectBtnBar:hover {
  transform: scale(1.1);
}

</style>
