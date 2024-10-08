<template>
  <figure class="snip1344">
    <DangLoader v-if="isLoading" />
    <img :src="lWeb3Profile?.avatar" alt="profile-sample1" class="background" />
    <div v-if="followersCount > 0" class="followers">
      <FollowersIcon class="inline-block w-4 mr-2" />{{ followersCount }}
    </div>
    <div v-if="lWeb3Profile?.isPro" class="isPro">
      <StarIcon class="inline-block w-4 mr-2" />PRO
    </div>
    <img
      :key="computedAvatar"
      :src="computedAvatar"
      class="web3Avatar w-21 h-21 mr-2 rounded-full ring-1 ring-gray-300 dark:ring-gray-500 inline-block"
      :alt="`avatar ${computedAvatar}`"
      loading="lazy"
      @error="onError"
    />

    <figcaption>
      <h3>
        [ {{ lWeb3Profile?.handle || `${id.slice(0, 6)}...` }} ]<span
          >Social Handles</span
        >
      </h3>
      <div class="handles">
        <div v-if="lWeb3Profile?.ens?.handle">
          <a :href="`https://polygonscan.com/address/${id}`" target="_blank">
            <ProfileEthIcon class="mr-2 w-3 inline-block" />
            {{ truncateSocialHandle(lWeb3Profile.ens.handle) }}
            <LinkIcon class="w-3 inline" />
          </a>
        </div>
        <div v-if="lWeb3Profile?.yup?.handle">
          <router-link :to="`/profile/${lWeb3Profile.yup.handle}`">
            <ProfileYupIcon class="mr-2 w-4 inline-block" />
            {{ truncateSocialHandle(lWeb3Profile.yup.handle) }}
            <LinkIcon class="w-3 inline" />
          </router-link>
        </div>
        <div v-if="lWeb3Profile?.twitter?.handle">
          <a :href="`https://twitter.com/${lWeb3Profile.twitter.handle}`" target="_blank">
            <TwitterIcon class="mr-2 w-4 inline-block" />
            {{ truncateSocialHandle(lWeb3Profile.twitter.handle) }}
            <LinkIcon class="w-3 inline" />
          </a>
        </div>
        <div v-if="lWeb3Profile?.farcaster?.handle">
          <a
            :href="`https://warpcast.com/${lWeb3Profile.farcaster.handle}`"
            target="_blank"
          >
            <ProfileFarcasterIcon class="mr-2 w-4 inline-block" />
            {{ truncateSocialHandle(lWeb3Profile.farcaster.handle) }}
            <LinkIcon class="w-3 inline" />
          </a>
        </div>
        <div v-if="lWeb3Profile?.lens?.handle">
          <a :href="`https://hey.xyz/u/${lWeb3Profile?.lens?.handle}`" target="_blank">
            <ProfileLensIcon class="mr-2 w-4 inline-block" />
            {{ truncateSocialHandle(lWeb3Profile?.lens?.handle ?? "") }}
            <LinkIcon class="w-3 inline" />
          </a>
        </div>
        <div v-if="lWeb3Profile?.bsky?.handle">
          <a
            :href="`https://bsky.app/profile/${lWeb3Profile.bsky.handle}`"
            target="_blank"
          >
            <ProfileBskyIcon class="-ml-1 w-6 inline-block" />
            {{ truncateSocialHandle(lWeb3Profile?.bsky?.handle) }}
            <LinkIcon class="w-3 inline" />
          </a>
        </div>
        <div v-if="lWeb3Profile?.threads?.handle">
          <ThreadsIcon class="mr-2 w-4 inline-block" />
          {{ lWeb3Profile?.threads?.handle }}
        </div>

        <FollowUnfollwBtn
          :evmAddr="id"
          class="mr-10 view-btn text-[0.85rem] mt-3 w-22 p-1 text-center"
          :iconClass="'inline-block w-3 mr-0'"
          :deps="deps"
        />
        <router-link
          v-if="addViewBtn && id.startsWith('0x')"
          :to="`/web3-profile/${id}`"
          class="mr-10 view-btn text-[0.85rem] mt-3 w-22 p-1 text-center inline-block"
          >Check</router-link
        >
        <slot name="block"></slot>
        <slot name="report"></slot>
      </div>
    </figcaption>
  </figure>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import type { PropType } from "vue";
import { makeRandAvatar } from "shared/src/utils/accounts";
import DangLoader from "components/vote-list/loader.vue";
import type { IWeb3Profile } from "shared/src/types/web3Profile";

import ProfileLensIcon from "icons/src/profileLens.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileEthIcon from "icons/src/profileEth.vue";
import ProfileYupIcon from "icons/src/profileYup.vue";
import ProfileBskyIcon from "icons/src/bskyClouds.vue";
import ThreadsIcon from "icons/src/threads.vue";
import TwitterIcon from "icons/src/twitter.vue";

import StarIcon from "icons/src/star.vue";
import FollowersIcon from "icons/src/followers.vue";
import FollowUnfollwBtn from "components/profile/followUnfollowBtn.vue";
import type { IDepsWeb3Profile } from "shared/src/types/web3/web3Deps";
import { fetchWeb3Profile } from "shared/src/utils/requests/web3Profiles";
import LinkIcon from "icons/src/link.vue";
import { truncateSocialHandle } from "shared/src/utils/misc";

export default defineComponent({
  name: "Web3ProfileCard",
  components: {
    DangLoader,
    ProfileEthIcon,
    ProfileYupIcon,
    ProfileFarcasterIcon,
    ProfileLensIcon,
    TwitterIcon,
    ProfileBskyIcon,
    ThreadsIcon,
    StarIcon,
    FollowersIcon,
    FollowUnfollwBtn,
    LinkIcon,
  },
  props: {
    web3Profile: {
      type: Object as PropType<IWeb3Profile | null>,
      required: true,
    },
    overWriteEVM: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },
    followersCount: {
      type: Number,
      required: false,
      default: 0,
    },
    addViewBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
    deps: {
      type: Object as PropType<IDepsWeb3Profile>,
      required: true,
    },
  },
  setup(props) {
    const isLoading = ref(true);
    const avatar = ref(props.web3Profile?.avatar ?? "");
    const id = ref(
      props.overWriteEVM ?? props.web3Profile?.evmAddress ?? props.web3Profile?._id ?? ""
    );
    const lWeb3Profile = ref(props.web3Profile);
    const computedHeyHandle = computed(() => {
      return lWeb3Profile.value?.lens || "";
    });
    const computedAvatar = computed(() => {
      const checkFarcasterAvatar = lWeb3Profile.value?.farcaster?.avatar
        ? lWeb3Profile.value?.farcaster?.avatar
        : lWeb3Profile?.value?.lens?.avatar;
      return (lWeb3Profile.value?.avatar ?? "").startsWith("https://cdn.bsky.app")
        ? checkFarcasterAvatar
        : lWeb3Profile.value?.avatar;
    });

    onMounted(async () => {
      if (props.overWriteEVM) {
        lWeb3Profile.value = await fetchWeb3Profile(
          props.deps.apiBase,
          props.overWriteEVM
        );
      }

      if (!lWeb3Profile.value?.avatar) {
        avatar.value = makeRandAvatar(id.value);
      }
      isLoading.value = false;
    });

    return {
      onError: () => {
        avatar.value = makeRandAvatar(id.value);
      },
      isLoading,
      avatar,
      id,
      lWeb3Profile,
      truncateSocialHandle,
      computedHeyHandle,
      computedAvatar,
    };
  },
});
</script>

<style lang="scss">
.snip1344 {
  position: relative;
  overflow: hidden;
  height: fit-content;
  max-width: 20rem;
  min-width: 18rem;
  width: 100%;
  color: aliceblue;
  text-align: center;
  line-height: 1.3rem;
  background-color: li;
  border-radius: 2rem;
  margin-top: 1rem;
  background: linear-gradient(
      234deg,
      rgba(80, 76, 76, 0.1411764706),
      rgba(24, 24, 24, 0.5490196078)
    ),
    linear-gradient(39deg, rgba(98, 92, 92, 0.2117647059), rgba(32, 31, 31, 0.5607843137));
  box-shadow: 2px 2px #2b2d2e;

  .handles {
    text-align: initial;
    margin-left: 3rem;
  }

  .followers,
  .isPro {
    position: absolute;
    top: 1rem;

    svg {
      position: relative;
      top: -0.1rem;
    }
  }

  .followers {
    left: 2rem;
  }

  .isPro {
    right: 2rem;
  }
}
.snip1344 * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.snip1344 .background {
  width: 100%;
  vertical-align: top;
  opacity: 0.45;
  -webkit-filter: grayscale(100%) blur(10px);
  filter: sepia(1) blur(20px) brightness(0.4);
  -webkit-transition: all 2s ease;
  transition: all 2s ease;
  height: 12rem;
}
.snip1344 figcaption {
  width: 100%;
  padding: 15px 25px;
}
.snip1344 .web3Avatar {
  border-radius: 50%;
  position: absolute;
  bottom: 60%;
  left: 50%;
  opacity: 1;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5019607843);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transform: translate(-50%);
  background-color: rgb(0 0 0 / 65%);
  height: 7rem;
  width: 7rem;
  -o-object-fit: contain;
  object-fit: cover;
}
.snip1344 h3 {
  margin: 0 0 5px;
  font-weight: 400;
  font-size: 1.2rem;
}
.snip1344 h3 span {
  display: block;
  font-size: 0.6em;
  color: #f39c12;
  opacity: 0.75;
}
.snip1344 i {
  padding: 10px 5px;
  display: inline-block;
  font-size: 32px;
  color: #ffffff;
  text-align: center;
  opacity: 0.65;
}
.snip1344 a {
  text-decoration: none;
}
.snip1344 i:hover {
  opacity: 1;
  -webkit-transition: all 0.35s ease;
  transition: all 0.35s ease;
}
.snip1344:hover .background,
.snip1344.hover .background {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}
</style>
