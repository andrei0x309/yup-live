<template>
  <div class="flex items-center p-4 border-1 rounded-lg shadow-sm">
    <ImagePreview
      :alt="'collection ' + collectionInfo?.name"
      class="w-36 h-36 min-w-36 min-h-36 rounded-md border-1"
      :source="[collectionInfo?.imgSrcUrl]"
      :noPreviewParagraph="false"
      imgClass="w-36 h-36 object-cover"
      :noLightbox="true"
      :noBorder="true"
    />
    <div id="body" class="flex flex-col ml-5 w-full">
      <h4 id="name" class="text-xl font-semibold mb-2">{{ collectionInfo?.name }}</h4>
      <p class="mt-2">
        {{ collectionInfo?.description || "Doesn't have any description" }}
      </p>
      <div class="flex mt-5">
        <router-link :to="`/collection/${collectionInfo?._id}`" class="w-20 p-2 pointer"
          ><RadarIcon class="w-4 inline mr-1" />View</router-link
        >
        <button class="p-2 pointer w-20"><ShareIcon class="w-4 inline mr-1" />Share</button>
      </div>
      <div v-if="isOwner" class="flex mt-1">
        <button class="p-2 pointer w-20"><SettingsIcon class="w-4 inline mr-1" />Edit</button>
        <button class="p- pointer w-20" @click="deletecol(collectionInfo?._id, collectionInfo?.name)">
          <DeleteIcon class="w-5 inline mr-1" />Delete
        </button>
      </div>
      <div class="flex flex-row mt-5">
        <p v-if="collectionInfo?.createdAt" class="text-[0.9rem] opacity-70">
          <DateIcon class="w-5 inline mr-2" />Created: {{ new Date(Number(collectionInfo.createdAt)).toLocaleDateString() }}
        </p>
        <p v-if="collectionInfo?.lastUpdated" class="text-[0.9rem] opacity-70 ml-auto">
          <DateIcon class="w-5 inline mr-2" /> Last updated {{ new Date(Number(collectionInfo.lastUpdated)).toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import ImagePreview from 'components/post/imagePreview.vue'
import { useMainStore } from '@/store/main'
import DeleteIcon from 'icons/src/delete.vue'
import RadarIcon from 'icons/src/radar.vue'
import ShareIcon from 'icons/src/share.vue'
import SettingsIcon from 'icons/src/settings.vue'
import DateIcon from 'icons/src/date.vue'

export default defineComponent({
  name: 'CollectionsPage',
  components: { ImagePreview, DeleteIcon, RadarIcon, ShareIcon, SettingsIcon, DateIcon },
  props: {
    collectionInfo: {
      type: Object,
      required: true
    }
  },
  emits: ['deletecol'],
  setup(props, ctx) {
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

    const deletecol = (id: string, name: string) => {
      ctx.emit('deletecol', id, name)
    }

    onMounted(async () => {
      // do nothing
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      isOwner,
      deletecol
    }
  }
})
</script>

<style lang="scss" scoped></style>