<template>
  <section class="body-font relative">
    <div class="container px-5 py-2 mx-auto flex">
      <div
        class="glassCard rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative shadow-md"
      >
        <h2 class="text-lg mb-1 font-medium title-font">Add Team Members</h2>

        <template v-if="isProcessing">
          <div class="flex justify-center">
            <BtnSpinner class="w-6 h-6" />
          </div>
        </template>

        <template v-if="admins.length === 0">
          <p class="text-[1rem]">No members yet</p>
        </template>
        <template v-else>
          <p class="text-[1rem]">Members:</p>
          <small class="my-4">
            <ul>
              <li v-for="admin in admins" :key="admin">
                <div class="flex justify-between">
                  <p>{{ admin }}</p>
                  <button
                    class="bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
                    @click="() => doRemoveAdmin(admin)"
                  >
                    <RedSkyIcon class="w-6 inline mr-2 bg-gray-200 rounded-full" />
                    Remove
                  </button>
                </div>
              </li>
            </ul></small
          >
        </template>

        <div class="mx-8 flex flex-col mt-4">
          <p class="text-[1rem]">Add</p>
          <input
            v-model="inAddress"
            type="text"
            name="ident"
            placeholder="ETH Address"
            class="mb-4 rounded p-2 text-[#222]"
          />
          <button
            class="bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg mt-4"
            @click="() => doAddAdmin()"
          >
            <BlueSkyIcon class="w-6 inline mr-2 bg-gray-200 rounded-full" />
            Add member
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from "vue";
import { useMainStore } from "@/store/main";
// import BtnSpinner from "icons/src/btnSpinner.vue";
import { addAdmin, getAdmins, removeAdmin } from "shared/src/utils/requests/teams";

// const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: "SettingsAddTeam",
  components: {},
  setup() {
    const inAddress = ref("");
    const isProcessing = ref(false);
    const admins = ref([]) as Ref<string[]>;
    const store = useMainStore();

    const doAddAdmin = async () => {
      isProcessing.value = true;
      try {
        if (
          await addAdmin({
            address: inAddress.value,
            store,
          })
        ) {
          admins.value.push(inAddress.value);
        }
      } catch (e) {
        console.error(e);
      }
      isProcessing.value = false;
    };

    const doRemoveAdmin = async (address: string) => {
      isProcessing.value = true;
      try {
        if (
          await removeAdmin({
            address,
            store,
          })
        ) {
          admins.value = admins.value.filter((a) => a !== address);
        }
      } catch (e) {
        console.error(e);
      }
      isProcessing.value = false;
    };

    onMounted(async () => {
      admins.value = await getAdmins({ store });
    });

    return {
      inAddress,
      doAddAdmin,
      doRemoveAdmin,
      admins,
      isProcessing,
    };
  },
});
</script>

<style lang="scss"></style>
