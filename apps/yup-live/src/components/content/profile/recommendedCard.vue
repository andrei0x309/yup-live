<template>
  
  <div class="recommanded text-left ml-6 hidden lg:block">
    <h2 class="text-xl font-bold mb-2">Web3Profiles to {{  isAuth ? 'follow': 'view'  }}</h2>
    <DangLoader v-if="!data.length" />
    <div class="flex">
    <ul>
        <li v-for="account of data.slice(0, 5)" :key="account._id" class="p-2">
            <img :src="account.avatar" class="w-8 h-8 mr-2 rounded-full ring-1 ring-gray-300 dark:ring-gray-500 inline-block" :alt="account.handle" loading="lazy" @error="onError" />
            <router-link :to="`/web3-profile/${account._id}`"> {{ account.handle }}</router-link>
            <router-link :to="`/web3-profile/${account._id}`" class="view-btn ml-2">VIEW</router-link>
                  <FollowUnfollwBtn 
          :evmAddr="account._id?? ''"
          class="inline-block ml-2 view-btn text-[0.75rem] mt-3 w-22 p-1 text-center"
          :iconClass="'inline-block w-3 mr-0'"
          :deps="{
            apiBase: API_BASE,
            useMainStore,
            stackAlertWarning,
            stackAlertSuccess,
          }"
          />
        </li>
    </ul>
    <ul>
        <li v-for="account of data.slice(5,10)" :key="account._id" class="p-2">
            <img :src="account.avatar" class="w-8 h-8 mr-2 rounded-full ring-1 ring-gray-300 dark:ring-gray-500 inline-block" :alt="account.handle" loading="lazy" @error="onError" />
            <router-link :to="`/web3-profile/${account._id}`"> {{ account.handle }} </router-link>
            <router-link :to="`/web3-profile/${account._id}`" class="view-btn ml-2">VIEW</router-link>
            <FollowUnfollwBtn 
            :evmAddr="account._id?? ''"
            class="inline-block ml-2 view-btn text-[0.75rem] mt-3 w-22 p-1 text-center"
            :iconClass="'inline-block w-3 mr-0'"
            :deps="{
            apiBase: API_BASE,
            useMainStore,
            stackAlertWarning,
            stackAlertSuccess,
            }"
            />
        </li>
    </ul>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import type { IWeb3ProfileRecommendation } from "shared/src/types/web3Profile";
import { makeRandAvatar } from 'shared/src/utils/accounts'
import DangLoader from 'components/vote-list/loader.vue'
import FollowUnfollwBtn from "components/profile/followUnfollowBtn.vue"
const API_BASE = import.meta.env.VITE_YUP_API_BASE;
import { useMainStore, openConnectModal, } from "@/store/main";
import { stackAlertWarning, stackAlertSuccess } from "@/store/alertStore";

export default defineComponent({
  name: "RecommandedCard",
  components: {
    DangLoader,
    FollowUnfollwBtn
  },
  props: {
    data : {
      type: Array<IWeb3ProfileRecommendation>,
      required: true
    },
    isAuth: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    onMounted(() => {
      // console.log('mounted')
    });

    return {
        onError: (e: Event) => {
            const target = e.target as HTMLImageElement;
            target.src = makeRandAvatar(target?.getAttribute('alt') ?? '')
        },
        API_BASE,
        useMainStore,
        openConnectModal,
        stackAlertWarning, 
        stackAlertSuccess
    }
  },
});
</script>

<style lang="scss">

.recommanded {
    min-width: 20rem;
    margin-top: 1rem;
    background-color: var(--glass-menu-bg);
    padding: 2rem;
    border-radius: 1rem;
    filter: grayscale(0.1);
    background: linear-gradient(234deg, #504c4c24, #1818188c), linear-gradient(39deg, #625c5c36, #201f1f8f);
    color: aliceblue;
    box-shadow: 2px 2px #2b2d2e;
}

</style>
