<template>
  <button v-if="showReplyButton" class="view-btn flex ml-2" @click="openPostModal = true">
    <ReplyIcon class="inline-block w-4" />Reply
  </button>
  <o-modal v-model:active="openPostModal" contentClass="modalDefault" @close="sendClose">
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
              @click="
                () => {
                  if (
                    modalContent === 'scheduling' ||
                    modalContent === 'selectFatscasterChannel'
                  ) {
                    modalContent = 'posting';
                  } else {
                    sendClose();
                  }
                }
              "
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
                :timeout="6000"
                title="Error"
                :type="postErrorType"
              />
              </div>
              <div v-for="(post, index) in posts" :key="index">
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
                v-model="post.postContent"
                :disabled="isSendPost"
                class="txt-box w-full bg-stone-200 text-gray-800 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-36 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                @input="() => {
                  postContentCharCount[index] = post.postContent.length;
                }"
              >
              </textarea>
              <small
                >Character limit: {{ postContentCharCount[index] }} / {{ maxCharCount }}</small
              >
            <div class="flex flex-col">
            <div v-if="post.images.length" class="flex">
              <div
                v-for="image of post.images"
                :key="image.id"
                class="flex flex-col items-center"
              >
                <img :src="image.img" class="max-w-20 max-h-20 mx-2" />
                <button
                  class="bg-rose-700 border-0 p-1 mx-auto my-2 focus:outline-none hover:bg-rose-900 rounded text-lg"
                  @click="() => !isSendPost && deleteImage(image.id, index)"
                >
                  <DeleteIcon class="inline w-6" />
                </button>
              </div>
            </div>
            <div v-if="post.videos.length" class="flex">
            <div v-for="video of post.videos" :key="video.id" class="flex flex-col items-center">
              <video class="max-w-20 max-h-20 mx-2" controls>
                <source :src="video.source" :type="video.type">
              </video>
              <button
                class="bg-rose-700 border-0 p-1 mx-auto my-2 focus:outline-none hover:bg-rose-900 rounded text-lg"
                @click="deleteVideo(video.id, index)"
              >
                <DeleteIcon class="inline w-6" />
              </button>
            </div>
          </div>
            <input
              :ref="el => {
                if(el && posts[index]) {
                  posts[index].fileInput = el as HTMLInputElement;
                }
              }"
              type="file"
              style="display: none"
              accept="image/*"
              @change="(f) => onFileUpload(f, index)"
            />
            <input
            :ref="e => {
              if (e && posts[index]) {
                posts[index].videoFileInput = e as HTMLInputElement;
              }
            }"
            type="file"
            style="display: none"
            accept="video/*" 
            @change="(f) => onVideoFileUpload(f, index)"
          />
          <div class="flex justify-between">
          <button
            class="w-1/2 mr-1 bg-stone-600 mb-4 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg text-[0.8rem]"
            @click="triggerFileInput(index)"
          >
            <BtnSpinner v-if="isFileUploading" class="inline mr-2 w-4" /><ImageUploadIcon
              class="inline mr-2 w-4"
            />
            Add Image
          </button>
          <button
            class="w-1/2 ml-1 bg-stone-600 mb-4 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg text-[0.8rem]"
            @click="triggerVideoFileInput(index)"
          >
            <BtnSpinner v-if="isVideoUploading" class="inline mr-2 w-4" /><VideoUploadIcon
              class="inline mr-2 w-4"
            />
            Add Video
          </button>
          </div>
          </div>
            </div>
            <div>
              <div class="flex justify-center mb-4">
              <button
                :disabled="isSendPost"
                class="w-1/2 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="addToThread"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><AddIcon
                  class="w-6 inline mr-2"
                /> {{  posts.length > 1 ? 'Add new post to Thread' : 'Create Thread' }}
              </button>
              <button
                v-if="posts.length > 1"
                :disabled="isSendPost"
                class="w-1/2 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="substractFromThread"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><SubstractIcon
                  class="w-6 inline mr-2"
                /> {{  posts.length  === 2 ? 'Convert To single Post' : 'Remove post from Thread' }}
              </button>
              </div>
              <button
                v-show="!replyTo && showFcChannel"
                class=" dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg mb-4"
                @click="
                  () => {
                    if (farcasterChannel) {
                      farcasterChannel = undefined;
                    } else {
                      modalContent = 'selectFatscasterChannel';
                    }
                  }
                "
              >
                <img
                  v-if="farcasterChannel"
                  :src="
                    typeof farcasterChannel === 'object'
                      ? farcasterChannel.image_url
                      : undefined
                  "
                  class="w-5 inline mr-2"
                />
                <ProfileFarcasterIcon v-else class="w-5 inline mr-2" />
                {{
                  farcasterChannel ? "Remove farcaster channel" : "Add farcaster channel"
                }}
              </button>
              <div class="flex justify-between mb-4">
              <button
                :disabled="isSendPost"
                class="w-1/2 mr-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="modalContent = 'scheduling'"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><ClockIcon
                  class="w-6 inline mr-2"
                />Schedule
              </button>
              <button
                :disabled="isSendPost"
                class="w-1/2 ml-1 dark:bg-stone-600 bg-stone-800 border-0 py-2 px-6 focus:outline-none hover:bg-stone-700 rounded text-lg"
                @click="doSendPost"
              >
                <BtnSpinner v-if="isSendPost" class="inline mr-2" /><SendIcon
                  class="w-6 inline mr-2"
                />Send
              </button>
              </div>
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
          <template v-else-if="modalContent == 'selectFatscasterChannel'">
            <div class="add-channel">
              <h2 class="text-lg mb-1 font-medium title-font">
                Select Farcaster Channel
              </h2>
              <p>Search</p>
              <input
                id="farcasterChannelSearch"
                type="text"
                placeholder="channel name"
                class="mb-4 rounded p-2 text-[#e0e0e0] bg-stone-800 border-purple-800 border-2"
                @input="(e) => {
                searchChannels((e?.target as any)?.value)
            }"
              />
              <div v-if="channels?.length === 0">
                <p>No channels found</p>
              </div>
              <div v-else class="flex flex-col">
                <o-radio
                  v-for="channel of channels"
                  :key="channel.id"
                  v-model="farcasterChannel"
                  :native-value="channel.id"
                >
                  <div class="flex flex-wrap-reverse">
                    <div class="w-max-[28%]">
                      <img
                        class="w-8 h-8 inline rounded-lg mx-4 my-1"
                        :src="channel.image_url"
                      />
                    </div>
                    <div class="flex flex-col text-left w-[70%]">
                      <p>{{ channel.name }}</p>
                      <p class="text-xs">{{ channel.description }}</p>
                    </div>
                  </div>
                </o-radio>
              </div>
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
  watch,
  onUnmounted,
  Ref,
  reactive
} from "vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import Alert from "components/functional/alert.vue";
import { useMainStore } from "@/store/main";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import ReplyIcon from "icons/src/reply.vue";
import type { TPlatform, IReplyTo, TChannel, ISendPostData } from "shared/src/types/web3-posting";
import ImageUploadIcon from "icons/src/imageUpload.vue";
import SendIcon from "icons/src/send.vue";
import ClockIcon from "icons/src/clock.vue";
import {
  mediaUpload,
  sendPost,
  PLATFORMS,
  schedulePost,
  makeSendData,
  searchChannel,
  sendThread
} from "shared/src/utils/requests/web3-posting";
import DeleteIcon from "icons/src/delete.vue";
import { getMaxCharCount } from "shared/src/utils/requests/crossPost";
import AvatarBtn from "components/functional/avatarBtn.vue";
import { ODatetimepicker } from "@oruga-ui/oruga-next";
import DateIcon from "icons/src/date.vue";
import GoToIcon from "icons/src/goTo.vue";
import { wait } from "shared/src";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import AddIcon from "icons/src/add.vue";
import SubstractIcon from "icons/src/substract.vue";
import VideoUploadIcon from "icons/src/videoUpload.vue";

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
    ProfileFarcasterIcon,
    AddIcon,
    SubstractIcon,
    VideoUploadIcon
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
    const openPostModal = ref(props.openModal);



    const postError = ref("");
    const postErrorKey = ref(0);
    const isSendPost = ref(false);
    const store = useMainStore();
    const userPlatforms = PLATFORMS.filter((p) => store.userData?.connected?.[p]);
    const postPlatforms = ref(props.platforms.filter((p) => userPlatforms.includes(p)));
    const isFileUploading = ref(false);
    const maxCharCount = ref(getMaxCharCount(postPlatforms.value));
    const postErrorType = ref("error");


    const isVideoUploading = ref(false);

    const posts = reactive([{
      images: [] as {
        twiter: string;
        farcaster: string;
        lens: string;
        bsky: string;
        img: string;
        id: string;
      }[],
      videos: [] as {
        twiter: string;
        farcaster: string;
        lens: string;
        source: string;
        id: string;
        type: string;
      }[],
      fileInput: null as HTMLInputElement | null,
      videoFileInput: null as HTMLInputElement | null,
      postContent: "",
    }]);

    const postContentCharCount = reactive(posts.map((p) => p.postContent.length));

    const dateTime = ref(new Date(Date.now() + 1000 * 60 * 5));
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    let pasteListner = async (_e: ClipboardEvent) => {
      // ignore
    };

    const modalContent = ref("posting");
    const maximumDate = new Date(Date.now() + 1000 * 3570 * 24 * 7);
    const minimumDate = new Date(Date.now() + 1000 * 60 * 2);
    const isSheduling = ref(false);
    const channels = ref([]) as Ref<TChannel[]>;
    const farcasterChannel = ref(undefined) as Ref<TChannel | undefined | string>;
    const isChannelSearching = ref(false);
    const showFcChannel = ref(!!postPlatforms?.value?.includes("farcaster"));
    let searchString = "";

    const addToThread = () => {
      if(posts.length > 30) {
        stackAlertWarning('This thread is too long, please limit it to 30 posts');
        return;
      }
      posts.push({
        images: [],
        fileInput: null,
        postContent: "",
        videos: [],
        videoFileInput: null
      });
      postContentCharCount.push(0);
    };

    const substractFromThread = () => {
      if (posts.length > 1) {
        posts.pop();
        postContentCharCount.pop();
      }
    };

    const searchChannels = async (value: string) => {
      searchString = value;
      if (!value) return;
      if (isChannelSearching.value) return;
      await wait(300);
      if (isChannelSearching.value) return;
      isChannelSearching.value = true;
      let result: TChannel[];
      let searchTerm = "";
      do {
        searchTerm = searchString;
        result = await searchChannel(searchString);
      } while (searchTerm !== searchString);
      channels.value = result;
      isChannelSearching.value = false;
    };

    watch(
      () => postPlatforms.value,
      (newVal) => {
        maxCharCount.value = getMaxCharCount(newVal);
        showFcChannel.value = !!newVal?.includes("farcaster");
      }
    );

    watch(
      () => farcasterChannel.value,
      (newVal) => {
        if (newVal !== undefined && newVal !== "" && !(newVal as TChannel)?.id) {
          farcasterChannel.value = channels.value.find((c) => c.id === newVal);
          modalContent.value = "posting";
        }
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

    const onFileUpload = async (f: File | Event, index: number) => {
      const imageFile = (posts?.[index]?.fileInput?.files?.[0] ?? f) as File;
      if (!imageFile) return;
      isFileUploading.value = true;
      const imageBase64 = await fileToBase64(imageFile);
      const upload = await mediaUpload(store, API_BASE, postPlatforms.value, imageFile);

      if(upload?.errors) {
        const platforms = [] as TPlatform[];
        for (const error of upload.errors) {
          platforms.push(error.platform)
        }
        postPlatforms.value = postPlatforms.value.filter(p => !platforms.includes(p));
        showError(`Error uploading image to ${platforms.join(', ')}, platforms removed from post`, true);
        if(Object.keys(upload.results).length) {
          posts[index].images.push(upload.results);
        }
      } else {
        posts[index].images.push(upload);
      }

      upload.img = imageBase64 as string;
      upload.id = Math.random().toString(36).substring(7);
      
      isFileUploading.value = false;
    };

    const triggerFileInput = (index: number) => {
      if (posts?.[index]?.fileInput) {
        posts?.[index]?.fileInput?.click();
      }
    };

    const triggerVideoFileInput = (index: number) => {
      if (posts?.[index]?.videoFileInput) {
        isVideoUploading.value = true;
        posts?.[index]?.videoFileInput?.click();
      }
    };

    const onVideoFileUpload = async (f: File | Event, index: number) => {
      const videoFile = (posts?.[index]?.videoFileInput?.files?.[0] ?? f) as File;
      if (!videoFile) return;

 
      if(postPlatforms.value.includes('bsky')) {
        showError("Video upload is not supported on BlueSky, your Bluesky post will be sent without the video.", true);
        postPlatforms.value = postPlatforms.value.filter(p => p !== 'bsky');
      }
      const upload = await mediaUpload(store, API_BASE, postPlatforms.value , videoFile )
      if(upload?.errors) {
        const platforms = [] as TPlatform[];
        for (const error of upload.errors) {
          platforms.push(error.platform)
        }
        postPlatforms.value = postPlatforms.value.filter(p => !platforms.includes(p));
        showError(`Error uploading video to ${platforms.join(', ')}, platforms removed from post`, true);
        if(Object.keys(upload.results).length) {
          upload.results.source =  URL.createObjectURL(videoFile);
          upload.results.type = videoFile.type
          upload.results.id =  Math.random().toString(36).substring(7)
          posts[index].videos.push(upload.results);
        }
      } else {
        upload.source =  URL.createObjectURL(videoFile);
        upload.type = videoFile.type
        upload.id =  Math.random().toString(36).substring(7)
        posts[index].videos.push(upload);
      }
      isVideoUploading.value = false;
    };

    const deleteVideo = (id: string, index: number) => {
      posts[index].videos =  posts?.[index]?.videos.filter((video) => video.id !== id);
    };

    const showError = (msg: string, warn?: boolean) => {
      postErrorType.value = warn ? "warning" : "error";
      postError.value = msg;
      postErrorKey.value += 1;
    };

    const sendClose = () => {
      ctx.emit("update:openModal", false);
    };

    const deleteImage = (id: string, index: number) => {
      posts[index].images =  posts?.[index]?.images.filter((image) => image.id !== id);
    };

    const doSendPost = async () => {
      let replyTo: IReplyTo | undefined = undefined;
      if (props.replyTo) {
        replyTo = props.replyTo;
      }
      if ((farcasterChannel.value as TChannel)?.parent_url) {
        replyTo = {
          farcaster: (farcasterChannel.value as TChannel).parent_url,
        };
      }
      let result 
      if (posts.length > 1) {
          result = await sendThread({
          store,
          posts: posts.map((p) =>  {
            return {
              postContent: p.postContent,
              media: [...p.images ?? [], ...p.videos ?? []],
              maxCharCount: maxCharCount.value,
              postPlatforms: postPlatforms.value,
            };
          }),
          isSendPost,
          replyTo,
          showError,
          stackAlertSuccess,
          stackAlertWarning,
        });
      } else {
        const media = [...posts?.[0]?.images ?? [], ...posts?.[0]?.videos ?? []]

        result = await sendPost({
        store,
        postContent: posts?.[0]?.postContent,
        postPlatforms: postPlatforms.value,
        maxCharCount: maxCharCount.value,
        isSendPost,
        replyTo,
        media,
        showError,
        stackAlertSuccess,
        stackAlertWarning,
      });
    }
      if (result) {
        ctx.emit("success");
        openPostModal.value = false;
        ctx.emit("update:openModal", false);
      }
    };

    const doSchedulePost = async () => {
      if (isSheduling.value) return;
      isSheduling.value = true;
      let replyTo: IReplyTo | undefined = undefined;
      if (props.replyTo) {
        replyTo = props.replyTo;
      }
      if ((farcasterChannel.value as TChannel)?.parent_url) {
        replyTo = {
          farcaster: (farcasterChannel.value as TChannel).parent_url,
        };
      }

      let sendData: ISendPostData | { posts: (ISendPostData | undefined)[]; platforms: TPlatform[]; time: number; replyTo?: IReplyTo } | undefined = undefined;
      if (posts.length > 1) {
        sendData = {
          posts: posts.map((p) => {
            return makeSendData({
              postContent: p.postContent,
              maxCharCount: maxCharCount.value,
              media: [...p.images ?? [], ...p.videos ?? []],
            });
          }) ?? [],
          platforms: postPlatforms.value,
          time: dateTime.value.getTime(),
          replyTo,
        };
      } else {
        const media = [...posts?.[0]?.images ?? [], ...posts?.[0]?.videos ?? []]
        sendData =
      makeSendData({

        postContent: posts?.[0]?.postContent,
        postPlatforms: postPlatforms.value,
        maxCharCount: maxCharCount.value,
        media,
        replyTo,
        showError,
        time: dateTime.value,
      });
    }

      if (!sendData) {
        isSheduling.value = false;
        return;
      }

      const result = await schedulePost({
        apiBase: API_BASE,
        store,
        sendData,
        isThread: posts.length > 1,
      });
      if (result?.ok) {
        ctx.emit("success");
        openPostModal.value = false;
        ctx.emit("update:openModal", false);
        stackAlertSuccess("Post scheduled successfully.");
      } else {
        if (result?.error === "insufficient") {
          stackAlertWarning(
            "This feature requires you to have at least 1000 YUP tokens."
          );
        } else {
          stackAlertWarning("Something went wrong, please try again later.");
        }
      }
      isSheduling.value = false;
    };

    onMounted(() => {
      pasteListner = async (e) => {
        for (const clipboardItem of (e?.clipboardData?.files ?? []) as File[]) {
          if (clipboardItem.type.startsWith("image/")) {
            e.preventDefault();
            onFileUpload(clipboardItem, posts.length - 1);
          }
        }
      };

      document.addEventListener("paste", pasteListner);
    });

    onUnmounted(() => {
      document.removeEventListener("paste", pasteListner);
    });

    return {
      openPostModal,
      isSendPost,
      postContentCharCount,
      postError,
      postErrorKey,
      doSendPost,
      sendClose,
      postPlatforms,
      PLATFORMS,
      onFileUpload,
      triggerFileInput,
      isFileUploading,
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
      channels,
      isChannelSearching,
      searchChannels,
      farcasterChannel,
      showFcChannel,
      posts,
      addToThread,
      substractFromThread,
      triggerVideoFileInput,
      isVideoUploading,
      deleteVideo,
      onVideoFileUpload,
      postErrorType
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

.add-channel {
  display: flex;
  height: 90%;
  flex-direction: column;
  .o-radio input[type="radio"] {
    display: none;
  }
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
