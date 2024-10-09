<template>
  <ion-accordion value="switchacc">
    <ion-item slot="header" color="light">
      <ion-label>Manage/Switch Accounts</ion-label>
    </ion-item>
    <div slot="content" class="ion-padding flex flex-col items-center">
      <div v-for="(account, id) in storedAccounts" :key="id" class="p-4 w-full">
        <div
          class="h-full bg-[#00000025] bg-opacity-75 p-8 rounded-lg text-center relative"
        >
          <AvatarBtn
            :pSource="account.avatar ?? ''"
            :isSelf="false"
            class="mb-3 object-cover object-center rounded-full inline-block bg-[#00000025]"
            :imgClass="`[&]:w-10 [&]:h-10`"
          />
          <p class="tracking-widest text-xs title-font font-mediu">
            ID: {{ account.account }}
          </p>
          <p class="text-[0.8rem]">Address: {{ account.address }}</p>
          <button
            v-if="store.userData.account !== id"
            class="text-white bg-red-600 border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded text-medium mt-2 mr-1"
            @click="removeAccount(String(id))"
          >
            <BtnSpinner v-if="isLoading" class="inline mr-2" />Remove
          </button>
          <button
            v-if="store.userData.account !== id"
            class="text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-medium mt-2 ml-1"
            @click="doSwitchAccount(String(id))"
          >
            <BtnSpinner v-if="isLoading" class="inline mr-2" />Switch
          </button>
        </div>
      </div>

      <button
        :disabled="isLoading"
        class="bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
        @click="addAccount"
      >
        <BtnSpinner v-if="isLoading" class="inline mr-2" />Add Account
      </button>
    </div>
  </ion-accordion>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from "vue";
import { useMainStore } from "@/store/main";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { onLogin, walletDisconnect } from "shared/src/utils/login-signup";
import { stackAlertWarning } from "@/store/alert-store";
import { storage } from "@/utils/storage";
import AvatarBtn from "components/functional/avatarBtn.vue";

import { IonItem, IonLabel, IonAccordion } from "@ionic/vue";

// const API_BASE = import.meta.env.VITE_YUP_API_BASE;

type StoredAccount = {
  authToken: string;
  account: string;
  weight: number | null | undefined | string;
  address: string;
  fid?: string | null | undefined;
  avatar: string | null | undefined;
};

type StoredAccounts = {
  [key: string]: StoredAccount;
};

export default defineComponent({
  name: "SettingsAddAccount",
  components: {
    BtnSpinner,
    AvatarBtn,
    IonItem,
    IonLabel,
    IonAccordion,
  },
  setup() {
    const isLoading = ref(false);

    const store = useMainStore();
    const storedAccounts = ref<StoredAccounts>({});

    const doSwitchAccount = (id: string) => {
      switchAccount(storedAccounts.value[id]);
      location.reload();
    };

    const switchAccount = async (account: StoredAccount) => {
      const userAuth = {
        address: account.address,
        account: account.account,
        signature: "",
        avatar: account.avatar || "",
        authToken: account.authToken,
        weight: Number(account.weight ?? "1"),
        fid: "",
        isTwitterBlue: false,
      };
      await storage.set("authInfo", JSON.stringify(userAuth));
      store.userData = userAuth;
    };

    const storeAccounts = async (loginResult: Awaited<ReturnType<typeof onLogin>>) => {
      if (!loginResult) return;

      for (const acc of loginResult ?? []) {
        storedAccounts.value[acc.account] = {
          authToken: acc.authToken,
          account: acc.account,
          weight: acc.weight,
          address: acc.address,
          avatar: acc.avatar,
        };
      }

      await storage.set("storedAccounts", JSON.stringify(storedAccounts.value));

      if (loginResult.length) {
        doSwitchAccount(loginResult?.[0].account);
      }
    };

    const addAccount = async () => {
      isLoading.value = true;
      try {
        await walletDisconnect();
        const loginNewAccounts = await onLogin({
          mobile: true,
          loadState: null,
          setAlert: null,
          cancelPromise: null,
          timeout: null,
        });
        if (!loginNewAccounts) {
          stackAlertWarning("Failed to login new account, please try again later");
          isLoading.value = false;
          return;
        }
        await storeAccounts(loginNewAccounts);
        isLoading.value = false;
      } catch (e) {
        stackAlertWarning("Failed to add account, please try again later");
        console.error(e);
      }
    };

    const removeAccount = (id: string) => {
      isLoading.value = true;
      storedAccounts.value = Object.fromEntries(
        Object.entries(storedAccounts.value).filter(([key]) => key !== id)
      );
      storage.set("storedAccounts", JSON.stringify(storedAccounts.value));
      isLoading.value = false;
    };

    onMounted(async () => {
      try {
        storedAccounts.value = JSON.parse((await storage.get("storedAccounts")) || "{}");
      } catch (e) {
        console.error(e);
      }
    });

    return {
      removeAccount,
      addAccount,
      doSwitchAccount,
      isLoading,
      storedAccounts,
      store,
    };
  },
});
</script>

<style lang="scss"></style>
