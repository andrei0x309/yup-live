<template>
  <div
    :class="`mentionsSection flex flex-col glassCard p-0`"
    :style="{ top: `${positionCoords.y}px`, left: `${positionCoords.x}px` }"
  >
    <ul class="flex flex-col flex-start items-start py-4">
      <li
        class="flex px-2 py-1 w-full"
        v-for="mention of (mentions ?? [])?.filter((m) => m?.handle)"
        @click="selectMention(mention._id)"
        :key="mention._id"
      >
        <div class="flex items-center">
          <AvatarBtn
            :key="mention.avatar"
            class="w-7 h-7 mx-auto"
            imgClass="w-7 h-7"
            :pSource="mention.avatar"
            :isSelf="false"
            :isTwitter="false"
            :pAccount="mention._id"
          />
          <p class="p-2 text-[0.9rem]">{{ mention.handle }}</p>
          <TwitterIcon class="w-4 h-4 mt-1" v-if="mention.twitter?.handle" />
          <ProfileYupIcon class="w-4 h-4 mt-1" v-if="mention.yup?.handle" />
          <ProfileEthIcon class="w-4 h-4 mt-1" v-if="mention.ens?.handle" />
          <ProfileFarcasterIcon class="w-4 h-4 mt-1" v-if="mention.farcaster?.handle" />
          <ProfileLensIcon class="w-4 h-4 mt-1" v-if="mention.lens?.handle" />
          <ProfileBskyIcon class="w-4 h-4 mt-1" v-if="mention.bsky?.handle" />
          <ThreadsIcon class="w-4 h-4 mt-1" v-if="mention.threads?.handle" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, reactive, shallowRef, PropType } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from "components/functional/customButton.vue";
import { formatNumber } from "shared/src/utils/misc";
import ImagePreview from "components/post/imagePreview.vue";
import type {
  IProfileToken,
  IProfileNFT,
  IProfilePOAP,
} from "shared/src/types/web3/wallet";
import AddIcon from "icons/src/add.vue";
import { fetchFromWallet, resources, chains } from "shared/src/utils/requests/web3Wallet";
import type { IWeb3Profile } from "shared/src/types/web3Profile";
import ProfileLensIcon from "icons/src/profileLens.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileEthIcon from "icons/src/profileEth.vue";
import ProfileYupIcon from "icons/src/profileYup.vue";
import ProfileBskyIcon from "icons/src/bskyClouds.vue";
import ThreadsIcon from "icons/src/threads.vue";
import TwitterIcon from "icons/src/twitter.vue";
import AvatarBtn from "components/functional/avatarBtn.vue";

export default defineComponent({
  name: "MentionSection",
  components: {
    ProfileEthIcon,
    ProfileYupIcon,
    ProfileFarcasterIcon,
    ProfileLensIcon,
    TwitterIcon,
    ProfileBskyIcon,
    ThreadsIcon,
    DangLoader,
    CustomButton,
    AvatarBtn,
  },
  props: {
    mentions: {
      type: Array as PropType<Array<IWeb3Profile> | null>,
      required: true,
    },
    positionCoords: {
      type: Object as PropType<{ x: number; y: number }>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["mentionSelected"],
  setup(props, { emit }) {
    const catComp = shallowRef(null) as Ref<unknown>;
    const nothingToShow = ref(false);
    const ethTokens = ref([]) as Ref<IProfileToken[]>;
    const polyTokens = ref([]) as Ref<IProfileToken[]>;
    const ethNfts = ref([]) as Ref<IProfileNFT[]>;
    const polyNfts = ref([]) as Ref<IProfileNFT[]>;
    const poaps = ref([]) as Ref<IProfilePOAP[]>;
    const hasMore = reactive({
      poaps: true,
      ethTokens: true,
      polyTokens: true,
      ethNfts: true,
      polyNfts: true,
    });
    const currentSegment = ref("tokens");

    const selectMention = (mentionId: string) => {
      emit(
        "mentionSelected",
        props.mentions?.find((m: IWeb3Profile) => m._id === mentionId)
      );
    };

    return {
      catComp,
      ethTokens,
      polyTokens,
      ethNfts,
      poaps,
      polyNfts,
      nothingToShow,
      formatNumber,
      AddIcon,
      currentSegment,
      hasMore,
      selectMention,
    };
  },
});
</script>

<style lang="scss">
.mentionsSection {
  display: flex;
  position: absolute;
  background-blend-mode: multiply;
  background-color: #a9a9a98f;
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  li:hover {
    background-color: #00000054;
    cursor: pointer;
    transition: 0.3s;
    transform: scale(1.02);
  }
}
</style>
