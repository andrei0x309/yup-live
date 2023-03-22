<template>
  <button v-if="showReplyButton && farcasterToken" class="view-btn flex ml-2" @click="openCastModal = true"  >
  <ReplyIcon class="inline-block w-4" />Reply</button>
  <o-modal v-model:active="openCastModal" contentClass="modalDefault" @close="sendClose">
    <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-8 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Send Cast</h2>
          <div class="relative mb-4">
            <Alert
              :key="castErrorKey"
              :hidden="!castError.length"
              :message="castError"
              title="Error"
              type="error"
            />
            <small>imgur links will be parsed</small>
            <label
              for="castField"
              class="leading-7 text-sm text-gray-600 dark:text-gray-300"
              >Cast Content</label
            >
            <textarea
              id="castField"
              v-model="castContent"
              class="w-full text-gray-600 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-36 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            >
            </textarea>
            <small>Character limit: {{ castContentCharCount }} / 320</small>
          </div>
          <button
            :disabled="isSendingCast"
            class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg"
            @click="sendCast"
          >
            <BtnSpinner v-if="isSendingCast" class="inline mr-2" />Send
          </button>
        </div>
      </div>
    </section>
  </o-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, computed } from "vue";
import BtnSpinner from 'icons/src/btnSpinner.vue'
import Alert from 'components/functional/alert.vue'
import { FCSendCast } from "shared/src/utils/farcaster";
import { useMainStore } from "@/store/main";
import { stackAlertSuccess } from "@/store/alertStore";
import ReplyIcon from 'icons/src/reply.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export default defineComponent({
  name: "FarcasterSendModal",
  components: {
    BtnSpinner,
    Alert,
    ReplyIcon
  },
  props: {
    replyTo: {
      type: Object as PropType<{
        fid: string,
        hash: string
      } | null>,
      required: false,
      default: null
    },
    showReplyButton: {
      type: Boolean,
      required: false,
      default: false
    },
    openModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['success', 'update:openModal'],
  setup(props, ctx) {
    onMounted(() => {
      // console.log('mounted')
    });

    const openCastModal = ref(props.openModal)
    const castContent = ref("");
    const castContentCharCount = computed(() => castContent.value.length);
    const castError = ref("");
    const castErrorKey = ref(0);
    const isSendingCast = ref(false);
    const store = useMainStore();
    const farcasterToken = computed(() => store.farcaster);

    const showCastError = (msg: string) => {
      castError.value = msg;
      castErrorKey.value += 1;
    };

    const sendClose = () => {
      ctx.emit('update:openModal', false)
    }

    const sendCast = async () => {
      if (!castContent.value) {
        showCastError("Cast cannot be empty");
        return;
      } else if (castContent.value.length > 320) {
        showCastError("Cast cannot be longer than 320 characters")
        return;
      }
      isSendingCast.value = true;
      const res = await FCSendCast(farcasterToken.value as string, castContent.value, API_BASE, props.replyTo);
      if (!res.error) {
        castContent.value = "";
        ctx.emit('success')
        stackAlertSuccess("Cast sent!");
      } else {
        showCastError(res.message)
      }
      isSendingCast.value = false;
    };

    return {
        openCastModal,
        isSendingCast,
        castContent,
        castContentCharCount,
        castError,
        castErrorKey,
        sendCast,
        farcasterToken,
        sendClose
    }
  },
});
</script>

<style lang="scss"></style>
