<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto flex">
    <div class="bg-color page-not w-full mb-4 flex flex-col">
      <div v-if="!loading" class="flex flex-col text-center items-center pb-4">
        <h2 class="p-4 tracking-wide uppercase">Collection: {{ collectionData.name }}</h2>
        <div class="flex">
          By
          <AvatarBtn
            :key="collectionData.ownerId"
            class="h-6 w-6 inline-block mx-2"
            :isSelf="false"
            :pAccount="collectionData.ownerId"
            :pSource="collectionData.ownerAvatar"
          />
          <router-link :to="`/profile/${collectionData.ownerId}`">{{ collectionData.ownerId }}</router-link>
        </div>
      </div>
      <template v-if="loading">
        <p class="p-4">Loading collection data</p>
        <DangLoader :unset="true" />
      </template>
      <InfScroll v-else :key="`${loading}-loaded`" :postLoaded="true" @hit="onHit">
        <template #content>
          <div v-if="posts.length > 0" class="flex flex-row mx-auto">
            <div class="flex flex-col">
              <Post
                v-for="post of posts"
                :id="(post as Record<string, any>)._id.postid"
                :key="(post  as Record<string, any>)._id.postid"
                :post="(post as Record<string, any>)"
                :postTypesPromises="postTypesPromises"
                :isHidenInfo="(post  as Record<string, any>)._id.postid === (postInfo as Record<string, any>)._id.postid"
                @updatepostinfo="
                  (postid: string) => {
                    postInfo = posts.find((p: any): boolean => postid === p._id.postid)
                  }
                "
              />
              <LineLoader v-if="feedLoading" class="w-full h-2 m-8" />
            </div>
            <PostInfo
              :key="(postInfo as Record<string, any>)._id.postid"
              class="hidden lg:flex"
              :post="(postInfo as Record<string, any>)"
            />
          </div>
          <div v-else>
            <h2 class="text-[1.3rem] mt-4 uppercase">This collection is empty :(</h2>
            <component :is="catComp" v-if="catComp !== null" class="max-w-120 w-10 mx-auto" />
          </div>
        </template>
      </InfScroll>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from '@/components/content/vote-list/loader.vue'
import { useRoute } from 'vue-router'
import InfScroll from '@/components/functional/inf-scroll/infScroll.vue'
import Post from '@/components/content/post/post.vue'
import { postTypesPromises } from '@/utils/post'
import AvatarBtn from '@/components/content/connect/avatarBtn.vue'
import PostInfo from '@/components/content/post/postInfo.vue'

// import { useMainStore } from '@/store/main'
export default defineComponent({
  name: 'Collection',
  components: {
    DangLoader,
    InfScroll,
    AvatarBtn,
    Post,
    PostInfo
  },
  setup() {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    const loading = ref(true)
    const collectionData = ref({}) as unknown as Ref<{ ownerId: string; ownerAvatar: string; name: string }>
    const catComp = ref(null) as Ref<unknown>
    const feedLoading = ref(false)
    // const search = ref("");
    // const store = useMainStore();

    const route = useRoute()
    const collectionId = route.params.collectionId as string
    const posts = ref([]) as Ref<Array<unknown>>
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>
    let allPosts: Array<unknown> = []

    const siteData = reactive({
      title: ``,
      description: ``
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    const getCollectionPosts = async () => {
      const res = await fetch(`${API_BASE}/collections/name/${collectionId}`)
      const data = await res.json()
      collectionData.value.ownerAvatar = data.ownerAvatar
      collectionData.value.ownerId = data.ownerId
      collectionData.value.name = data.name
      return data.posts.reverse()
    }

    const getJsPaginatedPosts = (index: number) => {
      return allPosts.slice(index, index + 10)
    }

    const onHit = async (type: string) => {
      feedLoading.value = true
      if (type === 'up' && posts.value.length <= 30) {
        return
      } else if (type === 'up' && postsIndex.value >= 30) {
        postsIndex.value -= 10
        const newPosts = getJsPaginatedPosts(postsIndex.value - 30)
        posts.value = [...newPosts, ...posts.value.slice(-30)]
      } else if (type === 'down' && posts.value.length <= 30) {
        postsIndex.value += 10
        const newPosts = getJsPaginatedPosts(postsIndex.value)
        posts.value = [...posts.value, ...newPosts]
      } else if (type === 'down' && posts.value.length >= 30) {
        postsIndex.value += 10
        const newPosts = getJsPaginatedPosts(postsIndex.value)
        posts.value = [...posts.value.slice(10), ...newPosts]
      }
      // console.log(postsIndex.value, (posts.value[0] as { _id: any })._id, posts.value.length)
      feedLoading.value = false
    }

    onMounted(async () => {
      allPosts = await getCollectionPosts()
      posts.value = getJsPaginatedPosts(postsIndex.value)
      if (posts.value.length < 1) {
        catComp.value = (await import('@/components/content/icons/catEmpty.vue')).default
      } else {
        if (!postInfo.value) {
          postInfo.value = posts.value[0]
        }
      }
      loading.value = false
    })

    return {
      onHit,
      loading,
      postTypesPromises,
      posts,
      collectionData,
      postInfo,
      feedLoading,
      catComp
    }
  }
})
</script>

<style lang="scss">
.page-not {
  min-height: calc(100vh - 2rem);
}
</style>