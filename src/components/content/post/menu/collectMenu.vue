<template>
  <o-tooltip
    v-model:active="collectionOpen"
    :triggers="['click', 'contextmenu']"
    :autoClose="['outside', 'escape']"
    :multiline="true"
    @click="showAddCollections"
  >
    <template #content>
      <ul class="w-30 text-justify collectMenu">
        <li class="pt-1 cursor-pointer"><AddIcon class="inline w-5 mr-2" />New collection</li>
        <li class="w-55 border-b-1 h-1 mt-1 mb-1">&nbsp;</li>
        <li v-for="collection in collectionsStore.collections" :key="collection._id" class="pt-1 cursor-pointer">
          <AddIcon class="inline w-5 mr-2" />{{ collection.name.length > 32 ? collection.name.slice(0, 29) + '...' : collection.name }}
        </li>
      </ul>
    </template>
    <button class="p-2 m-2 colbutton">Collect <CollectIcon class="w-6 inline mr-2" /></button>
  </o-tooltip>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import CollectIcon from '@/components/content/icons/collect.vue'
import { useMainStore, openConnectModal } from '@/store/main'
import { useCollectionStore } from '@/store/collections'
import AddIcon from '@/components/content/icons/add.vue'
// import DeleteIcon from '@/components/content/icons/delete.vue'

export default defineComponent({
  name: 'CollectMenu',
  components: {
    CollectIcon,
    AddIcon
  },
  props: {
    postId: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup() {
    const isError = ref(false)
    const isLoading = ref(true)
    const store = useMainStore()
    const isAuth = ref(store.isLoggedIn)
    const collectionOpen = ref(false)
    const collectionsStore = useCollectionStore()

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn
    })

    const onError = () => {
      isError.value = true
      isLoading.value = false
      console.log('error', isError.value)
    }

    const onLoad = () => {
      isLoading.value = false
      console.log('onload', isLoading.value)
    }

    onMounted(() => {
      // nothing
    })

    const showAddCollections = async () => {
      if (isAuth.value) {
        collectionOpen.value = true
        if (!collectionsStore.collections) {
          await collectionsStore.collectionsPromise
        }
      } else {
        openConnectModal(store)
      }
    }

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      showAddCollections,
      collectionOpen,
      collectionsStore
    }
  }
})
</script>

<style scoped lang="scss">
.collectMenu {
  height: 26rem;
  max-width: 16rem;
  min-width: 14.5rem;
  font-size: 0.9rem;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;

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
</style>