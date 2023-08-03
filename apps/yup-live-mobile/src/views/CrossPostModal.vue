<template>
  <button v-if="showReplyButton" class="view-btn block ml-2" @click="openCastModal = true">
    <ReplyIcon class="inline-block w-4" />Reply
  </button>
  <ion-modal :is-open="openCastModal" @didDismiss="() => { sendClose() }">
      <ion-header>
        <ion-toolbar>
          <ion-title>Post</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="() => { openCastModal = false }">Cancel</ion-button>
            <button
            :disabled="isSendPost"
            class="bg-stone-600 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
            @click="doSendPost"
          >
            <BtnSpinner v-if="isSendPost" class="inline mr-2" />Send
          </button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <section class="body-font relative">
      <div class="container cross-post px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-8 relative shadow-md"
        >
          <div v-if="platforms?.length > 1" class="block my-4">
            <ion-checkbox
            v-for="platfrom of userPlatforms"
            :key="platfrom"
            class="p-2"
            :value="platfrom"
            :checked="postPlatforms.includes(platfrom)"
            mode="ios" label-placement="start" @ion-change="updatePostPlatforms">
            <span class="ml-2">{{ platfrom }}</span>
            </ion-checkbox>
          </div>
          <div class="relative mb-4">
            <Alert
              :key="postErrorKey"
              :hidden="!postError.length"
              :message="postError"
              title="Error"
              type="error"
            />
            <AvatarBtn :useMainStore="useMainStore" class="mr-2" style="width: 2.3rem; height: 2.3rem; margin: auto" />
            <label
              for="castField"
              class="leading-7 text-sm text-gray-600 dark:text-gray-300"
              >Content</label
            >
            <textarea
              ref="txtEl"
              id="castField"
              v-model="postContent"
              class="txt-box w-full bg-stone-200 text-gray-800 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-36 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            >
            </textarea>
            <small>Character limit: {{ postContentCharCount }} / {{ maxCharCount }}</small>
          </div>
          <div v-if="images.length" class="flex">
            <div v-for="image of images" :key="image.id" class="flex flex-col items-center">
              <img :src="image.img" class="w-18 h-18 mx-2" />
              <button
                class="bg-rose-700 border-0 p-1 mx-auto my-2 focus:outline-none hover:bg-rose-900 rounded text-lg"
                @click="deleteImage(image.id)"
              >
                <DeleteIcon class="inline w-6" />
              </button>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            accept="image/*" 
            @change="onFileUpload"
          />
          <button
            class="bg-stone-600 mb-4 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
            @click="triggerFileInput"
          >
            <BtnSpinner v-if="isFileUploading" class="inline mr-2" /><ImageUploadIcon
              class="inline mr-2"
            />
            Add Image
          </button>
        </div>
      </div>
    </section>
      </ion-content>
    </ion-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, computed, watch } from "vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import Alert from "components/functional/alert.vue";
import { useMainStore } from "@/store/main";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import ReplyIcon from "icons/src/reply.vue";
import type { TPlatform, IReplyTo } from "shared/src/types/web3-posting";
import ImageUploadIcon from "icons/src/imageUpload.vue";
import { mediaUpload, sendPost, PLATFORMS } from 'shared/src/utils/requests/web3-posting'
import DeleteIcon from "icons/src/delete.vue";
import AvatarBtn from "components/functional/avatarBtn.vue";
import { 
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonCheckbox
 } from "@ionic/vue";
 import { getMaxCharCount } from "shared/src/utils/requests/crossPost";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "CrossPost",
  components: {
    BtnSpinner,
    Alert,
    ReplyIcon,
    ImageUploadIcon,
    DeleteIcon,
    IonModal,
    IonContent,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonCheckbox,
  AvatarBtn
  },
  props: {
    replyTo: {
      type: Object as PropType<IReplyTo | null>,
      required: false,
      default: null,
    },
    showReplyButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    crossPost: {
      type: Boolean,
      required: false,
      default: false,
    },
    platforms: {
      type: Array as PropType<TPlatform[]>,
      required: false,
      default: () => PLATFORMS,
    },
    openModal: {
      type: Boolean,
      required: false,
      default: false,
    },
    shareLink: {
      type: String,
      required: false,
      default: "",
    }
  },
  emits: ["success", "update:openModal"],
  setup(props, ctx) {
    const openCastModal = ref(props.openModal);
    const postContent = ref(props.shareLink ? ` ${props.shareLink}` : "");
    const postContentCharCount = computed(() => postContent.value.length);
    const postError = ref("");
    const postErrorKey = ref(0);
    const isSendPost = ref(false);
    const store = useMainStore();
    const userPlatforms = PLATFORMS.filter((p) =>
      store.userData?.connected?.[p]
    );
    const postPlatforms = ref(props.platforms.filter((p) => userPlatforms.includes(p)));
    const isFileUploading = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);
    const images = ref<{
      twiter: string,
      farcaster: string,
      lens: string,
      img : string
      id: string
    }[]>([]);
    const refTxtEl = ref<HTMLTextAreaElement | null>(null);


 

    const maxCharCount = ref(getMaxCharCount(postPlatforms.value))
    // const mediaPics = ref<string[]>([]);

    watch(
      () => postPlatforms.value,
      (newVal) => {
        maxCharCount.value = getMaxCharCount(newVal)
      }
    );

const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

    const onFileUpload = async () => {
      const imageFile = fileInput.value?.files?.[0];
      if (!imageFile) return;
      const imageBase64 = await fileToBase64(imageFile);
      const upload = await mediaUpload(store, API_BASE, postPlatforms.value, imageFile )
      upload.img = imageBase64 as string
      upload.id =  Math.random().toString(36).substring(7)
      images.value.push(upload)
      isFileUploading.value = false;
    };

    const triggerFileInput = () => {
      if (fileInput.value) {
        isFileUploading.value = true;
        fileInput.value.click();
      }
    };

    const showError = (msg: string) => {
      postError.value = msg;
      postErrorKey.value += 1;
    };

    const sendClose = () => {
      ctx.emit("update:openModal", false);
    };

    const deleteImage = (id: string) => {
      images.value = images.value.filter((image) => image.id !== id);
    };

    const doSendPost = async () => {
      await sendPost({
        store,
        postContent,
        postPlatforms,
        maxCharCount,
        isSendPost,
        replyTo: props.replyTo || undefined,
        images,
        ctx,
        showError,
        stackAlertSuccess,
        stackAlertWarning
      });
    }

    const updatePostPlatforms =  (event: any) => {
      const platform = event.detail.value
      const checked = event.detail.checked
      if(checked) {
        postPlatforms.value = [...postPlatforms.value, platform]
      } else {
        postPlatforms.value = postPlatforms.value.filter((p) => p !== platform)
      }
      console.log(postPlatforms.value)
    };

    onMounted(() => {
      if(props.shareLink) {
        refTxtEl.value?.setSelectionRange(0, 0);
        refTxtEl.value?.focus();
      }
    });
    
    return {
      openCastModal,
      isSendPost,
      postContent,
      postContentCharCount,
      postError,
      postErrorKey,
      doSendPost,
      sendClose,
      postPlatforms,
      PLATFORMS,
      onFileUpload,
      fileInput,
      triggerFileInput,
      isFileUploading,
      images,
      deleteImage,
      maxCharCount,
      updatePostPlatforms,
      userPlatforms,
      useMainStore
    };
  },
});
</script>

<style lang="scss">
.cross-post ion-checkbox{
  --border-color-checked: #739d62;
  --checkbox-background-checked: #405c252b;
}

.txt-box {
    background-color: #a1a5a952;
    border: 4px solid #3333339e;
    border-radius: 0.7rem;
    color: aliceblue;
}

</style>
