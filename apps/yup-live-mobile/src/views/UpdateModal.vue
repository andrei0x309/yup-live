<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Update App</ion-title>
        <ion-buttons v-if="!forced" slot="end">
          <ion-button @click="close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ion-padding">
        <section class="body-font relative">
          <div class="container py-2 mx-auto flex">
            <div
              class="glassCard rounded-lg p-4 flex flex-col md:ml-auto w-full mt-2 md:mt-0 relative shadow-md"
            > 
              <FileDownloadIcon class="w-8 mx-auto" />
              <h2 class="text-[1.1rem] text-center mb-1 font-medium title-font">
                App Update
              </h2>
              <h3 class="text-[0.95rem] text-center">{{ message }}</h3>
              <button
                v-if="!forced"
                class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg"
                @click="close"
              >
                Skip for now
              </button>
              <button
                v-else
                class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg"
                @click="quit"
              >
                Quit App
              </button>
              <button
                class="bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg mt-4"
                @click="goToUpdateApp"
              >
                <GoToIcon class="w-5 mr-2 inline" />Update
              </button>
            </div>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  modalController,
} from "@ionic/vue";

import BtnSpinner from "icons/src/btnSpinner.vue";
import GoToIcon from "icons/src/goTo.vue";
import FileDownloadIcon from 'icons/src/fileDownload.vue'
import { isAndroid } from "@/utils/capacitor";

export default defineComponent({
  name: "UpdateModal",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    BtnSpinner,
    GoToIcon,
    FileDownloadIcon
  },
  props: {
    forced: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const close = () => {
      return modalController?.dismiss(null, "cancel");
    };

    const goToUpdateApp = () => {
      window.open(props.url, "_system");
      close();
    };

    const quit = async () => {
      if(isAndroid()) {
        const { App } = await import("@capacitor/app");
        App?.exitApp();
      }
    };

    onMounted(async () => {});

    return {
      close,
      goToUpdateApp,
      quit
    };
  },
});
</script>
