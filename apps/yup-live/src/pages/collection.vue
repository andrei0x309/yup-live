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
              <component :is="loadLinerComp" v-if="feedLoading && loadLinerComp" class="w-full h-2 m-8" />
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
import { onMounted, defineComponent, reactive, computed, onUnmounted, Ref, ref, shallowRef } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import DangLoader from 'components/vote-list/loader.vue'
import { useRoute } from 'vue-router'
import InfScroll from 'components/functional/inf-scroll/infScroll.vue'
import Post from '@/components/content/post/post.vue'
import { postTypesPromises } from '@/utils/post'
import AvatarBtn from 'components/functional/avatarBtn.vue'
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
    const loadLinerComp = shallowRef(null) as Ref<unknown>
    // const search = ref("");
    // const store = useMainStore();

    const route = useRoute()
    const collectionId = route.params.collectionId as string
    const posts = ref([]) as Ref<Array<unknown>>
    const postsIndex = ref(0)
    const postInfo = ref(null) as Ref<unknown>

    const siteData = reactive({
      title: `YUP Collection: ${collectionData.value.name ?? ''}`,
      description: `View posts in YUP collection with name ${collectionData.value.name ?? ''}`
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

    onUnmounted(() => {
      // do nothing
    })


    const getCollectionInfo = async () => {
      const res = await fetch(`${API_BASE}/collections/name-v2/${collectionId}`)
      const data = await res.json()
      collectionData.value.ownerAvatar = data.ownerAvatar
      collectionData.value.ownerId = data.ownerId
      collectionData.value.name = data.name
    }

    const getCollectionPosts = async (index = 0) => {
      try {
        const res = await fetch(`${API_BASE}/collections/posts/${collectionId}?start=${index}&limit=10&reverse=true`)
        return await res.json()
      } catch (err) {
        return []
      }
    }

    const onHit = async (type: string) => {
      feedLoading.value = true
      if (type === 'up' && posts.value.length <= 30) {
        return
      } else if (type === 'up' && postsIndex.value >= 30) {
        postsIndex.value -= 10
        const newPosts = await getCollectionPosts(postsIndex.value - 30)
        posts.value = [...newPosts, ...posts.value.slice(-30)]
      } else if (type === 'down' && posts.value.length <= 30) {
        postsIndex.value += 10
        const newPosts = await getCollectionPosts(postsIndex.value)
        posts.value = [...posts.value, ...newPosts]
      } else if (type === 'down' && posts.value.length >= 30) {
        postsIndex.value += 10
        const newPosts = await getCollectionPosts(postsIndex.value)
        posts.value = [...posts.value.slice(10), ...newPosts]
      }
      // console.log(postsIndex.value, (posts.value[0] as { _id: any })._id, posts.value.length)
      feedLoading.value = false
    }

    onMounted(async () => {
      const p1 = getCollectionInfo()
      const p2 = getCollectionPosts()
      p2.then(async (r) => {
        posts.value = r
        if (posts.value.length < 1) {
          catComp.value = (await import('@/components/content/icons/catEmpty.vue')).default
        } else {
          if (!postInfo.value) {
            postInfo.value = posts.value[0]
          }
        }
      })
      Promise.allSettled([p1, p2]).then(() => (loading.value = false))
      import('components/functional/lineLoader.vue').then((r) => {
        loadLinerComp.value = r.default
      })
    })

    return {
      onHit,
      loading,
      postTypesPromises,
      posts,
      collectionData,
      postInfo,
      feedLoading,
      catComp,
      loadLinerComp
    }
  }
})
</script>

<style lang="scss">
.page-not {
  min-height: calc(100vh - 2rem);
}
</style>