<template>
  <figure class="snip1345">
    <DangLoader v-if="isLoading" />
    <img :src="lWeb3Profile?.avatar" alt="profile-sample1" class="background" />
    <img
      :key="avatar"
      :src="avatar"
      class="web3Avatar w-21 h-21 mr-2 rounded-full ring-1 ring-gray-300 dark:ring-gray-500 inline-block"
      :alt="`avatar ${lWeb3Profile?.avatar}`"
      loading="lazy"
      @error="onError"
    />

    <figcaption>
        <span
          >You blocked</span
        >
      <h3>
        [ {{ lWeb3Profile?.handle || `${id.slice(0, 6)}...` }} ]
      </h3>
      <div class="handles">
      
        <slot name="unblock"></slot>
      </div>
    </figcaption>
  </figure>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type { PropType } from "vue";
import { makeRandAvatar } from "shared/src/utils/accounts";
import DangLoader from "components/vote-list/loader.vue";
import type { IWeb3Profile } from "shared/src/types/web3Profile";

export default defineComponent({
  name: "BlockedProfile",
  components: {
    DangLoader,
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
    }
  },
  setup(props) {
    const isLoading = ref(true);
    const avatar = ref(props.web3Profile?.avatar ?? "");
    const id = ref(
      props.overWriteEVM ?? props.web3Profile?.evmAddress ?? props.web3Profile?._id ?? ""
    );
    const lWeb3Profile = ref(props.web3Profile);

    onMounted(async () => {
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
    };
  },
});
</script>

<style lang="scss">
.snip1345 {
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
  .yupScore {
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

  .yupScore {
    right: 2rem;
  }
}
.snip1345 * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.snip1345 .background {
  width: 100%;
  vertical-align: top;
  opacity: 0.45;
  -webkit-filter: grayscale(100%) blur(10px);
  filter: sepia(1) blur(20px) brightness(0.7);
  -webkit-transition: all 2s ease;
  transition: all 2s ease;
  height: 12rem;
}
.snip1345 figcaption {
  width: 100%;
  padding: 15px 25px;
}
.snip1345 .web3Avatar {
  border-radius: 50%;
  position: absolute;
  bottom: 45%;
  left: 50%;
  max-width: 100px;
  opacity: 1;
  box-shadow: 3px 3px 20px rgb(0 0 0 / 50%);
  border: 2px solid rgba(255, 255, 255, 0.5);
  -webkit-transform: translate(-50%, 0%);
  transform: translate(-50%, 0%);
}
.snip1345 h3 {
  margin: 0 0 5px;
  font-weight: 400;
  font-size: 1.2rem;
}
.snip1345 span {
  display: block;
  font-size: 1.05rem;
  color: #f39c12;
  opacity: 1.15;
}
.snip1345 i {
  padding: 10px 5px;
  display: inline-block;
  font-size: 32px;
  color: #ffffff;
  text-align: center;
  opacity: 0.65;
}
.snip1345 a {
  text-decoration: none;
}
.snip1345 i:hover {
  opacity: 1;
  -webkit-transition: all 0.35s ease;
  transition: all 0.35s ease;
}
.snip1345:hover .background,
.snip1345.hover .background {
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}
</style>
