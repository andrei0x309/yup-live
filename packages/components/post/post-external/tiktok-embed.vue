<template>
  <div class="mt-2">
    <BtnSpinner v-if="loading" />
    <iframe
      loading="lazy"
      class="w-full min-h-60"
      :src="`https://www.tiktok.com/player/v1/${videoId}?&music_info=1&description=1`"
      title="YouTube video player"
      frameborder="0"
      allow="fullscreen"
      allowfullscreen
      @load="loading = false"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from "vue";
import BtnSpinner from "icons/src/btnSpinner.vue";

export default defineComponent({
  name: "YoutubeEmbed",
  components: { BtnSpinner },
  props: {
    source: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true);
    const videoId = ref("");
    onMounted(() => {
      if (!props.source) return (loading.value = false);
      if (props.source.includes("shorts/")) {
        videoId.value = props.source.split("shorts/")[1].split("?")[0].trim();
        return (loading.value = false);
      } else if (props.source.includes("youtu.be")) {
        videoId.value = props.source.split("youtu.be/")[1].split("?")[0].trim();
        return (loading.value = false);
      }

      const ilegalChars = ["&", "?", "v=", '"', "'", " "];

      const match = /v=(.*?)$/.exec(props.source.split("&")[0]);
      if (match) {
        videoId.value = match[1];
      }
      ilegalChars.forEach((char) => {
        videoId.value = videoId.value.replace(char, "");
      });
      return (loading.value = false);
    });

    return {
      loading,
      videoId,
    };
  },
});
</script>

https://www.tiktok.com/
