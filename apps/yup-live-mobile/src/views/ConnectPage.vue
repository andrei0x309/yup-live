<template>
  <ion-page>
    <HeaderBar :key="mainStore.version" />

    <ion-content
      v-if="!enterLoading"
      class="connect-page ion-text-center"
      :fullscreen="false"
    >
      <ion-toast
        :is-open="toastState"
        :message="tostMsg"
        :duration="4550"
        @didDismiss="toastState = false"
      ></ion-toast>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style="
          opacity: 0.75;
          width: 6rem;
          margin-left: auto;
          margin-right: auto;
          margin-top: 1.5rem;
        "
        viewBox="0 0 366 366"
        fill="none"
      >
        <path
          d="M182.911 366C82.1487 366 0 283.851 0 182.911C0 81.9697 82.1487 0 182.911 0C283.672 0 365.821 82.1487 365.821 182.911C365.821 283.672 283.851 366 182.911 366ZM182.911 17.3604C91.6342 17.3604 17.1814 91.6342 17.1814 183.089C17.1814 274.545 91.4553 348.819 182.911 348.819C274.366 348.819 348.64 274.545 348.64 183.089C348.64 91.6342 274.366 17.3604 182.911 17.3604Z"
          fill="currentColor"
        />
        <path
          d="M129.218 156.959C105.952 156.959 86.8018 139.241 84.4751 116.69C84.1172 114.185 86.2649 111.858 88.9495 111.858H97.0033C99.5089 111.858 101.657 113.827 102.014 116.332C104.162 129.576 115.616 139.599 129.397 139.599C143.178 139.599 154.633 129.576 156.78 116.332C157.138 113.827 159.286 111.858 161.792 111.858H169.845C172.53 111.858 174.499 114.185 174.32 116.69C171.635 139.241 152.306 156.959 129.218 156.959Z"
          fill="currentColor"
        />
        <path
          d="M277.05 148.19H268.997C266.491 148.19 264.343 146.221 263.985 143.715C261.838 130.471 250.383 120.449 236.602 120.449C222.822 120.449 211.367 130.471 209.22 143.715C208.862 146.221 206.714 148.19 204.208 148.19H196.155C193.47 148.19 191.501 145.863 191.68 143.357C194.186 120.807 213.336 103.089 236.424 103.089C259.511 103.089 278.84 120.807 281.167 143.357C281.883 145.863 279.735 148.19 277.05 148.19Z"
          fill="currentColor"
        />
        <path
          d="M185.058 306.939C115.616 308.192 58.8818 250.204 58.8818 180.763V178.615C58.8818 176.289 60.8505 174.32 63.1772 174.32H302.464C304.791 174.32 306.76 176.289 306.76 178.615V182.911C306.939 250.562 252.531 305.865 185.058 306.939ZM79.8217 191.68C78.2109 191.68 76.7791 193.112 76.9581 194.723C82.8642 248.057 128.144 289.579 182.91 289.579C237.676 289.579 282.956 248.057 288.862 194.723C289.041 193.112 287.788 191.68 285.999 191.68H79.8217Z"
          fill="currentColor"
        />
      </svg>

      <ion-segment
        style="width: auto"
        class="my-8 mx-4 p-1"
        :value="currentSegment"
        mode="ios"
        @ion-change="segmentChange"
      >
        <ion-segment-button value="login">
          <ion-label>Login</ion-label>
        </ion-segment-button>
        <ion-segment-button value="signup">
          <ion-label>Signup</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div v-if="currentSegment === 'login'" class="mx-3">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Connect</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content class="ion-justify-content-center">
            <p class="ion-padding">Action requires an <b>Ethereum</b> mobile wallet.</p>
            <CustomButton
              :disabled="loading"
              class="ion-margin"
              text="Login"
              @click="onLoginLocal"
            />
          </ion-card-content>
        </ion-card>
      </div>
      <div v-else class="mx-3">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Connect</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content class="ion-justify-content-center">
            <ion-item mode="ios">
              <ion-label>Username</ion-label>
              <ion-input v-model="username" placeholder="yupster1337"></ion-input>
            </ion-item>
            <ion-accordion-group>
              <ion-accordion>
                <ion-item slot="header" color="light">
                  <ion-label>Details (optional)</ion-label>
                </ion-item>
                <div slot="content" class="ion-padding">
                  <ion-item>
                    <ion-label>Full Name</ion-label>
                    <ion-input placeholder="Sam Bankman-Fried"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label>Bio</ion-label>
                    <ion-textarea placeholder="yo yo yo I am a crypto bro"></ion-textarea>
                  </ion-item>
                </div>
              </ion-accordion>
            </ion-accordion-group>
            <p class="ion-padding">Action requires an <b>EVM</b> mobile wallet.</p>
            <CustomButton
              :disabled="loading"
              class="ion-margin"
              text="SignUp"
              @click="onSignupLocal"
            />
          </ion-card-content>
        </ion-card>
      </div>
      <div class="mt-8 mb-4">
        <ion-button
          class="info-btn"
          fill="clear"
          @click="
            () => {
              reviewModalLogin = false;
              codeModalLogin = false;
              infoModalOpen = true;
            }
          "
          >INFO - YUP</ion-button
        >
      </div>

      <div class="mt-2 mb-6">
        <ion-button
          class="info-btn"
          fill="clear"
          @click="
            () => {
              infoModalOpen = false;
              codeModalLogin = true;
              reviewModalLogin = false;
            }
          "
          >Desktop Login</ion-button
        >
      </div>

      <div class="mt-2 mb-6">
        <ion-button
          class="info-btn"
          fill="clear"
          @click="
            () => {
              infoModalOpen = false;
              codeModalLogin = false;
              reviewModalLogin = true;
            }
          "
          >Review Login</ion-button
        >
      </div>
    </ion-content>

    <ion-modal :is-open="infoModalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>INFO - YUP</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="infoModalOpen = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding pb-10">
        <h3 class="text-center mb-4">TLDR</h3>
        <p>
          This application is an open-source community client for Yup.io, it allows you to
          to post content and intercat with multiple social media networks. Source code is
          available on GitHub:
          <a href="https://github.com/andrei0x309/yup-live" target="_blank"
            >https://github.com/andrei0x309/yup-live</a
          >.
        </p>

        <h3 class="mt-4 text-center mb-4">FAQ:</h3>
        <ul class="mb-14">
          <li>
            <ul class="mb-4">
              <li class="mb-2">Q: Why do I need a wallet installed on my device?</li>
              <li class="mb-2">
                A: Sign in to an Ethereum DAPP is usually made by signing a message thus
                you need a wallet. But you can also sign in using a desktop website.
              </li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: What wallets have been tested?</li>
              <li class="mb-2">
                A: Many wallets but connection library has changed many tiems but
                Metamask, TrustWallet, and Rainbow have been tested most often.
              </li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: Is the signup open?</li>
              <li class="mb-2">A: Yes</li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: What I can do on YUP?</li>
              <li class="mb-2">
                A: Browse content, and like, and post on multiple other social media
                platforms(farcaster, Bluesky, Lens, Twitter), connect accounts and receive
                aggregated notifications from platforms that you have connected.
              </li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: Is this app open-source?</li>
              <li class="mb-2">
                A: Yes, alongside the web-app application and desktop bundle, you can find
                the code on
                <pre class="inline">yup-live</pre>
                repo on my GitHub account
                <pre class="inline">andrei0x309</pre>
                .
              </li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: Is this app available on IOS?</li>
              <li class="mb-2">
                A: No, it's available on these platforms: Android, Web, Win, Linux, Mac,
                but not IOS as it requires some costs I can't cover. Source could be
                modified to work on IOS too.
              </li>
            </ul>
          </li>
        </ul>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="reviewModalLogin">
      <ion-header>
        <ion-toolbar>
          <ion-title>Review Login</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="reviewModalLogin = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h3 class="text-center mb-4">AppStore Review Login</h3>

        <ion-card-content class="ion-justify-content-center">
          <ion-item mode="ios">
            <ion-label>Username</ion-label>
            <ion-input v-model="reviewUsername" placeholder=""></ion-input>
          </ion-item>

          <ion-item mode="ios">
            <ion-label>Password</ion-label>
            <ion-input v-model="reviewPassword" placeholder=""></ion-input>
          </ion-item>

          <ion-item mode="ios">
            <CustomButton
              :disabled="loading"
              class="mx-auto my-4"
              text="Log in"
              @click="reviewLogin"
            />
          </ion-item>
        </ion-card-content>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="codeModalLogin">
      <ion-header>
        <ion-toolbar>
          <ion-title>Desktop Login</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="codeModalLogin = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h3 class="text-center mb-4">Login using desktop</h3>

        <ion-card-content class="ion-justify-content-center">
          <ion-item mode="ios">
            <p class="p-4">
              Open desktop at <a href="https://live.yup.io" target="_blank">live.yup.io</a> or
              <a href="https://yup-live.pages.dev" target="_blank">yup-live.pages.dev</a>
              after you signed in, go to setting "Connect Device" and click "Generate Auth
              Code", then input the code below to login
            </p>
          </ion-item>

          <ion-item mode="ios">
            <ion-input
              label="Auth Code"
              label-placement="floating"
              fill="outline"
              placeholder="1sL1337Ls"
              v-model="codeInput"
            />
          </ion-item>

          <ion-item mode="ios">
            <CustomButton
              :disabled="loading"
              class="ion-margin"
              text="Log in"
              @click="codeLogin"
            />
          </ion-item>
        </ion-card-content>
      </ion-content>
    </ion-modal>

    <ion-loading
      :key="`loading-${loading}`"
      :is-open="loading"
      cssClass="my-custom-class"
      message="Please wait..."
      @didDismiss="loading = false"
    >
    </ion-loading>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonAccordion,
  IonItem,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardHeader,
  IonLoading,
  IonAccordionGroup,
  IonToast,
  IonModal,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonButton,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { onLogin, onSignup, walletDisconnect } from "shared/src/utils/login-signup";
import { useMainStore } from "@/store/main";
import { storage } from "@/utils/storage";
import CustomButton from "@/components/misc/button-connect-page.vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/template/header-bar.vue";
import { getConnected } from "shared/src/utils/requests/accounts";
import { verifyLoginCode } from "shared/src/utils/auth";

type StoredAccount = {
  authToken: string;
  account: string;
  weight: number | null | undefined | string;
  address: string;
  fid?: string | null | undefined;
  avatar: string | null | undefined;
  isOwner?: boolean;
};

type StoredAccounts = {
  [key: string]: StoredAccount;
};

const currentSegment = ref("login");
const username = ref("");
const bio = ref("");
const fullName = ref("");
const loading = ref(false);
const enterLoading = ref(true);
const mainStore = useMainStore();
const toastState = ref(false);
const tostMsg = ref("");
const router = useRouter();
const infoModalOpen = ref(false);
const reviewModalLogin = ref(false);
const codeModalLogin = ref(false);
const reviewUsername = ref("");
const reviewPassword = ref("");
const codeInput = ref("");
const storedAccounts = ref<StoredAccounts>({});

// const loginTimeout = ref(80000);
// const cancelPromiseResolve = ref((a: unknown) => {});

const segmentChange = (value: any) => {
  currentSegment.value = value.detail.value;
};

const loadState = (value: string) => {
  if (value === "start") {
    loading.value = true;
  } else if (value === "end") {
    loading.value = false;
  } else if (value === "close") {
    loading.value = false;
  }
};

const setAlert = (value: { message: string }) => {
  const msg = value?.message ?? "";
  if (msg) {
    tostMsg.value = msg;
    toastState.value = true;
  }
};

const reviewLogin = async () => {
  reviewModalLogin.value = false;
  loading.value = true;
  try {
    const req = await fetch("https://api.yup.io/accounts/log-in/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: reviewUsername.value,
        password: reviewPassword.value,
      }),
    });
    if (!req.ok) {
      loading.value = false;
      toastState.value = true;
      if (reviewUsername.value.toLocaleLowerCase() === "test200") {
        tostMsg.value = "API is down, please try again later";
        return;
      }
      tostMsg.value = "Invalid username or password";
      return;
    }

    const res = await req.json();

    const loginRes = {
      address: res?.address ?? "",
      _id: res?.accountId ?? "",
      avatar: res?.avatar ?? "",
      weight: 1,
      signature: "",
      authToken: res?.jwt ?? "",
      username: res?.username ?? "",
    };
    await doLogin(loginRes);
    loading.value = false;
  } catch {
    loading.value = false;
  }
};

const doLogin = (params: Awaited<ReturnType<typeof onSignup>>) => {
  if (params) {
    try {
      const userAuth = {
        address: params?.address ?? "",
        account: params?._id ?? "",
        signature: params?.signature ?? "",
        avatar: params?.avatar ?? "",
        authToken: params?.authToken ?? "",
        weight: params?.weight ?? "1",
        fid: "",
        isTwitterBlue: false,
      };
      storage.set("authInfo", JSON.stringify(userAuth));
      mainStore.userData = userAuth;
      mainStore.isLoggedIn = true;
      getConnected(mainStore, userAuth.account, userAuth.address).catch((err) => {
        console.error("Failed to get connected", err);
      });
      router.replace("/tabs/feeds");
    } catch (error) {
      console.error("Failed to set auth data", error);
    }
  } else {
    window?.localStorage?.clear();
    walletDisconnect();
  }
};

const doStoreLogin = async (params: Awaited<ReturnType<typeof onLogin>>) => {
  if (params) {
    try {
      for (const acc of params ?? []) {
        storedAccounts.value[acc.account] = {
          authToken: acc.authToken,
          account: acc.account,
          weight: acc.weight,
          address: acc.address,
          avatar: acc.avatar,
        };
      }

      await storage.set("storedAccounts", JSON.stringify(storedAccounts.value));

      const account = params[0];

      localStorage.setItem("account", account.account);
      localStorage.setItem("authToken", account.authToken);
      localStorage.setItem("weight", String(account.weight ?? "1"));
      localStorage.setItem("address", account.address);
      localStorage.setItem("avatar", account.avatar || "");

      const userAuth = {
        address: account.address,
        account: account.account,
        signature: "",
        avatar: account.avatar,
        weight: account.weight as number,
        authToken: account.authToken,
        fid: "",
        connected: account.connected,
        isTwitterBlue: account.isTwitterBlue,
      };

      await storage.set("authInfo", JSON.stringify(userAuth));
      mainStore.userData = userAuth;
      mainStore.isLoggedIn = true;
      getConnected(mainStore, userAuth.account, userAuth.address).catch((err) => {
        console.error("Failed to get connected", err);
      });
      router.replace("/tabs/feeds");
    } catch (error) {
      console.error("Failed to set auth data", error);
    }
  } else {
    window?.localStorage?.clear();
    walletDisconnect();
  }
};

const onSignupLocal = async () => {
  const signupResult = await onSignup({
    loadState,
    setAlert,
    username: username.value,
    bio: bio.value,
    fullname: fullName.value,
    mobile: true,
  });
  doLogin(signupResult);
  loading.value = false;
};

const onLoginLocal = async () => {
  const loginResult = await onLogin({
    loadState,
    setAlert,
    mobile: true,
  });
  doStoreLogin(loginResult);
  loading.value = false;
};

const codeLogin = async () => {
  loading.value = true;
  const res = await verifyLoginCode({ code: codeInput.value, store: mainStore });
  if (!res) {
    loading.value = false;
    toastState.value = true;
    tostMsg.value = "Invalid code";
    return;
  }
  const loginRes = {
    address: res?.address ?? "",
    _id: res?.accountId ?? "",
    avatar: res?.avatar ?? "",
    weight: res?.weight ?? 1,
    signature: "",
    authToken: res?.jwt ?? "",
    username: res?.username ?? "",
  };
  codeModalLogin.value = false;
  doLogin(loginRes);
  loading.value = false;
};

onMounted(async () => {
  const authInfo = await storage.get("authInfo");
  if (!authInfo) {
    enterLoading.value = false;
  }
  loading.value = false;
});
</script>

<style lang="scss">
#walletconnect-wrapper {
  .walletconnect-modal__base {
    background: #ffffff;
  }
  .walletconnect-qrcode__text {
    color: var(--ion-color-secondary);
  }

  .walletconnect-connect__button {
    background-color: var(--ion-color-tertiary-shade) !important;
    box-shadow: 3px 3px 9px 4px #0000005e;
  }

  .walletconnect-modal__mobile__toggle a {
    color: black;
  }
}

.info-btn {
  color: rgba(240, 248, 255, 0.829);
  background-color: rgba(240, 248, 255, 0.021);
}
</style>
