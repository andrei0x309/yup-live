<template>
  <div class="imgPreview flex flex-col content-center justify-center items-center" :id="`${hashId(refSources?.[0] ?? '')}-img`">
    <BtnSpinner v-if="isLoading" :key="`loading-${isLoading}`" />
    <div :class="`grid grid-cols-${refSources?.length > 1 ? 2 : 1} gap-4`">
      <div v-for="(source, i) in refSources" :key="source">
        <div v-if="!isError">
          <button @click="openImg(refSources?.[i])" >
            <img
              :key="source"
              :class="`imagePreview ${imgClass}`"
              :src="source"
              :alt="alt"
              loading="lazy"
              @error="onError"
              @load="onLoad"
            />
          </button>
          <a v-if="!noLightbox" :href="postId ? `${currentRoute ?? ''}#${postId}` : `${currentRoute ?? ''}#${hashId(refSources?.[i] ?? '')}-img`" class="lightbox" :id="`id${hashId(source)}`">
              <span :style="`background-image: url('${source}')`">
              </span>
              </a>
        </div>
        <div
          v-else-if="!isLoading && showPlaceholder"
          :class="`noPreview w-full ${noPreviewClass}`"
        >
          <img
            :class="`imagePreview ${imgClass} postBkImg`"
            alt="random image"
            :src="makeRandomPreview(true)"
            loading="lazy"
          />
          <NoImg class="noImg opacity-70" />
          <p v-if="noPreviewParagraph" class="-mt-7 mb-7 text-lg">
            No image preview available
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType, Ref } from "vue";
import NoImg from "icons/src/noImg.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { makeRandomPreview } from "shared/src/utils/misc";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "ImagePreview",
  components: {
    NoImg,
    BtnSpinner
  },
  props: {
    source: {
      required: false,
      type: Object as PropType<String | String[]>,
      default: "",
    },
    alt: {
      required: false,
      type: String,
      default: "thumbnail",
    },
    imgClass: {
      required: false,
      type: String,
      default: "",
    },
    noPreviewClass: {
      required: false,
      type: String,
      default: "",
    },
    noPreviewParagraph: {
      required: false,
      type: Boolean,
      default: true,
    },
    showPlaceholder: {
      required: false,
      type: Boolean,
      default: true,
    },
    postId: {
      required: false,
      type: String,
      default: "",
    },
    noLightbox: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isError = ref(false);
    const isLoading = ref(true);
    const isErrorBackup = ref(false);
    const refSources = ref(
      Array.isArray(props.source) ? props.source : [props.source]
    ) as Ref<string[]>;

    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const currentRoute =  ref(useRoute().path)

    const hashId = (str: string) => {
      let hash = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash;
    };

    const onError = () => {
      isError.value = true;
      isLoading.value = false;
    };

    const onLoad = () => {
      isLoading.value = false;
    };

    const openImg = (refSource: string) => {
      if (props.noLightbox) return;
      (window as any).location = `${currentRoute.value}#id${hashId(refSource)}`;
    }

    onMounted(() => {
      // nothing
      if (!props.source) {
        isError.value = true;
        isLoading.value = false;
      }
    });

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      isErrorBackup,
      randomInt,
      makeRandomPreview,
      refSources,
      hashId,
      currentRoute,
      openImg
    };
  },
});
</script>

<style scoped lang="scss">
.imagePreview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  max-height: 20rem;
  border-radius: 0.9rem;
}
.noImg {
  width: 35%;
  z-index: 2;
  padding: 1rem;

  p {
    z-index: 2;
  }
}

.noPreview {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 0.9rem;
}

.postBkImg {
  position: absolute;
  opacity: 0.4;
}

.lightbox {
   display: none;

    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1em;
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: end;
}

/* Unhide the lightbox when it's the target */
.lightbox:target {
  display: flex;
}

button:hover img, button:active img{
  filter: brightness(1.11);
} 

.lightbox span {
  display: block;
  width: 100%;
  height: 90%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
