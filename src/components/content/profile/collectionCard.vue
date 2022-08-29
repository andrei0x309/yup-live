<template>
  <div class="flex items-center p-4 border-1 rounded-lg shadow-sm">
    <ImagePreview
      :alt="'collection ' + collectionInfo?.name"
      class="w-36 h-36 min-w-36 min-h-36 rounded-md border-1"
      :source="collectionInfo?.imgSrcUrl"
      :noPreviewParagraph="false"
      imgClass="w-36 h-36 object-cover"
    />
    <div id="body" class="flex flex-col ml-5">
      <h4 id="name" class="text-xl font-semibold mb-2">{{ collectionInfo?.name }}</h4>
      <p class="mt-2">
        {{ collectionInfo?.description || "Doesn't have any description" }}
      </p>
      <div class="flex mt-5">
        <button>View</button>
        <button>Share</button>
        <template v-if="isOwner">
          <button>Edit</button>
          <button>Delete</button>
        </template>
      </div>
      <div class="flex mt-5">
        <p v-if="collectionInfo?.createdAt">Created: {{ new Date(Number(collectionInfo.createdAt)).toLocaleDateString() }}</p>
        <p v-if="collectionInfo?.lastUpdated">Last updated {{ new Date(Number(collectionInfo.lastUpdated)).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import ImagePreview from '@/components/content/post/imagePreview.vue'
import { useMainStore } from '@/store/main'

export default defineComponent({
  name: 'CollectionsPage',
  components: { ImagePreview },
  props: {
    collectionInfo: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const isError = ref(false)
    const isLoading = ref(true)
    const store = useMainStore()
    const isOwner = ref(props.collectionInfo.owner === store.userData.account)

    const onError = () => {
      isError.value = true
      isLoading.value = false
      console.log('error', isError.value)
    }

    const onLoad = () => {
      isLoading.value = false
      console.log('onload', isLoading.value)
    }

    onMounted(async () => {
      // do nothing
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      isOwner
    }
  }
})
</script>

<style lang="scss" scoped></style>