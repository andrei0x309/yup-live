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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Web3ProfileCard
        v-for="userdata of accountsData"
        :key="userdata._id"
        :web3Profile="userdata"
      />
    </div>
    <button v-if="hasMore" class="view-btn mt-4 text-[0.92rem] p-3" @click="loadMore"><AddIcon class="inline-block w-4 mr-2" />Load More <BtnSpinner v-if="loadingFollowers" class="inline-block w-4 ml-2" /></button>
  </template>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import Web3ProfileCard from '@/components/content/profile/web3ProfileCard.vue'
import DangLoader from 'components/vote-list/loader.vue'
import type { IWeb3Profile } from "shared/src/types/web3Profile";
import { fetchWeb3Profile } from "shared/src/utils/requests/web3Profiles";
import { getFollowers } from "shared/src/utils/requests/web3Follows";
import AddIcon from 'icons/src/add.vue'
import BtnSpinner from 'icons/src/btnSpinner.vue';



const API_BASE = import.meta.env.VITE_YUP_API_BASE;


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
    const catComp = ref(null) as Ref<unknown>
    const loadingFollowers = ref(false)

    const getProfilesData = async (accounts: string[]) => {
      return (await Promise.all(
        accounts.map(async (a) => {
            return await fetchWeb3Profile(API_BASE, a)
        })
      )).filter((p) => p) as IWeb3Profile[]
    }

    const loadMore = async () => {
      try {
      if(loadingFollowers.value || !hasMore.value) return
      loadingFollowers.value = true
      let newProfiles =  (await getFollowers(API_BASE, props.addr, accountsData.value.length, 11)).followers.map((f: { _id: string}) => f._id)
      console.log('sssssssssssss', newProfiles)
      newProfiles = await getProfilesData(newProfiles)
      hasMore.value = newProfiles.length === 11
      accountsData.value = [...accountsData.value, ...newProfiles.slice(0, 10)]
      loadingFollowers.value = false
        } catch (e) {
            hasMore.value = false
            console.log(e)
        }
    }

    onMounted(async () => {
      if (props.followersList.length > 0) {
        accountsData.value = await getProfilesData(props.followersList)
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
      hasMore
    }
  }
})
</script>

<style lang="scss"></style>
