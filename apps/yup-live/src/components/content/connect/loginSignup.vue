<template>
  <div class="login-form">
    <div class="header">
      <h2>{{ formTitle }}</h2>
    </div>
    <Alert
      ref="alert"
      :noTimeout="true"
      style="max-width: 26rem; margin-left: auto; margin-right: auto"
    />
    <form v-if="!isLogin" id="registration-form" class="mt-8" @submit.prevent>
      <div class="mx-4 text-left -mt-4 glassCard text-[0.9rem]">
        <p class="mt-2 mb-4">To sign-up you need to pass one of the following requirements:</p>
        <ul>
          <li class="p-1 ml-4">
            Address has a
            <a
              class="underline underline-offset-4"
              href="https://docs.yup.io/protocol/yup-score"
              rel="nofollow"
              >yup score</a
            >
            of 25
          </li>
          <li class="p-1 ml-4">Address has been added to onboard allow list</li>
        </ul>
        <p class="mt-2 text-[0.8rem]">Many addresses are already on the allow list, so try signing up first!</p>
      </div>

      <input v-model="username" type="text" name="pass" placeholder="Username*" />
      <input v-model="fullname" type="text" name="text" placeholder="Full name" />
      <textarea v-model="bio" name="text" placeholder="Bio"></textarea>
      <button class="login-btn" @click="onSignupLocal">Sign Up</button>
    </form>

    <form v-else class="login-view" @submit.prevent>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-32 mx-auto"
        style="opacity: 0.75"
        viewBox="0 0 366 366"
        fill="none"
      >
        <path
          d="M182.911 366C82.1487 366 0 283.851 0 182.911C0 81.9697 82.1487 0 182.911 0C283.672 0 365.821 82.1487 365.821 182.911C365.821 283.672 283.851 366 182.911 366ZM182.911 17.3604C91.6342 17.3604 17.1814 91.6342 17.1814 183.089C17.1814 274.545 91.4553 348.819 182.911 348.819C274.366 348.819 348.64 274.545 348.64 183.089C348.64 91.6342 274.366 17.3604 182.911 17.3604Z"
          fill="currentColor"
        />
        <path
          d="M129.218 156.959C105.952 156.959 86.8018 139.241 84.4751 116.69C84.1172 114.185 86.2649 111.858 88.9495 111.858H97.0033C99.5089 111.858 101.657 113.827 102.014 116.332C104.162 129.576 115.616 139.599 129.397 139.599C143.178 139.599 154.633 129.576 156.78 116.332C157.138 113.827 159.286 111.858 161.792 111.858H169.845C172.53 111.858 174.499 114.185 174.32 116.69C171.635 139.241 152.306 156.959 129.218 156.959Z"
          fill="currentColor"
        />
        <path
          d="M277.05 148.19H268.997C266.491 148.19 264.343 146.221 263.985 143.715C261.838 130.471 250.383 120.449 236.602 120.449C222.822 120.449 211.367 130.471 209.22 143.715C208.862 146.221 206.714 148.19 204.208 148.19H196.155C193.47 148.19 191.501 145.863 191.68 143.357C194.186 120.807 213.336 103.089 236.424 103.089C259.511 103.089 278.84 120.807 281.167 143.357C281.883 145.863 279.735 148.19 277.05 148.19Z"
          fill="currentColor"
        />
        <path
          d="M185.058 306.939C115.616 308.192 58.8818 250.204 58.8818 180.763V178.615C58.8818 176.289 60.8505 174.32 63.1772 174.32H302.464C304.791 174.32 306.76 176.289 306.76 178.615V182.911C306.939 250.562 252.531 305.865 185.058 306.939ZM79.8217 191.68C78.2109 191.68 76.7791 193.112 76.9581 194.723C82.8642 248.057 128.144 289.579 182.91 289.579C237.676 289.579 282.956 248.057 288.862 194.723C289.041 193.112 287.788 191.68 285.999 191.68H79.8217Z"
          fill="currentColor"
        />
      </svg>
      <button role="button" class="login-btn" @click="onLoginLocal">Log in</button>
    </form>

    <div>
      <button class="option" @click="isLogin ? onNewUser() : onBack()">
        <p class="option-text">
          <svg
            v-if="!isLogin"
            class="backIcon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"
              />
            </g>
          </svg>
          {{ isLogin ? `Create New account` : "Back" }}
        </p>
      </button>
      <p style="opacity: 0.7; font-size: 0.7rem; padding: 2rem">
        Don't have a wallet YET😱? Consider using this wallet I made:
        <a
          style="text-decoration: underline; display: block"
          href="https://chrome.google.com/webstore/detail/clear-evm-wallet-clw/djlahdpfkflehaepgohnnodmaajabdlg?hl=en&authuser=0"
          target="_blank"
          >Clear EVM Wallet (CLW)</a
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref  } from "vue";

import Alert from "components/functional/alert.vue";
import { useMainStore } from "@/store/main";
import type { PartialAccountInfo } from "shared/src/types/account";
import { onLogin, onSignup } from "shared/src/utils/login-signup";
import { closeConnectModal } from "@/store/main";
import { getConnected } from "shared/src/utils/requests/accounts";

export default defineComponent({
  name: "LoginSignup",
  components: {
    Alert,
  },
  props: {
    loadState: {
      type: Function,
      default: () => ({}),
    },
    loginState: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["loading"],
  setup(props) {
    // const provider = (ref(null) as unknown) as Ref<ethers.providers.Web3Provider>;
    // const web3Modal = (ref(null) as unknown) as Ref<Web3Modal>;
    const isLogin = ref(props.loginState);
    const formTitle = ref(isLogin.value ? "Log in" : "Sign up");
    const mainStore = useMainStore();
    const fullname = ref("");
    const username = ref("");
    const bio = ref("");
    const alert = ref(null) as unknown as Ref<typeof Alert>

    const onBack = () => {
      formTitle.value = "Log-in";
      isLogin.value = true;
    };

    const onNewUser = () => {
      formTitle.value = "Gated Sign-up";
      isLogin.value = false;
    };

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

    const doLogin = ({
      address,
      account,
      signature,
      authToken,
    }: {
      address: string;
      account: PartialAccountInfo;
      signature: string;
      authToken: string;
    }) => {
      try {
        localStorage.setItem("address", address);
        localStorage.setItem("account", account._id);
        localStorage.setItem("signature", signature);
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("avatar", account.avatar);
        localStorage.setItem("weight", String(account.weight));
        mainStore.userData = {
          address,
          account: account._id,
          signature,
          avatar: account.avatar,
          weight: account.weight as number,
          authToken,
        };
        getConnected(mainStore, mainStore.userData.account)
        mainStore.isLoggedIn = true;
      } catch (error) {
        console.error("Failed to set auth data", error);
      }
    };

    const doExtensionLogin = (a: unknown) => {
      try {
        type setYupAuthFn = (a: unknown) => typeof a;
        ((window as unknown) as { yupSetAuth: setYupAuthFn }).yupSetAuth(a);
      } catch {
        // ignore
      }
    };

    const doAllLogin = (params: Awaited<ReturnType<typeof onSignup>>) => {
      if (params) {
        const { address, _id, avatar, weight, signature, authToken, username } = params;
        doLogin({
          address,
          account: {
            _id,
            avatar,
            weight,
          },
          signature,
          authToken,
        });
        doExtensionLogin({
          ethSignature: signature,
          userId: _id,
          address,
          authToken,
          username,
        });
        props.loadState("close");
      }
    };

    const onSignupLocal = async () => {
      const signupResult = await onSignup({
        loadState: props.loadState,
        setAlert,
        username: username.value,
        bio: bio.value,
        fullname: fullname.value,
      });
      doAllLogin(signupResult);
      if (signupResult?._id) {
        closeConnectModal(mainStore);
      }
    };

    const onLoginLocal = async () => {
      const loginResult = await onLogin({
        loadState: props.loadState,
        setAlert,
      });
      doAllLogin(loginResult);
      if (loginResult?._id) {
        closeConnectModal(mainStore);
      }
    };

    onMounted(() => {
      // nothing
    });

    return {
      onSignupLocal,
      onLoginLocal,
      onBack,
      onNewUser,
      formTitle,
      isLogin,
      fullname,
      username,
      bio,
      alert
    };
  },
});
</script>

<style lang="scss">
@use '@/assets/inputs';

.login-form {
  margin: 0;
  padding-bottom: 1rem;
  background: rgb(126 126 126 / 18%);
  width: 100%;
  height: 100%;
  position: relative;
  top: -1rem;
  display: grid;

  .login-view {
    margin-top: 3rem;
  }

  ::selection {
    background: rgba(255, 255, 255, 0.5);
    color: #333;
  }
  ::-moz-selection {
    background: rgba(0, 0, 0, 0.5);
    color: red;
  }

  .header {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    height: auto;
    background: rgba(3, 3, 3, 0.1);
    top: 1rem;
    align-self: flex-start;
  }

  .header h2 {
    margin: 0;
    padding: 10px 0;
    text-align: center;
    font-weight: 300;
    font-size: 21px;
    color: rgba(255, 255, 255, 0.5);
  }

  @include inputs.inputsShare;

  .login-btn {
    border-radius: 4px;
    text-align: center;
    background: rgb(106 33 187 / 87%);
    font-size: 1.4rem;
    filter: drop-shadow(1px 2px 1px #cccccc1c) saturate(0.7);
    color: #fff;
    width: 12rem;
    text-transform: uppercase;
  }

  .option {
    position: relative;
    display: block;
    width: 45%;
    margin: auto;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background: rgba(12, 12, 12, 0.719);
    border-bottom: 2px solid rgb(156, 49, 228);
    cursor: pointer;
  }

  .option-text {
    position: relative;
    margin: 0;
    line-height: 30px;
    color: #ccc;
    text-align: center;
    font-size: 1rem;
    font-weight: 100;
    text-transform: uppercase;
  }

  // #registration-form {
  //   display: none;
  // }

  .backIcon {
    width: 1.2rem;
    display: inline-block;
    position: relative;
    color: aliceblue;
  }
}
</style>
