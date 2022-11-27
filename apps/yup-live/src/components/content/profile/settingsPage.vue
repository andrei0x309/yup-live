<template>
  <template v-if="isLoading">
    <p class="p-4 text-[1.2rem]">Loading user settings Page</p>
    <DangLoader :unset="true" />
  </template>
  <div v-else class="settings-section">
<section class="body-font relative">
  <div class="container px-5 py-2 mx-auto flex">
    <div class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md">
      <h2 class="text-lg mb-1 font-medium title-font">Edit Account Details</h2>
      <div class="relative mb-4">
        <label for="fullnameField" class="leading-7 text-sm text-gray-600 dark:text-gray-300">Full Name</label>
        <input id="fullnameField" v-model="fullName" type="text" class="w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
      </div>
      <div class="relative mb-4">
        <label for="bioField" class="leading-7 text-sm text-gray-600 dark:text-gray-300">Bio</label>
        <textarea id="bioField" v-model="bio" class="w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-22 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out">
        </textarea>
      </div>
      <button :disabled="isEditLoading" class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg" @click="onEditProfile" >
      <BtnSpinner v-if="isEditLoading" class="inline mr-2"/>Edit 
      </button>
    </div>
  </div>
</section>
<section class="body-font relative">
  <div class="container px-5 py-2 mx-auto flex">
    <div class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md">
      <h2 class="text-lg mb-1 font-medium title-font">Delete Account</h2>
      <button :disabled="isDeleteLoading" class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg" @click="confirmDeleteModal =true"><BtnSpinner v-if="isDeleteLoading" class="inline mr-2"/>Delete</button>
    </div>
  </div>
</section>
  </div>
  <o-modal v-model:active="confirmDeleteModal" contentClass="modal-body grid grid-cols-1 gap-4 content-center" @close="confirmDeleteModal = true">
    <h2 class="mt-2 p-4 text-[1.3rem]">Delete Account</h2>
    <h2 class="mt-2 p-4 text-[1.3rem]">Action is irreversible</h2>
    <p class="p-4 mb-4 text-[1.3rem]">Are you sure?</p>
    <div class="flex">
      <CustomButton class="mx-auto" :icon="refGoTo" iconClass="transform -rotate-180" text="Nay" @click="confirmDeleteModal = false" />
      <CustomButton class="mx-auto" :icon="refGoTo" iconClass="transform rotate-90" text="Yup" @click="deleteAccount" />
    </div>
  </o-modal>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType } from "vue";
import DangLoader from "components/vote-list/loader.vue";
import CustomButton from 'components/functional/customButton.vue'
import { stackAlertError, stackAlertSuccess } from "@/store/alertStore";
import { formatNumber } from "shared/dist/utils/misc";
import { fetchWAuth } from 'shared/dist/utils/auth'
import { useMainStore } from "@/store/main";
import GoToIcon from 'icons/src/goTo.vue'
import { editProfile } from "shared/dist/utils/login-signup"
const refGoTo = GoToIcon
import type { IUserData } from "shared/dist/types/account";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { useRouter } from "vue-router";

const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export default defineComponent({
  name: "SettingsPage",
  components: { DangLoader, CustomButton, BtnSpinner  },
  props: {
    userData: {
      type: Object as PropType<IUserData>,
      default: {} as IUserData
    }
  },
  setup(props) {
    const isLoading = ref(true);
    const confirmDeleteModal = ref(false);
    const store = useMainStore()
    const bio = ref(props.userData.bio)
    const fullName = ref(props.userData.fullname)
    const isEditLoading = ref(false)
    const isDeleteLoading = ref(false)
    const router = useRouter()

    const deleteAccount = async () => {
      isDeleteLoading.value = true;
      confirmDeleteModal.value = false
      try {        
        const req = await fetchWAuth(store, `${API_BASE}/accounts/delete`, {
          method: 'DELETE'
        })
        if (req.ok) {
          localStorage.clear();
          store.isLoggedIn = false
          stackAlertSuccess('Account deleted successfully')
        } else {
          stackAlertError('Error while deleting account: '+ await req.text())
        }}
      catch {
        // ignore
      }
     isDeleteLoading.value = false;
     router.push('/')
    }

//     {
//     bio,
//     fullname,
//     avatar,
//     authToken,
//     loadState = null
// }

    const onEditProfile = async () => {
      console.log(editProfile)
      isEditLoading.value = true
      if ( await editProfile(  {
        bio: bio.value,
        fullname: fullName.value,
        authToken: store.userData.authToken
      })) {
        stackAlertSuccess('Account data successfully edited.')
      } else {
        stackAlertError('Error trying to edit.')
      }
      isEditLoading.value = false
    }

    // colStore.$subscribe(() => {
    //   refCollections.value = colStore.collections
    // })


    onMounted(async () => {
      // nothing
      isLoading.value = false
    });

    return {
      isLoading,
      formatNumber,
      confirmDeleteModal,
      deleteAccount,
      refGoTo,
      bio,
      fullName,
      onEditProfile,
      isEditLoading,
      isDeleteLoading
    };
  },
});
</script>

<style lang="scss">
.settings-section {
  .glassCard {
    background: var(--glass-menu-bg);
    color: var(--glassTxt);
    box-shadow: 0 8px 32px 0 var(--glassShadow);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

}
</style>
