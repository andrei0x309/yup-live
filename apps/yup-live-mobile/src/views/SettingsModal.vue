<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
                <ion-button @click="close">Close</ion-button>
              </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-accordion-group :value="defaultAccordionOpen" v-if="!loading">
        <ion-accordion value="1">
          <ion-item slot="header" color="light">
            <ion-label>Account</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <section class="body-font relative">
  <div class="container py-2 mx-auto flex">
    <div class="glassCard rounded-lg p-4 flex flex-col md:ml-auto w-full mt-2 md:mt-0 relative shadow-md">
      <h2 class="text-lg mb-1 font-medium title-font">Edit Account Details</h2>
      <div class="relative mb-4">
        <label for="fullnameField" class="leading-7 text-sm text-gray-600 dark:text-gray-300">Full Name</label>
        <input id="fullnameField" v-model="fullName" type="text" class="text-white w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
      </div>
      <div class="relative mb-4">
        <label for="bioField" class="leading-7 text-sm text-gray-600 dark:text-gray-300">Bio</label>
        <textarea id="bioField" v-model="bio" class="text-white w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-30 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out">
        </textarea>
      </div>
      <button :disabled="isEditLoading" class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg" @click="onEditProfile" >
      <BtnSpinner v-if="isEditLoading" class="inline mr-2"/>Edit 
      </button>
    </div>
  </div>
</section>
<section class="body-font relative">
  <div class="container py-2 mx-auto flex">
    <div class="glassCard rounded-lg p-4 flex flex-col md:ml-auto w-full mt-2 md:mt-0 relative shadow-md">
      <h2 class="text-lg mb-1 font-medium title-font">Delete Account</h2>
      <button v-if="!wasDelConfirmed" :disabled="isDeleteLoading" class="bg-red-500 border-0 py-2 px-6 focus:outline-none rounded text-lg" @click="wasDelConfirmed=true"><BtnSpinner v-if="isDeleteLoading" class="inline mr-2"/>Delete</button>
      <template v-else>
      <h2 class="text-lg mb-1 font-medium title-font">Are you sure?</h2>
      <button class="bg-red-500 border-0 py-2 px-6 focus:outline-none rounded text-lg" @click="deleteAccount">Yes</button><button class="bg-gray-500 border-0 py-2 px-6 focus:outline-none rounded text-lg mt-4" @click="wasDelConfirmed = false">No</button>
      </template>
    </div>
  </div>
</section>
          </div>
        </ion-accordion>
        <ion-accordion :disabled="true" value="2">
          <ion-item slot="header" color="light">
            <ion-label>Feed (NOT-IMPLEMENTED)</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <ion-list>          
                <ion-item>
                  Enabling feed personalization will make feeds to be tailored to your account.
                </ion-item>
                <ion-item>
                  <ion-label>Enable Feed Personalization</ion-label>
                  <ion-toggle
                    :key="updateKey"
                    @ion-change="changeSetting('personalization')"
                    slot="end"
                    :checked="localSettings.personalizedFeeds"
                  ></ion-toggle>
                </ion-item>
                <ion-item>
                  Enabling actions tracking will make feeds to be tailored to your account.
                </ion-item>
              <ion-item>
                <ion-label>Enabling actions tracking</ion-label>
                <ion-toggle
                  :key="updateKey"
                  @ion-change="changeSetting('tracking')"
                  slot="end"
                  :checked="localSettings.accountTracking"
                ></ion-toggle>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <ion-toast
        :is-open="toastState"
        @didDismiss="toastState = false"
        :message="toastMsg"
        :duration="1500"
      ></ion-toast>
      <ion-loading
        :is-open="loading"
        cssClass="my-custom-class"
        message="Please wait..."
        :duration="4000"
        @didDismiss="loading = false"
      >
      </ion-loading>
      <ion-alert
        :is-open="alertOpen"
        :header="alertHeader"
        :message="alertMsg"
        :buttons="['OK']"
        @didDismiss="alertOpen = false"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
  IonList,
  IonToggle,
  // IonModal,
  // IonInput,
  IonAccordion,
  IonAccordionGroup,
  // IonRadioGroup,
  // IonRadio,
  IonButtons,
  IonAlert,
  IonToast,
  modalController
} from "@ionic/vue";

import BtnSpinner from "icons/src/btnSpinner.vue";
import { useSettingsStore } from "@/store/main";
import { storage } from '@/utils/storage'

// import DangLoader from "components/vote-list/loader.vue";
// import CustomButton from 'components/functional/customButton.vue'
import { stackAlertError, stackAlertSuccess } from "@/store/alertStore";
// import { formatNumber } from "shared/src/utils/misc";
import { fetchWAuth } from 'shared/src/utils/auth'
import { useMainStore } from "@/store/main";
// import GoToIcon from 'icons/src/goTo.vue'
import { editProfile } from "shared/src/utils/login-signup"
// const refGoTo = GoToIcon
import type { IUserData } from "shared/src/types/account";
import { useRouter } from "vue-router";

import { config } from 'shared/src/utils/config'
const { API_BASE } = config


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButton,
    IonLoading,
    IonList,
    IonToggle,
    // IonModal,
    // IonInput,
    IonAccordion,
    IonAccordionGroup,
    // IonRadioGroup,
    // IonRadio,
    IonButtons,
    IonAlert,
    IonToast,
    BtnSpinner
  },
  props: {
    userData: {
      type: Object as PropType<IUserData>,
      default: {} as IUserData
    }
  },
  setup(props) {
    const loading = ref(false);
    const mpModal = ref(false);
    const updateKey = ref(0);
    const alertOpen = ref(false);
    const alertMsg = ref("");
    const toastState = ref(false);
    const toastMsg = ref("");
    const alertHeader = ref("Error");
    const importFile = (ref(null) as unknown) as Ref<HTMLInputElement>;
    type ModalPromisePassword = null | {
      resolve: (p?: unknown) => void;
      reject: (p?: unknown) => void;
    };
    const modalGetPassword = ref(null) as Ref<ModalPromisePassword>;
    const noAccounts = ref(true);
    const defaultAccordionOpen = ref("1");
    const radioTheme = ref("system") as Ref<"system" | "light" | "dark">;
    const settings = useSettingsStore();
    const localSettings = ref(settings)
    const wasDelConfirmed = ref(false);
    const store = useMainStore()
    const bio = ref(props.userData.bio)
    const fullName = ref(props.userData.fullname)
    const isEditLoading = ref(false)
    const isDeleteLoading = ref(false)
    const router = useRouter()

 
    const deleteAccount = async () => {
      isDeleteLoading.value = true;
      wasDelConfirmed.value = false
      try {        
        const req = await fetchWAuth(store, `${API_BASE}/accounts/delete`, {
          method: 'DELETE'
        })
        if (req.ok) {
          await storage.clear()
          const Web3Modal = (await import("web3modal")).default;
          const web3Modal = new Web3Modal({
            network: "matic", // optional
            cacheProvider: false, // optional
            disableInjectedProvider: false,
          });
          await web3Modal.clearCachedProvider();
          window?.localStorage?.clear();
          router.replace('/')
          stackAlertSuccess('Account deleted successfully')
        } else {
          stackAlertError('Error while deleting account: '+ await req.text())
        }
      } catch {
        // ignore
      }
     isDeleteLoading.value = false;
    }

    const onEditProfile = async () => {
      isEditLoading.value = true
      if ( await editProfile(  {
        bio: bio.value,
        fullname: fullName.value,
        authToken: store.userData.authToken
      })) {
        stackAlertSuccess('Account data successfully edited.')
      } else {
        stackAlertError('Error trying to edit.')
      }
      isEditLoading.value = false
    }

    const changeSetting = async (setting: string) => {
      console.log('implement change setting' + setting)
    }
 
    const close = () => {
        return modalController?.dismiss(null, 'cancel');
    }
 
    return {
      loading,
      mpModal,
      updateKey,
      alertOpen,
      alertMsg,
      toastState,
      toastMsg,
      importFile,
      modalGetPassword,
      noAccounts,
      alertHeader,
      defaultAccordionOpen,
      radioTheme,
      deleteAccount,
      onEditProfile,
      bio,
      fullName,
      isEditLoading,
      isDeleteLoading,
      wasDelConfirmed,
      changeSetting,
      localSettings,
      close
    };
  },
});
</script>
