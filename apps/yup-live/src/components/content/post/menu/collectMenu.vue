<template>
  <o-tooltip
    v-model:active="collectionOpen"
    :triggers="['click', 'contextmenu']"
    :autoClose="['outside', 'escape']"
    :multiline="true"
    position="bottom"
    @click="showAddCollections"
  >
    <template #content>
      <ul class="w-32 text-justify collectMenu">
        <li class="pt-1 cursor-pointer" @click="onNewCollection"><AddIcon class="inline w-5 mr-2 text-[0.9rem]" />New Folder</li>
        <li class="w-55 border-b-1 h-1 mt-1 mb-1">&nbsp;</li>
        <li
          v-for="collection in collectionsStore.collections"
          :key="collection._id"
          class="pt-1 cursor-pointer text-[0.84rem]"
          @click="onAction(collection._id)"
        >
          <AddIcon v-if="isAdd[collection._id]" :key="`is-${inCollKey}`" class="inline ml-1 mr-1 colDmenuIcon" />
          <AddIcon v-else class="inline w-4 ml-1 mr-1" />
          {{ collection.name.length > 32 ? collection.name.slice(0, 29) + '...' : collection.name }}
        </li>
      </ul>
    </template>
    <button class="p-2 m-2 colbutton">Save <CollectIcon class="w-6 inline mr-2" /></button>
  </o-tooltip>
  <o-modal v-model:active="newCollectionModal" contentClass="modal-body grid grid-cols-1 gap-4 content-center" @close="modalWasClosed">
    <h2 class="mt-2 p-4 text-[1.3rem]">Create New Folder</h2>
    <Alert ref="alertComp" class="mx-4" />
    <input v-model="colName" type="text" name="text" placeholder="Collection Name" />
    <textarea v-model="colDesc" name="text" class="mx-auto" placeholder="Description"></textarea>
    <CustomButton class="mx-auto" :icon="refAddIcon" text="Create Collection" @click="onCreateNewCollection" />
  </o-modal>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import CollectIcon from 'icons/src/collect.vue'
import { useMainStore, openConnectModal } from '@/store/main'
import { getCollections, useCollectionStore } from '@/store/collections'
import AddIcon from 'icons/src/add.vue'
import { fetchWAuth } from 'shared/src/utils/auth'
import { stackAlertError, stackAlertSuccess } from '@/store/alertStore'
import CustomButton from 'components/functional/customButton.vue'
import Alert from 'components/functional/alert.vue'
import { OTooltip } from '@oruga-ui/oruga-next'

const API_BASE = import.meta.env.VITE_YUP_API_BASE
const refAddIcon = AddIcon

export default defineComponent({
  name: 'CollectMenu',
  components: {
    CollectIcon,
    AddIcon,
    CustomButton,
    Alert,
    OTooltip
  },
  props: {
    postId: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup(props) {
    const isError = ref(false)
    const isLoading = ref(true)
    const store = useMainStore()
    const isAuth = ref(store.isLoggedIn)
    const collectionOpen = ref(false)
    const collectionsStore = useCollectionStore()
    const isAdd = ref({}) as Ref<Record<string, boolean>>
    const inCollKey = ref(0)
    const newCollectionModal = ref(false)
    const colName = ref('')
    const colDesc = ref('')
    const alertComp = ref(null) as unknown as Ref<typeof Alert>

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn
    })

    const onError = () => {
      isError.value = true
      isLoading.value = false
    }

    const closeMenu = () => {
      setTimeout(() => {
        collectionOpen.value = false
      }, 50)
    }

    const onLoad = () => {
      isLoading.value = false
    }
    const checkIfInCollection = async (): Promise<Record<string, boolean>> => {
      const isInCollection = {} as Record<string, boolean>
      for (const colection of collectionsStore.collections) {
        isInCollection[colection._id] = colection.postIds.some((e) => e === props.postId)
      }
      return isInCollection
    }

    const onAdd = (id: string) => {
      try {
        fetchWAuth(store, `${API_BASE}/collections/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            postId: props.postId
          })
        })
        isAdd.value[id] = true
        stackAlertSuccess('Post was added to the collection')
        closeMenu()
      } catch {
        stackAlertError('API went down')
      }
    }

    watch(collectionsStore, () => {
      checkIfInCollection().then((res) => {
        isAdd.value = res
        inCollKey.value += 1
      })
    })

    const onDelete = async (id: string) => {
      try {
        fetchWAuth(store, `${API_BASE}/collections/remove/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            postId: props.postId
          })
        })
        isAdd.value[id] = false
        stackAlertSuccess('Post was removed from the collection')
        closeMenu()
      } catch {
        stackAlertError('API went down')
      }
    }

    const onAction = async (id: string) => {
      if (isAdd.value[id]) {
        onDelete(id)
      } else {
        onAdd(id)
      }
    }

    const showAddCollections = async () => {
      if (isAuth.value) {
        collectionOpen.value = true
        if (!collectionsStore.collections) {
          await collectionsStore.collectionsPromise
        }
        if (Object.keys(isAdd.value).length < 1) {
          isAdd.value = await checkIfInCollection()
          inCollKey.value += 1
        }
      } else {
        openConnectModal(store)
      }
    }

    const onCreateNewCollection = async () => {
      if (!colName.value && !colDesc.value) {
        alertComp.value?.showErr("If you don't put a description that's on you but name is required!")
        return
      } else if (!colName.value) {
        alertComp.value?.showErr('Name is required for new collection!')
        return
      }
      if (store.userData.account) {
        const createReq = await fetchWAuth(store, `${API_BASE}/collections/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eosname: store.userData.account,
            name: colName.value,
            description: colDesc.value ?? ''
          })
        })
        if (createReq.ok) {
          newCollectionModal.value = false
          stackAlertSuccess('Collection Created')
          getCollections(collectionsStore, store.userData.account, true)
        } else {
          alertComp.value?.showErr('API' + (await createReq.text()))
        }
      }
    }

    const modalWasClosed = async () => {
      newCollectionModal.value = false
    }

    const onNewCollection = async () => {
      newCollectionModal.value = true
    }

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      showAddCollections,
      collectionOpen,
      collectionsStore,
      isAdd,
      inCollKey,
      onAction,
      modalWasClosed,
      onNewCollection,
      newCollectionModal,
      refAddIcon,
      onCreateNewCollection,
      colName,
      colDesc,
      alertComp
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/inputs';
.collectMenu {
  max-height: 26rem;
  max-width: 16rem;
  min-width: 14.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;

  .colDmenuIcon {
    transform: rotate(45deg);
    color: rgba(214, 40, 40, 0.918);
    width: 1.1rem;
    margin-left: 0.2rem;
  }

  li:hover {
    transform: translatex(0.3rem);
    filter: brightness(1.1) sepia(0.6);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

.collectMenu {
  @-moz-document url-prefix() {
    scrollbar-width: thin;
    scrollbar-color: #222 #444;
  }
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(68, 68, 68, 0.623);
}
::-webkit-scrollbar-thumb {
  background: #252525;
}
::-webkit-scrollbar-thumb:hover {
  background: #111;
}

.modal-body {
  @include inputs.inputsShare;
}
</style>