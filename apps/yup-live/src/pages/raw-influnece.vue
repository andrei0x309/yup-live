<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
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
          class="m-2 rounded px-4 py-2 font-semibold text-gray-100"
          :class="search.length > 0 ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
          :disabled="search.length == 0"
          @click="getUserData"
        >
          check
        </button>
      </div>
      <DangLoader v-if="isDataLoading" class="mt-8" :unset="true" />
      <div v-if="!isDataLoading && influence" class="flex flex-wrap m-auto">
        <div>
          <h2>
            Account
            <span style="padding: 1rem; font-size: 1.4rem" class="gradient-text">{{ userId }}</span>
            has
            <span style="padding: 1rem; font-size: 1.4rem" class="gradient-text">{{ influence }}</span>
            raw influence
            = <span style="padding: 1rem; font-size: 1.4rem" class="gradient-text">{{ getDerivedInfluence(Number(influence)) }}</span> influence.
          </h2>
          <o-table :data="historicInfluence" :tableClass="`${isDataLoading ? 'tableLoading' : ''}`" :loading="isDataLoading">
            <o-table-column v-slot="props" field="timestamp" label="Snapshot Timestamp">
              <div class="inline">
                <DateIcon />
                {{ props.row.createdAt }}
              </div>
            </o-table-column>

            <o-table-column v-slot="props" field="rawInfluence" label="Raw Influence">
              <div :key="`${Number(props.row.rawInfluence).toFixed(2)}-${props.row.account}`" class="inline">
                {{ `💪 ${Number(props.row.rawInfluence).toFixed(2)}` }}
              </div>
            </o-table-column>

            <template #loading> </template>
          </o-table>
        </div>
      </div>
      <div
        v-if="apiError && !isDataLoading"
        class=" w-max-[30rem] justify-center justify-self-center alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300 mt-8"
      >
        <div class="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
          <span class="text-red-500">
            <svg fill="currentColor" viewBox="0 0 20 20" class="h-6 w-6">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </div>
        <div class="alert-content ml-4">
          <div class="alert-title font-semibold text-lg text-red-800">Error</div>
          <div class="alert-description text-sm text-red-600">
            {{ apiErrorMsg }}
          </div>
        </div>
      </div>

      <h2>Derived Influence From Raw Influence Calculator:</h2>
      <div class="flex rounded bg-gray-200 w-[30rem] m-auto">
        <input
          v-model="rawInf"
          type="search"
          class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
          placeholder="raw influence number"
        />

        <button
          type="button"
          class="m-2 rounded px-4 py-2 font-semibold text-gray-100"
          :class="search.length > 0 ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
          :disabled="search.length == 0"
          @click="calcDerived"
        >
          check
        </button>
      </div>
      <h2>
            Derived influence from
            <span style="padding: 1rem; font-size: 1.4rem" class="gradient-text">{{ rawInf }}</span>
            is
            <span style="padding: 1rem; font-size: 1.4rem" class="gradient-text">{{ derivedInf }}</span>
            .
      </h2>

    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead } from 'unhead'
import DangLoader from 'components/vote-list/loader.vue'
import DateIcon from 'icons/src/date.vue'
import { useRoute } from 'vue-router'
import { getDerivedInfluence } from 'shared/src/utils/accounts'

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default defineComponent({
  name: 'RawInfluence',
  components: {
    DangLoader,
    DateIcon
  },
  setup() {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    const route = useRoute()
    const user = ref((route.params.user as string) ?? "");
    const search = ref(user)
    const apiError = ref(false)
    const apiErrorMsg = ref('')
    const userId = ref('')
    const isDataLoading = ref(false)
    const influence: Ref<null | string> = ref(null)
    const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([])
    const rawInf = ref(0)
    const derivedInf = ref(0)
    

    const siteData = reactive({
      title: `YUP Live - Check your raw influence`,
      description: `Live Check your raw influence for YUP DApp...`
    })

    useHead({
      title: computed(() => siteData.title).value,
      meta: [
        {
          name: 'og:image',
          content: `${BASE_URL}/share/yup-live-ogs/og-yup-live-default.png`
        },
        {
          name: 'description',
          content: computed(() => siteData.description).value
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content: computed(() => siteData.title).value
        },
        {
          name: 'og:description',
          content: computed(() => siteData.description).value
        },
        {
          name: 'og:url',
          content: computed(() => route.fullPath).value
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: computed(() => route.fullPath).value
        },
        {
          name: 'twitter:title',
          content: computed(() => siteData.title).value
        },
        {
          name: 'twitter:description',
          content: computed(() => siteData.description).value
        }
      ]
    })

    onUnmounted(() => {
      // do nothing
    })

    const calcDerived = async () => {
      const derived = await getDerivedInfluence(Number(rawInf.value))
      derivedInf.value = derived
    }

    const checkAccount = async () => {
      const reqAcc = await fetch(`${API_BASE}/accounts/${search.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
      if (!reqAcc.ok) {
        apiErrorMsg.value = 'Account not found, please check your spelling.'
        apiError.value = true
        isDataLoading.value = false
        return false
      }
      const acc = await reqAcc.json()
      userId.value = acc._id
      return acc._id
    }

    const searchRawInf = async (accId: string) => {
      const reqRawInf = await fetch(`${API_BASE}/accounts/raw-influence/${accId}?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
      if (!reqRawInf.ok) {
        apiErrorMsg.value = 'Error accessing raw influence API, please try again later.'
        apiError.value = true
        return false
      }
      const rawInf = await reqRawInf.json()
      influence.value = Number(rawInf.influence).toFixed(2)
    }

    const getInfHistory = async (accId: string) => {
      const reqRawInf = await fetch(`${API_BASE}/accounts/influence-history/${accId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
      if (!reqRawInf.ok) {
        apiErrorMsg.value = 'Error accessing raw influence API, please try again later.'
        apiError.value = true
        return false
      }
      historicInfluence.value = await reqRawInf.json()
    }

    const getUserData = async () => {
      isDataLoading.value = true
      apiError.value = false
      const accId = (await checkAccount()) || false
      if (!accId) return (isDataLoading.value = false)
      await searchRawInf(accId)
      await getInfHistory(accId)
      isDataLoading.value = false
    }

    onMounted(async () => {
      if (user.value) {
        await getUserData();
      }
    });

    return {
      search,
      getUserData,
      apiError,
      apiErrorMsg,
      isDataLoading,
      userId,
      influence,
      historicInfluence,
      calcDerived,
      getDerivedInfluence,
      rawInf,
      derivedInf
    }
  }
})
</script>

<style lang="scss">
.table-list {
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-top: 2rem;
  }

  table {
    margin-top: 2rem;
  }

  table tr td {
    padding-bottom: 0.7rem;
    padding-top: 0.7rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
}
</style>
