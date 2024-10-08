<template>
  <ion-app id="root">
    <ion-page>
      <ion-router-outlet />

      <ion-toast
        :key="toastMsg"
        :is-open="toastState"
        :message="toastMsg"
        :duration="4550"
        @didDismiss="toastState = false"
      ></ion-toast>
      <ion-loading
        :key="`loading-${loading}`"
        :is-open="loading"
        message="Please wait..."
        :duration="5000"
      >
      </ion-loading>
    </ion-page>
  </ion-app>
  <AlertStack
    :useAlertStack="useAlertStack"
    :setAlertStack="setAlertStack"
    :mobile="true"
  />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMainStore, openPostModal } from "@/store/main";
import {
  IonApp,
  IonRouterOutlet,
  actionSheetController,
  IonToast,
  IonPage,
  toastController,
  IonLoading,
  modalController,
  useBackButton,
  useIonRouter,
} from "@ionic/vue";
import { ref, onBeforeMount, onBeforeUnmount, watch, defineAsyncComponent } from "vue";
import { storage } from "@/utils/storage";
import { SendIntent } from "send-intent";
import { arrowDownOutline, heartCircleOutline, addCircleOutline } from "ionicons/icons";
import { isAndroid } from "@/utils/capacitor";
import { fetchWAuth } from "shared/src/utils/auth";
import { wait } from "shared/src/utils/time";
import { getConnected, clearProfileBlocks } from "shared/src/utils/requests/accounts";
import { cleanBlockedPosts } from "shared/src/utils/post";
import AlertStack from "components/functional/alertStack.vue";
import { setAlertStack, useAlertStack, stackAlertSuccess } from "@/store/alert-store";
import { getExpoPushTokenAndRegister } from "@/utils/expo-push-not-re";
import { checkForUpdateAndNotify, getVersion } from "@/utils/update-version";
import UpdateModal from "@/views/UpdateModal.vue";
import { getPushSettings } from "@/utils/expo-push-not-re";
import { updateNotify } from "shared/src/utils/changeLog";

// const CrossPost = defineAsyncComponent(() => import("@/views/CrossPostModal.vue"));

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const store = useMainStore();
const router = useRouter();
const toastState = ref(false);
const toastMsg = ref("");
const loading = ref(false);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const promisePostResolved = ref((_a: unknown) => {});
const ionRouter = useIonRouter();

store.$subscribe(async (newValue) => {
  if (newValue?.openPostModal === false) {
    promisePostResolved.value(1);
  }
});

const openToast = (msg: string) => {
  toastState.value = true;
  toastMsg.value = msg;
};

const executeVote = async (like: boolean, url: string) => {
  const body = {} as Record<string, unknown>;
  body.like = like;
  body.url = url;
  body.rating = 1;
  body.voter = store.userData.account;
  openToast("Vote is pending");
  const req = await fetchWAuth(store, `${API_BASE}/votes`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (req.ok) {
    await toastController.dismiss();
    openToast("Vote sent, you'll be redirected back after 3 seconds");
    await wait(3000);
  } else {
    const err = await req.text();
    if (err.includes("limit")) {
      await toastController.dismiss();
      openToast("Voting limit reached, you'll be redirected back after 3 seconds");
      await wait(3000);
    } else {
      await toastController.dismiss();
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
});

// store.$subscribe(async (newValue) => {

// });

const presentActionSheet = async (url: string) => {
  const urlSub = url.length > 15 ? url.substring(0, 15) + '..."' : url;
  const actionSheet = await actionSheetController.create({
    header: "URL: " + urlSub,
    subHeader: "You'll be redirect back after action",
    buttons: [
      {
        text: "New Post",
        role: "newPost",
        icon: addCircleOutline,
        data: {
          action: "newPost",
        },
      },
      {
        text: "Like Post",
        role: "like",
        icon: heartCircleOutline,
        data: {
          action: "like",
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
      case "newPost": {
        await openPostModal({
          state: store,
          shareLink: url,
        });
        await new Promise((resolve) => {
          promisePostResolved.value = resolve;
        });
        break;
      }
    }
  }
  SendIntent.finish();
};

if (isAndroid()) {
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
        SendIntent.finish();
      }
    })
    .catch(() => {
      // ignore
    });
}

const openUpdateModal = async ({
  forced,
  message,
  url,
  paused,
}: {
  forced: boolean;
  message: string;
  url: string;
  paused: boolean;
}) => {
  const modal = await modalController.create({
    component: UpdateModal,
    componentProps: {
      forced,
      message: message,
      url: url,
      paused,
    },
  });
  modal.present();
  const { role } = await modal.onWillDismiss();
  if (role === "confirm") return true;
  return false;
};

onBeforeMount(async () => {
  loading.value = true;
  clearProfileBlocks();
  cleanBlockedPosts();
  if (!store.isLoggedIn) {
    const authInfo = storage.get("authInfo");
    const settings = storage.get("settings");
    const authInfoVal = await authInfo;

    getVersion()
      .then((vinfo) => {
        store.version = vinfo.versionString;
        if (authInfoVal) {
          checkForUpdateAndNotify(store, vinfo.versionString).then((res) => {
            if (res?.update) {
              openUpdateModal({
                forced: res.forced,
                paused: !!res.paused,
                message: res.updateMessage,
                url: res.url,
              });
            }
            setTimeout(() => {
              updateNotify({
                stackAlertSuccess,
                router,
              });
            }, 1500);
            import("@capacitor/app").then((lib) => {
              if (res?.update && res?.forced) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                useBackButton(99, () => {
                  lib.App.minimizeApp();
                });
              } else {
                useBackButton(99, () => {
                  if ((window as any)?.closeLightbox) {
                    const source = (window as any)?.closeLightboxSource;
                    (window as any)?.closeLightbox?.(source);
                    (window as any).closeLightbox = null;
                    return;
                  }
                  if (!ionRouter.canGoBack()) {
                    lib.App.minimizeApp();
                  } else if (
                    router.currentRoute.value.path === "/" &&
                    router.currentRoute.value.redirectedFrom?.path === "/tabs/feeds" &&
                    store.isLoggedIn
                  ) {
                    router.replace("/tabs/feeds");
                    lib.App.minimizeApp();
                    return;
                  }
                  router.back();
                });
              }
            });
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });

    if (authInfoVal) {
      setTimeout(async () => {
        getExpoPushTokenAndRegister({ store });
      }, 2000);
      store.userData = JSON.parse(authInfoVal);
      getConnected(store, store.userData.account, store.userData.address);
      store.isLoggedIn = true;
      getPushSettings({ store }).then((res) => {
        if (res) {
          const pushNotifications = res.notificationSettings.enabledNotificationTypes;
          store.pushNotifications = pushNotifications;
        }
      });
      settings.then((res) => {
        if (res) {
          store.settings = res;
        }
      });
      if (router.currentRoute.value.path === "/" && store.isLoggedIn) {
        await router?.replace("/tabs/feeds");
      }
    }
  }
  loading.value = false;
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
    -90deg,
    #ca4246 0.666%,
    #ca4246 45.666%,
    #f18f43 40.333%,
    #f18f43 60%,
    #829641 66.666%,
    #829641 75.333%,
    #3b7a57 83.333%
  );
  font-size: 1.3rem;

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

.view-btn {
  font-size: 0.7rem;
  border: 1px solid #949d9d;
  border-radius: 0.3rem;
  padding: 0.1rem 0.2rem;
}
.view-btn:hover {
  background-color: #383838;
}

.glassCard {
  margin-top: 1rem;
  background-color: var(--glass-menu-bg);
  padding: 2rem;
  border-radius: 1rem;
  filter: grayscale(0.1);
  background: linear-gradient(
      234deg,
      rgba(80, 76, 76, 0.1411764706),
      rgba(24, 24, 24, 0.5490196078)
    ),
    linear-gradient(39deg, rgba(98, 92, 92, 0.2117647059), rgba(32, 31, 31, 0.5607843137));
  color: aliceblue;
  box-shadow: 2px 2px #2b2d2e;
}

.blink {
  animation: blink 0.9s infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>
