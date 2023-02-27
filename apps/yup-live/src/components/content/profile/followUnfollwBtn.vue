<template>
  <div>
    <BtnSpinner v-if="isLoading" />
    <template v-else>
        <button v-if="isFollower" :disabled="disabled" @click="doUnfollow" >
        <DeleteIcon :class="iconClass" /> Unfollow
        </button>
        <button v-else :disabled="disabled" @click="doFollow">
        <AddFollowIcon :class="iconClass" /> Follow
        </button>
    </template>
    
  </div>
</template>


<script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import AddFollowIcon from "icons/src/addFollow.vue";
  import DeleteIcon from "icons/src/delete.vue";
  import BtnSpinner from "icons/src/btnSpinner.vue";
  import { isFollowing, follow, unfollow } from "shared/src/utils/requests/web3Follows";
  import { useMainStore } from "@/store/main";
  import { openConnectModal } from "@/store/main";
  import { stackAlertWarning, stackAlertSuccess } from "@/store/alertStore";
   
  const API_BASE = import.meta.env.VITE_YUP_API_BASE;


  export default defineComponent({
    name: "FollowUnfollwBtn",
    components: {
        BtnSpinner,
        DeleteIcon,
        AddFollowIcon
    },
    props: {
     evmAddr : {
            type: String,
            required: true
        },
    iconClass: {
      type: String,
      required: false,
      default: ''
     },
     disabled: {
      type: Boolean,
      required: false,
      default: false
     },
    },
    setup(props) {
        const isLoading = ref(false)
        const isFollower = ref(false)
        const store = useMainStore()

        const checkIsFollower = async () => {
        if(store.isLoggedIn) {
            isLoading.value = true
            isFollower.value = await isFollowing(API_BASE, props.evmAddr, store.userData.address)
            isLoading.value = false
         } else {
            isFollower.value = false
         }
        }

      onMounted(checkIsFollower);

      const doUnfollow = async () => {
        if(store.isLoggedIn) {
            isLoading.value = true
            const result = await unfollow(API_BASE, store, props.evmAddr)
            if(result) {
                isFollower.value = false
                stackAlertSuccess('You are no longer following this profile')
            } else {
                stackAlertWarning('Cannot unfollow this profile')
                isFollower.value = true
            }
            isLoading.value = false
         } else {
            openConnectModal(store)
         }
      }

        const doFollow = async () => {
            if(store.isLoggedIn) {
                isLoading.value = true
                const result = await follow(API_BASE, store, props.evmAddr)
                if(result) {
                    isFollower.value = true
                    stackAlertSuccess('You are now following this profile')
                } else {
                    stackAlertWarning('Cannot follow this profile')
                    isFollower.value = false
                }
                isLoading.value = false
             } else {
                openConnectModal(store)
             }
        }

      return {
        isLoading,
        isFollower,
        doFollow,
        doUnfollow
      }
    },
  });
</script>

<style lang="scss"></style>
