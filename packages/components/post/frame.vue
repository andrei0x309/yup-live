<template>
  <div
    v-if="isLoadedFrame"
    :class="`flex flex-col content-center justify-center items-center fcFrame ${
      canInteractWithFrame ? '' : 'opacity-40'
    }`"
    :style="secondLoading ? 'filter: blur(0.6rem);' : ''"
  >
    <div class="flex flex-col">
      <ImagePreview
        :source="[frameImage]"
        :key="frameImage"
        imgClass="min-h-[14rem] rounded-lg"
        :noPreviewParagraph="true"
        :noLightbox="true"
        :noBorder="true"
      />
      <div v-if="textInput" class="flex flex-row">
        <input
          type="text"
          class="w-1/2 rounded-lg bg-gray-800 text-white p-2"
          :placeholder="textPlaceholder"
          v-model="inputText"
        />
      </div>
      <div
        :class="`grid grid-cols-1 ${
          buttons?.length > 1 ? 'md:grid-cols-2' : ''
        }  auto-cols-auto auto-cols-fr ${buttons?.length > 2 ? 'lg:grid-cols-3' : ''}`"
      >
        <button
          v-for="button in buttons"
          :key="button.index"
          class="text-white p-2 rounded-lg m-2 btn-frame text-[0.9rem] col-auto"
          @click="doFrameAction(button)"
        >
          <LinkIcon v-if="isRedirectBtn(button)" class="w-4 h-4" />
          <NFTIco v-if="isMintBtn(button)" class="w-4 h-4 inline" />
          {{ button.title }}
        </button>
      </div>
      <div v-if="secondLoading" class="flex justify-center">
        <DangLoader />
      </div>
      <div v-if="!canInteractWithFrame" class="flex justify-center">
        <p class="text-[0.7rem] text-yellow-300 p-2">
          Only users with a connected Farcaster account can interact with this frame.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, Ref, ref, PropType } from "vue";
import ImagePreview from "./imagePreview.vue";
import GotTo from "icons/src/goTo.vue";
import { getInitialFrame, postFrameAction } from "shared/src/utils/requests/web3-posting";
import type { IPostDeps } from "shared/src/types/post";
import DangLoader from "components/vote-list/loader.vue";
import LinkIcon from "icons/src/link.vue";
import NFTIco from "icons/src/nft.vue";
import { getOpenSeaNftUrl } from "shared/src/utils/web3/open-sea";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "FrameComp",
  components: {
    ImagePreview,
    GotTo,
    DangLoader,
    LinkIcon,
    NFTIco,
  },
  props: {
    url: {
      required: true,
      type: String,
    },
    postId: {
      required: false,
      type: String,
      default: "",
    },
    castDep: {
      required: true,
      type: Object as PropType<{
        hash: string;
        fid: string;
      }>,
    },
    deps: {
      type: Object as PropType<IPostDeps>,
      default: () => ({}),
    },
  },
  setup(props) {
    const frameImage = ref("") as Ref<string>;
    const textInput = ref(false) as Ref<boolean>;
    const textPlaceholder = ref("") as Ref<string>;
    let store = props?.deps?.useMainStore?.();
    const canInteractWithFrame = ref(false) as Ref<boolean>;
    const buttons = ref([]) as Ref<
      {
        index: number;
        title: string;
        type: string;
        target: string;
      }[]
    >;
    const isLoadedFrame = ref(false) as Ref<boolean>;
    const inputText = ref("") as Ref<string>;
    const secondLoading = ref(false) as Ref<boolean>;
    const sendData = {
      castFid: Number(props.castDep.fid),
      castHash: props.castDep.hash,
      inputText: undefined,
    } as {
      url: string;
      castFid: number;
      castHash: string;
      inputText?: string;
      buttonIndex?: number;
      state?: string;
    };
    let frame: {
      imageUrl: string;
      textInput: boolean;
      inputText: string;
      postUrl: string;
      buttons: {
        index: number;
        title: string;
        type: string;
        target: string;
      }[];
      state: string;
      redirectUrl?: string;
    } | null = null;

    const isZora = props.url.includes("zora.co");

    const sanitizeFrameImage = (url: string) => {
      if (url?.includes("mirror.xyz")) {
        let urlArr = url.split("featuredImageUrl=");
        if (!urlArr?.[1]) return url;
        url = decodeURIComponent(urlArr[1]);
        return url;
      }
      return url;
    };

    const isRedirectBtnLink = (button: { type: string }) => {
      return button.type === "link";
    };

    const isRedirectBtnPost = (button: { type: string }) => {
      return button.type === "post_redirect";
    };

    const isRedirectBtn = (button: { type: string }) => {
      return isRedirectBtnLink(button) || isRedirectBtnPost(button);
    };

    const isMintBtn = (button: { type: string }) => {
      return button.type === "mint";
    };

    const loadFrame = async (
      url: string,
      secLoad = false,
    ) => {
      if (!secLoad) {
        frame = await getInitialFrame(url);
      }
      canInteractWithFrame.value = store?.userData?.connected?.farcaster || false;
      frameImage.value = sanitizeFrameImage(frame?.imageUrl || "");
      textInput.value = !!frame?.textInput;
      textPlaceholder.value = frame?.inputText || "";
      sendData.url = frame?.postUrl || url || "";
      buttons.value = frame?.buttons || [];
      sendData.state = frame?.state || "";
      if (frame?.imageUrl && sendData.url) isLoadedFrame.value = true;
      return frame;
    };

    const doFrameAction = async (button: {
      index: number;
      type: string;
      target: string;
    }) => {
      try {
        sendData.inputText = inputText.value;
        sendData.buttonIndex = button.index;
        secondLoading.value = true;

        if (isRedirectBtnLink(button) && button?.target) {
          window.open(button.target, "_blank");
          secondLoading.value = false;
          return;
        }

        if (isMintBtn(button) && button?.target) {
          const openSeaUrl = getOpenSeaNftUrl(button.target);
          if (openSeaUrl) {
            window.open(openSeaUrl, "_blank");
            secondLoading.value = false;
          }
          return;
        }

        if(isRedirectBtnPost(button) && isZora) {
          window.open(props.url, "_blank");
          secondLoading.value = false;
          return;
        }

        // isPostRedirect = isRedirectBtnPost(button);

        // if(isPostRedirect) {
        //   sendData.url = props.url;
        // } else {
        //   sendData.url = frame?.postUrl || props.url;
        // }

        frame = await postFrameAction({
          apiBase: API_BASE,
          store: store,
          sendData
        });

        if (!frame) {
          props?.deps?.stackAlertError &&
            props.deps.stackAlertError("Error posting frame action");
          secondLoading.value = false;
          return;
        }

        if (frame?.redirectUrl) {
          window.open(frame?.redirectUrl, "_blank");
          secondLoading.value = false;
          return;
        }
        await loadFrame("", true);
        secondLoading.value = false;
      } catch (e) {
        console.error(e);
        props?.deps?.stackAlertError &&
          props.deps.stackAlertError("Error posting frame action");
        secondLoading.value = false;
      }
    };

    onMounted(() => {
      store = props?.deps?.useMainStore?.();
      sendData.castHash = props.castDep.hash;
      sendData.castFid = Number(props.castDep.fid);
      loadFrame(props.url);
    });

    return {
      doFrameAction,
      frameImage,
      textInput,
      textPlaceholder,
      buttons,
      isLoadedFrame,
      inputText,
      secondLoading,
      canInteractWithFrame,
      isRedirectBtn,
      isMintBtn,
    };
  },
});
</script>

<style scoped lang="scss">
.fcFrame {
  margin: 0.5rem;
  position: relative;
  background-color: rgb(119 0 255 / 4%);
  border-radius: 0.3rem;
  border: 1px solid #4f4f4fad;

  .btn-frame {
    background-color: #4f4f4fad;
    border: 1px solid #4f4f4fad;
  }
}
.linkPreview:hover {
  cursor: pointer;
  background-color: #372e3fad;
}
.linkPreview:active {
  background-color: #372e3fad;
}
</style>
