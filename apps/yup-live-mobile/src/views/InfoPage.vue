<template>
  <ion-page>
    <HeaderBar text="APP INFO" :menu="true" />

    <ion-content class="ion-text-center" :fullscreen="false">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style="
          opacity: 0.75;
          width: 3rem;
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

      <div class="logo inline-flex items-center mt-2" aria-label="logo">
        <p style="margin-left: 1rem" class="titleToolbar gradient-text">YUP</p>
        <svg
          style="margin-left: 0.5rem; width: 2.4rem"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 27.015619 12.00781"
        >
          <path
            id="live-1"
            fill="#f04545"
            d="M 0,6.0039 C 0,5.60937 0.0391,5.21875 0.11328,4.83203 0.19138,4.44531 0.30469,4.07031 0.45703,3.70312 0.60547,3.33984 0.79297,2.99609 1.01172,2.66797 1.23047,2.33984 1.48047,2.03515 1.75781,1.75781 2.03516,1.47656 2.33984,1.23047 2.66797,1.01172 2.99609,0.79297 3.33984,0.60547 3.70703,0.45703 4.07031,0.30469 4.44531,0.1914 4.83203,0.11328 5.21875,0.03518 5.60937,0 6.00391,0 h 15.00781 c 0.39453,0 0.78515,0.0352 1.17187,0.11328 0.38672,0.0781 0.76172,0.19141 1.125,0.34375 0.36719,0.14844 0.71094,0.33594 1.03907,0.55469 0.32812,0.21875 0.63281,0.46484 0.91015,0.74609 0.27735,0.27734 0.52735,0.58203 0.7461,0.91016 0.21875,0.32812 0.40625,0.67187 0.55468,1.03515 0.15235,0.36719 0.26563,0.74219 0.34375,1.12891 0.0742,0.38672 0.11328,0.77734 0.11328,1.17187 0,0.39063 -0.0391,0.78125 -0.11328,1.16797 -0.0781,0.38672 -0.1914,0.76172 -0.34375,1.12891 -0.14843,0.36328 -0.33593,0.71094 -0.55468,1.03516 -0.21875,0.32812 -0.46875,0.63281 -0.7461,0.91015 -0.27734,0.28125 -0.58203,0.52735 -0.91015,0.7461 -0.32813,0.22265 -0.67188,0.40625 -1.03907,0.55859 -0.36328,0.14844 -0.73828,0.26172 -1.125,0.33984 -0.38672,0.0781 -0.77734,0.11719 -1.17187,0.11719 H 6.00391 c -0.39454,0 -0.78516,-0.0391 -1.17188,-0.11719 -0.38672,-0.0781 -0.76172,-0.1914 -1.125,-0.33984 C 3.33984,11.39844 2.99609,11.21484 2.66797,10.99609 2.33984,10.77344 2.03516,10.52734 1.75781,10.24609 1.48047,9.96875 1.23047,9.66406 1.01172,9.33594 0.79297,9.01172 0.60547,8.66406 0.45703,8.30078 0.30469,7.93359 0.19141,7.55859 0.11328,7.17187 0.03908,6.78515 0,6.39453 0,6.0039 Z m 0,0"
          />
          <path
            id="live-2"
            fill="#fff"
            d="m 8.8538666,9.0041491 h -3.4375 v -6.203125 h 1.203125 v 5.140625 h 2.0625 z m 0,0"
          />
          <path
            id="live-3"
            fill="#fff"
            d="M 10.966965,9.0041491 H 9.7638397 v -6.203125 h 1.2031253 z m 0,0"
          />
          <path
            id="live-4"
            fill="#fff"
            d="m 17.635117,2.8010241 -2.3125,6.234375 h -1.21875 l -2.265625,-6.09375 1.25,-0.203125 1.671875,4.75 1.609375,-4.6875 z m 0,0"
          />
          <path
            id="live-5"
            fill="#fff"
            d="m 22.175171,9.0041491 h -3.703125 v -6.203125 h 3.609375 v 1 h -2.421875 v 1.484375 h 1.859375 l 0.171875,1 h -2.03125 v 1.71875 h 2.515625 z m 0,0"
          />
        </svg>
      </div>
      <div v-if="appVersion.length" class="mt-6 mb-4">
        App Version: {{ appVersion }}
        </div>
      <div class="mt-6 mb-4">
        <ion-button class="info-btn" fill="clear" @click="changesModalOpen = true"
          >Recent Changes</ion-button
        >
      </div>

      <div class="mt-2 mb-6">
        <ion-button class="info-btn" fill="clear" @click="guideModalOpen = true"
          >App Guide</ion-button
        >
      </div>
    </ion-content>

    <ion-modal :is-open="changesModalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Recent Changes</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="changesModalOpen = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding pb-10 log-page">
        <section
        v-for="change of recentChanges"
        :id="change.date"
        :key="change.date"
        :aria-labelledby="change.date"
        class="md:flex mb-10"
      >
        <h2
          id="2022-09-07-heading"
          class="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right"
        >
          {{ change.date }}
        </h2>
        <div class="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
          <div class="absolute bottom-0 left-0 w-px bg-slate-200 -top-3 md:top-2.5"></div>
          <div
            class="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"
          ></div>
          <div
            class="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600"
          >
            <h3 class="font-weight-800 mb-4">{{ change.title }}</h3>
            <div>
              <ol>
                <li v-for="(c, i) of change.changes" :key="i">{{ c }}</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="guideModalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Guide Pointers</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="guideModalOpen = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h3 class="text-center mb-4">Guide Pointers</h3>
        <ion-card-content class="ion-justify-content-center pb-10 log-page">
          <ol>
          <li>Tapping avatars and handles of web3 posts will open their web3 profile page.</li>
          <li>Web3 profiles are mainly sourced from active users that use Ethereum and polygon networks.</li>
          <li>Web3 profiles will show indexed content and data connected to that user</li>
          <li>Tapping on the star of a web3 profile will open the yup score page of that profile</li>
          <li>Yup score is a blockchain-based reputation system that is used to rank a user address</li>
          <li>Protocol will auto-copy followers from other social networks</li>
          <li>The primary identification of a web3 profile is the Ethereum address</li>
          <li>Yup mobile products can be used only in authenticated mode</li>
          <li>Signup and login require using an Ethereum wallet</li>
          <li>Following users will affect your feed as long as personalization is enabled</li>
          <li>Notifications are stored only for a couple of days</li>
        <li>Main web3 posts are comming from Farcaster, Lens, Bluesky, Mirror and other sources like web3 posts are NFTs POAPs Snapshots</li>
          </ol>
        </ion-card-content>
        <h3 class="text-center -mt-4 mb-4">Aditional Help</h3>
        <ion-card-content class="ion-justify-content-center pb-10 log-page mb-10">
          <p class="text-center">If you need any help, please join discord.</p>
        </ion-card-content>
        <h3 class="text-center -mt-4 mb-4">How to Help</h3>
        <ion-card-content class="ion-justify-content-center pb-10 log-page mb-10">
          <p class="text-center">This is an open source monorepo project which is maintained by a sole developer. If you want to help, you could rate the app, share it with your friends, star the repo, or contribute to the codebase.</p>
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
//   IonLabel,
//   IonSegment,
//   IonSegmentButton,
//   IonAccordion,
//   IonItem,
//   IonInput,
//   IonTextarea,
//   IonCard,
//   IonCardSubtitle,
//   IonCardHeader,
//   IonAccordionGroup,
//   onIonViewWillEnter,
  IonCardContent,
  IonLoading,
  IonToast,
  IonModal,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { ref, onMounted } from "vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { recentChanges } from "shared/src/utils/changeLog"
import { useMainStore } from "@/store/main";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "InfoPage",
  components: {
    IonContent,
    IonPage,
    IonLoading,
    // CustomButton,
    // IonLabel,
    // IonSegment,
    // IonSegmentButton,
    // IonAccordion,
    // IonItem,
    // IonInput,
    // IonTextarea,
    // IonCard,
    IonCardContent,
    // IonCardSubtitle,
    // IonCardHeader,
    // IonAccordionGroup,
    IonToast,
    HeaderBar,
    IonModal,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonButtons,
    IonButton,
  },
  setup() {
    const store = useMainStore();
    const currentSegment = ref("login");
    const username = ref("");
    const bio = ref("");
    const fullName = ref("");
    const loading = ref(false);
    const toastState = ref(false);
    const tostMsg = ref("");
    const guideModalOpen = ref(false);
    const appVersion = ref(store?.version ?? "");
    const route = useRoute();
    const openChanges = route?.params?.openChanges
    const changesModalOpen = ref(!!openChanges);


    const segmentChange = (value: any) => {
      currentSegment.value = value.detail.value;
    };


    onMounted(async () => {
      loading.value = true
      loading.value = false
    });

    return {
      currentSegment,
      segmentChange,
      username,
      bio,
      fullName,
      loading,
      toastState,
      tostMsg,
      changesModalOpen,
      guideModalOpen,
      appVersion,
      recentChanges,
      openChanges
    };
  },
});
</script>

<style lang="scss">
.info-btn {
  color: rgba(240, 248, 255, 0.829);
  background-color: rgba(240, 248, 255, 0.021);
}
.log-page{
li {
    padding-left: 1rem;
    text-indent: -0.7rem;
    margin-bottom: 0.8rem;
}
  li::before {
    content: "🔹 ";
  }
}
</style>
