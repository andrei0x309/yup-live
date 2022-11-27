<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { config } from 'shared/dist/utils/config'
config.setConfig({ API_BASE: 'https://api.yup.io', POLY_RPC: 'https://polygon-rpc.com' })
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, onBeforeMount } from 'vue';
import { useMainStore } from "@/store/main";
import { storage } from '@/utils/storage'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup () {
    const store = useMainStore();
    const router = useRouter();

    onBeforeMount(async () => {
        if(!store.isLoggedIn) {
          const authInfo = await storage.get('authInfo')
          if(authInfo) {
            store.userData = JSON.parse(authInfo)
            store.isLoggedIn = true
            router.push('/tabs/feeds')
          } else {
            router.push('/connect')
          }
        }
    })
  }
});
</script>

<style>
.gradient-text {
  background-color: #ca4246;
  background-image: linear-gradient(
    45deg,
    #ca4246 16.666%,
    #e16541 16.666%,
    #e16541 33.333%,
    #f18f43 33.333%,
    #f18f43 50%,
    #8b9862 50%,
    #8b9862 66.666%,
    #476098 66.666%,
    #476098 83.333%,
    #a7489b 83.333%
  );

  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow-text-simple-animation-rev 0.75s ease forwards;
}

.gradient-text:hover {
  animation: rainbow-text-simple-animation 0.5s ease-in forwards;
}

@keyframes rainbow-text-simple-animation-rev {
  0% {
    background-size: 650%;
  }
  40% {
    background-size: 650%;
  }
  100% {
    background-size: 100%;
  }
}

@keyframes rainbow-text-simple-animation {
  0% {
    background-size: 100%;
  }
  80% {
    background-size: 650%;
  }
  100% {
    background-size: 650%;
  }
}

.titleToolbar {
  font-weight: bolder;
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  display: inline;
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

html {
  --glass-menu-bg: #fafafa7a;
  --glassTxt: #222;
}

html.dark, body.dark {
  --glassTxt: rgb(21, 24, 26);
  --glass-menu-bg: #b6b19ff6;
}
</style>