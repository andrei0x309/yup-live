<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user collections</p>
    <DangLoader :unset="true" />
  </template>
  <template v-else>
    <h2 v-if="collections?.length > 0" class="text-[1.3rem] my-4 uppercase">{{ accountId }}'s Collections</h2>
    <div v-else>
      <h2 class="text-[1.3rem] mt-2 uppercase">{{ accountId }} has not created any collection</h2>
      <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CollectionCard v-for="collection of refCollections" :key="collection._id" :collectionInfo="collection" @deletecol="onDeletePress" />
    </div>
  </template>
  <o-modal v-model:active="confirmDeleteModal" contentClass="modal-body grid grid-cols-1 gap-4 content-center" @close="modalWasClosed">
    <h2 class="mt-2 p-4 text-[1.3rem]">Delete Collection</h2>
    <h2 class="mt-2 p-4 text-[1.3rem]">{{ colectionDeleteName }}</h2>
    <p class="p-4 mb-4 text-[1.3rem]">Are you sure?</p>
    <div class="flex">
      <CustomButton class="mx-auto" :icon="refGoTo" iconClass="transform -rotate-180" text="Nay" @click="onDeleteNay" />
      <CustomButton class="mx-auto" :icon="refGoTo" iconClass="transform rotate-90" text="Yup" @click="onDeleteYup" />
    </div>
  </o-modal>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, shallowRef } from 'vue'
import { ICollection } from 'shared/src/types/store'
import CollectionCard from './collectionCard.vue'
import DangLoader from 'components/vote-list/loader.vue'
import CustomButton from 'components/functional/customButton.vue'
import GoToIcon from 'icons/src/goTo.vue'
import { fetchWAuth } from 'shared/src/utils/auth'
import { stackAlertError, stackAlertSuccess } from '@/store/alertStore'
import { getCollections, useCollectionStore } from '@/store/collections'
import { useMainStore } from '@/store/main'
const refGoTo = GoToIcon

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: 'CollectionsPage',
  components: { CollectionCard, DangLoader, CustomButton },
  props: {
    collections: {
      type: Array<ICollection>,
      required: true
    },
    collectionPromise: {
      type: Promise,
      required: true
    },
    accountId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isLoading = ref(true)
    const catComp = shallowRef(null) as Ref<unknown>
    const refCollections = ref([]) as Ref<ICollection[]>
    const confirmDeleteModal = ref(false)
    const colectionDeleteName = ref('')
    const colStore = useCollectionStore()
    const store = useMainStore()
    const delId = ref('')

    colStore.$subscribe(() => {
      refCollections.value = colStore.collections
    })

    onMounted(async () => {
      console.log(props.collections)
      console.log(props.collectionPromise)
      if (!props.collections) {
        const coll = await props.collectionPromise
        if (coll) {
          refCollections.value = coll as ICollection[]
        }
      } else {
        refCollections.value = props.collections
      }
      if (refCollections.value.length < 1) {
        catComp.value = (await import('icons/src/catEmpty.vue')).default
      }
      isLoading.value = false
    })

    const onDeletePress = async (id: string, colName: string) => {
      delId.value = id
      colectionDeleteName.value = colName
      confirmDeleteModal.value = true
    }

    const onDeleteYup = async () => {
      try {
        const reqDelete = await fetchWAuth(store, `${API_BASE}/collections/${delId.value}`, {
          method: 'DELETE'
        })

        if (reqDelete.ok) {
          getCollections(colStore, store.userData.account, true)
          confirmDeleteModal.value = false
          stackAlertSuccess('Collection was successfully deleted.')
        } else {
          stackAlertError(`Server ${await reqDelete.text()}`)
        }
      } catch {
        confirmDeleteModal.value = false
      }
    }

    const onDeleteNay = async () => {
      confirmDeleteModal.value = false
    }

    const modalWasClosed = () => {
      // noting
    }

    return {
      isLoading,
      catComp,
      refCollections,
      confirmDeleteModal,
      colectionDeleteName,
      modalWasClosed,
      onDeletePress,
      refGoTo,
      onDeleteYup,
      onDeleteNay
    }
  }
})
</script>

<style lang="scss"></style>