<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user followers</p>
    <DangLoader :unset="true" />
  </template>
  <template v-else>
    <h2 v-if="followersList?.length > 0" class="text-[1.3rem] mt-2 uppercase">{{ account }}'s Followers</h2>
    <div v-else>
      <h2 class="text-[1.3rem] mt-2 uppercase">{{ account }} does not have any followers</h2>
      <component :is="catComp" v-if="catComp !== null" class="w-10 mx-auto" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProfileCard v-for="userdata of accountsData" :key="userdata._id" :userData="userdata" />
    </div>
  </template>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import ProfileCard from './profileCard.vue'
import DangLoader from 'components/vote-list/loader.vue'
import { createUserData, createActionUsage, getUserFollowers } from 'shared/dist/utils/requests/accounts'
import type { IUserData } from 'shared/dist/types/account'

export default defineComponent({
  name: 'CollectionsPage',
  components: { ProfileCard, DangLoader },
  props: {
    account: {
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
    const accountsData = ref([]) as Ref<IUserData[]>
    const catComp = ref(null) as Ref<unknown>

    const getAccountData = async (accounts: string[]) => {
      const localAccData = [] as IUserData[]
      await Promise.all(
        accounts.map(async (a) => {
          const cUD = await createUserData(a)
          const [cAG, cAF] = await Promise.all([createActionUsage(a, cUD.data.userData.balanceNum ?? 0), getUserFollowers(a)])
          if (!cUD.error) {
            localAccData.push(
              Object.assign({}, cUD.data.userData, { actionBars: cAG.actionBars }, { nextReset: cAG.nextReset }, {
                followers: cAF.data.length
              } as IUserData)
            )
          }
        })
      )
      return localAccData
    }

    onMounted(async () => {
      if (props.followersList.length > 0) {
        accountsData.value = await getAccountData(props.followersList)
      } else {
        catComp.value = (await import('@/components/content/icons/catEmpty.vue')).default
      }
      isLoading.value = false
    })

    return {
      isLoading,
      accountsData,
      catComp
    }
  }
})
</script>

<style lang="scss"></style>
