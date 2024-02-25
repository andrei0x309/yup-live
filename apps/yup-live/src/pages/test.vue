<template>
  <div class="page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
      <h2>Check Yup Account raw influence:</h2>
      <div class="flex rounded bg-gray-200 w-[30rem] m-auto">
        <button
          type="button"
          class="m-2 rounded px-4 py-2 font-semibold text-gray-100"
          :class="'bg-purple-500'"
          @click="doGenerateApiToken"
        >
          DO
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import { generateApiToken } from "shared/src/utils/requests/warpcast";
import { useMainStore } from "@/store/main";
import { web3Libs } from "shared/src/utils/evmTxs";

export const TOKEN =
  import.meta.env.VITE_WC_TOKEN 

export default defineComponent({
  name: "TestPage",
  components: {},
  setup() {
    const store = useMainStore();

    // const registerFname = async () => {
    //   const res = await fetch("https://client.warpcast.com/v2/register-fname", {
    //     headers: {
    //       Authorization: `Bearer ${TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({
    //       fname: "a309",
    //     }),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // };

    // const checkMe = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/me', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`
    //         }
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const checkRegEligibility = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/address-registration-eligibility', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`,
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             message: '',
    //             signature: '',
    //             nonceId: '0x1'
    //         })
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const completeRegistartion = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/complete-registration', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`,
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'PUT',
    //         body: JSON.stringify({
    //             fnameProof: {
    //                 signature: '0x15b0af0867c9e46b0273eb8ddd61d435191260f308f75dcc171978b83d72946c514909996ce83c48d88a4410a0088509167b12172304b52e060fbbf47455bd571b',
    //                 name: 'yuptester',
    //                 timestamp: 1708793737
    //             }
    //         })
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const signupAtestation = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/signed-up-attestations', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`,
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             email: 'test@flashsoft.eu',
    //             recipientWalletAddress: '0x01Ca6f13E48fC5E231351bA38e7E51A1a7835d8D'
    //         })
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const addUsername = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/user-usernames', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`,
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             username: {
    //                 type: 'ens_l1',
    //                 name: 'dwr.eth'
    //             }
    //         })
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const updatedMe = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/me', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`,
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'PATCH',
    //         body: JSON.stringify({
    //             displayName: 'YupTester',
    //             bio: 'Bip, Bop, Testing account...',
    //             username: 'yup_tester'
    //         })
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const resetOnboarding = async () => {
    //     const res = await fetch('https://client.warpcast.com/v2/reset-onboarding-state', {
    //         headers: {
    //             Authorization: `Bearer ${TOKEN}`,
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'PUT',
    //         body: JSON.stringify({
    //             email: 'test@flashsoft.eu'
    //         })
    //     })
    //     const data = await res.json()
    //     console.log(data)
    // }

    // const setUserUsername = async () => {
    //   const res = await fetch("https://client.warpcast.com/v2/set-user-username", {
    //     headers: {
    //       Authorization: `Bearer ${TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "PUT",
    //     body: JSON.stringify({
    //       username: "370032",
    //     }),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // };

    // const createOnboarding = async () => {
    //   const timestamp = Math.floor(new Date().getTime() / 1000)
    //   const T = await generateApiToken({
    //     store,
    //     web3Libs: web3Libs(),
    //     timestamp
    //   });
    //   const res = await fetch("https://client.warpcast.com/v2/onboarding", {
    //     headers: {
    //       Authorization: `Bearer ${T}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "PUT",
    //     body: JSON.stringify({
    //         email: "test@flashsoft.eu",
    //         authRequest: {
    //             method: "generateToken",
    //             params: {
    //                 timestamp: 1708798367270,
    //             }
    //         }
    //     }),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // };

    // const verifyEmail = async () => {
    //   const res = await fetch("https://client.warpcast.com/v2/send-verification-email", {
    //     headers: {
    //       Authorization: `Bearer ${TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({
    //         email: "test@flashsoft.eu",
    //     }),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // };

    // const signInFarcaster = async () => {
    //   const res = await fetch("https://client.warpcast.com/v2/sign-in-with-farcaster", {
    //     headers: {
    //       Authorization: `Bearer ${TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({}),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // };

    // const getOnboarding = async () => {
    //   const T = await generateApiToken({
    //     store,
    //     web3Libs: web3Libs(),
        
    //   });
    //   console.log(T);
    //   const res = await fetch("https://client.warpcast.com/v2/onboarding-state", {
    //     headers: {
    //       Authorization: `Bearer ${T}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "PUT",
    //     body: JSON.stringify({
    //       authRequest: {
    //         method: "generateToken",
    //         params: {
    //           timestamp: 1708798367270,
    //         },
    //       },
    //     }),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    // };

    const getGetOnboarding = async () => {
      const res = await fetch("https://client.warpcast.com/v2/onboarding-state", {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await res.json();
      console.log(data);
    };


    // const getAuthTokens = async () => {
    //   const res = await fetch("https://client.warpcast.com/v2/auth", {
    //     headers: {
    //         Authorization: `Bearer ${TOKEN}`,
    //         "Content-Type": "application/json",
    //         },
    //         method: "GET",
    //     });
    //     const data = await res.json();
    //     console.log(data);
    // }

    onMounted(async () => {
      // do nothing
      getGetOnboarding()
    });

    const doGenerateApiToken = async () => {
      const token = await generateApiToken({
        store,
        web3Libs: web3Libs(),
      });
      console.log(token);
    };

    return {
      doGenerateApiToken,
    };
  },
});
</script>

<style lang="scss"></style>
