<template>
  <div>
  <button v-if="showReplyButton" class="view-btn block ml-2" @click="openPostModal = true">
    <ReplyIcon class="inline-block w-4" />Reply
  </button>
  <ion-modal :is-open="openPostModal" @didDismiss="sendClose">
      <ion-header>
        <ion-toolbar>
          <ion-title>Post</ion-title>
          <ion-buttons v-if="modalContent !== 'scheduling'" slot="end" >
            <ion-button @click="openPostModal = false">Cancel</ion-button>
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
      <div class="container cross-post px-1 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-4 flex flex-col md:ml-auto w-full mt-4 relative shadow-md"
        >
        <template v-if="modalContent == 'posting'">

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
              :type="postErrorType"
              class="mb-4"
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
          <div v-if="videos.length" class="flex">
            <div v-for="video of videos" :key="video.id" class="flex flex-col items-center">
              <video class="w-18 h-18 mx-2" controls>
                <source :src="video.source" :type="video.type">
              </video>
              <button
                class="bg-rose-700 border-0 p-1 mx-auto my-2 focus:outline-none hover:bg-rose-900 rounded text-lg"
                @click="deleteVideo(video.id)"
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
          <input
            ref="videoFileInput"
            type="file"
            style="display: none"
            accept="video/*" 
            @change="onVideoFileUpload"
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
          <button
            class="bg-stone-600 mb-4 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
            @click="triggerVideoFileInput"
          >
            <BtnSpinner v-if="isVideoUploading" class="inline mr-2" /><VideoUploadIcon
              class="inline mr-2 w-8"
            />
            Add Video
          </button>
          <div class="flex justify-between">
              <button
                :disabled="isSendPost"
                class="text-[0.9rem] w-1/2 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="modalContent = 'scheduling'"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><ClockIcon
                  class="w-3 inline mr-2"
                />Schedule
              </button>
              <button
                :disabled="isSendPost"
                class="text-[0.9rem] w-1/2 ml-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="doSendPost"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><SendIcon
                  class="w-3 inline mr-2"
                />Send
              </button>
            </div>
        </template>
        <template v-else-if="modalContent == 'scheduling'">
            <h2 class="text-lg mb-1 font-medium title-font">Schedule Post</h2>
            <p>
              <DateIcon /> Maximum allowed date:
              <b
                >{{ new Date(maximumDate).toLocaleDateString() }} -
                {{ new Date(maximumDate).toLocaleTimeString() }}</b
              >
            </p>
            <p>
              <DateIcon />Minimum allowed date:
              <b
                >{{ new Date(minimumDate).toLocaleDateString() }} -
                {{ new Date(minimumDate).toLocaleTimeString() }}</b
              >
            </p>
            <section class="m-4 flex justify-center">
              <ion-datetime @ionChange="changeDate" :min="minimumDate.toISOString()" :max="maximumDate.toISOString()" 
              :value="dateTime.toISOString()" display-format="MMM DD, YYYY HH:mm" picker-format="MMM DD, YYYY HH:mm" />
            </section>
            <div class="flex justify-between">
              <button
                :disabled="isSheduling"
                class="text-[0.9rem] w-1/2 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="modalContent = 'posting'"
              >
                <BtnSpinner v-if="isSheduling" class="inline mr-2" /><GoToIcon
                  class="w-3 inline mr-2 rotate-180"
                />Cancel
              </button>
              <button
                :disabled="isSheduling"
                class="text-[0.9rem] w-1/2 ml-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="doSchedulePost"
              >
                <BtnSpinner v-if="isSheduling" class="inline mr-2" /><ClockIcon
                  class="w-3 inline mr-2"
                />Schedule
              </button>
            </div>
          </template>
        </div>
      </div>
    </section>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, computed, watch } from "vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import Alert from "components/functional/alert.vue";
import { useMainStore } from "@/store/main";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alert-store";
import ReplyIcon from "icons/src/reply.vue";
import type { TPlatform, IReplyTo } from "shared/src/types/web3-posting";
import ImageUploadIcon from "icons/src/imageUpload.vue";
import VideoUploadIcon from "icons/src/videoUpload.vue";
import { mediaUpload, sendPost, PLATFORMS, schedulePost, makeSendData } from 'shared/src/utils/requests/web3-posting'
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
  IonCheckbox,
  IonDatetime
 } from "@ionic/vue";
 import { getMaxCharCount } from "shared/src/utils/requests/crossPost";
import DateIcon from "icons/src/date.vue";
import GoToIcon from "icons/src/goTo.vue";
import ClockIcon from "icons/src/clock.vue";
import SendIcon from "icons/src/send.vue";


const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "CrossPost",
  components: {
    BtnSpinner,
    Alert,
    ReplyIcon,
    ImageUploadIcon,
    VideoUploadIcon,
    DeleteIcon,
    IonModal,
    IonContent,
    IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonCheckbox,
  AvatarBtn,
  DateIcon,
  GoToIcon,
  ClockIcon,
  SendIcon,
  IonDatetime
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
    const openPostModal = ref(props.openModal);
    const postContent = ref(props.shareLink ? ` ${props.shareLink}` : "");
    const postContentCharCount = computed(() => postContent.value.length);
    const postError = ref("");
    const postErrorKey = ref(0);
    const postErrorType = ref("error");
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

    const videoFileInput = ref<HTMLInputElement | null>(null);
    const isVideoUploading = ref(false);
    const videos = ref<{
      twiter: string,
      farcaster: string,
      lens: string,
      source : string
      id: string
      type: string
    }[]>([]);


    const refTxtEl = ref<HTMLTextAreaElement | null>(null);

    const maxCharCount = ref(getMaxCharCount(postPlatforms.value))
    const modalContent = ref("posting");
    const maximumDate = new Date(Date.now() + 1000 * 3570 * 24 * 7);
    const minimumDate = new Date(Date.now() + 1000 * 60 * 2);
    const isSheduling = ref(false);
    const dateTime = ref(new Date(Date.now() + 1000 * 60 * 5));


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

    const triggerVideoFileInput = () => {
      if (videoFileInput.value) {
        isVideoUploading.value = true;
        videoFileInput.value.click();
      }
    };

    const onVideoFileUpload = async () => {
      const videoFile = videoFileInput.value?.files?.[0];
      if (!videoFile) return;

      const mediaPlatforms = postPlatforms.value

      if(mediaPlatforms.includes('bsky')) {
        showError("Video upload is not supported on BlueSky, your post will be sent without the video.", true)
        mediaPlatforms.splice(mediaPlatforms.indexOf('bsky'), 1)
      }
      const upload = await mediaUpload(store, API_BASE, mediaPlatforms, videoFile )
      upload.source =  URL.createObjectURL(videoFile);
      upload.type = videoFile.type
      upload.id =  Math.random().toString(36).substring(7)
      videos.value.push(upload)
      isVideoUploading.value = false;
    };

    const deleteVideo = (id: string) => {
      videos.value = videos.value.filter((video) => video.id !== id);
    };

    const showError = (msg: string, warn?: boolean) => {
      postErrorType.value = warn ? "warning" : "error";
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
      const media = [...images.value, ...videos.value]
      const result = await sendPost({
        store,
        postContent,
        postPlatforms,
        maxCharCount,
        isSendPost,
        replyTo: props.replyTo || undefined,
        media,
        showError,
        stackAlertSuccess,
        stackAlertWarning
      });
      if (result) {
        ctx.emit("success");
        openPostModal.value = false;
      }
    }

    const doSchedulePost = async () => {
      if (isSheduling.value) return;
      isSheduling.value = true;
      const media = [...images.value];

      const sendData = makeSendData({
        postContent,
        postPlatforms,
        maxCharCount,
        media,
        showError,
        time: dateTime.value
      });

      if (!sendData) {
        isSheduling.value = false;
        return;
      }

      const result = await schedulePost({
        apiBase: API_BASE,
        store,
        sendData,
      });
      if (result) {
        ctx.emit("success");
        openPostModal.value = false;
        stackAlertSuccess("Post scheduled successfully.");
      } else {
        stackAlertWarning("Something went wrong, please try again later.");
      }
      isSheduling.value = false;
    };

    const changeDate = (event: any) => {
      dateTime.value = new Date(event.detail.value)
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
      openPostModal,
      isSendPost,
      postContent,
      postContentCharCount,
      postError,
      postErrorKey,
      postErrorType,
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
      useMainStore,
      triggerVideoFileInput,
      onVideoFileUpload,
      videoFileInput,
      isVideoUploading,
      videos,
      deleteVideo,
      modalContent,
      maximumDate,
      minimumDate,
      isSheduling,
      dateTime,
      doSchedulePost,
      changeDate
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
    min-height: 13rem;
    color: aliceblue;
}

</style>
