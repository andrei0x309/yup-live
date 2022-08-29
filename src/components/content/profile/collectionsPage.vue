<template>
  <h2>{{ accountId }} Collections</h2>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <CollectionCard v-for="collection of collections" :key="collection._id" :collectionInfo="collection" />
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import { ICollection } from '@/types/store'
import CollectionCard from './collectionCard.vue'

export default defineComponent({
  name: 'CollectionsPage',
  components: { CollectionCard },
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
    const isError = ref(false)
    const isLoading = ref(true)

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
      console.log(props.collections)
      console.log(props.collectionPromise)
      if (!props.collections) {
        await props.collectionPromise
      }
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError
    }
  }
})
</script>

<style lang="scss"></style>