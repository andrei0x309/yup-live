<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user followers</p>
    <DangLoader :unset="true" />
  </template>
  <template v-else>
    <h2 v-if="followersList?.length > 0" class="text-[1.3rem] mt-2 uppercase">
      {{ handle }}'s Followers
    </h2>
    <div v-else>
      <h2 class="text-[1.3rem] mt-2 uppercase">
        {{ handle }} does not have any followers
      </h2>
      <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[60rem]">
      <Web3ProfileCard
        v-for="userdata of accountsData"
        :key="userdata._id"
        :web3Profile="userdata"
        :deps="web3Deps"
        :addViewBtn="true"
      />
    </div>
    <button v-if="hasMore" class="view-btn mt-4 text-[0.92rem] p-3" @click="loadMore"><AddIcon class="inline-block w-4 mr-2" />Load More <BtnSpinner v-if="loadingFollowers" class="inline-block w-4 ml-2" /></button>
  </template>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, shallowRef } from 'vue'
import Web3ProfileCard from 'components/profile/web3ProfileCard.vue'
import DangLoader from 'components/vote-list/loader.vue'
import type { IWeb3Profile } from "shared/src/types/web3Profile";
import { getProfilesData } from "shared/src/utils/requests/web3Profiles";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import AddIcon from 'icons/src/add.vue'
import BtnSpinner from 'icons/src/btnSpinner.vue';
import { useMainStore, openConnectModal, } from "@/store/main";
import { stackAlertWarning, stackAlertSuccess } from "@/store/alertStore";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const web3Deps = {
  openConnectModal,
  useMainStore: useMainStore,
  stackAlertWarning,
  stackAlertSuccess,
  apiBase: API_BASE,
};

export default defineComponent({
  name: 'Web3FollowersPage',
  components: { Web3ProfileCard, DangLoader, AddIcon, BtnSpinner },
  props: {
    handle: {
      type: String,
      required: true
    },
    addr: {
        type: String,
        required: true
    },
    followersList: {
      type: Array<string>,
      required: true
    }
  },
  setup(props) {
    const isLoading = ref(true)
    const hasMore = ref(true)
    const accountsData = ref([]) as Ref<IWeb3Profile[]>
    const catComp = shallowRef(null) as Ref<unknown>
    const loadingFollowers = ref(false)

    const loadMore = async () => {
      try {
      if(loadingFollowers.value || !hasMore.value) return
      loadingFollowers.value = true
      let newProfiles =  (await getFollowers(API_BASE, props.addr, accountsData.value.length, 11)).followers.map((f: { _id: string}) => f._id)
      newProfiles = await getProfilesData(newProfiles)
      hasMore.value = newProfiles.length === 11
      accountsData.value = [...accountsData.value, ...newProfiles.slice(0, 10)]
      loadingFollowers.value = false
        } catch (e) {
            hasMore.value = false
        }
    }

    onMounted(async () => {
      if (props.followersList.length > 0) {
        hasMore.value = props.followersList.length === 10
        accountsData.value = await getProfilesData(props.followersList.slice(0, 9))
      } else {
        catComp.value = (await import('icons/src/catEmpty.vue')).default
      }
      isLoading.value = false
    })

    return {
      isLoading,
      accountsData,
      catComp,
      loadMore,
      loadingFollowers,
      hasMore,
      web3Deps
    }
  }
})
</script>

<style lang="scss"></style>
