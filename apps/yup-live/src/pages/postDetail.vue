<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4 min-h-[75vh] flex justify-start">
      <h2 class="mb-4">Post: {{ postId }}</h2>
      <DangLoader v-if="isDataLoading" />
      <Post v-else :id="postId" :full="true" :post="processedPost" :postTypesPromises="postTypesPromises" class="w-full max-w-[60rem]" @updatepostinfo="openInfoModal" />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from 'components/vote-list/loader.vue'
import { useRoute } from 'vue-router'
import Post from '@/components/content/post/post.vue'
import { postTypesPromises } from 'components/post-types/post-types'

// import { useMainStore } from '@/store/main'

export default defineComponent({
  name: 'PostDetail',
  components: {
    DangLoader,
    Post
  },
  props: {
    post: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup(props) {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    const route = useRoute()
    const postId = ref(route.params.postId as string)
    // const store = useMainStore()
    const isDataLoading = ref(true)
    const processedPost = ref(props.post)
    const infoModalOpen = ref(false)

    const openInfoModal = () => {
      infoModalOpen.value = true
    }

    const siteData = reactive({
      title: `YUP Live Article: ${processedPost.value?.previewData?.title ?? ''}`,
      description: `View contents of article with title: ${processedPost.value?.previewData?.title ?? ''}`
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'og:description',
          content: computed(() => siteData.description)
        },
        {
          name: 'og:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: computed(() => route.fullPath)
        },
        {
          name: 'twitter:title',
          content: computed(() => siteData.title)
        },
        {
          name: 'twitter:description',
          content: computed(() => siteData.description)
        }
      ]
    } as unknown as Ref<HeadObject>)

    const getPostbyId = async (postId: string) => {
      const req = await fetch(`${API_BASE}/posts/post/${postId}`)
      if (req.ok) {
        return await req.json()
      } else {
        console.error(req)
      }
    }

    onMounted(async () => {
      if (!props?.post?._id?.postid) {
        processedPost.value = await getPostbyId(postId.value)
        console.log(processedPost.value)
        postId.value = processedPost.value._id.postid
        isDataLoading.value = false
      } else {
        isDataLoading.value = false
      }
      siteData.description = processedPost.value.previewData?.description
      siteData.title = `YUP LIVE - ${processedPost.value.previewData?.title}`
    })

    onUnmounted(() => {
      // do nothing
    })

    return {
      isDataLoading,
      processedPost,
      postId,
      postTypesPromises,
      openInfoModal
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
