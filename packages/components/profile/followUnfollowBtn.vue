<template>
  <div>
    <BtnSpinner v-if="isLoading" />
    <template v-else>
      <button v-if="isFollower" :disabled="disabled" @click="doUnfollow">
        <DeleteIcon :class="iconClass" /> Unfollow
      </button>
      <button v-else :disabled="disabled" @click="doFollow">
        <AddFollowIcon :class="iconClass" /> Follow
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from "vue";
import AddFollowIcon from "icons/src/addFollow.vue";
import DeleteIcon from "icons/src/delete.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { isFollowing, follow, unfollow } from "shared/src/utils/requests/web3Follows";
import type { IMainStore } from "shared/src/types/store";

export default defineComponent({
  name: "FollowUnfollwBtn",
  components: {
    BtnSpinner,
    DeleteIcon,
    AddFollowIcon,
  },
  props: {
    evmAddr: {
      type: String,
      required: true,
    },
    iconClass: {
      type: String,
      required: false,
      default: "",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    deps: {
        type: Object as PropType<{
            apiBase: string,
            useMainStore: () => IMainStore,
            stackAlertWarning?: (msg: string) => void,
            stackAlertSuccess?: (msg: string) => void,
            openConnectModal?: (store: IMainStore) => void
        }>,
        required: true
    }
  },
  setup(props) {
    const isLoading = ref(false);
    const isFollower = ref(false);
    const store = props.deps.useMainStore();

    const checkIsFollower = async () => {
      if (store.isLoggedIn) {
        isLoading.value = true;
        isFollower.value = await isFollowing(
          props.deps.apiBase,
          props.evmAddr,
          store.userData.address
        );
        isLoading.value = false;
      } else {
        isFollower.value = false;
      }
    };

    onMounted(checkIsFollower);

    const doUnfollow = async () => {
      if (store.isLoggedIn) {
        isLoading.value = true;
        const result = await unfollow(props.deps.apiBase, store, props.evmAddr);
        if (result) {
          isFollower.value = false;
          if(props.deps.stackAlertSuccess) props.deps.stackAlertSuccess("You are no longer following this profile");
        } else {
          if(props.deps.stackAlertWarning) props.deps.stackAlertWarning("Cannot unfollow this profile");
          isFollower.value = true;
        }
        isLoading.value = false;
      } else {
        if(props.deps.openConnectModal) props.deps.openConnectModal(store);
      }
    };

    const doFollow = async () => {
      if (store.isLoggedIn) {
        isLoading.value = true;
        const result = await follow(props.deps.apiBase, store, props.evmAddr);
        if (result) {
          isFollower.value = true;
          if(props.deps.stackAlertSuccess)  props.deps.stackAlertSuccess("You are now following this profile");
        } else {
            if(props.deps.stackAlertWarning) props.deps.stackAlertWarning("Cannot follow this profile");
          isFollower.value = false;
        }
        isLoading.value = false;
      } else {
        if(props.deps.openConnectModal) props.deps.openConnectModal(store);
      }
    };

    return {
      isLoading,
      isFollower,
      doFollow,
      doUnfollow,
    };
  },
});
</script>

<style lang="scss"></style>
