<template>
  <ion-header :translucent="true" >
    <ion-toolbar>
        <ion-buttons v-if="menu" slot="start">
        <ion-menu-toggle :auto-hide="false">
          <ion-button>
           <ion-icon :icon="MenuIcon" ></ion-icon>
          </ion-button>
        </ion-menu-toggle>
        <ion-button v-show="route.fullPath && !route.fullPath.includes('/tabs/feeds')" @click="goBack">
           <ion-icon :icon="arrowBack" ></ion-icon>
          </ion-button>
        </ion-buttons>
      <div
        class="logo inline-flex items-center"
        aria-label="logo"
      >
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
        <span v-if="text" style="position: absolute;right: 2rem;top: 1.2rem;">
        {{text}}
        </span>
      </div>
      <span v-show="route.fullPath === '/' && version" class="mx-1 text-[0.95rem]"><span class="ml-4 text-[0.75rem]">v</span>{{ version  }}</span>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  IonHeader,
  IonToolbar,
IonMenuToggle,
    IonButton,
    IonButtons,
    IonIcon
} from "@ionic/vue";
import {
menu as MenuIcon,
arrowBack
} from "ionicons/icons";
import { useRoute } from "vue-router";
import { useMainStore } from "@/store/main";


export default defineComponent({
  name: "HeaderBar",
  components: {
    IonHeader,
    IonToolbar,
    IonButton,
    IonMenuToggle,
    IonButtons,
    IonIcon
},
  props: {
    text: {
      type: String,
      default: "",
    },
    menu: {
        type: Boolean,
        default: false
    }
  },
  setup() {
    const store = useMainStore()
    const route = useRoute();
    const version = ref(store.version)
 
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
        version
    };
  },
});
</script>

<style></style>
