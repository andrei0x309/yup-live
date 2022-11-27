<template>
  <HeaderComp />
  <main class="content">
    <router-view :key="route.path" />
  </main>
  <FooterCom />
  <AlertStack :useAlertStack="useAlertStack" :setAlertStack="setAlertStack" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderComp from '@/components/theme/header.vue'
import FooterCom from '@/components/theme/footer.vue'
import { getThemeMode } from './utils'
import { onBeforeMount } from 'vue'
import { useMainStore } from '@/store/main'
import { useCollectionStore, getCollections } from './store/collections'
import type { ICollection } from 'shared/dist/types/store'
import { useRoute } from 'vue-router'
import AlertStack from 'components/functional/alertStack.vue'
import { deleteMeta } from 'shared/dist/utils/head'
import { setAlertStack, useAlertStack } from '@/store/alertStore'

export default defineComponent({
  name: 'App',
  components: {
    HeaderComp,
    FooterCom,
    AlertStack
  },
  setup() {
    ;(function setTheme() {
      document.documentElement.setAttribute('class', getThemeMode())
    })()
    const mainStore = useMainStore()
    const collectionStore = useCollectionStore()
    const route = useRoute()

    onBeforeMount(() => {
      try {

        if (localStorage.getItem('address')) {
          mainStore.userData.address = localStorage.getItem('address') as string
          mainStore.userData.account = localStorage.getItem('account') || ''
          mainStore.userData.signature = localStorage.getItem('signature') || ''
          mainStore.userData.avatar = localStorage.getItem('avatar') || ''
          mainStore.userData.weight = Number(localStorage.getItem('weight')) || 1
          mainStore.userData.authToken = localStorage.getItem('authToken') || ''
          mainStore.isLoggedIn = true
          collectionStore.collectionsPromise = getCollections(collectionStore, mainStore.userData.account) as Promise<ICollection[]>
        }
      } catch (error) {
        console.error('Failed, to set store', error)
      }
      try {
        deleteMeta()
      } catch (error) {
        console.error('Failed to delete meta', error)
      }
    })

    return {
      route,
      setAlertStack,
      useAlertStack
    }

    // onMounted(() => {
    //   console.log('isAuth', isLoggedIn.value)
    //   console.log(instance)
    // })
  }
})
</script>

<style lang="scss">
@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/lora/v26/0QI6MX1D_JOuGQbT0gvTJPa787weuxJPkq1umA.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/lora/v26/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}

html {
  transition: all 0.2s ease;

  body {
    background-color: var(--bg-content);
  }
}

html {
  --bg-color: #dfded7d4;
  --bg-content: #222222ba;
  --logoBg: #ffffffcf;

  --headerColor1: #1f2937;
  --headerColor2: #9ca3af;
  --headerColor3: #f3e29e;
  --glassBg: #4a4a4abf;
  --glassTxt: #222;
  --glass-menu-bg: #fafafa7a;
  --heroShadow: rgba(31, 38, 135, 0.37);

  --bg: #333333;
  --bg-panel: #434343;
  --color-heading: #0077ff;
  --color-text: #b5b5b5;
  --color-text-faded: #565656;
  --color-text-faded2: #4c4c4c;
  --stake-counter: #64570b;
}

html[class='dark'] {
  --bg-color: #111;
  --bg-content: #222;
  --logoBg: #080808cf;

  --headerColor1: #131313;
  --headerColor2: #151515;
  --headerColor3: #1d1d1d;
  --glassBg: rgba(0, 0, 0, 0.932);
  --glassTxt: aliceblue;
  --glass-menu-bg: #2023289e;
  --heroShadow: #6b728038;

  --bg: #333333;
  --bg-panel: #434343;
  --color-heading: #0077ff;
  --color-text: #b5b5b5;
  --color-text-faded: #b5b5b5;
  --color-text-faded2: #8a8a8a;
  --stake-counter: #b6b326a1;
}

#app {
  //https://fonts.googleapis.com/css2?family=Lora&display=swap
  font-family: 'Lora', serif;
  font-display: swap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--bg-content);

  .o-tip__content {
    word-break: normal;
    max-width: 15rem;
    background-color: var(--glassBg);
    color: aliceblue;
    border-radius: 4px;
    padding: 0.5rem;
    opacity: 0.9;
  }

  .o-drop__item--active {
    background-color: inherit;
    color: inherit;
  }
}

.glass,
#app .o-modal__content {
  background: var(--glassBg);
  color: var(--glassTxt);
  box-shadow: 0 8px 32px 0 var(--glassShadow);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 80rem;
  margin: 0 auto;
}

.border222 {
  border: 1px solid #455;
}

.bg-dark {
  background-color: #282828;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Crect stroke='%23282828' stroke-width='0.5' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cuse fill='%23363636' href='%23s' y='2'/%3E%3Cuse fill='%23363636' href='%23s' x='1' y='2'/%3E%3Cuse fill='%23404040' href='%23s' x='2' y='2'/%3E%3Cuse fill='%23404040' href='%23s'/%3E%3Cuse fill='%234a4a4a' href='%23s' x='2'/%3E%3Cuse fill='%234a4a4a' href='%23s' x='1' y='1'/%3E%3C/pattern%3E%3Cpattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23525252'%3E%3Cuse href='%23s'/%3E%3Cuse href='%23s' y='5' /%3E%3Cuse href='%23s' x='1' y='10'/%3E%3Cuse href='%23s' x='2' y='1'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='8'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='5' y='2'/%3E%3Cuse href='%23s' x='5' y='6'/%3E%3Cuse href='%23s' x='6' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23525252'%3E%3Cuse href='%23s' y='5'/%3E%3Cuse href='%23s' y='8'/%3E%3Cuse href='%23s' x='1' y='1'/%3E%3Cuse href='%23s' x='1' y='9'/%3E%3Cuse href='%23s' x='1' y='12'/%3E%3Cuse href='%23s' x='2'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='2'/%3E%3Cuse href='%23s' x='3' y='6'/%3E%3Cuse href='%23s' x='3' y='11'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='4' y='10'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23595959'%3E%3Cuse href='%23s' y='11'/%3E%3Cuse href='%23s' x='2' y='9'/%3E%3Cuse href='%23s' x='5' y='12'/%3E%3Cuse href='%23s' x='9' y='4'/%3E%3Cuse href='%23s' x='12' y='1'/%3E%3Cuse href='%23s' x='16' y='6'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23282828'%3E%3Cuse href='%23s' y='9'/%3E%3Cuse href='%23s' x='16' y='5'/%3E%3Cuse href='%23s' x='14' y='2'/%3E%3Cuse href='%23s' x='11' y='11'/%3E%3Cuse href='%23s' x='6' y='14'/%3E%3C/g%3E%3Cg fill='%23606060'%3E%3Cuse href='%23s' x='3' y='13'/%3E%3Cuse href='%23s' x='9' y='7'/%3E%3Cuse href='%23s' x='13' y='10'/%3E%3Cuse href='%23s' x='15' y='4'/%3E%3Cuse href='%23s' x='18' y='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23FF0000'%3E%3Cuse href='%23s' x='2' y='5'/%3E%3Cuse href='%23s' x='16' y='38'/%3E%3Cuse href='%23s' x='46' y='42'/%3E%3Cuse href='%23s' x='29' y='20'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23FF0000'%3E%3Cuse href='%23s' x='33' y='13'/%3E%3Cuse href='%23s' x='27' y='54'/%3E%3Cuse href='%23s' x='55' y='55'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='rotate(140 1000 750) scale(11.55) translate(-913.42 -685.06)'%3E%3Cg fill='%23FF0000'%3E%3Cuse href='%23s' x='11' y='8'/%3E%3Cuse href='%23s' x='51' y='13'/%3E%3Cuse href='%23s' x='17' y='73'/%3E%3Cuse href='%23s' x='99' y='57'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23b)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23h)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23c)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23d)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23e)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23f)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23g)' width='100%25' height='100%25'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}

.details-link {
  color: aliceblue;
  &:hover {
    border-color: rgb(204, 171, 27);
  }
}

.content {
  min-height: 80vh;
  padding-top: 4rem;
}

.page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.1rem;
}

.bg-color {
  background-color: var(--bg-color);
  transition: all 0.4s ease-in;
}

#app .o-modal__content {
  background: var(--glass-menu-bg);
  min-height: 50vh;
  min-width: 40rem;
  @media screen and (max-width: 768px) {
    min-height: 80vh;
    min-width: 100%;
  }
}

@keyframes blink {
  0% {
    opacity: 0.1;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
}
</style>
