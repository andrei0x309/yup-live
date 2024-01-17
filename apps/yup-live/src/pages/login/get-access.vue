<template>
<div class="get-access-page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto flex items-center justify-center h-full">
    <div class="bg-color max-w-screen-lg px-4 md:px-8 mx-auto rounded ">
      <div class="mx-8 my-8 flex flex-col">
        <p class="text-[1rem]">Get Access by interacting with polygon contract</p>
            <Alert
        ref="alert"
        :noTimeout="true"
        style="max-width: 26rem; margin-left: auto; margin-right: auto"
      />
        <small class="my-4">
          <ul class="get-access-notes">
            <li>
              Two transactions will be requested (first tx - [yup token approval for 309 yup], second tx - [ addAccess ])
            </li>
            <li>You will need to have <b>309 </b>  
              <o-tooltip :triggers="['hover']" :autoClose="true" :multiline="true">
              <template #content>
                  <p class="p-2 ">Click to see the token on polygonscan.</p>
              </template>
              <a href="https://polygonscan.com/token/0x086373fad3447f7f86252fb59d56107e9e0faafa" target="_blank" class="text-[#e0e0e0] font-extrabold"> yup tokens</a>
            </o-tooltip>
            in order to invoke <b>addaccess</b></li>
            <li>Email will be stored on chain</li>
            <li>
              Credentials will not work immediately, it usually takes 5-10 minutes for
              transactions to be processed
            </li>
            <li>Once transactions are processed, you will be able to login</li>
            <li>You should recive an email when transaction was processed</li>
            <li>
              Access is granted withouth any time limit
            </li>
            <li>If you forgot your password, you can repeat the process with same email. This update your process to a new one.</li>
          </ul></small
        >
        <form class="flex flex-col">
        <input
          v-model="email"
          type="text"
          name="ident"
          placeholder="Email"
          class="mb-4 rounded p-2 text-[#e0e0e0]"
          autocomplete="email"
        />
        <input
          v-model="password"
          type="password"
          name="pass"
          placeholder="Password"
          class="mb-4 rounded p-2 text-[#e0e0e0]"
          autocomplete="new-password"
        />
      </form>
        <button
          :key="buttonText"
          :disabled="loading"
          class="bg-rose-600 border-0 py-2 px-6 focus:outline-none hover:bg-rose-700 rounded text-lg mt-4 text-gray-300 hover:text-white"
          @click="
            () => {
              doGetAccess();
            }
          "
        >
          <WalletIcon v-if="!loading" class="w-6 inline mr-2" />
          <BtnSpinner v-if="loading" class="inline mr-2" />{{ buttonText }}
        </button>

        <div style="font-size: 0.9rem; margin-top: 2rem;">
        Contract is open source - <a href="https://github.com/andrei0x309/yuplive-access" rel="noopener noreferrer">https://github.com/andrei0x309/yuplive-access</a>
        </div>
      </div>
    </div>
  </div>
  <o-modal v-model:active="successModal" contentClass="modal-body justify-center content-center grid bg-gray-950">
  <div class="flex flex-col items-center justify-center bg-gray-950 text-green-600">
    Transactions were sent successfully.
    <br />
    You'll be able to login as soon as transactions are processed.
    <br />
    You should recive an email when transactions were processed.
    <br /><br />
    </div>
  </o-modal>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import { useHead } from 'unhead'
import { getAccess, setAccess, checkAccess } from "shared/src/utils/get-access";
import { TWeb3Libs, web3Libs } from "shared/src/utils/evmTxs";
import WalletIcon from "icons/src/walletIcon.vue";
import BtnSpinner from "icons/src/btnSpinner.vue";
import { validateEmail } from "shared/src/utils/misc";
import { wait } from 'shared/src/utils/time'
import Alert from "components/functional/alert.vue";
import { OTooltip } from '@oruga-ui/oruga-next'


    const siteData = {
      title: `Get access to Yup Live`,
      description: `Get access to yup live to access all features`,
    };

    useHead({
      title: siteData.title,
      meta: [
        {
          name: "description",
          content: siteData.description,
        },
        {
          name: "og:image",
          content: `/share/yup-live-ogs/og-yup-live-changelog.png`,
        },
      ],
    });
 
    const email = ref("") as Ref<string>;
    const password = ref("") as Ref<string>;
    const loading = ref(false) as Ref<boolean>;
    const Web3Libs = (ref(null) as unknown) as Ref<TWeb3Libs>;
    const successModal = ref(false) as Ref<boolean>;
    const buttonText = ref("Confirm Transactions") as Ref<string>;

  const alert = ref(null) as unknown as Ref<typeof Alert>


  const setAlert = ({
    message = "",
    type = "error",
  }: {
    message: string;
    type: string;
  }) => {
    if(type === "error") alert.value?.showErr(message)
    else alert.value?.showSuccess(message)
  };


  const stackAlertWarning = (message: string) => setAlert({ message, type: "error" });
  const stackAlertSuccess = (message: string) => setAlert({ message, type: "success" });
 

    const doGetAccess = async () => {
      loading.value = true;
      await wait(300)
      try {
        if (!password.value) {
          stackAlertWarning("Password is required");
          loading.value = false;
          return;
        }

        if (!email.value) {
          stackAlertWarning("Email is required");
          loading.value = false;
          return;
        }

        if (!validateEmail(email.value)) {
          stackAlertWarning("Invalid email");
          loading.value = false;
          return;
        }

        setAccess({
          email: email.value,
          password: password.value,
        });

        if(await checkAccess() === 1) {
          stackAlertWarning("You already have access, please login");
          loading.value = false;
          return;
        }

        const recentSuccess = localStorage.getItem("recentSuccessGetAccess");
        if (recentSuccess) {
          const now = new Date().getTime();
          const recentSuccessTime = parseInt(recentSuccess);
          const diff = now - recentSuccessTime;
          if (diff < 1000 * 60 * 60 * 24) {
            stackAlertWarning("You already did this recently, please wait 24 hours");
            loading.value = false;
            return;
          }
        }

        const res = await getAccess({
          email,
          password,
          Web3Libs,
          buttonText,
          stackAlertSuccess,
          stackAlertWarning,
        });
        if (res) {
          successModal.value = true;
          localStorage.setItem("recentSuccessGetAccess", new Date().getTime().toString());
        }
      } catch (error) {
        console.error(error);
      }
      loading.value = false;
    };

    onMounted(async () => {
      try {
        Web3Libs.value = web3Libs();
      } catch (error) {
        console.error(error);
      }
    });

</script>

<style scoped lang="scss">
</style>
