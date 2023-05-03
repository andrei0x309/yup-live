<template>
  <div :class="`flex justify-between m-1 md:m-6 flex-row pPost ${postTypeClass}`">
    <div
      class="flex flex-col max-w-2xl mx-auto postCard w-full min-w-[20rem]"
      :style="full && post.tag === 'mirror' ? 'max-width: 56rem;' : ''"
    >
      <component
        :is="!postTypeLoading ? postTypeCom : undefined"
        :key="`post-loaded-${postTypeLoading}|${comments.length}`"
        :full="full"
        :post="processedPost"
        :comments="post.tag === 'farcaster' ? comments : undefined"
        :replyComp="replyComp ? replyComp : undefined"
        :deps="deps"
      />
      <div class="flex flex-row items-end w-full px-4 mt-4">
        <div class="flex border-t border-stone-400 dark:border-stone-600 w-full py-4">
          <div
            v-if="!noYUPPost"
            class="flex items-center gap-x-2 border-r border-stone-400 dark:border-stone-600 w-full pl-2"
          >
            <Voting
              :key="`${processedPost.title}${votingKey}`"
              v-model:vote="refHasVote"
              :postId="processedPost.id"
              :positiveWeight="processedPost.positiveWeight"
              :negativeWeight="processedPost.negativeWeight"
              :hasVote="refHasVote"
              :deps="deps"
              :mobile="mobile"
              :toolTipComponent="deps.ToolTip"
            />
            <div class="flex ml-auto">
              <router-link
                v-if="commentsNum > 2"
                class="mr-2"
                :to="`/post/${processedPost.id}`"
                ><ComentsIcon class="inline-block w-5 mr-2" />{{
                  commentsNum
                }}</router-link
              >
              <router-link v-else-if="!full" :to="`/post/${processedPost.id}`"
                ><RadarIcon class="inline-block w-4 mr-2"
              /></router-link>
              <InfoIcon
                v-if="!isHidenInfo"
                class="hidden w-5 lg:flex ml-2 mr-4 cursor-pointer"
                @click="updatePostInfo"
              />
            </div>
          </div>
          <div class="flex items-center flex-shrink-0 px-2">
            <div v-if="!noYUPPost" class="flex items-center space-x-1">
              <component
                v-if="deps.CollectMenu"
                v-bind:is="deps.CollectMenu"
                :key="deps.CollectMenu"
                :postId="processedPost.id"
              />
              <component
                v-if="deps.PostMenu"
                :key="`${menuKey}-${deps.PostMenu}`"
                v-bind:is="deps.PostMenu"
                v-model:vote="refHasVote"
                :postId="processedPost.id"
                :postShareInfo="postShareInfo"
                :hasVote="refHasVote"
                @deletedvote="hasVoteDeleted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  Ref,
  shallowRef,
  watch,
  PropType,
} from "vue";
import ImagePreview from "components/post/imagePreview.vue";
import Voting from "components/post/voting.vue";
import FavIco from "components/post/favIco.vue";
import ClockIcon from "icons/src/clock.vue";
import InfoIcon from "icons/src/infoIcon.vue";
import { hasVote } from "shared/src/utils/requests/vote";
import type { Vote } from "shared/src/types/vote";
import ComentsIcon from "icons/src/comments.vue";
import RadarIcon from "icons/src/radar.vue";
import { processPost } from "shared/src/utils/post";
import type { IPost, IProcessedPost } from "shared/src/types/post";
import { useRoute } from "vue-router";
import type { Web3LensRaw } from "shared/src/types/web3";
import type { IPostDeps } from "shared/src/types/post";

export default defineComponent({
  name: "Post",
  components: {
    ImagePreview,
    ClockIcon,
    Voting,
    FavIco,
    InfoIcon,
    ComentsIcon,
    RadarIcon,
  },
  props: {
    post: {
      required: false,
      type: Object as PropType<IPost>,
      default: () => ({}),
    },
    isHidenInfo: {
      type: Boolean,
      default: false,
    },
    postTypesPromises: {
      type: Object,
      required: true,
    },
    full: {
      type: Boolean,
      required: false,
    },
    noYUPPost: {
      type: Boolean,
      required: false,
      default: false,
    },
    mobile: {
      type: Boolean,
      required: false,
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
  },
  emits: ["updatepostinfo"],
  setup(props, ctx) {
    const postTypeCom: Ref<ReturnType<typeof defineComponent>> = shallowRef(undefined);
    const route = useRoute();
    const nested = (route.query.nested as string) ?? "";

    const processedPost = (reactive({
      id: "",
      title: "",
      content: "",
      image: "",
      createdAt: "",
      url: "",
      isVideo: false,
      videoType: "",
      positiveWeight: 0,
      negativeWeight: 0,
      tweetInfo: {},
      web3Preview: {},
      web3CreatorProfile: null,
      //   isMirror: false,
      //   isWeb3: false,
      //   isTwitter: false,
    }) as unknown) as IProcessedPost;

    const store = props?.deps?.useMainStore();
    const postTypeLoading = ref(true);
    const postShareInfo = (reactive({}) as unknown) as {
      url: string;
      title: string;
      text: string;
    };
    const postTypeClass = ref("");
    const refHasVote = ref(
      store.isLoggedIn
        ? hasVote(props.post._id.postid, store.userData.account)
        : Promise.resolve([])
    ) as Ref<Promise<Vote[]>>;
    const cloneWeights = ({} as unknown) as {
      positiveWeight: number;
      negativeWeight: number;
    };
    // const hasComments = ref(false)
    // const commentsCount = ref(0)

    const votingKey = ref(0);
    const menuKey = ref(0);
    const comments = ref([]) as Ref<unknown[]>;
    const commentsNum = ref(0);
    const replyComp = shallowRef(null) as Ref<ReturnType<typeof defineComponent>>;

    // store.$subscribe(() => {
    // })

    watch(refHasVote, (newVal) => {
      refHasVote.value = newVal;
      menuKey.value++;
    });

    const updatePostInfo = () => {
      ctx.emit("updatepostinfo", props.post._id.postid);
    };

    onMounted(() => {
      console.log("post mounted", props.deps);
      checkPostType((props.post as unknown) as { url: string; tag: string }).then(
        async (type) => {
          postTypeClass.value = type;
          switch (type) {
            case "tweet":
              processedPost.tweetInfo = props.post.tweetInfo;
              postTypeCom.value = (await props.postTypesPromises.preLoadTweet).default;
              break;
            case "farcaster":
              processedPost.web3Preview = props.post.web3Preview;
              processedPost.web3CreatorProfile = props.post.web3CreatorProfile;
              postTypeCom.value = (
                await props.postTypesPromises.preloadFarcaster
              ).default;
                import("shared/src/utils/requests/farcaster").then((module) => {
                  const commId = !nested
                    ? props.post.web3Preview?.meta?.parentPostId
                    : props.post._id.postid;

                  module
                    .getFarcasterYupThread({
                      apiBase: props.deps.apiBase,
                      postId: commId,
                    })
                    .then((res) => {
                      if (res) {
                        comments.value = res.comments;
                        commentsNum.value = res.numComments - 1;
                      }
                    });
                });
                if (props.crossPost) {
                  props.crossPost()?.then((module) => {
                    replyComp.value = module.default;
                  });
                }
              break;
            case "lens":
              import("shared/src/utils/web3/lens").then((module) => {
                module
                  .getLensComments(module.lensIdToRaw(props.post?.web3Preview?.id ?? ""))
                  .then((res) => {
                    if (res) {
                      comments.value = res as Web3LensRaw[];
                      commentsNum.value = res.length;
                    }
                  });
              });

              processedPost.web3Preview = props.post.web3Preview;
              processedPost.web3CreatorProfile = props.post.web3CreatorProfile;
              postTypeCom.value = (await props.postTypesPromises.preloadLens).default;
              break;
            case "erc721":
              processedPost.web3Preview = props.post.web3Preview;
              processedPost.web3CreatorProfile = props.post.web3CreatorProfile;
              postTypeCom.value = (await props.postTypesPromises.preloadErc721).default;
              break;
            case "poap":
              processedPost.web3Preview = props.post.web3Preview;
              processedPost.web3CreatorProfile = props.post.web3CreatorProfile;
              postTypeCom.value = (await props.postTypesPromises.preloadPoap).default;
              break;
            case "mirror":
              processedPost.web3Preview = props.post.web3Preview;
              processedPost.web3CreatorProfile = props.post.web3CreatorProfile;
              postTypeCom.value = (await props.postTypesPromises.preloadMirror).default;
              break;
            case "snapshot":
              processedPost.web3Preview = props.post.web3Preview;
              processedPost.web3CreatorProfile = props.post.web3CreatorProfile;
              postTypeCom.value = (await props.postTypesPromises.preloadSnapshot).default;
              break;
            case "youtubeVideo":
              postTypeCom.value = (await props.postTypesPromises.preloadYoutube).default;
              break;
            default:
              postTypeCom.value = (await props.postTypesPromises.preloadGeneral).default;
              break;
          }
          postTypeLoading.value = false;
        }
      );
      processPost(props.post, processedPost, cloneWeights, postShareInfo);
    });

    const checkPostType = async (post: { url: string; tag: string }) => {
      if (post.tag === "mirror") return "mirror";
      if (post.tag === "poap") return "poap";
      if (post.tag === "farcaster") return "farcaster";
      if (post.tag === "lens") return "lens";
      if (post.tag === "snapshot") return "snapshot";
      if (post.tag === "twitter") return "tweet";
      if (post.tag === "erc721") return "erc721";
      if (post?.url.match(/https?:\/\/(mobile.|www.)?twitter\.com\/.*?status/i))
        return "tweet";
      if (post?.url.startsWith("farcaster://")) return "farcaster";
      if (post?.url.toLocaleLowerCase().includes("youtube.com/watch?"))
        return "youtubeVideo";

      return "general";
    };

    const hasVoteDeleted = () => {
      processedPost.positiveWeight = cloneWeights.positiveWeight;
      processedPost.negativeWeight = cloneWeights.negativeWeight;
      votingKey.value++;
    };

    // onBeforeMount(() => {

    // })

    return {
      processedPost,
      postTypeCom,
      postTypeLoading,
      postShareInfo,
      updatePostInfo,
      postTypeClass,
      refHasVote,
      hasVoteDeleted,
      votingKey,
      menuKey,
      comments,
      commentsNum,
      replyComp,
      nested,
    };
  },
});
</script>

<style lang="scss">
.postCard {
  background-color: var(--post-card-bg);
  border: 1px solid #00000047;
  border-radius: 0.5rem;
  box-shadow: inset -1px -1px 0px 0px rgba(10, 10, 10, 0.7019607843);
  height: min-content;
  position: relative;
}

.mfavIco {
  background: radial-gradient(
    ellipse at bottom,
    rgb(243 226 158 / 42%) 0%,
    rgb(199 158 243 / 45%) 100%
  );
  box-shadow: 0px 0px 0px 2px rgb(115 118 118 / 15%);
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -0.3rem;
  img {
    filter: brightness(0) invert(1);
  }
  opacity: 0.8;
}

.mtime {
  background: radial-gradient(
    ellipse at bottom,
    rgb(28 28 28) 0%,
    rgb(30 30 30 / 88%) 100%
  );
  box-shadow: 2px 0px 10px 3px rgb(0 0 0 / 16%);
  justify-content: center;
  align-items: center;
  color: #f0ffffd4;
  padding: 0 0.5rem;
}

.colbutton {
  border: 1px solid #8f8f8fa8;
  border-radius: 0.3rem;
}

.pPost {
  opacity: 1;
  transition: opacity 700ms linear;
  align-items: center;
}

.pPost.mirror div.postCard {
  word-break: break-word;
  overflow-x: hidden;
}

div.w3TweetTypeBody {
  text-align: left;
  word-break: break-word;

  .reply-line {
    border-left: 2px solid rgba(255, 127, 80, 0.699);
  }

  a {
    filter: brightness(1.2) sepia(2);
    border-bottom: 1px solid rgba(184, 184, 184, 0.096);
  }
  a:hover {
    transform: skewX(20deg);
  }

  .indent {
    width: 1rem;
    margin-left: 1.5rem;
    margin-right: 1rem;
  }
}
</style>
