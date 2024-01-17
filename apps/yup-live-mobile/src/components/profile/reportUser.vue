<template>
  <ion-modal :is-open="modalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="modalOpen = false">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Report Profile</h2>
      <p>Are you sure you want to report this profile?</p>
      <div class="relative my-4">
        <p class="">Reason: (required)</p>
        <ion-radio-group v-model="reportReason" value="relevance">
          <ion-item v-for="reason of reasons" :key="reason">
            <ion-radio :label="reason" :value="reason" class="mt-2 mr-4">{{
              reason
            }}</ion-radio>
          </ion-item>
        </ion-radio-group>
        <div class="mt-2">
          <label for="bioField" class="leading-7 text-sm text-gray-600 dark:text-gray-300"
            >Details: (required)</label
          >
          <textarea
            id="bioField"
            v-model="reportDetails"
            class="text-white w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-30 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
          >
          </textarea>
        </div>
      </div>
      <button
        :disabled="isReporting"
        class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg"
        @click="() => (modalOpen = false)"
      >
        <BtnSpinner v-if="isReporting" class="inline mr-2" />Cancel
      </button>
      <button
        :disabled="isReporting"
        class="ml-8 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
        @click="reportProfile()"
      >
        <BtnSpinner v-if="isReporting" class="inline mr-2" />Report
      </button>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import {
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonHeader,
  IonItem,
  IonRadioGroup,
  IonRadio,
} from "@ionic/vue";
import { defineComponent, ref, Ref } from "vue";
import PostMenuIcon from "icons/src/postMenuIcon.vue";
import { useMainStore } from "@/store/main";
import AvatarBtn from "components/functional/avatarBtn.vue";
import { timeAgo } from "shared/src/utils/time";
import { useRouter } from "vue-router";
import { stackAlertError, stackAlertSuccess } from "@/store/alert-store";
import { reasons, reportType } from "shared/src/types/report";
import { report } from "shared/src/utils/requests/report";
import BtnSpinner from "icons/src/btnSpinner.vue";

export default defineComponent({
  name: "PostMenu",
  components: {
    PostMenuIcon,
    IonModal,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonHeader,
    AvatarBtn,
    IonItem,
    IonRadioGroup,
    IonRadio,
    BtnSpinner,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const modalOpen = ref(false);
    const isReporting = ref(false);
    const router = useRouter();
    const store = useMainStore();

    const reportReason = (ref(reasons[0]) as unknown) as Ref<typeof reasons[0]>;
    const reportDetails = (ref("") as unknown) as Ref<string>;

    const reportProfile = async () => {
      try {
        if (!reportDetails.value.length || reportDetails.value.length < 6) {
          stackAlertError("Repot reason is to short, it need at least 6 characters.");
          return;
        }
        isReporting.value = true;
        const res = await report(store, {
          type: reportType[1],
          reason: reportReason.value,
          details: reportDetails.value,
          resourceId: props.userId,
        });
        if (res) {
          router.push("/tabs/feeds");
        stackAlertSuccess("Report successful. Thank you for your feedback.");
        modalOpen.value = false;
        } else {
          stackAlertError("There was an error with the report, please try again later.");
        }
      } catch {
        stackAlertError("There was an error with the report, please try again later.");
      }
      isReporting.value = false;
    };

    const toggleModal = () => {
      modalOpen.value = !modalOpen.value;
    };

    return {
      modalOpen,
      timeAgo,
      reportDetails,
      reasons,
      reportReason,
      reportProfile,
      isReporting,
      toggleModal,
    };
  },
});
</script>

<style lang="scss">
.postMenu {
  font-size: 0.9rem;
  li:hover {
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transform: scale(1.03) translateX(-0.6rem);
    background-color: var(--glassBg);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.3rem;
    opacity: 1;
  }

  .rotate {
    animation: spin 3.3s linear infinite;
    color: coral;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
