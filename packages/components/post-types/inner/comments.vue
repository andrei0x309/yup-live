<template>
  <div v-if="LComments?.length > 0" class="p-2 flex-col">
    <h2 class="pl-4 text-left">Comments:</h2>
    <Post
      :deps="deps"
      v-for="comment in LComments"
      :key="comment.lensId"
      :post="comment"
      :crossPost="crossPost"
      :postTypesPromises="postTypesPromises"
      :isComment="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import type { IPostDeps } from "shared/src/types/post";
import Post from "../../post/post.vue";
// import { IPost } from 'shared/src/types/post'

export default defineComponent({
  name: "PostComments",
  components: { Post },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({}),
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
    }
  },
  setup(props) {
    const LComments = ref(props.comments ?? []);

    return {
      LComments,
    };
  },
});
</script>
