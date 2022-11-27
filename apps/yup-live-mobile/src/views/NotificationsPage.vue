<template>
  <ion-page>
    <HeaderBar text="NOTIFICATIONS" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
      <ion-segment
        style="width: auto"
        class=""
        :value="currentSegment"
        @ion-change="segmentChange"
        mode="ios"
      >
        <ion-segment-button value="all">
          <ion-label>All</ion-label>
        </ion-segment-button>
        <ion-segment-button value="rewards">
          <ion-label>Rewards</ion-label>
        </ion-segment-button>
      </ion-segment>

        <template v-if="notifications.length">
           <div
            v-for="notification of notifications"
            :key="notification._id"
            class="shadow-md p-4 flex flex-row rounded-lg relative notComp"
          >
            <template v-if="notification.action === 'vote'">
              <div :class="`notBLine inline-block p-1 mr-3`"></div>
              <div class="flex w-full">
                <div class="flex flex-col min-w-10">
                  <p class="ml-4 mt-1 pb-4 flex items-center">
                    <template v-if="notification.like">
                      <ThumbsUp class="w-6 opacity-70" :isSolid="true" />
                    </template>
                    <template v-else>
                      <ThumbsDown class="w-6 opacity-70" :isSolid="true" />
                    </template>
                  </p>
                  <ImagePreview
                    v-if="typeof notification.image === 'string'"
                    :source="notification.image"
                    :noPreviewParagraph="false"
                    :imgClass="`max-h-16 max-w-16 rounded-[0.2rem]`"
                    :previewClass="`max-h-16 max-w-16 rounded-[0.2rem]`"
                    :noPreviewClass="`max-h-16 max-w-16 min-h-16 min-max-w-16 imgNotRadius`"
                  />
                  <component v-else :is="notification.image" />
                </div>
                <div class="flex flex-col w-full">
                  <div class="flex">
                    <p class="ml-3 flex items-center pb-2">
                      <b class="mr-2 opacity-60">by</b>
                      <router-link :to="`/tabs/account/${notification.voter}`">{{ notification.voter }}</router-link>
                    </p>
                  </div>
                  <p class="ml-3 mt-3 flex items-center w-full">
                    <b class="mr-2 opacity-60" style="writing-mode: vertical-rl; text-orientation: upright">URL</b
                    ><span style="font-size: 0.78rem"
                      ><router-link :to="`/tabs/post/${notification?.post?.postid}`">{{ notification?.post?.url }}</router-link></span
                    >
                  </p>
                  <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
                </div>
              </div>
            </template>
            <template v-else-if="notification.action === 'reward'">
              <div :class="`notBLine inline-block p-1 mr-3`"></div>
              <div class="flex w-full">
                <div class="flex flex-col min-w-10">
                  <p class="ml-3 mt-1 pb-4 flex items-center">You</p>
                  <ImagePreview
                    :source="notification.image"
                    :noPreviewParagraph="false"
                    :imgClass="`max-h-8 max-w-8 rounded-[0.2rem]`"
                    :previewClass="`max-h-8 max-w-8 rounded-[0.2rem]`"
                    :noPreviewClass="`max-h-8 max-w-8 min-h-8 min-max-w-8 imgNotRadius`"
                  />
                </div>
                <div class="flex flex-col w-full">
                  <div class="flex">
                    <p class="ml-3 flex items-center pb-2 mt-1"><b class="mr-2 opacity-60">were alocated a future reward of:</b></p>
                  </div>
                  <p class="ml-3 mt-3 flex items-center">
                    <b class="mr-2 opacity-60">{{ notification?.quantity ?? 'unknown' }}</b> YUP
                  </p>
                  <p class="ml-3 flex items-center mt-4 self-end"><ClockIcon class="h4 w-4 mr-1" />{{ timeAgo(notification.createdAt) }}</p>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else-if="!loading">
          <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Notifications -> [0]</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content class="ion-justify-content-center">
            <p class="ion-padding">No notifications were found.</p>
          </ion-card-content>
        </ion-card>
        </template>

 
      <ion-loading
      :is-open="loading"
      message="Please wait..."
      :duration="3000"
      @didDismiss="loading = false"
    >
    </ion-loading>
     </ion-content>
  </ion-page>


  
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  // IonList,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonLoading,
  onIonViewDidEnter
} from "@ionic/vue";
import { defineComponent, ref, Ref, markRaw } from "vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { getNotifications } from "shared/dist/utils/notifications"
import { useMainStore } from "@/store/main";
import type { NotifType } from 'shared/dist/types/notification'
import { timeAgo } from "shared/dist/utils/time"
import ThumbsDown from "icons/src/thumbsDown.vue"
import ThumbsUp from "icons/src/thumbsUp.vue"
import ClockIcon from "icons/src/clock.vue"
import ImagePreview from "@/components/copy/post/imagePreview.vue"
import TwitterIcon from 'icons/src/twitter.vue'


export default defineComponent({
  name: "NotificationsPage",
  components: {
    IonContent,
    IonPage,
    HeaderBar,
    IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonLoading,
  ClockIcon,
  ThumbsUp,
  ThumbsDown,
  ImagePreview
  },
  setup () {
    const store = useMainStore()
    const loading = ref(false)
    const notifications = ref([]) as Ref<NotifType[]>
    const currentSegment = ref("all");

    const addTwitterIcon =  (n:any) => {
            if(n?.post?.url?.match(/.*?twitter.com\/.*/)) {
              n.image = markRaw(TwitterIcon)
            }
            if(!n?.image) {
              n.image =''
            }
            return n
          }

    const segmentChange = async (value: any) => {
      currentSegment.value = value.detail.value;
      console.log(store.userData.account)
      if(currentSegment.value === "all") {
        notifications.value = (await getNotifications({ userId: store.userData.account, type: 'all'}))?.reverse().map(addTwitterIcon) ?? []
      } else {
        notifications.value = (await getNotifications({ userId: store.userData.account, type: 'rewards'}))?.reverse() ?? []
      }
    };

    onIonViewDidEnter(async () => {
      console.log('not')
      loading.value = true
      notifications.value = (await getNotifications({ userId: store.userData.account, type: 'all'}))?.reverse().map(addTwitterIcon) ?? []
      loading.value = false
      
    })

    return {
      loading,
      segmentChange,
      currentSegment,
      notifications,
      timeAgo
    }
  }
});
</script>

<style scoped>
.notComp {
  border: 1px solid #181818;
  margin-top: 2rem;
  font-size: 0.93rem;
  width: 100%;
  max-width: 46rem;
  word-break: break-all;
}

.notBLine {
  border-right: 2px solid dimgrey;
  opacity: 0.5;
}

#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
