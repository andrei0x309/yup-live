<template>
  <video
    v-if="!isError"
    ref="videoPlayer"
    :key="videoSource"
    class="w-full rounded-t-lg md:min-w-[24rem] max-h-[24rem] video-js"
    controls
    playsinline
    preload="auto"
    @canplay="canPlay"
    data-setup="{}"
  >
    <source :src="videoSource" :type="videType" />
  </video>
  <div
    v-else-if="!loading && isError"
    :class="`noPreview rounded-t-lg ${noPreviewClass} relative`"
  >
    <img
      class="postBkImg md:min-w-[24rem] w-full max-h-[14rem]"
      alt="random image"
      :src="makeRandomPreview(true)"
      loading="lazy"
    />
    <YoutubeIcon class="noImgIcon" />
    <p class="noImg-txt hidden md:flex relative">Video is not available</p>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from "vue";
import { makeRandomPreview } from "shared/src/utils/misc";
import YoutubeIcon from "icons/src/youtube.vue";
import { getVideoTypeFromUrl } from "shared/src/utils/misc";
import { wait } from "shared/src/utils/time";

const vCss = "https://unpkg.com/video.js/dist/video-js.min.css";
const vJs = "https://unpkg.com/video.js/dist/video.min.js";

export default defineComponent({
  name: "VideoPlayer",
  components: {
    YoutubeIcon,
  },
  props: {
    videoSource: {
      required: false,
      type: String,
      default: "",
    },
    noPreviewClass: {
      required: false,
      type: String,
      default: "",
    },
  },
  setup(props) {
    const videoType = ref("");
    const loading = ref(true);
    const isError = ref(false);
    const isHls = ref(props.videoSource.includes(".m3u8"));
    const videType = getVideoTypeFromUrl(props.videoSource);

    const scriptComp = document.createElement("script");
    scriptComp.src = vJs;
    scriptComp.id = "videojs-http-streaming";

    const vidCss = document.createElement("link");
    vidCss.href = vCss;
    vidCss.rel = "stylesheet";
    vidCss.id = "videojs-core-css";

    const videoPlayer = ref(null);

    const canPlay = () => {
      loading.value = false;
    };

    const error = () => {
      isError.value = true;
      loading.value = false;
    };

    onMounted(async () => {
      if (!document.getElementById("videojs-http-streaming")) {
        document.head.appendChild(scriptComp);
        document.head.appendChild(vidCss);
      }
      let timer = 0;
      do {
        if (videoPlayer.value) {
          await wait(100);
          timer += 100;
          (videoPlayer.value as any)?.hook?.("error", function () {
            error();
          });
        }
      } while (timer < 5000 && typeof (videoPlayer.value as any)?.hook === "function");
    });

    return {
      canPlay,
      loading,
      error,
      videoType,
      makeRandomPreview,
      isError,
      isHls,
      videType,
      videoPlayer,
    };
  },
});
</script>

<style lang="scss" scoped>
.noImgIcon {
  width: 20%;
  height: 20%;
  margin: 0 auto;
  display: block;
  position: absolute;
  top: 35%;
  left: 40%;
}

.noImg-txt {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
  position: absolute;
  top: 56%;
  left: 28%;
  width: 20rem;
}
</style>
