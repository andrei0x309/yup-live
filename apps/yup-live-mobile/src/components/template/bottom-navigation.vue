<template>
  <ion-page>
    <ion-content>
      <HeaderMenu />
      <AlertStack :useAlertStack="useAlertStack" :setAlertStack="setAlertStack"  :mobile="true" />
      <ion-tabs
        style="border-top: 2px solid #1a1a1a"
      >
        <ion-router-outlet  ref="outlet" id="content-page" />

        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="account" href="/tabs/account">
            <AvatarBtn class="w-8 h-8 mt-1" :isSelf="true" :pSource="avatar" :key="avatar" :isTwitter="true" />
            <ion-label>Account</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="feed" href="/tabs/feeds">
            <ion-icon style="font-size: 2.3rem" :icon="filterCircle"></ion-icon>
            <ion-label>Feeds</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="notifications" href="/tabs/notifications">
            <ion-icon style="font-size: 2.3rem" :icon="notificationsCircle"></ion-icon>
            <ion-label>Notifications</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, Ref } from "vue";
import {
  IonPage,
  IonContent,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from "@ionic/vue";
import { notificationsCircle, filterCircle } from "ionicons/icons";
import AvatarBtn from "components/functional/avatarBtn.vue";
import HeaderMenu from "./header-menu.vue";
import { useMainStore } from "@/store/main";
import { storage } from '@/utils/storage'
import { useRouter} from 'vue-router'
import { setAlertStack, useAlertStack } from '@/store/alertStore'
import AlertStack from 'components/functional/alertStack.vue'

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon,
    HeaderMenu,
    AvatarBtn,
    AlertStack
    },
  name: "BottomNavigation",
  setup() {
    const store = useMainStore();
    const avatar = ref('');
    const account = ref('');
    const router = useRouter()
    const outlet = ref(null) as unknown as Ref<typeof IonRouterOutlet>

      onBeforeMount(async () => {
        if(!store.isLoggedIn) {
          const authInfo = await storage.get('authInfo')
          if(authInfo) {
            store.userData = JSON.parse(authInfo)
            avatar.value = store.userData.avatar
            account.value = store.userData.account
            store.isLoggedIn = true
          } else {
            router.replace('/')
          }
        }
      })
    
    return {
      notificationsCircle,
      filterCircle,
      avatar,
      account,
      setAlertStack,
      useAlertStack,
      outlet
    };
  },
});
</script>
