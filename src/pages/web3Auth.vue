<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
      <h2>Web3Auth Demo Vue:</h2>
        <section>
      <button
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 mb-2" style="cursor: pointer; background: blueviolet;" @click="login">Sign In</button>
      <br><button 
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100" style="cursor: pointer; background: darkslategray;" @click="getUserInfo">Get User Info</button>
      <button  
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100" style="cursor: pointer; background: darkslategray;" @click="getChainId">Get Chain ID</button>
      <br><button  
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100" style="cursor: pointer; background: darkslategray;" @click="getAccounts">Get Accounts</button>
      <button
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100" style="cursor: pointer; background: darkslategray;" @click="getBalance">Get Balance</button>
      <br><button  
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100" style="cursor: pointer; background: darkslategray;" @click="sendTransaction">Send Transaction</button>
      <button  
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100" style="cursor: pointer; background: darkslategray;" @click="signMessage">Sign Message</button>
      <br><button  
    type="button"
    class="m-2 rounded px-4 px-4 py-2 font-semibold text-gray-100 mb-4" style="cursor: pointer; background: brown;" @click="logout">Logout</button>
    </section>
    <div id="console" style="white-space: pre-line">
      <textarea id="log" readonly :innerHTML="log"></textarea>
    </div>
    </div>
    </div>
</template>


<script lang="ts">

import { ref, onMounted } from "vue";
import { Web3Auth } from "@web3auth/web3auth";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./ethersRPC";

export default {
  name: "Home",
  props: {
    msg: {
        type: String,
        default: ""
    }
  },
  setup() {
    const loading = ref<boolean>(false);
    const loginButtonStatus = ref<string>("");
    const connecting = ref<boolean>(false);
    let provider = ref<SafeEventEmitterProvider | any>(null);
    const clientId = "BF7Vr3M1qOC2-EIkKL0Nce8VRdhtD4EHKSQ23bVRqzbMOmbczledc7Tu1_Tj9uugqobyjSiGuROQX5mz1dhIzko"; // get from https://dashboard.web3auth.io
    const log =ref<string>("");

      const web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["twitter", "github", "google", "dsicord", "twitch", "passwordless", ],
          appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
        }
      });

    onMounted(async () => {
      try {
        loading.value = true;

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId,
          network: "testnet",
          uxMode: "popup", 
          whiteLabel: {
            name: "YUP APP",
            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            defaultLanguage: "en",
            dark: true, // whether to enable dark mode. defaultValue: false
          },
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: "openlogin",
            loginMethods: {
              reddit: {
                showOnModal: false,
                name: "reddit",
              },
              facebook: {
                showOnModal: false,
                name: "facebook",
              },
            },
          },
        },
      });
        if (web3auth.provider) {
          provider.value = web3auth.provider;
        };
      } catch (error) {
        console.log("error", error);
        console.log("error", error);
      } finally {
        loading.value = false;
      }
    });

    const login = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      provider.value = await web3auth.connect();
    };

    const getUserInfo = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const user = await web3auth.getUserInfo();
       log.value = JSON.stringify(user, null, 2);
    };

    const logout = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      await web3auth.logout();
      provider.value = null;
      log.value = "";
    };

  const getChainId = async () => {
    if (!provider.value) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider.value);
    const chainId = await rpc.getChainId();
    log.value = JSON.stringify(chainId, null, 2);
  };
  const getAccounts = async () => {
    if (!provider.value) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider.value);
    const address = await rpc.getAccounts();
    log.value = JSON.stringify(address, null, 2);
  };

  const getBalance = async () => {
    if (!provider.value) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider.value);
    const balance = await rpc.getBalance();
    log.value = JSON.stringify(balance, null, 2);
  };

  const sendTransaction = async () => {
    if (!provider.value) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider.value);
    const receipt = await rpc.sendTransaction();
    log.value = JSON.stringify(receipt, null, 2);
  };

  const signMessage = async () => {
    if (!provider.value) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider.value);
    const signedMessage = await rpc.signMessage();
    log.value = JSON.stringify(signedMessage, null, 2);
  };

  const getPrivateKey = async () => {
    if (!provider.value) {
      console.log("provider not initialized yet");
      return;
    }
    // const rpc = new RPC(provider.value);
    // const privateKey = await rpc.getPrivateKey();
    // console.log(privateKey);
  };
    return {
      loading,
      loginButtonStatus,
      connecting,
      provider,
      web3auth,
      login,
      logout,
      getUserInfo,
      getChainId,
      getAccounts,
      getBalance,
      sendTransaction,
      signMessage,
      getPrivateKey,
      log
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin: 1.4rem;
  font-size: 1.5rem
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#log {
  width: 42rem;
  height: 20rem;
  background: #222;
  color: #21bb21;
  padding: 1.6rem;
  border-radius:1rem;
}

</style>