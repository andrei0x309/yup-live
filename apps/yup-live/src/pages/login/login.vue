<template>
  <div class="get-access-page lg:max-w-[90rem] md:max-w-[60rem] py-2 mx-auto flex items-center justify-center h-full">
    <div class="bg-color max-w-screen-lg px-4 md:px-8 mx-auto rounded">
      <div class="mx-8 my-8 flex flex-col">
        <div class="my-4">
          <p class="text-[1rem] my-2">Login</p>
          <Alert ref="alert" :noTimeout="true" style="max-width: 26rem; margin-left: auto; margin-right: auto" />
        </div>
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
          :disabled="loading"
          class="bg-rose-600 border-0 py-2 px-6 focus:outline-none hover:bg-rose-700 rounded text-lg mt-4 text-gray-300 hover:text-white"
          @click="
            () => {
              doLogin()
            }
          "
        >
          <WalletIcon v-if="!loading" class="w-6 inline mr-2" />
          <BtnSpinner v-if="loading" class="inline mr-2" />Login
        </button>

        <div class="box get-access">
          <p>
            <svg class="svg" height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(3 3)"
              >
                <path d="m6.5 10.5 3-3-3-3" />
                <path d="m5 3v9" transform="matrix(0 1 -1 0 12.5 2.5)" />
                <path
                  d="m1.5 5.5v-3.0079176c0-1.10147263.89060277-1.99561512 1.99206673-1.99998427l7.95228497-.03160773c1.1045608-.00432011 2.0035361.8875515 2.0079175 1.99211231l.0398162 10.02918369c.0043323 1.1045608-.8875404 2.003535-1.9921012 2.0079309-.0026436 0-.0052873 0-.0079309 0h-7.9920533c-1.1045695 0-2-.8954305-2-2v-2.9897173"
                />
              </g>
            </svg>
            Getting Access
          </p>
          <div style="font-size: 0.9rem">
            <div style="margin: 0.5rem">
              <p class="p-2 text-left">
                This page was protected because is less often maintained and other reasons. If you really want to get access there's an
                automatic process to get access that requires 2 transactions and 309 YUP tokens.
              </p>
                <p class="p-2 text-left">
                If you wish to continue the button below will take you to the frontend to interact with the contract.
              </p>
              <p class="p-2 text-left">
                <o-tooltip :triggers="['hover']" :autoClose="true" :multiline="true">
              <template #content>
                  <p class="p-2 ">Go to playstore.</p>
              </template>
              <a href="https://play.google.com/store/apps/details?id=gf.info.yup" target="_blank" class="text-[#e0e0e0] font-extrabold">YupLive </a>
            </o-tooltip>
              on Android can still be used without access.
              </p>
            </div>
            <button
              class="enter bg-rose-600 border-0 py-2 px-6 focus:outline-none hover:bg-rose-700 rounded text-lg mt-4 text-gray-300 hover:text-white"
              @click="
                () => {
                  gotoGetAccess()
                }
              "
            >
              <svg
                id="svg1025"
                class="svg"
                version="1.1"
                viewBox="0 0 19.05 19.050001"
                width="72"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlns:svg="http://www.w3.org/2000/svg"
              >
                <defs id="defs1022" />
                <g id="layer1" style="opacity: 1">
                  <g id="g1739">
                    <path
                      id="path6466"
                      d="m 1.7764548,6.5494847 c 0,0 -0.7574139,3.1687735 4.7969436,3.1687735"
                      style="
                        font-variation-settings: normal;
                        fill: none;
                        fill-opacity: 1;
                        stroke: #dfdfdf;
                        stroke-width: 0.500001;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-miterlimit: 4;
                        stroke-dasharray: none;
                        stroke-dashoffset: 0;
                        stroke-opacity: 1;
                        paint-order: markers fill stroke;
                        stop-color: #bebebe;
                      "
                    />
                    <path
                      id="path6468"
                      d="M 6.5733984,9.7182582 H 17.306333 L 14.623099,6.5495805"
                      style="
                        font-variation-settings: normal;
                        fill: none;
                        fill-opacity: 1;
                        stroke: #dfdfdf;
                        stroke-width: 0.500001;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-miterlimit: 4;
                        stroke-dasharray: none;
                        stroke-dashoffset: 0;
                        stroke-opacity: 1;
                        paint-order: markers fill stroke;
                        stop-color: #bebebe;
                      "
                    />
                    <path
                      id="path6806"
                      d="M 17.306333,9.7182582 14.623099,12.500515"
                      style="
                        font-variation-settings: normal;
                        fill: none;
                        fill-opacity: 1;
                        stroke: #dfdfdf;
                        stroke-width: 0.500001;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-miterlimit: 4;
                        stroke-dasharray: none;
                        stroke-dashoffset: 0;
                        stroke-opacity: 1;
                        paint-order: markers fill stroke;
                        stop-color: #bebebe;
                      "
                    />
                  </g>
                </g>
              </svg>
              Get access
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <o-modal v-model:active="successModal" contentClass="modal-body justify-center content-center grid">
    Transactions were sent successfully.
    <br />
    You'll be able to login as soon as transactions are processed.
    <br />
    You should recive an email when transactions were processed.
    <br /><br />
  </o-modal>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import { useHead } from 'unhead'
import { checkAccess, setAccess } from 'shared/src/utils/get-access'
import { TWeb3Libs, web3Libs } from 'shared/src/utils/evmTxs'
import WalletIcon from 'icons/src/walletIcon.vue'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import { validateEmail } from 'shared/src/utils/misc'
import { wait } from 'shared/src/utils/time'
import Alert from 'components/functional/alert.vue'
import { useRouter, useRoute } from 'vue-router'
import { OTooltip } from '@oruga-ui/oruga-next'

    const siteData = {
      title: `Login to Yup Live`,
      description: `Login to yup live to access all features`
    }

    useHead({
      title: siteData.title,
      meta: [
        {
          name: 'description',
          content: siteData.description
        },
        {
          name: 'og:image',
          content: `/share/yup-live-ogs/og-yup-live-changelog.png`
        }
      ]
    })

    const email = ref('') as Ref<string>
    const password = ref('') as Ref<string>
    const loading = ref(false) as Ref<boolean>
    const Web3Libs = ref(null) as unknown as Ref<TWeb3Libs>
    const successModal = ref(false) as Ref<boolean>
    const router = useRouter()
    const route = useRoute()
    const eQuery = route.query.e || ''
    const errorCode = ref(route.params.errorCode || eQuery)

    const alert = ref(null) as unknown as Ref<typeof Alert>

    const setAlert = ({ message = '', type = 'error' }: { message: string; type: string }) => {
      if (type === 'error') alert.value?.showErr(message)
      else alert.value?.showSuccess(message)
    }

    const stackAlertWarning = (message: string) => setAlert({ message, type: 'error' })

    const errorLogin = {
      0: 'Invalid credentials provided',
      2: 'Account is expired you need to renew access',
      3: 'Backend error, please try again later'
    } as Record<number, string>

    const doLogin = async () => {
      loading.value = true
      await wait(200)

      if (!password.value) {
        stackAlertWarning('Password is required')
        loading.value = false
        return
      }

      if (!email.value) {
        stackAlertWarning('Email is required')
        loading.value = false
        return
      }

      if (!validateEmail(email.value)) {
        stackAlertWarning('Invalid email')
        loading.value = false
        return
      }

      setAccess({ email: email.value, password: password.value })
      
      const res = await checkAccess()
      if (res === 1) {
        window.location.href = '/index.html'
        return
      }
      stackAlertWarning(errorLogin[res] || 'Unknown error')
      loading.value = false
    }
    

    const gotoGetAccess = async () => {
      router.push('/get-access')
    }

    onMounted(async () => {
      if (errorCode.value) {
        const index = Number(errorCode.value)
        stackAlertWarning(errorLogin[index] || 'Unknown error')
      }

      try {
        Web3Libs.value = web3Libs()
      } catch (error) {
        console.error(error)
      }
    })
</script>

<style scoped lang="scss">
.page-log {
  min-height: calc(100vh - 2rem);
  text-align: justify;
}

a.enter {
  background-image: linear-gradient(to top, #1c1e21b8, #2c2d2fa8, #303031a1, #595e6b, #1c1c1c40);
  padding: 0.4rem 0.8rem;
  border-radius: 0.125rem;
  color: #fff;
  font-weight: 400;
  text-decoration: none;
  display: inline-block;
  margin-top: 0.5rem;
  box-shadow: #00000036 3px 4px 3px;
  margin-bottom: 0.5rem;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
  display: block;
  max-width: 10rem;
  text-transform: uppercase;
  transition-delay: 0.1s;
  transition: all 0.2s ease-in-out;
}

a.enter:hover {
  background-image: linear-gradient(to top, #1c1e21b8, #2c2d2fa8, #303031f5, #777777, #1c1c1c40);
  box-shadow: #00000036 3px 4px 3px;
  color: #f7b86f;
}

.box {
  max-width: 32rem;
  width: 100%;
  background: rgb(40 32 38 / 33%);
  padding: 1rem;
  border-radius: 0.125rem;
  margin: 0 auto;
  box-shadow: #00000036 2px 2px 2px;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.svg {
  width: 1.4rem;
  color: aliceblue;
  display: inline-block;
}

header {
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.input {
  font-weight: 200;
  border-radius: 0.125rem;
  background: var(--gray-800);
  border: 1px solid var(--gray-700);
  padding: 0.5rem 1rem;
  width: 100%;
  color: #fff;
  margin-bottom: 0.6rem;
}

#input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
</style>
