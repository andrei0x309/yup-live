<template>
  <div>
    <div v-if="tweetType === 'original'" class="p-2">
      <div class="flex p-2">
        <AvatarBtn
          :key="mainTweet.userAvatar"
          class="w-9 h-9 cursor-pointer"
          imgClass="w-9 h-9"
          :pSource="mainTweet.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainTweet.userHandle"
          @click="
            () => {
              goToCreator();
            }
          "
        />
        <div
          class="flex flex-col text-justify pl-3 cursor-pointer"
          @click="
            () => {
              goToCreator();
            }
          "
        >
          <span>{{ mainTweet.userName }}</span>
          <span class="opacity-70"
            >@{{ mainTweet.userHandle }}
            <VerifiedIcon v-if="mainTweet.verified" class="verIcon"
          /></span>
        </div>
        <span
          v-if="Object.keys(post.crossPostGroup ?? {})?.length > 1"
          class="mCrossIcon"
        >
          <CrossIconGroup :post="(post as any)" />
        </span>
        <span v-else class="flex mfavIco ml-auto">
          <TwitterIcon cclass="w-5 h-5 tIcon" />
        </span>
      </div>
      <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
        <div class="indent"></div>
        <div class="pl-4 flex flex-col w-full">
          <p v-html="mainTweet.body"></p>
          <template v-for="media of mainTweet.mediaEntities" :key="media.url">
            <VideoPlayer
              v-if="media.type === 'video'"
              :videoSource="media.url"
              class="py-4 rounded-lg"
            />
            <ImagePreview
              v-if="media.type === 'image'"
              :source="media.url"
              class="py-4 rounded-lg"
            />
          </template>
        </div>
      </div>
      <span
        class="flex opacity-70 h-min space-x-1 items-center rounded-full text-[0.7rem] order-last justify-end mt-3"
      >
        <ClockIcon class="w-4 h-4" />
        <p class="text-xs">
          {{ post.createdAt }}
        </p>
      </span>
    </div>
    <div v-else-if="tweetType === 'missing'">
      <div v-if="!embedLoaded">
        <p><WarningIcon class="w-10 mx-auto mt-2" /></p>
        <p class="p-2" v-if="deleted">Sorry the tweet data is not available on yup!</p>
        <div v-else>
          <p>Preview for this tweet is missing.</p>
          <p>Do you want to try to load an embed?</p>
          <p>
            <CustomButton
              :mobile="true"
              :loading="loadingEmebed ? true : false"
              :icon="loadingEmebed ? refBtnSpinner : refGoTo"
              class="mt-2 mx-auto"
              :text="loadingEmebed ? 'Loading' : 'Load Embed'"
              @click="loadEmbed"
            />
          </p>
        </div>
      </div>
      <div ref="tweet" :id="`${missingTweetId}`" class="flex justify-center"></div>
    </div>
    <div v-else-if="tweetType === 'reply'" class="p-2">
      <div class="relative mb-6">
        <div class="flex p-2">
          <AvatarBtn
            :key="mainTweet.userAvatar"
            class="w-9 h-9"
            imgClass="w-9 h-9"
            :pSource="mainTweet.userAvatar"
            :isSelf="false"
            :isTwitter="true"
            :pAccount="mainTweet.userHandle"
          />
          <div class="flex flex-col text-justify pl-3">
            <span>{{ mainTweet.userName }}</span>
            <span class="opacity-70"
              >@{{ mainTweet.userHandle }}
              <VerifiedIcon v-if="mainTweet.verified" class="verIcon"
            /></span>
          </div>
          <span class="inline-block favIco ml-auto"><TwitterIcon class="w-5 h-5" /></span>
        </div>
        <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
          <div class="indent reply-line"></div>
          <div class="pl-4 flex flex-col w-full">
            <p v-html="mainTweet.body"></p>
            <template v-for="media of mainTweet.mediaEntities" :key="media.url">
              <VideoPlayer
                v-if="media.type === 'video'"
                :videoSource="media.url"
                class="py-4 rounded-lg"
              />
              <ImagePreview
                v-if="media.type === 'image'"
                :source="media.url"
                class="py-4 rounded-lg"
              />
            </template>
          </div>
        </div>
      </div>
      <div>
        <div class="flex px-2">
          <AvatarBtn
            :key="replyOrQuote.userAvatar"
            class="w-7 h-7"
            imgClass="w-7 h-7"
            :pSource="replyOrQuote.userAvatar"
            :isSelf="false"
            :isTwitter="true"
            :pAccount="replyOrQuote.userHandle"
          />
          <div class="flex flex-col text-justify pl-3">
            <span>{{ replyOrQuote.userName }}</span>
            <span class="opacity-70"
              >@{{ replyOrQuote.userHandle }}
              <VerifiedIcon v-if="replyOrQuote.verified" class="verIcon"
            /></span>
          </div>
        </div>
        <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
          <div class="indent"></div>
          <div class="pl-4 flex flex-col w-full">
            <p v-html="replyOrQuote.body"></p>
            <template v-for="media of replyOrQuote.mediaEntities" :key="media.url">
              <VideoPlayer
                v-if="media.type === 'video'"
                :videoSource="media.url"
                class="py-4 rounded-lg"
              />
              <ImagePreview
                v-if="media.type === 'image'"
                :source="media.url"
                class="py-4 rounded-lg"
              />
            </template>
          </div>
        </div>
      </div>
      <span
        class="flex opacity-60 h-min space-x-1 items-center rounded-full text-[0.7rem] order-last justify-end mt-4 mr-2"
      >
        <ClockIcon class="w-4 h-4" />
        <p class="text-xs">
          {{ post.createdAt }}
        </p>
      </span>
    </div>
    <div v-else-if="tweetType === 'quoted' || tweetType === 'retweet'" class="p-2">
      <div :class="`relative ${tweetType === 'quoted' ?? 'mb-6'}:''`">
        <div class="flex p-2">
          <AvatarBtn
            :key="mainTweet.userAvatar"
            class="w-9 h-9"
            imgClass="w-9 h-9"
            :pSource="mainTweet.userAvatar"
            :isSelf="false"
            :isTwitter="true"
            :pAccount="mainTweet.userHandle"
          />
          <div class="flex flex-col text-justify pl-3">
            <span>{{ mainTweet.userName }}</span>
            <span class="opacity-70"
              >@{{ mainTweet.userHandle }}
              <VerifiedIcon v-if="mainTweet.verified" class="verIcon"
            /></span>
          </div>
          <span class="inline-block favIco ml-auto"><TwitterIcon class="w-5 h-5" /></span>
        </div>
        <div
          v-if="tweetType === 'quoted'"
          class="pt-2 text-justify pr-2 flex w3TweetTypeBody"
        >
          <div class="indent"></div>
          <div class="pl-4 flex flex-col w-full">
            <p v-html="mainTweet.body"></p>
            <template
              v-for="media of mainTweet.mediaEntities?.filter((e) => e.type === 'video')"
              :key="media.url"
            >
              <VideoPlayer
                v-if="media.type === 'video'"
                :videoSource="media.url"
                class="py-4 rounded-lg"
              />
            </template>
            <ImagePreview
              v-if="
                mainTweet.mediaEntities?.filter((media) => media.type === 'image')?.length
              "
              :source="
                mainTweet.mediaEntities
                  ?.filter((media) => media.type === 'image')
                  ?.map((e) => e.url) ?? []
              "
              class="py-4 rounded-lg"
              :postId="post?.id ?? post?._id?.postid"
            />
          </div>
        </div>
        <span v-else class="text-[1.2rem] text-left">RT:</span>
      </div>
      <div class="flex">
        <span v-if="tweetType !== 'retweet'" class="text-[1.6rem]">❝</span>
        <div class="quotedStatus">
          <div class="flex px-2">
            <AvatarBtn
              :key="replyOrQuote.userAvatar"
              class="w-9 h-9"
              imgClass="w-9 h-9"
              :pSource="replyOrQuote.userAvatar"
              :isSelf="false"
              :isTwitter="true"
              :pAccount="replyOrQuote.userHandle"
            />
            <div class="flex flex-col text-justify pl-3">
              <span>{{ replyOrQuote.userName }}</span>
              <span class="opacity-70"
                >@{{ replyOrQuote.userHandle }}
                <VerifiedIcon v-if="replyOrQuote.verified" class="verIcon"
              /></span>
            </div>
          </div>
          <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody">
            <div class="indent"></div>
            <div class="pl-4 flex flex-col w-full">
              <p v-html="replyOrQuote.body"></p>
              <template
                v-for="media of replyOrQuote.mediaEntities?.filter(
                  (e) => e.type === 'video'
                )"
                :key="media.url"
              >
                <VideoPlayer
                  v-if="media.type === 'video'"
                  :videoSource="media.url"
                  class="py-4 rounded-lg"
                />
              </template>
              <ImagePreview
                v-if="
                  replyOrQuote.mediaEntities?.filter((media) => media.type === 'image')
                    ?.length
                "
                :source="
                  replyOrQuote.mediaEntities
                    ?.filter((media) => media.type === 'image')
                    ?.map((e) => e.url) ?? []
                "
                class="py-4 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <span
        class="flex opacity-60 h-min space-x-1 items-center rounded-full text-[0.7rem] order-last justify-end mt-4 mr-2"
      >
        <ClockIcon class="w-4 h-4" />
        <p class="text-xs">
          {{ post.createdAt }}
        </p>
      </span>
    </div>
    <div id="scriptPlacer" class="hidden"></div>
  </div>
</template>

<script lang="ts">
// import { useMainStore } from '@/store/main'
import { onMounted, defineComponent, ref, Ref, PropType } from "vue";
import AvatarBtn from "components/functional/avatarBtn.vue";
// import { loadTwitterFactory, createTweetEmbed } from '@/utils/twitter'
import TwitterIcon from "icons/src/twitter.vue";
import VideoPlayer from "components/post/videoPlayer.vue";
import ClockIcon from "icons/src/clock.vue";
import WarningIcon from "icons/src/warning.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import GoTo from "icons/src/goTo.vue";
import CustomButton from "components/functional/customButton.vue";
import ImagePreview from "components/post/imagePreview.vue";
import VerifiedIcon from "icons/src/verified.vue";
import type { mediaType } from "shared/src/types/post";
import type { TweetData, TweetRaw } from "shared/src/types/web2/twitter";
import CrossIconGroup from "components/post-types/misc/crossicon-group.vue";
import type { IPostDeps } from "shared/src/types/post";
import { useRouter } from "vue-router";

const refGoTo = GoTo;
const refBtnSpinner = BtnSpinner;

export default defineComponent({
  name: "PostTweet",
  inheritAttrs: false,
  components: {
    AvatarBtn,
    TwitterIcon,
    VideoPlayer,
    ClockIcon,
    WarningIcon,
    CustomButton,
    ImagePreview,
    VerifiedIcon,
    CrossIconGroup,
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({}),
    },
    deps: {
      type: Object as PropType<IPostDeps>,
      default: () => ({}),
    },
  },
  setup(props) {
    const tweet = ref(null);
    const tweetType = ref("original");
    const loadingEmebed = ref(false);
    const embedLoaded = ref(false);
    const deleted = ref(false);
    const missingTweetId = ref("") as Ref<string>;
    const router = useRouter();
    const creatorAddress = ref("");

    const mainTweet = ref({
      userName: "",
      userHandle: "",
      userAvatar: "",
      body: "",
      verified: false,
      mediaEntities: [] as mediaType[],
      crossPostGroup: {},
    }) as Ref<TweetData>;

    const replyOrQuote = ref({
      userName: "",
      userHandle: "",
      userAvatar: "",
      body: "",
      verified: false,
      mediaEntities: [] as mediaType[],
    }) as Ref<TweetData>;

    const extractTweetIdFromUrl = (url: string) => {
      const urlParts = url.split("/");
      const tweetId = urlParts[urlParts.length - 1];
      return tweetId;
    };

    const loadEmbed = async () => {
      loadingEmebed.value = true;
      const scriptUrl = "https://platform.twitter.com/widgets.js";
      const scriptId = "t-script";
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = scriptUrl;
      if (!!!document.querySelector("#t-script")) {
        document
          .querySelector("#scriptPlacer")
          ?.insertAdjacentElement("afterbegin", script);
      }
      const embedInterval = setInterval(() => {
        if (!!document.querySelector("#t-script")) {
          const id = extractTweetIdFromUrl(props.post.url);
          ((window as unknown) as { twttr: Record<string, any> }).twttr.error = (
            err: any
          ) => {
            console.error("error", err);
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((window as unknown) as { twttr: Record<string, any> }).twttr
            .ready(() => {
              const tweetEl = tweet.value || document.getElementById(id);

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((window as unknown) as {
                twttr: Record<string, any>;
              }).twttr.widgets.createTweet(id, tweetEl, {
                theme: "dark",
              });
            })
            .then((r: unknown) => {
              if (r === undefined) {
                deleted.value = true;
              } else {
                setTimeout(() => {
                  embedLoaded.value = true;
                }, 100);
              }
              loadingEmebed.value = false;
            });
          clearInterval(embedInterval);
        }
      }, 250);
    };

    const getTweetType = () => {
      if (!props.post?.tweetInfo) return "missing";
      if (props.post.tweetInfo?.retweeted_status) return "retweet";
      if (props.post.tweetInfo?.quoted_status) return "quoted";
      if (props.post.tweetInfo?.reply_status) return "reply";
      if (!props.post.tweetInfo?.reply_status && props.post.tweetInfo?.in_replay_status)
        return "delReply";
      return "original";
    };

    const checkMedia = (filler: TweetRaw) => {
      const mediaEntities: mediaType[] = [];

      const twMediaEntities = filler?.extended_entities?.media ?? filler?.media ?? [];
      twMediaEntities?.forEach((e) => {
        if (e?.type === "video" || e?.type === "animated_gif") {
          for (const pVideo of e?.video_info?.variants ?? []) {
            if ("bitrate" in pVideo) {
              mediaEntities.push({ type: "video", url: pVideo.url ?? "" });
              break;
            }
          }
        }
        if (e?.type === "photo") {
          mediaEntities.push({
            type: "image",
            url: e?.media_url_https ?? (e.url as string),
          });
        }
      });

      return mediaEntities;
    };

    const parseBody = (text: string) => {
      text = text ?? "";
      return text
        .replace(
          /(http|https)(.*)( \n|\t|\s|$){1}/gi,
          "<a href='$1$2' rel='noFollow' target='_blank'>$1$2</a>$3"
        )
        .replace(
          /@(.*?)($|\s|\t|\n)/g,
          "<a href='https://twitter.com/$1' rel='noFollow' target='_blank'>@$1</a>$2"
        );
    };

    const fillTweet = (filler: TweetRaw, tweet: Ref<TweetData>, avatar?: string) => {
      const tweetBuilder = {} as TweetData;
      tweetBuilder.userAvatar =
        avatar ??
        filler?.author?.profile_image_url ??
        filler?.user?.profile_image_url_https ??
        ("" as string);
      tweetBuilder.userHandle =
        filler?.author?.username ??
        filler?.author?.screen_name ??
        filler?.user?.screen_name ??
        ("..." as string);
      tweetBuilder.userName =
        filler?.author?.name ?? filler?.user?.name ?? ("Anon" as string);
      tweetBuilder.verified =
        filler?.author?.verified ?? filler?.user?.verified ?? (false as boolean);
      tweetBuilder.body = parseBody(filler?.full_text ?? (filler?.text as string)) ?? "";
      tweetBuilder.mediaEntities = checkMedia(filler);

      tweet.value = tweetBuilder;
    };

    onMounted(() => {
      creatorAddress.value = props.post.web3CreatorProfile?._id;
      tweetType.value = getTweetType();
      switch (tweetType.value) {
        case "missing": {
          missingTweetId.value = extractTweetIdFromUrl(props.post.url);
          break;
        }
        case "original": {
          fillTweet(
            props.post.tweetInfo,
            mainTweet,
            props?.post?.web3CreatorProfile?.avatar
          );
          break;
        }
        case "retweet":
        case "quoted": {
          fillTweet(
            props.post.tweetInfo,
            mainTweet,
            props?.post?.web3CreatorProfile?.avatar
          );
          if (tweetType.value === "quoted") {
            fillTweet(
              props.post.tweetInfo.quoted_status,
              replyOrQuote,
              props?.post?.web3CreatorProfile?.avatar
            );
          } else {
            fillTweet(
              props.post.tweetInfo.retweeted_status,
              replyOrQuote,
              props?.post?.web3CreatorProfile?.avatar
            );
          }
          break;
        }
        case "reply": {
          fillTweet(
            props.post.tweetInfo.reply_status,
            mainTweet,
            props?.post?.web3CreatorProfile?.avatar
          );
          fillTweet(
            props.post.tweetInfo,
            replyOrQuote,
            props?.post?.web3CreatorProfile?.avatar
          );
          break;
        }
      }
      mainTweet.value.crossPostGroup = props.post?.crossPostGroup ?? {};
    });

    const goToCreator = () => {
      if (creatorAddress.value) {
        router.push(`/web3-profile/${creatorAddress.value}`);
      } else {
        props?.deps?.stackAlertWarning &&
          props.deps.stackAlertWarning("User does not have a connected address");
      }
    };

    return {
      tweet,
      mainTweet,
      replyOrQuote,
      tweetType,
      refGoTo,
      refBtnSpinner,
      loadingEmebed,
      embedLoaded,
      loadEmbed,
      goToCreator,
      missingTweetId,
      deleted,
    };
  },
});
</script>

<style scoped lang="scss">
.quotedStatus {
  border: 0.1rem solid rgba(129, 129, 129, 0.568);
  box-shadow: inset -1px -1px 1px 0px rgb(0 0 0 / 46%);
  padding: 1.5rem 0.6rem;
  margin: 0.5rem;
  border-radius: 1rem;
  width: 100%;
}

.verIcon {
  width: 0.9rem;
  fill: rgb(10, 142, 250);
  line-height: 1.5rem;
  display: inline;
  margin-bottom: 0.18rem;
}
</style>
