<template>
  <div class="page lg:max-width-90 md:max-width-60 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4 min-h-[75vh] flex justify-start">
      <div class="flex">
        <div>
          <h2 class="mb-4 text-[1.2rem]">
            Post UUIDv4: <span class="opacity-80 text-[1.1rem]">{{ postId }}</span>
          </h2>
          <DangLoader v-if="isDataLoading" />
          <Post
            v-else
            :id="postId"
            :full="true"
            :post="processedPost"
            :postTypesPromises="postTypesPromises"
            class="w-full max-w-[60rem]"
            :deps="postDeps"
            :castModal="() => import('@/components/content/post/sendCastModal.vue')"
            @updatepostinfo="openInfoModal"
          />
        </div>
        <div
          v-if="
            processedPost?.web3CreatorProfile &&
            processedPost?.web3CreatorProfil?.noData !== true
          "
          class="hidden lg:block min-w-[21rem]"
        >
          <h2 class="mb-4">Post Creator</h2>
          <Web3ProfileCard
            class="ml-8"
            :web3Profile="(processedPost.web3CreatorProfile as IWeb3Profile) ?? null"
            :overWriteEVM="
              processedPost.tag === 'farcaster' && processedPost?.previewData?.creator
                ? processedPost?.previewData?.creator
                : undefined
            "
            :followersCount="followersCount"
            :deps="web3Deps"
            :addViewBtn="true"
          />
        </div>
      </div>
    </div>
    <o-modal v-model:active="infoModalOpen" contentClass="modal-body">
      <h2 class="text-[1.4rem] p-4">Post Info</h2>
      <ul class="m-auto">
        <li class="p-2"><span class="font-bold">Post ID:</span> {{ postId }}</li>
        <li class="p-2"><span class="font-bold">Type:</span> {{ processedPost?.tag }}</li>
        <li class="p-2">
          <span class="font-bold">Creator:</span>
          {{ processedPost?.previewData?.creator }}
        </li>
        <li class="p-2">
          <span class="font-bold">Positive Weight:</span>
          {{ processedPost?.rawPositiveWeight ?? processedPost?.positiveWeight ?? 0 }}
        </li>
        <li class="p-2">
          <span class="font-bold">Negative Weight:</span>
          {{ processedPost?.rawNegativeWeight ?? processedPost?.negativeWeight ?? 0 }}
        </li>
        <li class="p-2">
          <span class="font-bold">Total Likes:</span>
          {{ processedPost?.catVotes?.overall?.up ?? 0 }}
        </li>
        <li class="p-2">
          <span class="font-bold">Total Dislikes:</span>
          {{ processedPost?.catVotes?.overall?.down ?? 0 }}
        </li>
        <li class="p-2">
          <span class="font-bold">Total Creator Rewards:</span>
          {{ processedPost?.totalCreatorRewards ?? 0 }}
        </li>
      </ul>
    </o-modal>
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
  PropType
} from "vue";
import { useHead, HeadObject } from "@vueuse/head";
import DangLoader from "components/vote-list/loader.vue";
import { useRoute } from "vue-router";
import { postTypesPromises } from "components/post-types/post-types";
import Web3ProfileCard from "components/profile/web3ProfileCard.vue";
import { stackAlertSuccess, stackAlertWarning, stackAlertError } from "@/store/alertStore";
import Post from "components/post/post.vue";
import type { IPost } from "shared/src/types/post";
import { useMainStore, openConnectModal } from "@/store/main";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import { IPostDeps } from 'shared/src/types/post'
import type { IMainStore } from "shared/src/types/store";
import PostMenu from '@/components/content/post/menu/postMenu.vue'
import CollectMenu from '@/components/content/post/menu/collectMenu.vue'
import { IWeb3Profile } from 'shared/src/types/web3Profile'
import { OTooltip } from '@oruga-ui/oruga-next'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const postDeps: IPostDeps = {
      stackAlertError,
      stackAlertSuccess,
      stackAlertWarning,
      openConnectModal,
      useMainStore: useMainStore as unknown as () => IMainStore,
      apiBase: API_BASE,
      PostMenu: PostMenu,
      CollectMenu: CollectMenu,
      ToolTip: OTooltip
    }

const web3Deps = {
  openConnectModal,
  useMainStore: useMainStore as unknown as () => IMainStore,
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
    type  ExIPost  =  IPost  &  {  web3CreatorProfile:  IWeb3Profile  |  null  |  undefined  }
    const route = useRoute();
    const postId = ref(route.params.postId as string);
    const isDataLoading = ref(true);
    const processedPost = ref(props.post as ExIPost);
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
      infoModalOpen,
      postDeps
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
