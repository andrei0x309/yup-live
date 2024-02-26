<template>
  <div  :class="`imgPreview grid content-center justify-center items-center ${ !isLoading && !isError && !noBorder ? 'imgPreviewBorder': ''}`" :id="`${hashId(refSources?.[0] ?? '')}-img`">
    <BtnSpinner v-if="isLoading" class="imagePreviewSpiner" :key="`loading-${isLoading}`" />
    <div :class="`grid grid-cols-${refSources?.length > 1 ? 2 : 1} gap-4`">
      <div v-for="(source, i) of refSources" :key="source">
        <div v-if="!isError">
          <button @click="openImg(source)" >
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
          <button v-if="!noLightbox" @click="closeImage(source)" class="lightbox" :id="`id${hashId(source)}`">
              <span :style="`background-image: url('${source}')`">
              </span>
              </button>
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
          <p v-if="noPreviewParagraph" class="my-2 text-lg">
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

export default defineComponent({
  name: "ImagePreview",
  components: {
    NoImg,
    BtnSpinner
  },
  props: {
    source: {
      type:  [String, Array] as PropType<string | string[]>,
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
    noBorder: {
      required: false,
      type: Boolean,
      default: false,
    }
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

    const hashId = (str: string) => {
      str = str + window.location.pathname;
      let hash = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash;
    };

    const lightBoxListner = (refSource: string) => {
      closeImage(refSource)
    };

    const onError = () => {
      isError.value = true;
      isLoading.value = false;
    };

    const onLoad = () => {
      isLoading.value = false;
    };

    const openImg = async (refSource: string) => {
      const getImg = document.getElementById(`id${hashId(refSource)}`);
      if (getImg) {
        getImg.style.display = "flex";
      }
      if((window as any)?.Ionic) {
        (window as any).closeLightboxSource = refSource;
        (window as any).closeLightbox = lightBoxListner
      }
    }

    const closeImage = async (refSource: string) => {
      const getImg = document.getElementById(`id${hashId(refSource)}`);
      if (getImg) {
        getImg.style.display = "none";
      }
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
      openImg,
      closeImage
    };
  },
});
</script>

<style scoped lang="scss">
.imagePreview {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
  max-height: 20rem;
  border-radius: 0.9rem;
}

.imgPreviewBorder {
  border: 2px solid #4f4f4fad;
}

.imagePreviewSpiner {
    top: 50%;
    position: sticky;

}
.noImg {
    width: 29%;
    min-height: 1rem;
    min-width: 12rem;
    padding: 1rem 4rem 1rem 5rem;
    position: absolute;

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
    opacity: 0.42;
    max-height: 15rem;
    max-width: -moz-fit-content;
    max-width: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    margin-bottom: -8rem;
    width: 100rem;
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
