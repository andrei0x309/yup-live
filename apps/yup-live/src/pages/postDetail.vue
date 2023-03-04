<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4 min-h-[75vh] flex justify-start">
      <div class="flex">
      <div>
        <h2 class="mb-4  text-[1.2rem]">Post UUIDv4: <span class="opacity-80 text-[1.1rem]">{{ postId }}</span></h2>
        <DangLoader v-if="isDataLoading" />
        <Post
          v-else
          :id="postId"
          :full="true"
          :post="processedPost"
          :postTypesPromises="postTypesPromises"
          class="w-full max-w-[60rem]"
          @updatepostinfo="openInfoModal"
        />
      </div>
      <div  v-if="processedPost?.web3CreatorProfile && processedPost?.web3CreatorProfil?.noData !== true">
        <h2 class="mb-4">Post Creator</h2>
        <Web3ProfileCard
           class="ml-8"
          :web3Profile="(processedPost.web3CreatorProfile as unknown as IWeb3Profile) ?? null"
          :followersCount="followersCount"
          :deps="web3Deps"
        />
      </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  reactive,
  computed,
  onUnmounted,
  Ref,
  ref,
  PropType,
} from "vue";
import { useHead, HeadObject } from "@vueuse/head";
import DangLoader from "components/vote-list/loader.vue";
import { useRoute } from "vue-router";
import Post from "@/components/content/post/post.vue";
import { postTypesPromises } from "components/post-types/post-types";
import Web3ProfileCard from "components/profile/web3ProfileCard.vue";
import { stackAlertSuccess, stackAlertWarning } from "@/store/alertStore";
import type { IPost } from "shared/src/types/post";
import { useMainStore, openConnectModal } from "@/store/main";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import type { IWeb3Profile } from "shared/src/types/web3Profile";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const web3Deps = {
  openConnectModal,
  useMainStore,
  stackAlertWarning,
  stackAlertSuccess,
  apiBase: API_BASE,
};

export default defineComponent({
  name: "PostDetail",
  components: {
    DangLoader,
    Post,
    Web3ProfileCard,
  },
  props: {
    post: {
      type: Object as PropType<IPost>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    const route = useRoute();
    const postId = ref(route.params.postId as string);
    const isDataLoading = ref(true);
    const processedPost = ref(props.post);
    const infoModalOpen = ref(false);
    const followersCount = ref(0);

    const openInfoModal = () => {
      infoModalOpen.value = true;
    };

    const siteData = reactive({
      title: `YUP Live Article: ${processedPost.value?.previewData?.title ?? ""}`,
      description: `View contents of article with title: ${
        processedPost.value?.previewData?.title ?? ""
      }`,
    });

    useHead(({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
      meta: [
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-default.png`,
        },
        {
          name: "description",
          content: computed(() => siteData.description),
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:title",
          content: computed(() => siteData.title),
        },
        {
          name: "og:description",
          content: computed(() => siteData.description),
        },
        {
          name: "og:url",
          content: computed(() => route.fullPath),
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:url",
          content: computed(() => route.fullPath),
        },
        {
          name: "twitter:title",
          content: computed(() => siteData.title),
        },
        {
          name: "twitter:description",
          content: computed(() => siteData.description),
        },
      ],
    } as unknown) as Ref<HeadObject>);

    const getPostbyId = async (postId: string) => {
      const req = await fetch(`${API_BASE}/posts/post/${postId}`);
      if (req.ok) {
        return await req.json();
      } else {
        console.error(req);
      }
    };

    onMounted(async () => {
      if (!props?.post?._id?.postid) {
        processedPost.value = await getPostbyId(postId.value);
        console.log(processedPost.value);
        postId.value = processedPost.value._id.postid;
        isDataLoading.value = false;
      } else {
        isDataLoading.value = false;
      }
      if (props?.post?.web3CreatorProfile?._id) {
        const userAddr =
          props?.post?.web3CreatorProfile?._id ?? props?.post.previewData?.creator;

        getFollowers(API_BASE, userAddr).then((res: { totalCount: number }) => {
          if (res) {
            followersCount.value = res.totalCount;
          }
        });
      }
      siteData.description =
        processedPost.value.previewData?.description ?? "Atricle on YUP";
      siteData.title = `YUP LIVE - ${processedPost.value.previewData?.title}`;
    });

    onUnmounted(() => {
      // do nothing
    });

    return {
      isDataLoading,
      processedPost,
      postId,
      postTypesPromises,
      openInfoModal,
      web3Deps,
      followersCount,
    };
  },
});
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
