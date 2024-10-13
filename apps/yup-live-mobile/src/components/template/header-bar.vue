<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons v-if="menu" slot="start">
        <ion-menu-toggle :auto-hide="false">
          <ion-button>
            <ion-icon :icon="MenuIcon"></ion-icon>
          </ion-button>
        </ion-menu-toggle>
        <ion-button
          v-show="route?.fullPath && !route?.fullPath?.includes('/tabs/feeds')"
          @click="goBack"
        >
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-button>
      </ion-buttons>
      <div class="logo inline-flex items-center" aria-label="logo">
        <p style="margin-left: 1rem" class="titleToolbar gradient-text">YUP</p>
        <ActivityIcon class="text-red-700 ml-1 w-5 h-5" />
        <span
          v-if="text"
          style="position: absolute; right: 2rem; top: 1.2rem; font-size: 0.9rem"
        >
          {{ text }}
        </span>
      </div>
      <span v-show="route?.fullPath === '/' && version" class="mx-1 text-[0.95rem]"
        ><span class="ml-4 text-[0.75rem]">v</span>{{ version }}</span
      >
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  IonHeader,
  IonToolbar,
  IonMenuToggle,
  IonButton,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
import { menu as MenuIcon, arrowBack } from "ionicons/icons";
import { useRoute } from "vue-router";
import { useMainStore } from "@/store/main";
import ActivityIcon from "icons/src/active.vue";

export default defineComponent({
  name: "HeaderBar",
  components: {
    IonHeader,
    IonToolbar,
    IonButton,
    IonMenuToggle,
    IonButtons,
    IonIcon,
    ActivityIcon,
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
    const store = useMainStore();
    const route = useRoute();
    const version = ref(store.version);

    const goBack = () => {
      if (route.path === "/") {
        return;
      } else {
        window.history.back();
      }
    };

    return {
      MenuIcon,
      goBack,
      arrowBack,
      route,
      version,
    };
  },
});
</script>

<style></style>
