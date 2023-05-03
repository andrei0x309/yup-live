<template>
  <ion-page>
    <ion-content>
      <HeaderMenu />
      <ion-tabs
        style="border-top: 2px solid #1a1a1a"
      >
        <ion-router-outlet  id="content-page" ref="outlet" />

        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="account" href="/tabs/account">
            <AvatarBtn :key="avatar" imgClass="h-8 w-8" :useMainStore="useMainStore" class="w-8 h-8 mt-1" :isSelf="true" :pSource="avatar" :isTwitter="true" />
            <ion-label>Account</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="feed" href="/tabs/feeds">
            <ion-icon style="font-size: 2.3rem" :icon="filterCircle"></ion-icon>
            <ion-label>Feeds</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="notifications" href="/tabs/notifications">
            <ion-icon style="font-size: 2.3rem" :icon="notificationsCircle"></ion-icon>
            <ion-label>Notifications</ion-label>
            <ion-badge v-show="hasNewNot" color="danger">{{ notDisplay }}</ion-badge>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, Ref, onBeforeUnmount } from "vue";
import {
  IonPage,
  IonContent,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonBadge
} from "@ionic/vue";
import { notificationsCircle, filterCircle } from "ionicons/icons";
import AvatarBtn from "components/functional/avatarBtn.vue";
import HeaderMenu from "./header-menu.vue";
import { useMainStore } from "@/store/main";
import { storage } from '@/utils/storage'
import { useRouter} from 'vue-router'
import { getNotificationsCount } from 'shared/src/utils/notifications'
import { CancelablePromise } from 'shared/src/utils/misc'
import { wait } from 'shared/src/utils/time'

export default defineComponent({
  name: "BottomNavigation",
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
    IonBadge
    },
  setup() {
    const store = useMainStore();
    const avatar = ref('');
    const account = ref('');
    const router = useRouter()
    const outlet = ref(null) as unknown as Ref<typeof IonRouterOutlet>
    const hasNewNot = ref(false)
    const notDisplay = ref('')
    let timerPromise: CancelablePromise | null = null

    const checkNot = () => {
      getNotificationsCount(store.userData.account).then(async result => {
          hasNewNot.value = result.hasNewNot
          notDisplay.value = result.notDisplay
          timerPromise = new CancelablePromise(wait(10000))
          await timerPromise.promise
          checkNot()
        })
    }

      onBeforeMount(async () => {
        if(!store.isLoggedIn) {
          const authInfo = await storage.get('authInfo')
          if(authInfo) {
            store.userData = JSON.parse(authInfo)
            avatar.value = store.userData.avatar
            account.value = store.userData.account
            checkNot()
            store.isLoggedIn = true
          } else {
            router.replace('/')
          }
        }
      })

      onBeforeUnmount(() => {
      if (timerPromise) {
        timerPromise.cancel()
      }
    })
    
    return {
      notificationsCircle,
      filterCircle,
      avatar,
      account,
      outlet,
      useMainStore,
      notDisplay,
      hasNewNot
    };
  },
});
</script>
