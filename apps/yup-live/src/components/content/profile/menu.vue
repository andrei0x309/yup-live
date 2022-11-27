<template>
  <div ref="nav" class="nav">
    <div class="nav__item">
      <button :ref="(el) => (buttons[MENU_BUTTONS.feed] = el as Element)" class="pmenu-active" @click="onClick(MENU_BUTTONS.feed)">
        <svg class="icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9,13H15V19H18V10L12,5.5L6,10V19H9V13M4,21V9L12,3L20,9V21H4Z" />
        </svg>
        <span class="text" data-title="Feed">Feed</span>
      </button>
    </div>

    <div class="nav__item">
      <button
        :ref="(el) => (buttons[MENU_BUTTONS.collections] = el as Element)"
        class="menu-button"
        @click="onClick(MENU_BUTTONS.collections)"
      >
        <svg class="icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z"
          />
        </svg>
        <span class="text" data-title="Collections">Collections</span>
      </button>
    </div>

    <div class="nav__item">
      <button :ref="(el) => (buttons[MENU_BUTTONS.followers] = el as Element)" class="menu-button" @click="onClick(MENU_BUTTONS.followers)">
        <FollwersOutlineIcon class="opacity-80" />
        <span class="text" data-title="Followers">FOLLOWERS</span>
      </button>
    </div>

    <div class="nav__item">
      <button :ref="(el) => (buttons[MENU_BUTTONS.wallet] = el as Element)" class="menu-button" @click="onClick(MENU_BUTTONS.wallet)">
        <WalletIcon class="max-w-7" />
        <span class="text" data-title="Wallet">WALLET</span>
      </button>
    </div>

    <div v-if="isOwnAccount" class="nav__item">
      <button :ref="(el) => (buttons[MENU_BUTTONS.settings] = el as Element)" class="menu-button" @click="onClick(MENU_BUTTONS.settings)">
        <svg class="icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"
          />
        </svg>
        <span class="text" data-title="Settings">SETTINGS</span>
      </button>
    </div>

    <div ref="activeIndicator" class="nav__active-indicator"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import { MENU_BUTTONS, BUTTONS_ORDER } from './menuButtonEnums'
import { useRouter } from 'vue-router'
import WalletIcon from '@/components/content/icons/walletIcon.vue'
import FollwersOutlineIcon from '@/components/content/icons/followersOutline.vue'

const invObj = (obj: Record<string, string>) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()))

export default defineComponent({
  name: 'ProfileMenu',
  components: {
    WalletIcon,
    FollwersOutlineIcon
  },
  props: {
    currentMenuTab: {
      type: String,
      default: 'feedButton'
    },
    isOwnAccount: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup(props, ctx) {
    const { emit } = ctx
    const INV_MENU_BUTTONS = invObj(MENU_BUTTONS)
    console.log(INV_MENU_BUTTONS[MENU_BUTTONS.feed], MENU_BUTTONS.feed)
    const buttons = {} as { [key: string]: Element }
    const isActive = ref((BUTTONS_ORDER as { [key: string]: number })[MENU_BUTTONS.feed])
    const nav = ref(null) as unknown as Ref<HTMLElement>
    const activeIndicator = ref(null) as unknown as Ref<HTMLElement>
    const router = useRouter()

    const activeTabChange = (button: string) => {
      const changeingActive = (BUTTONS_ORDER as { [key: string]: number })[button]
      if (isActive.value > changeingActive) {
        nav.value.classList.remove('slide-right')
        nav.value.classList.add('slide-left')
      } else {
        nav.value.classList.remove('slide-left')
        nav.value.classList.add('slide-right')
      }
      activeIndicator.value.style.transform = `translateX(${60 * changeingActive}px) translateY(-50%)`
      buttons[Object.keys(BUTTONS_ORDER)[isActive.value]].classList.remove('pmenu-active')
      isActive.value = changeingActive
      buttons[Object.keys(BUTTONS_ORDER)[isActive.value]].classList.add('pmenu-active')
      const pathFragments = router.currentRoute.value.fullPath.split('/').slice(0, 3)
      history.pushState(
        {},
        `YUP LIVE ${pathFragments[2]}`,
        [
          window.location.origin,
          pathFragments[1],
          pathFragments[2],
          (INV_MENU_BUTTONS as { [key: string]: string })[Object.keys(BUTTONS_ORDER)[isActive.value]]
        ].join('/')
      )
    }

    const onClick = (button: string) => {
      emit('change', button)
      activeTabChange(button)
    }

    onMounted(() => {
      activeTabChange(props.currentMenuTab)
    })

    return {
      onClick,
      buttons,
      MENU_BUTTONS,
      nav,
      activeIndicator
    }
  }
})
</script>

<style lang="scss">
:root {
  --active-indicator-width: 120px;
  --icon-width: 26px;
  --icon-margin-right: 9px;
  --menu-padding-horizontal: 29px;
  --menu-padding-vertical: 20px;
  --active-indicator-extra-length: 12px; /* We want the indicator to be longer than the actual buttons themselves, this length is added to both sides of the indicator */
  --space-between-icons: 32px;
}

@media (max-width: 600px) {
  :root {
    --active-indicator-width: 80px;
    --icon-margin-right: 7px;
    --menu-padding-horizontal: 24px;
  }
}

.nav {
  padding: var(--menu-padding-vertical) var(--menu-padding-horizontal);
  display: flex;
  box-shadow: inset -1px -1px 24px 0 rgba(0, 0, 0, 0.26);
  border-radius: 1px;
  position: relative;
  max-width: 26rem;
  border-radius: 1rem;
  position: relative;
  margin: auto;
  top: -1rem;

  @media (min-width: 400px) {
    left: -1.5rem;
  }
}

.nav__active-indicator {
  position: absolute;
  top: 46%;
  margin-left: calc(var(--menu-padding-horizontal) - var(--active-indicator-extra-length));
  left: 0;
  transform: translateY(-50%);
  width: calc(var(--active-indicator-width) + var(--active-indicator-extra-length) * 2);
  background: radial-gradient(ellipse at right, rgb(62 62 62 / 18%) 0%, rgb(60 60 60 / 16%) 100%);
  z-index: 10;
  border-radius: 1rem;
  height: 2.5rem;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.nav__item {
  margin-left: var(--space-between-icons);
  position: relative;
  z-index: 5;
}

.nav__item:first-child {
  margin-left: 0;
}

.menu-button {
  padding: 0;
  border: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: var(--icon-width);
  transition: width 0.3s cubic-bezier(0.215, 0.61, 0.355, 1); /* I knowwww, don't animate width, but it doesn't actually look jittery in this case - so maybe it just works in this case? If not there are alternatives we can try */
  outline: none;
  position: relative;
  background: transparent;
}

.pmenu-active {
  width: var(--active-indicator-width);
}

.icon {
  display: block;
  margin-right: var(--icon-margin-right);
  flex-shrink: 0;
  width: var(--icon-width);
  height: var(--icon-width);
}

.icon path {
  fill: #a6adb1;
  transition: fill 0.2s;
}

.text {
  display: block;
  pointer-events: none;
  font-size: 0;
}

.text:after {
  content: attr(data-title);
  position: absolute;
  top: 0;
  left: 0;
  width: var(--active-indicator-width);
  height: 100%;
  opacity: 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  padding-left: calc(var(--icon-width) + var(--icon-margin-right));
  transition: opacity 0s;
}

.slide-right .text:after {
  left: 0;
  right: auto;
}
.slide-left .text:after {
  right: 0;
  left: auto;
}

.pmenu-active .text:after {
  opacity: 1;
  transition: opacity 0.4s;
}
</style>