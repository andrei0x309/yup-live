<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
  <div class="bg-color table-list w-full mb-4">
  <h2>Check Yup Account raw influence:</h2>
  <div class="flex rounded bg-gray-200 w-[30rem] m-auto">
    <input
      v-model="search"
      type="search"
      class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
      placeholder="username or account id"
    />

    <button
      type="button"
      class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100"
      :class="(search.length > 0) ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
      :disabled="search.length == 0"
      @click="searchRawInf"
    >
      check
    </button>
  </div>
  <DangLoader v-if="isDataLoading" :unset="true" />
  <div v-if="!isDataLoading && influence" class="flex flex-wrap m-auto">
  <h2>Account <span style="padding: 1rem; font-size:1.4rem;" class="gradient-text">{{ userId }}</span> has <span  style="padding: 1rem; font-size:1.4rem;" class="gradient-text">{{ influence }}</span> raw influence.</h2>
  </div>
    <div v-if="apiError && !isDataLoading" style="max-width: 40rem; margin: auto" class="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300">
			<div class="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
				<span class="text-red-500">
					<svg
                         fill="currentColor"
						 viewBox="0 0 20 20"
						 class="h-6 w-6">
						<path
                                fill-rule="evenodd"
							  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							  clip-rule="evenodd"></path>
					</svg>
				</span>
			</div>
			<div class="alert-content ml-4">
				<div class="alert-title font-semibold text-lg text-red-800">
					Error
				</div>
				<div class="alert-description text-sm text-red-600">
					{{ apiErrorMsg }}
				</div>
			</div>
		</div>
    </div>
    </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from '@/components/content/vote-list/loader.vue'

export default defineComponent({
  name: 'RawInfluence',
  components: {
    DangLoader
  },
  setup() {
  const API_BASE = import.meta.env.VITE_YUP_API_BASE
  const search = ref('')
  const apiError = ref(false)
  const apiErrorMsg = ref('')
  const userId = ref('')
  const isDataLoading = ref(false)
  const influence = ref(null)

  const siteData = reactive({
      title: `YUP Live - Check your raw influence`,
      description: `LiveCheck your raw influence for YUP DApp...`
    })
    
 
    onMounted(async () => {
       // do nothing
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    const searchRawInf = async () => {
      isDataLoading.value = true
      apiError.value = false
      const reqAcc = await fetch(
        `${API_BASE}/accounts/${search.value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      )
      if(!reqAcc.ok) {
        apiErrorMsg.value = 'Account not found, please check your spelling.'
        apiError.value = true
        isDataLoading.value = false
        return
      }
      const acc = await reqAcc.json()
      userId.value = acc._id
      const reqRawInf = await fetch(
        `${API_BASE}/accounts/raw-influence/${acc._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      )
       if(!reqRawInf.ok) {
        apiErrorMsg.value = 'Error accessing raw influence API, please try again later.'
        apiError.value = true
        isDataLoading.value = false
        return
      }
      const rawInf = await reqRawInf.json()
      influence.value = rawInf.influence
      isDataLoading.value = false
    }


    return {
        search,
        searchRawInf,
        apiError,
        apiErrorMsg,
        isDataLoading,
        userId,
        influence
    }
  }
})
</script>

<style scoped lang="scss">
 
</style>
