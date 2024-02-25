<template>
  <div v-if="LComments?.length > 0" class="p-2 flex-col">
    <h2 class="pl-4 text-left">Comments:</h2>
    <InfScroll :key="`${postId}-loaded`" :postLoaded="!!postId" @hit="onHit">
      <template #content>
    <Post
      :deps="deps"
      v-for="comment in LComments"
      :key="comment.lensId"
      :post="comment"
      :crossPost="crossPost"
      :postTypesPromises="postTypesPromises"
      :isComment="true"
    />
    </template> 
  </InfScroll>
  <LineLoader v-if="!feedLoaded" class="w-full h-2 m-8" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import type { IPostDeps } from "shared/src/types/post";
import Post from "../../post/post.vue";
import InfScroll from "components/functional/inf-scroll/infScroll.vue";
import { getComments } from "shared/src/utils/requests/comments";
import LineLoader from "components/functional/lineLoader.vue";
     
export default defineComponent({
  name: "PostComments",
  components: { Post, InfScroll, LineLoader },
  props: {
    postId: {
      required: false,
      type: String,
      default: null,
    },
    comments: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    full: {
      type: Boolean,
      default: false,
    },
    deps: {
      type: Object as PropType<IPostDeps>,
      required: true,
    },
    crossPost: {
      type: Function as PropType<() => Promise<{ default: any }> | undefined>,
      required: false,
      default: undefined,
    },
    postTypesPromises: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const LComments = ref(props.comments ?? []);
    const hasNoMore = ref((props.comments?.length ?? 0) < 10);
    const feedLoaded = ref(true);


    const onHit = async (type: string) => {
      if (hasNoMore.value || !props.postId) {
        return;
      }
      feedLoaded.value = false;
      if (type === "down") {
        LComments.value = [...LComments.value, ...((await getComments({
          postId: props?.postId ?? '',
          apiBase: props.deps.apiBase,
          limit: 10,
          skip: LComments?.value?.length ?? 0,
        }))?.comments ?? [])];
      }
      feedLoaded.value = true;
    };

    return {
      LComments,
      onHit,
      feedLoaded
    };
  },
});
</script>
