<template>
  <ion-page>
    <HeaderBar :key="mainStore.version" />

    <ion-content class="connect-page ion-text-center" :fullscreen="false">
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
          <ion-label>SignUp</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div v-if="currentSegment === 'login'" class="mx-3">
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Connect</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content class="ion-justify-content-center">
            <p class="ion-padding">Action requires an <b>Ethereum</b> mobile wallet.</p>
            <CustomButton :disabled="loading"  class="ion-margin" text="Login" @click="onLoginLocal" />
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
            <CustomButton :disabled="loading" class="ion-margin" text="SignUp" @click="onSignupLocal"  />
            <ion-item mode="ios" class="text-[0.85rem] opacity-80">
          Sign Up is gated check conditions by tapping the "INFO - YUP" button.
        </ion-item>
          </ion-card-content>
        </ion-card>
      </div>
      <div class="mt-20 mb-4">
        <ion-button class="info-btn" fill="clear" @click="(infoModalOpen = true)" >INFO - YUP</ion-button>
      </div>

      <div class="mt-2 mb-6">
        <ion-button class="info-btn" fill="clear" @click="(reviewModalLogin = true)" >Review Login</ion-button>
      </div>
    </ion-content>

    <ion-modal :is-open="infoModalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>INFO - YUP</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="(infoModalOpen = false)">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding pb-10">
        <h3 class="text-center mb-4">TLDR</h3>
        <p>
          This application provides access to certain features of the YUP social network.
        </p>

        <h3 class="mt-4 text-center mb-4">FAQ:</h3>
        <ul class="mb-14">
          <li>
            <ul class="mb-4">
              <li class="mb-2">Q: Why do I need a wallet installed on my device?</li>
              <li class="mb-2">A: Sign in to an Ethereum DAPP is usually made by signing a message thus you need a wallet. In theory, you can sign in / sign-up even on a desktop if you copy the link from the QR modal and input it in any wallet.</li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: What wallets have been tested?</li>
              <li class="mb-2">A: <pre class="inline">TrustWallet</pre>, and  <pre class="inline">Metamask</pre>, Rainbow does not wotk well with walletConnect V2 currently.</li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: Is the signup open?</li>
              <li class="mb-2">A: No, is currently gated by requiring to meet one of 3 conditions: 1 Yup Score of 25, 2 Be on Allow List, 3 Yup Balance of 25k.</li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: What I can do on YUP?</li>
              <li class="mb-2">A: Browse content, and like, post on multiple other soical media platforms, connect accounts and receive aggregated notifications from platforms that you have connected.</li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: Is this app open-source?</li>
              <li class="mb-2">A: Yes, alongside the web-app application and desktop bundle, you can finde the code on <pre class="inline">yup-live</pre> repo on my GitHub account <pre class="inline">andrei0x309</pre>.</li>
            </ul>
            <ul class="mb-4">
              <li class="mb-2">Q: Is this app available on IOS?</li>
              <li class="mb-2">A: No, it's available on these platforms: Android, Web, Win, Linux, Mac, but never on IOS.</li>
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
            <ion-button @click="(infoModalOpen = false)">Close</ion-button>
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

        <CustomButton :disabled="loading" class="ion-margin" text="Log in" @click="reviewLogin"  />
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
    <ion-toast
      :is-open="toastState"
      :message="tostMsg"
      :duration="4550"
      @didDismiss="toastState = false"
    ></ion-toast>
  </ion-page>
</template>

<script lang="ts">
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
  onIonViewWillEnter,
  IonModal,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonButton
} from "@ionic/vue";
import { defineComponent } from "vue";
import { ref, Ref, onMounted, } from "vue";
import { onLogin, onSignup } from "shared/src/utils/login-signup";
import { useMainStore } from "@/store/main";
import { storage } from "@/utils/storage";
import CustomButton from "@/components/misc/button-connect-page.vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/template/header-bar.vue";
import { getConnected } from "shared/src/utils/requests/accounts";

export default defineComponent({
  name: "ConnectPage",
  components: {
    IonContent,
    IonPage,
    IonLoading,
    CustomButton,
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
    IonAccordionGroup,
    IonToast,
    HeaderBar,
    IonModal,
    IonToolbar,
    IonTitle,
    IonHeader,
  IonButtons,
  IonButton
  },
  setup() {
    const currentSegment = ref("login");
    const username = ref("");
    const bio = ref("");
    const fullName = ref("");
    const loading = ref(false);
    const mainStore = useMainStore();
    const toastState = ref(false);
    const tostMsg = ref("");
    const router = useRouter();
    const infoModalOpen = ref(false);
    const reviewModalLogin = ref(false);
    const reviewUsername = ref("");
    const reviewPassword = ref("");

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
      const req = await fetch('https://api.yup.io/accounts/log-in/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: reviewUsername.value,
          password: reviewPassword.value
        })
      })
      if(!req.ok) {
        loading.value = false;
        toastState.value = true;
        if(reviewUsername.value.toLocaleLowerCase() === 'test200') {
          tostMsg.value = 'API is down, please try again later';
          return;
        }
        tostMsg.value = 'Invalid username or password';
        return;
      }

      const res = await req.json()

      const loginRes = {
            address:res?.address ?? "",
            _id: res?.accountId ?? "",
            avatar: res?.avatar ?? "",
            weight: 1,
            signature: '',
            authToken: res?.jwt ?? "",
            username: res?.username ?? "",
        }
      await doLogin(loginRes)
      loading.value = false;
    } catch {
      loading.value = false;
    }
    }


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
          };
          storage.set("authInfo", JSON.stringify(userAuth));
          mainStore.userData = userAuth;
          mainStore.isLoggedIn = true;
          getConnected(mainStore, params?._id ?? "").catch((err) => {
          console.error("Failed to get connected", err);
        });
          router.push("/tabs/feeds");
        } catch (error) {
          console.error("Failed to set auth data", error);
        }
      } else {
        window?.localStorage?.clear()
      }
    };

 
    const onSignupLocal = async () => {
      loadState('start')
      const signupResult = await onSignup({
        loadState: loadState,
        setAlert: setAlert,
        username: username.value,
        bio: bio.value,
        fullname: fullName.value,
      });
      doLogin(signupResult);
      loading.value = false
    };

    const onLoginLocal = async () => {
      loadState('start')
      const loginResult = await onLogin({
        loadState,
        setAlert,
      });
      doLogin(loginResult);
      loading.value = false
    };

    onIonViewWillEnter(async () => {
      loading.value = true;
      const authInfo = await storage.get("authInfo");
      if (authInfo) {
        await router.replace("/tabs/feeds");
      }
      loading.value = false;
    });

    onMounted(async () => {
      loading.value = false;
    });

    return {
      onSignupLocal,
      onLoginLocal,
      currentSegment,
      segmentChange,
      username,
      bio,
      fullName,
      loading,
      toastState,
      tostMsg,
      infoModalOpen,
      reviewModalLogin,
      reviewPassword,
      reviewUsername,
      reviewLogin,
      mainStore
    };
  },
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
    background-color: var(--ion-color-tertiary-shade)!important;
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
