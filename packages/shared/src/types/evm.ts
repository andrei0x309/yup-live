import { web3Libs, getWeb3Modal } from 'shared/src/utils/evmTxs'
import { Ref } from 'vue'
import type { providers } from 'ethers'

export type Iweb3Libs = ReturnType<typeof web3Libs>

export type IethersLib = Ref<Awaited<Iweb3Libs["ethers"]>["default"]>
export type IuserProvider = Ref<providers.Web3Provider>
export type Iweb3Modal = Ref<Awaited<ReturnType<typeof getWeb3Modal>>>

export type IproviderOptionsProm = Iweb3Libs['providerOptionsProm']
export type Iweb3Mprom = Iweb3Libs['web3Mprom']
export type Iethers = Iweb3Libs['ethers']
