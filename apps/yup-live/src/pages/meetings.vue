<template>
  <div class="py-6 sm:py-8 lg:py-12">
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
          @hit="onHit"
        >
          <template #content>
            <div
              v-for="meeting of dbLastMeetings"
              :key="meeting.id"
              class="divide-y-2 divide-gray-100"
            >
              <div class="py-8 flex flex-wrap md:flex-nowrap video-container">
                <div
                  class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col justify-center"
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
                    <button
                      type="button"
                      class="inline-flex items-center rounded-lg opacity-60 bg-gray-700 hover:bg-gray-500 px-4 py-2 text-white m-2"
                      @click="modalOpen(meeting)"
                    >
                      <RadarIcon class="m-1 w-4 inline" />
                      <span class="font-bold">Open in modal</span>
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
  </div>

  <o-modal v-model:active="modalVideo" contentClass="modalDefault">
    <div class="py-8 flex flex-wrap md:flex-nowrap video-container">
      <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col justify-center">
        <span class="font-semibold title-font">Date</span>
        <span class="mt-1 text-sm">{{ singleVideo[0].date }}</span>
      </div>
      <div class="md:flex-grow lg:w-96">
        <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">
          {{ singleVideo[0].title }}
        </h2>
        <div class="leading-relaxed">
          <div class="iframe-wrapper">
            <iframe
              width="640"
              height="360"
              class="responsive-iframe"
              frameborder="0"
              :src="singleVideo[0].mega_link"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </o-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, reactive } from "vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import { stackAlertError } from "@/store/alertStore";
import { useRoute } from "vue-router";
import ShareIcon from "icons/src/share.vue";
import RadarIcon from "icons/src/radar.vue";
import DangLoader from "components/vote-list/loader.vue";
import Alert from "components/functional/alert.vue";
import { useHead } from "@unhead/vue";

import { getStaticMetaFrame } from "shared/src/utils/frame";

export default defineComponent({
  name: "MeetingRecordings",
  components: {
    InfScroll,
    ShareIcon,
    RadarIcon,
    DangLoader,
    Alert,
  },
  setup(props) {
    const endpointBase = "https://meetings-yup.deno.dev";

    interface Meeting {
      id: string;
      date: string;
      title: string;
      mega_link: string;
    }

    const route = useRoute();
    const id = ref(route.params.id as string);
    const initialLoading = ref(true);
    const intialError = ref(false);
    const loadingMore = ref(true);
    const modalVideo = ref(false);
    const page = ref(0);
    const dbLastMeetings = ref([]) as Ref<Meeting[]>;
    const singleVideo = ref([]) as Ref<Meeting[]>;

    const siteData = reactive({
      title: `YUP Meetings History`,
      description: `See previeous community meetings and recordings`,
    });

    useHead({
      title: siteData.title,
      meta: [
        {
          name: "og:image",
          content: `$/share/yup-live-ogs/og-yup-live-default.png`,
        },
        {
          name: "description",
          content: siteData.description,
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: siteData.title,
        },
        {
          name: "og:description",
          content: siteData.description,
        },
        {
          name: "og:url",
          content: route.fullPath,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: route.fullPath,
        },
        {
          name: "twitter:title",
          content: siteData.title,
        },
        {
          name: "twitter:description",
          content: siteData.description,
        },
        ...getStaticMetaFrame(`/share/yup-live-ogs/og-yup-live-default.png`),
      ],
    });

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

    const getMeeting = async (id: number) => {
      const res = await fetch(`${endpointBase}/get-meeting`, {
        method: "POST",
        body: JSON.stringify({
          id,
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
        url: `${window.location.origin}/meetings/${meeting.id}`,
      };
      if (navigator.share) {
        navigator
          .share(share)
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      }
    };

    const modalOpen = (meeting: Meeting) => {
      singleVideo.value = [meeting];
      modalVideo.value = true;
    };

    onMounted(async () => {
      if (id.value) {
        modalVideo.value = true;
        singleVideo.value = await getMeeting(Number(id.value));
      }

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
      modalVideo,
      singleVideo,
      share,
      modalOpen,
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
