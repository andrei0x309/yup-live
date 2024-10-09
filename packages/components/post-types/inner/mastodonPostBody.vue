<template>
  <div
    :class="`openpost pressable relative pt-2 rounded-lg ${isReply ? 'mb-6' : ''}`"
    @click="openLocalPost"
  >
    <div class="flex p-2 overflow-hidden openpost">
      <router-link
        v-if="mainPost.userAddress"
        :to="`/web3-profile/${mainPost.userAddress}`"
      >
        <AvatarBtn
          :key="mainPost.userAvatar"
          class="w-9 h-9"
          imgClass="w-9 h-9"
          :pSource="parseIpfs(mainPost.userAvatar)"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainPost.userHandle"
        />
      </router-link>
      <AvatarBtn
        v-else
        :key="mainPost.userAvatar"
        class="w-9 h-9"
        imgClass="w-9 h-9"
        :pSource="parseIpfs(mainPost.userAvatar)"
        :isSelf="false"
        :isTwitter="true"
        :pAccount="mainPost.userHandle"
      />
      <router-link
        v-if="mainPost.userAddress"
        :to="`/web3-profile/${mainPost.userAddress}`"
      >
        <div class="flex flex-col text-justify pl-3 openpost">
          <span>{{ mainPost.userName }}</span>
          <span class="mainPost-70"
            >@{{ mainPost.userHandle }}
            <!-- <VerifiedIcon v-if="mainPost.verified" class="verIcon"
            /> --></span
          >
        </div>
      </router-link>
      <div v-else>
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainPost.userName }}</span>
          <span class="mainPost-70"
            >@{{ mainPost.userHandle }}
            <!-- <VerifiedIcon v-if="mainPost.verified" class="verIcon"
            /> --></span
          >
        </div>
      </div>
      <span
        v-if="Object.keys(mainPost.crossPostGroup ?? {})?.length > 1"
        class="mCrossIcon"
      >
        <CrossIconGroup :post="mainPost" />
      </span>
      <span v-else class="flex mfavIco ml-auto">
        <MatodonIcon class="w-5 h-5" />
      </span>
    </div>
    <div class="pt-2 text-justify pr-2 flex w3TweetTypeBody openpost">
      <div :class="`indent openpost ${isReply ? 'reply-line' : ''}`"></div>
      <div class="pl-4 w-full openpost">
        <div class="openpost" v-html="mainPost.body"></div>
        <template
          v-for="media of mainPost.mediaEntities?.filter((e) => e.type === 'video')"
          :key="media.url"
        >
          <VideoPlayer
            v-if="media.type === 'video'"
            :videoSource="media.url"
            :poster="media?.poster ?? undefined"
            class="py-4 rounded-lg"
          />
        </template>
        <ImagePreview
          v-if="mainPost.mediaEntities?.filter((media) => media.type === 'image')?.length"
          :source="
            mainPost.mediaEntities
              ?.filter((media) => media.type === 'image')
              ?.map((e) => e.url) ?? []
          "
          class="py-4 rounded-lg"
          :postId="mainPost.postId"
        />

        <LinkPreview
          v-for="(preview, index) in mainPost.linkPreviews"
          :linkPreview="preview"
          :key="preview.url"
          :noImage="index > 0 || mainPost.mediaEntities?.length > 0"
        />

        <ExternalEmbeds v-if="mainPost?.embeds?.length" :embeds="mainPost.embeds" />

        <div
          class="openpost flex opacity-60 h-min space-x-1 items-right justify-end rounded-full text-[0.7rem] mr-2 mt-2 mb-2"
        >
          <div class="openpost flex items-left grow mt-2 -ml-2">
            <component
              v-if="replyComp"
              :platforms="['bsky']"
              :is="replyComp"
              :showReplyButton="true"
              :replyTo="{ bsky: mainPost?.bsky?.uri }"
            />
          </div>
          <div class="openpost flex items-end">
            <div class="openpost flex items-center">
              <p class="openpost text-xs mr-2 mt-2">
                <ClockIcon class="w-4 h-4 mr-1 inline-block" />
                {{ mainPost.createdAt }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import AvatarBtn from "components/functional/avatarBtn.vue";
import MatodonIcon from "icons/src/mastodon.vue";
import VideoPlayer from "components/post/videoPlayer.vue";
import ClockIcon from "icons/src/clock.vue";
import ImagePreview from "components/post/imagePreview.vue";
import LinkPreview from "components/post/linkPreview.vue";
import VerifiedIcon from "icons/src/verified.vue";
import { parseIpfs } from "shared/src/utils/web3/ipfs";
import type { PostBodyProcessed } from "shared/src/types/post";
import ExternalEmbeds from "components/post/post-external/external-embeds.vue";
import CrossIconGroup from "components/post-types/misc/crossicon-group.vue";
import { openPost } from "shared/src/utils/post";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PostMastodonBody",
  components: {
    AvatarBtn,
    VideoPlayer,
    ClockIcon,
    ImagePreview,
    VerifiedIcon,
    MatodonIcon,
    LinkPreview,
    ExternalEmbeds,
    CrossIconGroup,
  },
  props: {
    mainPost: {
      type: Object as PropType<PostBodyProcessed>,
      required: true,
    },
    postId: {
      type: String,
      default: "",
    },
    replyComp: {
      type: Object as PropType<ReturnType<typeof defineComponent>>,
      default: null,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();

    const openLocalPost = (e: any) => {
      if (!e.target.classList.contains("mention-handle")) {
        if (!e?.target?.classList?.contains("openpost")) return;
        if (!props.mainPost?.postId) return;
        openPost(router, props.mainPost?.postId);
        e.stopPropagation();
      }
    };

    return {
      parseIpfs,
      openLocalPost,
    };
  },
});
</script>
