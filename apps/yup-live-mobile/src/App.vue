<template>
  <ion-app>
  <ion-page>
    <ion-router-outlet />

    <ion-toast
      :is-open="toastState"
      @didDismiss="toastState = false"
      :key="toastMsg"
      :message="toastMsg"
      :duration="4550"
    ></ion-toast>
    <ion-loading
        :is-open="loading"
        message="Please wait..."
        :duration="5000"
      >
      </ion-loading>
    </ion-page>
  </ion-app>
</template>

<script lang="ts">
import { config } from "shared/src/utils/config";
config.setConfig({ API_BASE: "https://api.yup.io", POLY_RPC: "https://polygon-rpc.com" });

import {
  IonApp,
  IonRouterOutlet,
  actionSheetController,
  IonToast,
  IonPage,
  toastController,
  IonLoading
} from "@ionic/vue";
import { defineComponent, ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useMainStore } from "@/store/main";
import { storage } from "@/utils/storage";
import { useRouter } from "vue-router";
import { SendIntent } from "send-intent";
import { arrowDownOutline, thumbsUpOutline, thumbsDownOutline } from "ionicons/icons";
import { Capacitor } from '@capacitor/core';
import { fetchWAuth } from "shared/src/utils/auth";
import { wait } from "shared/src/utils/time";
import { App } from "@capacitor/app";

const { API_BASE } = config;

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    IonToast,
    IonLoading,
    IonPage
  },
  setup() {
    const store = useMainStore();
    const router = useRouter();
    const toastState = ref(false);
    const toastMsg = ref("");
    const loading = ref(false)

    const openToast = (msg: string) => {
      toastState.value = true;
      toastMsg.value = msg;
    };


    App.addListener('backButton', (r) => {
       if(!r.canGoBack) {
        App.minimizeApp()
       } else if (router.currentRoute.value.path === '/connect' && router.currentRoute.value.redirectedFrom?.path === '/tabs/feeds' && store.isLoggedIn){
          router.replace('/tabs/feeds')
          App.minimizeApp()
       }
    })

    const executeVote = async (like: boolean, url: string) => {
      const body = {} as Record<string, unknown>;
      body.like = like;
      body.url = url;
      body.rating = 1;
      body.voter = store.userData.account;
      openToast("Vote is pending")
      const req = await fetchWAuth(store, `${API_BASE}/votes`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (req.ok) {
        await toastController.dismiss()
        openToast("Vote sent, you'll be redirected back after 3 seconds")
        await wait(3000);
      } else {
        const err = await req.text();
        if (err.includes("limit")) {
          await toastController.dismiss()
          openToast("Voting limit reached, you'll be redirected back after 3 seconds")
          await wait(3000);
        } else {
          await toastController.dismiss()
          openToast(
            "Vote not submitted due to error try to re-login, you'll be redirected back after 3 seconds!"
          );
          await wait(3500);
        }
        return null;
      }
    };

    onBeforeUnmount(() => {
      loading.value = false;
    })

    const presentActionSheet = async (url: string) => {
      const urlSub = url.length > 15 ? url.substring(0, 15) + '..."' : url;
      const actionSheet = await actionSheetController.create({
        header: "URL: " + urlSub,
        subHeader: "You'll be redirect back after action",
        buttons: [
          {
            text: "Like Post",
            role: "like",
            icon: thumbsUpOutline,
            data: {
              action: "like",
            },
          },
          {
            text: "Dislike Post",
            role: "dislike",
            icon: thumbsDownOutline,
            data: {
              action: "dislike",
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            icon: arrowDownOutline,
            data: {
              action: "cancel",
            },
          },
        ],
      });

      await actionSheet.present();

      const res = await actionSheet.onDidDismiss();
      if (res?.data?.action) {
        switch (res.data.action) {
          case "like": {
            await executeVote(true, url);
            break;
          }
          case "dislike": {
            await executeVote(false, url);
            break;
          }
        }
      }
      SendIntent.finish();
    };

    if(Capacitor.isPluginAvailable('SplashScreen')) {
    SendIntent.checkSendIntentReceived()
      .then(async (result: any) => {
        if (result?.url) {
          const authInfo = await storage.get("authInfo");
          if (!authInfo) {
            openToast(
              "Error: You must be logged in, you'll be redirected back in 3 seconds"
            );
            setTimeout(
              () =>
                (toastMsg.value =
                  "Error: You must be logged in, you'll be redirected back in 2 seconds"),
              1000
            );
            setTimeout(
              () =>
                (toastMsg.value =
                  "Error: You must be logged in, you'll be redirected back in 1 seconds"),
              2000
            );
            setTimeout(() => SendIntent.finish(), 3500);
          } else {
            await presentActionSheet(result?.url);
          }
        } else {
          openToast(
            "Error: Unsuported Share Type , you'll be redirected back in 3 seconds"
          );
          SendIntent.finish()
        }
      }).catch(() => {
        // ignore
      })
    }

    onBeforeMount(async () => {
      loading.value = true;
      if (!store.isLoggedIn) {
        const authInfo = await storage.get("authInfo");
        if (authInfo) {
          store.userData = JSON.parse(authInfo);
          store.isLoggedIn = true;
          router.replace("/tabs/feeds");
        }
      }
      loading.value = false;
    });

    return {
      toastState,
      toastMsg,
      loading
    };
  },
});
</script>

<style lang="scss">
html {
  --glass-menu-bg: #fafafa7a;
  --glassTxt: #222;
  --post-card-bg: #f9f9f93b;
}

html.dark,
body.dark {
  --glassTxt: aliceblue;
  --glass-menu-bg: #14141463;
  --post-card-bg: #2626263b;
}

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
  font-size: 1.4rem;
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

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.glassCard {
    margin-top: 1rem;
    background-color: var(--glass-menu-bg);
    padding: 2rem;
    border-radius: 1rem;
    filter: grayscale(0.1);
    background: linear-gradient(234deg, rgba(80, 76, 76, 0.1411764706), rgba(24, 24, 24, 0.5490196078)), linear-gradient(39deg, rgba(98, 92, 92, 0.2117647059), rgba(32, 31, 31, 0.5607843137));
    color: aliceblue;
    box-shadow: 2px 2px #2b2d2e;
  }

</style>
