<template>
  <div class="input">
    <button
      :ref="(el) => (buttons[MENU_BUTTONS.feed] = el as Element)"
      class="value"
      @click="onClick(MENU_BUTTONS.feed)"
    >
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M9,13H15V19H18V10L12,5.5L6,10V19H9V13M4,21V9L12,3L20,9V21H4Z"
        />
      </svg>
      Feed
    </button>
    <button
      :ref="(el) => (buttons[MENU_BUTTONS.followers] = el as Element)"
      class="value"
      @click="onClick(MENU_BUTTONS.followers)"
    >
      <FollwersOutlineIcon class="opacity-80 max-w-7" />
      Followers
    </button>
    <button
      v-if="isOwnAccount"
      :ref="(el) => (buttons[MENU_BUTTONS.settings] = el as Element)"
      class="value"
      @click="onClick(MENU_BUTTONS.settings)"
    >
      <svg class="icon" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"
        />
      </svg>
      Settings
    </button>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from "vue";
import { MENU_BUTTONS, BUTTONS_ORDER } from "./menuButtonEnums";
import { useRouter } from "vue-router";
// import WalletIcon from "icons/src/walletIcon.vue";
import FollwersOutlineIcon from "icons/src/followersOutline.vue";

const invObj = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export default defineComponent({
  name: "ProfileMenu",
  components: {
    // WalletIcon,
    FollwersOutlineIcon,
  },
  props: {
    currentMenuTab: {
      type: String,
      default: "feedButton",
    },
    isOwnAccount: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["change"],
  setup(props, ctx) {
    const { emit } = ctx;
    const INV_MENU_BUTTONS = invObj(MENU_BUTTONS);
    const buttons = {} as { [key: string]: Element };
    const isActive = ref((BUTTONS_ORDER as { [key: string]: number })[MENU_BUTTONS.feed]);
    const nav = (ref(null) as unknown) as Ref<HTMLElement>;
    const activeIndicator = (ref(null) as unknown) as Ref<HTMLElement>;
    const router = useRouter();

    const activeTabChange = (button: string) => {
      const changeingActive = (BUTTONS_ORDER as { [key: string]: number })[button];
      isActive.value = changeingActive;
      document.querySelectorAll(".value").forEach((el) => el.classList.remove("active"));
      buttons[Object.keys(BUTTONS_ORDER)[isActive.value]]?.classList.add("active");
      const pathFragments = router.currentRoute.value.fullPath.split("/").slice(0, 3);
      history.pushState(
        {},
        `YUP LIVE ${pathFragments[2]}`,
        [
          window.location.origin,
          pathFragments[1],
          pathFragments[2],
          (INV_MENU_BUTTONS as { [key: string]: string })[
            Object.keys(BUTTONS_ORDER)[isActive.value]
          ],
        ].join("/")
      );
    };

    const onClick = (button: string) => {
      emit("change", button);
      activeTabChange(button);
    };

    onMounted(() => {
      activeTabChange(props.currentMenuTab);
    });

    return {
      onClick,
      buttons,
      MENU_BUTTONS,
      nav,
      activeIndicator,
    };
  },
});
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  flex-direction: row;
  width: fit-content;
  background-color: #150e1a6b;
  justify-content: center;
  border-radius: 5px;
  gap: 7.5px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  padding-left: 10px;
  padding-right: 10px;
  transition: all 0.2s ease;
  border: 1px solid #310f446b;
  font-size: 0.9rem;
}

.value {
  background-color: transparent;
  border: none;
  padding: 10px;
  color: aliceblue;
  display: flex;
  position: relative;
  gap: 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.value:not(:active):hover,
.active,
.value:focus {
  background-color: #21262cad;
}

.value:focus,
.value:active {
  background-color: #1a1f24;
  outline: none;
}

.value::before {
  content: "";
  position: absolute;
  top: 35px;
  right: 0px;
  width: 100%;
  height: 1px;
  background-color: #0a01303f;
  border-radius: 5px;
  opacity: 0;
}

.value:focus::before,
.value:active::before {
  opacity: 1;
}

.value svg {
  width: 15px;
  margin-top: 4px;
}
</style>
