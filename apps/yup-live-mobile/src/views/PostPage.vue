<template>
    <ion-page>
    <HeaderBar text="POST DETAIL" :menu="true" />
    <ion-content :fullscreen="false" class="ion-padding mt-4">
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
      <DangLoader v-if="isDataLoading" />
      <template v-else>
      <h2 class="text-center text-[1.4rem]">Post</h2>
      <h2 class="text-center text-[1.1rem] mt-2 mb-4">{{ postId }}</h2>
      <Post
        :id="postId"
        :full="true"
        :post="processedPost"
        :postTypesPromises="postTypesPromises"
        @updatepostinfo="openInfoModal"
      />
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
} from "vue";
import DangLoader from "components/vote-list/loader.vue";
import { useRoute } from "vue-router";
import Post from "@/components/copy/post/post.vue";
import { postTypesPromises } from "@/components/copy/post/post-types";
import HeaderBar from "@/components/template/header-bar.vue";

import { config } from "shared/src/utils/config";
const { API_BASE } = config;

export default defineComponent({
  name: "PostDetail",
  components: {
    Post,
    DangLoader,
    IonPage, 
    IonContent,
    HeaderBar
  },
  props: {
    post: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    const route = useRoute();
    const postId = ref(route.params.postId as string);
    // const store = useMainStore()
    const isDataLoading = ref(true);
    const processedPost = ref(props.post);
    const infoModalOpen = ref(false);

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
        console.log('zzzz', postId.value, route.params)
        processedPost.value = await getPostbyId(postId.value);
        console.log(processedPost.value);
        postId.value = processedPost.value._id.postid;
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
