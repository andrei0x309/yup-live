<template>
    <ion-page>
    <HeaderBar text="POST DETAIL" :menu="true" />
    <ion-content :fullscreen="false" class="mt-4">
  <div class="page w-full py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
      <DangLoader v-if="isDataLoading" />
      <template v-else>
      <h2 class="text-center text-[1.1rem]">Post</h2>
      <h2 class="text-center text-[0.9rem] mt-2 mb-4">{{ postId }}</h2>
      <div class="flex flex-col">
      <Post
        :id="postId"
        :full="true"
        :post="processedPost"
        :postTypesPromises="postTypesPromises"
        :deps="postDeps"
        :crossPost="() => import('@/views/CrossPostModal.vue')"
        :mobile="true"
        @updatepostinfo="openInfoModal"
      />
      <div
          v-if="
            processedPost?.web3CreatorProfile &&
            processedPost?.web3CreatorProfil?.noData !== true
          "
          class="min-w-[30vw]"
        >
          <h2 class="mx-auto text-center">Post Creator</h2>
          <Web3ProfileCard
            class="mx-auto"
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
  </template>
</div>
  </div>
  </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, onIonViewDidEnter } from '@ionic/vue'

import {
  defineComponent,
  onUnmounted,
  ref,
  PropType
} from "vue";
import DangLoader from "components/vote-list/loader.vue";
import { useRoute } from "vue-router";
import { postTypesPromises } from "components/post-types/post-types";
import HeaderBar from "@/components/template/header-bar.vue";
import PostMenu from '@/components/post/menu/postMenu.vue'
import type { IPostDeps } from 'shared/src/types/post'
import type { IMainStore } from 'shared/src/types/store'
import { stackAlertError, stackAlertSuccess, stackAlertWarning } from "@/store/alert-store";
import { useMainStore } from "@/store/main";
import Post from 'components/post/post.vue'
import { IPost } from "shared/src/types/post";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import { IWeb3Profile } from 'shared/src/types/web3Profile'
import Web3ProfileCard from 'components/profile/web3ProfileCard.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const postDeps: IPostDeps = {
  stackAlertError,
  stackAlertSuccess,
  stackAlertWarning,
  openConnectModal: () => '',
  useMainStore: useMainStore as unknown as () => IMainStore,
  apiBase: API_BASE,
  PostMenu,
}

const web3Deps = {
  openConnectModal: null as unknown as () => void,
  useMainStore: useMainStore as unknown as () => IMainStore,
  stackAlertWarning,
  stackAlertSuccess,
  apiBase: API_BASE,
};


export default defineComponent({
  name: "PostDetail",
  components: {
    Post,
    DangLoader,
    IonPage, 
    IonContent,
    HeaderBar,
    Web3ProfileCard
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
    // const store = useMainStore()
    const isDataLoading = ref(true);
    const processedPost = ref(props.post as ExIPost);
    const infoModalOpen = ref(false);
    const followersCount = ref(0);


    const openInfoModal = () => {
      infoModalOpen.value = true;
    };

    const getPostbyId = async (postId: string) => {
      const req = await fetch(`${API_BASE}/posts/post/${postId}`);
      if (req.ok) {
        return await req.json();
      } else {
        console.error(req);
      }
    };

    onIonViewDidEnter(async () => {
      if (!props?.post?._id?.postid) {
        processedPost.value = await getPostbyId(postId.value);
        postId.value = processedPost.value._id.postid;

        if (props?.post?.web3CreatorProfile?._id) {
        const userAddr =
          props?.post?.web3CreatorProfile?._id ?? props?.post.previewData?.creator;

        getFollowers(API_BASE, userAddr).then((res: { totalCount: number }) => {
          if (res) {
            followersCount.value = res.totalCount;
          }
        });
      }

        isDataLoading.value = false;
      } else {
        isDataLoading.value = false;
      }
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
      postDeps,
      web3Deps,
      followersCount
    };
  },
});
</script>

<style lang="scss">
.table-list {
  h2 {
    font-weight: 500;
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
