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
      <CollectionCard v-for="collection of refCollections" :key="collection._id" :collectionInfo="collection" />
    </div>
  </template>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import { ICollection } from '@/types/store'
import CollectionCard from './collectionCard.vue'
import DangLoader from '@/components/content/vote-list/loader.vue'

export default defineComponent({
  name: 'CollectionsPage',
  components: { CollectionCard, DangLoader },
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
    const catComp = ref(null) as Ref<unknown>
    const refCollections = ref([]) as Ref<ICollection[]>

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
        catComp.value = (await import('@/components/content/icons/catEmpty.vue')).default
      }
      isLoading.value = false
    })

    return {
      isLoading,
      catComp,
      refCollections
    }
  }
})
</script>

<style lang="scss"></style>