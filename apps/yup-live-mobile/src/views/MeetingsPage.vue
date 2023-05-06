<template>
  <ion-page>
    <HeaderBar text="MEETINGS" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
      <div class="bg-color max-w-screen-lg px-4 md:px-8 mx-auto rounded">
        <div v-if="initialLoading" class="min-h-[60vh]">
          <p class="p-4 pt-20">Loading feed data</p>
          <DangLoader :unset="true" />
        </div>
        <div v-else class="col-span-12 mx-auto pt-8">
          <Alert
            v-if="intialError"
            type="error"
            message="API Network error."
            title="Error"
          />
          <InfScroll
            class="flex items-center flex-row"
            style="min-height: 60vh"
            :postLoaded="true"
            :top-detection="false"
            @hit="onHit"
          >
            <template #content>
              <div
                v-for="meeting of dbLastMeetings"
                :key="meeting.id"
                class="divide-y-2 divide-gray-100"
              >
                <div class="py-2 flex flex-wrap md:flex-nowrap video-container">
                  <div
                    class="md:w-64 md:mb-0 mr-2 mb-4 flex-shrink-0 flex flex-col justify-center"
                  >
                    <span class="font-semibold title-font">Date</span>
                    <span class="mt-1 text-sm">{{ meeting.date }}</span>
                  </div>
                  <div class="md:flex-grow lg:w-96">
                    <h2 class="text-2xl font-medium title-font mb-2">
                      {{ meeting.title }}
                    </h2>
                    <div class="leading-relaxed">
                      <div class="iframe-wrapper">
                        <iframe
                          width="640"
                          height="360"
                          class="responsive-iframe"
                          frameborder="0"
                          :src="meeting.mega_link"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                    <div class="mt-4 mb-8">
                      <button
                        type="button"
                        class="inline-flex items-center rounded-lg opacity-60 bg-gray-700 hover:bg-gray-500 px-4 py-2 text-white m-2"
                        @click="share(meeting)"
                      >
                        <ShareIcon class="m-1 w-4 inline" />
                        <span class="font-bold">Share this</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <DangLoader v-if="loadingMore" :unset="true" class="m-8" />
            </template>
          </InfScroll>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import { stackAlertError } from "@/store/alertStore";
import ShareIcon from "icons/src/share.vue";
import DangLoader from "components/vote-list/loader.vue";
import Alert from "components/functional/alert.vue";
import HeaderBar from "@/components/template/header-bar.vue";
import { Share } from '@capacitor/share';

import {
  IonPage,
  IonContent,
} from "@ionic/vue";

export default defineComponent({
  name: "MeetingRecordings",
  components: {
    InfScroll,
    ShareIcon,
    DangLoader,
    Alert,
    HeaderBar,
    IonPage,
    IonContent,
  },
  setup(props) {
    const endpointBase = "https://meetings-yup.deno.dev";

    interface Meeting {
      id: string;
      date: string;
      title: string;
      mega_link: string;
    }

    const initialLoading = ref(true);
    const intialError = ref(false);
    const loadingMore = ref(true);
    const page = ref(0);
    const dbLastMeetings = ref([]) as Ref<Meeting[]>;
    const singleVideo = ref([]) as Ref<Meeting[]>;

    const getPastMeetings = async (page: number) => {
      const res = await fetch(`${endpointBase}/get-meetings`, {
        method: "POST",
        body: JSON.stringify({
          start: 15 * page,
        }),
      });
      if (res.ok) {
        return (await res.json()).data;
      }
      return false;
    };

    const onHit = async (type: string) => {
      if (type === "down") {
        loadingMore.value = true;
        page.value += 1;
        const meetings = await getPastMeetings(page.value);
        if (meetings) {
          dbLastMeetings.value.push(...meetings);
        } else {
          page.value -= 1;
          stackAlertError("Network error");
        }

        loadingMore.value = false;
      }
    };

    const share = (meeting: Meeting) => {
      const share = {
        title: meeting.title,
        text: `Recording of ${meeting.title}`,
        url: `https://yup-live.pages.dev/meetings/${meeting.id}`,
      };
        Share
          .share(share)
    };


    onMounted(async () => {
      const meetings = await getPastMeetings(0);
      if (meetings) {
        dbLastMeetings.value = meetings;
      } else {
        intialError.value = true;
      }
      initialLoading.value = false;
    });

    return {
      dbLastMeetings,
      props,
      initialLoading,
      loadingMore,
      onHit,
      singleVideo,
      share,
      intialError,
    };
  },
});
</script>

<style lang="scss">
.modalDefault {
  min-width: 20rem;
  min-height: 20rem;
  padding: 1rem;
  text-align: left;

  h3 {
    font-size: 1.5rem;
    font-weight: 500;
    padding: 1rem;
  }
}

.iframe-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%;
}
.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 768px) {
  .video-container {
    padding-right: 10rem;
  }
}
</style>
