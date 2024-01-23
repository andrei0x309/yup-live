<template>
  <button v-if="showReplyButton" class="view-btn flex ml-2" @click="openCastModal = true">
    <ReplyIcon class="inline-block w-4" />Reply
  </button>
  <o-modal v-model:active="openCastModal" contentClass="modalDefault" @close="sendClose">
    <section class="body-font relative">
      <div class="container p-1 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full relative mt-0 shadow-md"
        >
          <div>
            <o-button
              style="
                width: 2rem;
                position: absolute;
                right: 1rem;
                top: 1rem;
                padding-right: 0.5rem;
                background-color: #1f2937;
              "
              icon-left="times"
              label="X"
              @click="sendClose"
            />
          </div>

          <template v-if="modalContent == 'posting'">
            <h2 class="text-lg mb-1 font-medium title-font">
              {{ platforms?.length > 1 ? "Create New Post" : "Reply" }}
            </h2>
            <div v-if="platforms?.length > 1" class="block my-4">
              <o-checkbox
                v-for="platfrom of userPlatforms"
                :key="platfrom"
                v-model="postPlatforms"
                class="p-2"
                :native-value="platfrom"
              >
                <span class="ml-2">{{ platfrom }}</span>
              </o-checkbox>
            </div>
            <div class="relative mb-4">
              <Alert
                :key="postErrorKey"
                :hidden="!postError.length"
                :message="postError"
                title="Error"
                type="error"
              />
              <AvatarBtn
                :useMainStore="useMainStore"
                class="mr-2"
                style="width: 2.3rem; height: 2.3rem; margin: auto"
              />
              <label
                for="castField"
                class="leading-7 text-sm dark:text-gray-300 text-stone-100"
                >Content</label
              >
              <textarea
                id="castField"
                v-model="postContent"
                :disabled="isSendPost"
                class="txt-box w-full bg-stone-200 text-gray-800 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-36 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              >
              </textarea>
              <small
                >Character limit: {{ postContentCharCount }} / {{ maxCharCount }}</small
              >
            </div>
            <div v-if="images.length" class="flex">
              <div
                v-for="image of images"
                :key="image.id"
                class="flex flex-col items-center"
              >
                <img :src="image.img" class="w-20 h-20 mx-2" />
                <button
                  class="bg-rose-700 border-0 p-1 mx-auto my-2 focus:outline-none hover:bg-rose-900 rounded text-lg"
                  @click="() => !isSendPost && deleteImage(image.id)"
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
              :disabled="isSendPost"
              class="dark:bg-stone-600 bg-stone-800 mb-4 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
              @click="triggerFileInput"
            >
              <BtnSpinner v-if="isFileUploading" class="inline mr-2" /><ImageUploadIcon
                class="inline mr-2"
              />
              Add Image
            </button>
            <div>
              <button
                :disabled="isSendPost"
                class="w-1/3 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="modalContent = 'scheduling'"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><ClockIcon
                  class="w-6 inline mr-2"
                />Schedule
              </button>
              <button
                :disabled="isSendPost"
                class="w-1/3 ml-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="doSendPost"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><SendIcon
                  class="w-6 inline mr-2"
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
            <section class="m-4">
              <o-datetimepicker
                v-model="dateTime"
                datepickerWrapperClass="bg-stone-200 m-4"
                timepickerWrapperClass="bg-stone-20 m-4"
                :min-datetime="minimumDate"
                :max-datetime="maximumDate"
                inline
              />
            </section>
            <div>
              <button
                :disabled="isSheduling"
                class="w-1/3 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="modalContent = 'posting'"
              >
                <BtnSpinner v-if="isSheduling" class="inline mr-2" /><GoToIcon
                  class="w-6 inline mr-2 rotate-180"
                />Cancel
              </button>
              <button
                :disabled="isSheduling"
                class="w-1/3 ml-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="doSchedulePost"
              >
                <BtnSpinner v-if="isSheduling" class="inline mr-2" /><ClockIcon
                  class="w-6 inline mr-2"
                />Schedule
              </button>
            </div>
          </template>
        </div>
      </div>
    </section>
  </o-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  computed,
  watch,
  onUnmounted,
} from "vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import Alert from "components/functional/alert.vue";
import { useMainStore } from "@/store/main";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import ReplyIcon from "icons/src/reply.vue";
import type { TPlatform, IReplyTo } from "shared/src/types/web3-posting";
import ImageUploadIcon from "icons/src/imageUpload.vue";
import SendIcon from "icons/src/send.vue";
import ClockIcon from "icons/src/clock.vue";
import {
  mediaUpload,
  sendPost,
  PLATFORMS,
  schedulePost,
  makeSendData,
} from "shared/src/utils/requests/web3-posting";
import DeleteIcon from "icons/src/delete.vue";
import { getMaxCharCount } from "shared/src/utils/requests/crossPost";
import AvatarBtn from "components/functional/avatarBtn.vue";
import { ODatetimepicker } from "@oruga-ui/oruga-next";
import DateIcon from "icons/src/date.vue";
import GoToIcon from "icons/src/goTo.vue";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "CrossPost",
  components: {
    BtnSpinner,
    Alert,
    ReplyIcon,
    SendIcon,
    ClockIcon,
    ImageUploadIcon,
    DeleteIcon,
    AvatarBtn,
    ODatetimepicker,
    DateIcon,
    GoToIcon,
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
  },
  emits: ["success", "update:openModal"],
  setup(props, ctx) {
    const openCastModal = ref(props.openModal);
    const postContent = ref("");
    const postContentCharCount = computed(() => postContent.value.length);
    const postError = ref("");
    const postErrorKey = ref(0);
    const isSendPost = ref(false);
    const store = useMainStore();
    const userPlatforms = PLATFORMS.filter((p) => store.userData?.connected?.[p]);
    const postPlatforms = ref(props.platforms.filter((p) => userPlatforms.includes(p)));
    const isFileUploading = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);
    const images = ref<
      {
        twiter: string;
        farcaster: string;
        lens: string;
        bsky: string;
        img: string;
        id: string;
      }[]
    >([]);
    const dateTime = ref(new Date(Date.now() + 1000 * 60 * 5));
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    let pasteListner = async (_e: ClipboardEvent) => {
      // ignore
    };

    const maxCharCount = ref(getMaxCharCount(postPlatforms.value));
    const modalContent = ref("posting");
    const maximumDate = new Date(Date.now() + 1000 * 3570 * 24 * 7);
    const minimumDate = new Date(Date.now() + 1000 * 60 * 2);
    const isSheduling = ref(false);

    watch(
      () => postPlatforms.value,
      (newVal) => {
        maxCharCount.value = getMaxCharCount(newVal);
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

    const onFileUpload = async (f?: File | Event) => {
      const imageFile = (fileInput.value?.files?.[0] ?? f) as File;
      if (!imageFile) return;
      isFileUploading.value = true;
      const imageBase64 = await fileToBase64(imageFile);
      const upload = await mediaUpload(store, API_BASE, postPlatforms.value, imageFile);
      upload.img = imageBase64 as string;
      upload.id = Math.random().toString(36).substring(7);
      images.value.push(upload);
      isFileUploading.value = false;
    };

    const triggerFileInput = () => {
      if (fileInput.value) {
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
      const media = [...images.value];
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
        stackAlertWarning,
      });
      if (result) {
        ctx.emit("success");
        openCastModal.value = false;
        ctx.emit("update:openModal", false);
      }
    };

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
        openCastModal.value = false;
        ctx.emit("update:openModal", false);
        stackAlertSuccess("Post scheduled successfully.");
      } else {
        stackAlertWarning("Something went wrong, please try again later.");
      }
      isSheduling.value = false;
    };

    onMounted(() => {
      pasteListner = async (e) => {
        for (const clipboardItem of (e?.clipboardData?.files ?? []) as File[]) {
          if (clipboardItem.type.startsWith("image/")) {
            e.preventDefault();
            onFileUpload(clipboardItem);
          }
        }
      };

      document.addEventListener("paste", pasteListner);
    });

    onUnmounted(() => {
      document.removeEventListener("paste", pasteListner);
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
      userPlatforms,
      useMainStore,
      modalContent,
      dateTime,
      maximumDate,
      minimumDate,
      doSchedulePost,
      isSheduling,
    };
  },
});
</script>

<style lang="scss">
.txt-box {
  background-color: #a1a5a952;
  border: 4px solid #3333339e;
  border-radius: 0.7rem;
  color: aliceblue;
  min-height: 25vh;
  min-width: 35vw;
}

.o-dpck {
  .o-sel-arrow {
    background-color: var(--glassBg) !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:serif='http://www.serif.com/' width='100%25' height='100%25' viewBox='0 0 100 100' version='1.1' xml:space='preserve' style='fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;'%3E%3Cg transform='matrix(5.70052,0,0,5.70052,-1329.79,-547.054)'%3E%3Cpath d='M233.451,101.749L235.617,99.422L242.013,105.565L248.463,99.422L250.642,101.749L242.013,110.052L233.451,101.749Z' style='fill:;stroke:white;stroke-width:0.18px;'/%3E%3C/g%3E%3C/svg%3E");
  }

  .o-dpck__box {
    padding: 1rem;
  }

  .o-dpck__table__cell {
    padding: 0.3rem;
  }

  .o-dpck__table__cell--unselectable {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .o-dpck__table__cell--selectable {
    cursor: pointer;
    border: 1px solid #8181815e;
  }

  .o-dpck__table__cell--selected {
    background-color: #a33e1fb9;
  }

  .o-tpck__select {
    background-color: #a33e1fb9;
    padding: 0.28rem;
  }

  .o-tpck__selected {
    background-color: var(--glassBg) !important;
  }
}
</style>
