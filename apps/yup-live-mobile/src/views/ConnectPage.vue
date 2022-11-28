<template>
  <ion-page>
    <HeaderBar />

    <ion-content class="ion-text-center" :fullscreen="false">
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
        @ion-change="segmentChange"
        mode="ios"
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
            <p class="ion-padding">Action requires an <b>EVM</b> mobile wallet.</p>
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
            <ion-label>Username</ion-label>
            <ion-input v-model="username" placeholder="yupster1337"></ion-input>
            <ion-accordion-group>
              <ion-accordion>
                <ion-item slot="header" color="light">
                  <ion-label>Details (optional)</ion-label>
                </ion-item>
                <div class="ion-padding" slot="content">
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
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <ion-loading
      :is-open="loading"
      cssClass="my-custom-class"
      message="Please wait..."
      @didDismiss="loading = false"
    >
    </ion-loading>
    <ion-toast
      :is-open="toastState"
      @didDismiss="toastState = false"
      :message="tostMsg"
      :duration="4550"
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
  onIonViewWillEnter
} from "@ionic/vue";
import { defineComponent } from "vue";
import { ref, Ref, onMounted, } from "vue";
import { onLogin, onSignup } from "shared/dist/utils/login-signup";
import { useMainStore } from "@/store/main";
import { ethers } from "ethers";
import { storage } from "@/utils/storage";
import CustomButton from "@/components/misc/button-connect-page.vue";
import { useRouter } from "vue-router";
import HeaderBar from "@/components/template/header-bar.vue";

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
    HeaderBar
  },
  setup() {
    const provider = (ref(null) as unknown) as Ref<ethers.providers.Web3Provider>;
    const web3Modal = (ref(null) as unknown) as Ref<any>;
    const currentSegment = ref("login");
    const username = ref("");
    const bio = ref("");
    const fullName = ref("");
    const loading = ref(false);
    const mainStore = useMainStore();
    const toastState = ref(false);
    const tostMsg = ref("");
    const router = useRouter();

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
          router.push("/tabs/feeds");
        } catch (error) {
          console.error("Failed to set auth data", error);
        }
      }
    };

    const onSignupLocal = async () => {
      loadState('start')
      const signupResult = await onSignup({
        loadState,
        setAlert,
        ethers,
        provider,
        username: username.value,
        bio: bio.value,
        fullname: fullName.value,
        web3M: web3Modal,
      });
      doLogin(signupResult);
      loading.value = false
    };

    const onLoginLocal = async () => {
      loadState('start')
      const loginResult = await onLogin({
        loadState,
        setAlert,
        ethers,
        provider,
        web3M: web3Modal,
      });
      doLogin(loginResult);
      loading.value = false
    };

    onIonViewWillEnter(async () => {
      const authInfo = await storage.get("authInfo");
      if (authInfo) {
        router.push("/tabs/feeds");
      }
    });

    onMounted(async () => {
      loading.value = true;
      const providerOptions = (await import("shared/dist/utils/evm")).providerOptions;
      const Web3Modal = (await import("web3modal")).default;
      web3Modal.value = new Web3Modal({
        network: "matic", // optional
        cacheProvider: false, // optional
        providerOptions, // required
        theme: mainStore.theme,
        disableInjectedProvider: false,
      });
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
    };
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
