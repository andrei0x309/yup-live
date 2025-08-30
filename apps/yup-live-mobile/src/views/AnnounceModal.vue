<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Announcement</ion-title>
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
                Announcement
              </h2>
              <h3 class="text-[0.95rem] text-center">
                Yup has been aqured by thirdweb and all services will be suspended. This
                app will be removed from the store in late September 2025. You can check
                my related projects using the button below.
              </h3>
              <button
                class="bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded text-lg mt-4"
                @click="gotoProjects"
              >
                <GoToIcon class="w-5 mr-2 inline" />Related Projects
              </button>
              <button
                class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg mt-4"
                @click="quit"
              >
                Quit App
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
import FileDownloadIcon from "icons/src/fileDownload.vue";
import { isAndroid } from "@/utils/capacitor";

export default defineComponent({
  name: "AnnounceModal",
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
    FileDownloadIcon,
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
    paused: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const gotoProjects = () => {
      window.open("https://flashsoft.eu/projects", "_blank");
    };

    const quit = async () => {
      if (isAndroid()) {
        const { App } = await import("@capacitor/app");
        App?.exitApp();
      }
    };

    onMounted(async () => {});

    return {
      quit,
      gotoProjects,
    };
  },
});
</script>
