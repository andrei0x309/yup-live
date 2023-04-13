<template>
  <ion-page>
    <HeaderBar text="NOTIFICATIONS" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
      <ion-segment
        style="width: auto"
        class=""
        :value="currentSegment"
        mode="ios"
        @ion-change="segmentChange"
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
              <VoteNotification :notification="notification" />
            </template>
            <template v-else-if="notification.action === 'reward'">
              <RewardNotification :notification="notification" />
            </template>
            <template v-else-if="['follow', 'unfollow'].includes(notification.action)">
              <FollowUnfollowNotification :notification="notification" />
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
      :key="`k${loading}`"
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
import { getNotifications } from "shared/src/utils/notifications"
import { useMainStore } from "@/store/main";
import type { NotifType } from 'shared/src/types/notification'
import { timeAgo } from "shared/src/utils/time"

import TwitterIcon from 'icons/src/twitter.vue'

import VoteNotification from '@/components/notifications/vote.vue'
import RewardNotification from '@/components/notifications/reward.vue'
import FollowUnfollowNotification from '@/components/notifications/followUnfollow.vue'

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
  VoteNotification,
  RewardNotification,
  FollowUnfollowNotification
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
      if(currentSegment.value === "all") {
        notifications.value = (await getNotifications({ userId: store.userData.account, type: null}))?.reverse().map(addTwitterIcon) ?? []
      } else {
        notifications.value = (await getNotifications({ userId: store.userData.account, type: ['reward']}))?.reverse() ?? []
      }
    };

    onIonViewDidEnter(async () => {
      loading.value = true
      notifications.value = (await getNotifications({ userId: store.userData.account, type: null}))?.reverse().map(addTwitterIcon) ?? []
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
