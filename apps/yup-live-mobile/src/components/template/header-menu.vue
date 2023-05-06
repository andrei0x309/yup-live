<template>
  <ion-menu menu-id="menu" content-id="content-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu
        <ion-menu-toggle :auto-hide="false" style="position: absolute; right: 2rem">
        <ion-icon :icon="closeCircleOutline" />
      </ion-menu-toggle>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
      <ion-item button @click="doLogOut">
      <LogOutIcon class="w-5 mr-4" /> Log Out
      </ion-item>
      </ion-list>

      <ion-list class="mt-2">
        <ion-item button @click="goTo('/tabs/search')">
      <ion-icon :icon="searchOutline" class="w-5 mr-4" /> Search
      </ion-item>
        <ion-item button @click="goTo('/tabs/metrics')">
      <ion-icon :icon="podiumOutline" class="w-5 mr-4" /> General Metrics
      </ion-item>
        <ion-item button @click="goTo('/tabs/live')">
      <ActivityIcon class="w-5 mr-4" /> Live Activity
      </ion-item>
      <ion-item button @click="goTo('/tabs/meetings')">
        <ion-icon :icon="listOutline" class="w-5 mr-4" /> Community Meetings
      </ion-item>
      <ion-item button @click="goTo(`/tabs/score/${store.userData?.address}`)">
        <ScoreIcon class="w-5 mr-4" /> Yup Score
      </ion-item>
      <ion-item button @click="goTo('/tabs/stake')">
        <StakeIcon class="w-5 mr-4" /> Stake
      </ion-item>
      <ion-item button @click="goTo('/tabs/info')">
        <InfoIcon class="w-5 mr-4" /> About & Info
      </ion-item>
      </ion-list>

    </ion-content>
  </ion-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonHeader, IonToolbar, IonMenu, IonTitle, IonContent, IonMenuToggle, IonIcon, IonItem, IonList, menuController } from "@ionic/vue";
import {
closeCircleOutline,
podiumOutline,
searchOutline,
listOutline
} from "ionicons/icons";
import { storage } from "@/utils/storage";
import { useMainStore } from "@/store/main";
import { useRouter } from "vue-router";
import LogOutIcon from 'icons/src/logout.vue'
import ActivityIcon from '@/icons/activity.vue'
import InfoIcon from 'icons/src/infoIcon.vue'
import ScoreIcon from 'icons/src/score.vue'
import StakeIcon from "icons/src/stake.vue";


export default defineComponent({
  name: "HeaderMenu",
  components: {
    IonHeader,
    IonToolbar,
    IonMenu, IonTitle, IonContent, IonMenuToggle, IonIcon,
    IonItem, IonList, LogOutIcon, ActivityIcon, InfoIcon, ScoreIcon, StakeIcon
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    menu: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useMainStore()
    const router = useRouter()

    const doLogOut = async () => {
      store.isLoggedIn = false
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
      menuController.close('menu');
    }

    const goTo = (path: string) => {
      router.push(path)
      menuController.close('menu');
    }

    return {
        closeCircleOutline,
        doLogOut,
        goTo,
        podiumOutline,
        searchOutline,
        listOutline,
        store
    };
  },
});
</script>

<style></style>
