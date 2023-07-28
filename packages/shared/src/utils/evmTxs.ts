
import omitDeep from 'omit-deep'
import { TypedDataDomain } from '@ethersproject/abstract-signer'
import { config } from './config'
import type { signTypedData as TsignTypedData } from '@wagmi/core'

const canonicalize = import("canonicalize");
// const API_BASE = import.meta.env.VITE_YUP_API_BASE;

// import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
// import { Web3Modal } from '@web3modal/html'
// import { configureChains, createConfig, getAccount, signMessage, disconnect } from '@wagmi/core'
// import { polygon, mainnet } from '@wagmi/core/chains'
// import { config } from './config'

let EthereumClient: Awaited<ReturnType<typeof web3Libs>['web3ModalEthereum']>['EthereumClient']
let w3mConnectors: Awaited<ReturnType<typeof web3Libs>['web3ModalEthereum']>['w3mConnectors']
let w3mProvider: Awaited<ReturnType<typeof web3Libs>['web3ModalEthereum']>['w3mProvider']
let Web3Modal: Awaited<ReturnType<typeof web3Libs>['web3ModalHtml']>['Web3Modal']
let configureChains: Awaited<ReturnType<typeof web3Libs>['wgamiCore']>['configureChains']
let createConfig: Awaited<ReturnType<typeof web3Libs>['wgamiCore']>['createConfig']
let wagmiConfig: ReturnType<typeof createConfig>
let wgamiChains: Awaited<ReturnType<typeof web3Libs>['wgamiChains']>


export const web3Libs = () => {
    return {
        web3ModalEthereum: import('@web3modal/ethereum'),
        web3ModalHtml: import("@web3modal/html"),
        wgamiCore: import("@wagmi/core"),
        wgamiChains: import("@wagmi/core/chains"),
    }
}

export type TWeb3Libs = ReturnType<typeof web3Libs>

// export const getWeb3Modal = async ({
//     providerOptionsProm,
//     web3Mprom,
//     theme = 'dark',
//     disableInjectedProvider = false
// }: {
//     providerOptionsProm: IproviderOptionsProm,
//     web3Mprom: Iweb3Mprom,
//     theme?: 'dark' | 'light',
//     disableInjectedProvider?: boolean
// }) => {
//     const { default: libDefault } = await web3Mprom
//     const { providerOptions } = await providerOptionsProm
//     return new libDefault({
//         network: 'matic', // optional
//         cacheProvider: false, // optional
//         providerOptions, // required
//         theme,
//         disableInjectedProvider
//     })
// }

// export const ethersLib = ref() as IethersLib
// export const userProvider = ref() as IuserProvider
// export const web3Modal = ref() as Iweb3Modal

export const tryToGetAddressWithoutPrompt = async ({
    localWeb3Libs
}: {
        localWeb3Libs: ReturnType<typeof web3Libs>
}) => {
    const { EthereumClient, w3mConnectors, w3mProvider } = await localWeb3Libs.web3ModalEthereum
    const { Web3Modal } = await localWeb3Libs.web3ModalHtml
    const { configureChains, createConfig, getAccount } = await localWeb3Libs.wgamiCore
    const { polygon, mainnet } = await localWeb3Libs.wgamiChains

    const chains = [polygon, mainnet]

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId: config.PROJECT_ID })])
    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors: w3mConnectors({ projectId: config.PROJECT_ID, chains }),
        publicClient
    })
    const ethereumClient = new EthereumClient(wagmiConfig, chains)

    new Web3Modal({ projectId: config.PROJECT_ID }, ethereumClient)

    return (await getAccount()).address || null
}

export const prepareForTransaction = async ({
    stackAlertWarning,
    localWeb3Libs
}: {
    stackAlertWarning?: (msg: string) => void,
        localWeb3Libs: ReturnType<typeof web3Libs>
}) => {

    const [web3ModalEthereum, web3ModalHtml, wgamiCore, chainsLib] = await Promise.all([
        localWeb3Libs.web3ModalEthereum,
        localWeb3Libs.web3ModalHtml,
        localWeb3Libs.wgamiCore,
        localWeb3Libs.wgamiChains
    ])

    EthereumClient = EthereumClient || web3ModalEthereum.EthereumClient
    w3mConnectors = w3mConnectors || web3ModalEthereum.w3mConnectors
    w3mProvider = w3mProvider || web3ModalEthereum.w3mProvider
    Web3Modal = Web3Modal || web3ModalHtml.Web3Modal
    configureChains = configureChains || wgamiCore.configureChains
    createConfig = createConfig || wgamiCore.createConfig
    const { polygon, mainnet } = wgamiChains || chainsLib

    const chains = [polygon, mainnet]

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId: config.PROJECT_ID })])
    wagmiConfig = wagmiConfig || createConfig({
        autoConnect: true,
        connectors: w3mConnectors({ projectId: config.PROJECT_ID, chains }),
        publicClient
    })
    const ethereumClient = new EthereumClient(wagmiConfig, chains)

    const web3Modal = new Web3Modal({ projectId: config.PROJECT_ID }, ethereumClient)

    if (web3Modal) {
        let conn = await wgamiCore.getAccount()
        if (!conn?.isConnected) {
            await web3Modal.openModal()
            const modalStateProm = new Promise((resolve) => {
                const unsub = web3Modal.subscribeModal(async (state) => {
                    unsub()
                    resolve(state)
                })
            })
            await modalStateProm
            conn = await wgamiCore.getAccount()
            if (!conn.isConnected) {
                stackAlertWarning && stackAlertWarning('User closed connect modal.')
                return false
            }
        } else {
            await wagmiConfig.autoConnect()
        }
        return {
            wgamiCore
        }
    } else {
        stackAlertWarning && stackAlertWarning('Web3 Instance is null.')
        return false
    }


    // if (!depUserProvider.value) {
    //     try {
    //         await web3Mprom
    //         const inst = await w3Modal.value.connect()
    //         ethersLib.value = await ethers
    //         depUserProvider.value = new ethersLib.value.providers.Web3Provider(inst)
    //     } catch {
    //         stackAlertWarning && stackAlertWarning('User rejected connection')
    //         return false
    //     }
    // }
    // const { chainId } = await deRef(depUserProvider).getNetwork()
    // if (chainId !== 137) {
    //     depUserProvider.value = null as any
    //     stackAlertWarning && stackAlertWarning(`You are on wrong network(${chainId}), please switch to polygon(137)`)
    //     return false
    // }
    // return true
}

export const signCanonChallenge = async (payload: Record<string, unknown>, signMessage: (arg: { message: string }) => Promise<string>) => {
    const canFn = (await canonicalize).default;
    let signature;
    try {
        signature = await signMessage({ message: canFn(payload) as string });
    } catch (error) {
        return;
    }
    return signature;
};

export const omit = (object: any, name: string) => {
    return omitDeep(object, name as any)
}

export const signedTypeData = async ({
    domain,
    types,
    value,
    signTypedData
}: {
    domain: TypedDataDomain,
    types: Record<string, any>,
    value: Record<string, any>,
        signTypedData: typeof TsignTypedData
}
) => {
    return await signTypedData({
        domain: omit(domain, '__typename'),
        types: omit(types, '__typename') as any,
        message: omit(value, '__typename') as any
    } as any
    )
}