<template>
  <section class="body-font relative">
      <div class="container px-5 py-2 mx-auto flex">
        <div
          class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
        >
          <h2 class="text-lg mb-1 font-medium title-font">Connect Device</h2>
          <button
            v-if="!authCode"
            :disabled="isGenerateAuthCodeLoading"
            class="bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
            @click="generateAuthCode"
          >
            <BtnSpinner v-if="isGenerateAuthCodeLoading" class="inline mr-2" />Generate Auth Code
          </button>
          <div v-else>
            <h3 class="text-[1.1rem] mb-2">Enter the following code in your device:</h3>
            <input
              v-model="authCode"
              type="text"
              class="w-full rounded-lg bg-gray-800 text-white p-2 text-[1.4rem]"
              style="text-align: center;letter-spacing: .4rem;"
              disabled
            />
            <p class="text-[1.2] p-4">Expires in <span class="font-semibold">{{ timeout / 1000 }}</span> seconds</p>
        </div>
        </div>
      </div>
    </section>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref} from "vue";
import { useMainStore } from "@/store/main";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { requestLoginCode } from "shared/src/utils/auth";
 
// const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "SettingsAddDevice",
  components: {
    BtnSpinner,
   },
  setup() {
     const isGenerateAuthCodeLoading = ref(false);
    const authCode = ref("");
    const timeout = ref(0);

 
    const store = useMainStore();


    const startTimeout = () => {
      const interval = setInterval(() => {
        timeout.value -= 1000
        if (timeout.value <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    };
   
    
    const generateAuthCode = async () => {
      isGenerateAuthCodeLoading.value = true;
      const res = await requestLoginCode({store});
      if (res) {
        authCode.value = res.code;
        timeout.value = res.expiresAt - Date.now();
      }
      startTimeout();
      isGenerateAuthCodeLoading.value = false;
    };

 
    onMounted(async () => {
      // nothing
    });

 
    return {
      generateAuthCode,
      isGenerateAuthCodeLoading,
      authCode,
      timeout
    };
  },
});
</script>

<style lang="scss">
 
</style>
