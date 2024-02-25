
// import { TypedDataDomain } from '@ethersproject/abstract-signer'
import { config } from './config'
import type { signTypedData as TsignTypedData } from '@wagmi/core'

export const metadata = {
    name: 'YupLive',
    description: 'YupLive',
    url: 'https://yup-live.pages.dev/',
    icons: ['data:image/x-icon;base64,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']
}

const canonicalize = import("canonicalize");
// const API_BASE = import.meta.env.VITE_YUP_API_BASE;

// import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
// import { Web3Modal } from '@web3modal/html'
// import { configureChains, createConfig, getAccount, signMessage, disconnect } from '@wagmi/core'
// import { polygon, mainnet } from '@wagmi/core/chains'
// import { config } from './config'

// let EthereumClient: Awaited<ReturnType<typeof web3Libs>['web3ModalEthereum']>['EthereumClient']
// let w3mConnectors: Awaited<ReturnType<typeof web3Libs>['web3ModalEthereum']>['w3mConnectors']
// let w3mProvider: Awaited<ReturnType<typeof web3Libs>['web3ModalEthereum']>['w3mProvider']
// let Web3Modal: Awaited<ReturnType<typeof web3Libs>['web3ModalHtml']>['Web3Modal']
let configureChains: Awaited<ReturnType<typeof web3Libs>['wgamiCore']>['configureChains']
let createConfig: Awaited<ReturnType<typeof web3Libs>['wgamiCore']>['createConfig']
let wagmiConfig: ReturnType<typeof createConfig>
let wgamiChains: Awaited<ReturnType<typeof web3Libs>['wgamiChains']>
// let coinBaseConnector: Awaited<ReturnType<typeof web3Libs>['CoinbaseWalletConnector']>['CoinbaseWalletConnector']


export const web3Libs = () => {
    return {
        web3ModalWagmi: import('@web3modal/wagmi'),
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
    const { web3ModalWagmi, wgamiCore, wgamiChains } = localWeb3Libs
    const [lib1, lib2, lib3] = await Promise.all([web3ModalWagmi, wgamiCore, wgamiChains])
    const { createWeb3Modal, defaultWagmiConfig } = lib1
    const { getAccount } = lib2
    const { polygon, mainnet, polygonMumbai } = lib3


    const chains = [polygon, mainnet, polygonMumbai]

    // const { publicClient } = configureChains(chains, [w3mProvider({ projectId: config.PROJECT_ID })])
    // const wagmiConfig = createConfig({
    //     autoConnect: true,
    //     connectors: w3mConnectors({ projectId: config.PROJECT_ID, chains }),
    //     publicClient
    // })
    // const ethereumClient = new EthereumClient(wagmiConfig, chains)

    const enableCoinbase = !(window as any)?.Ionic


    const wagmiConfig = defaultWagmiConfig({
        projectId: config.PROJECT_ID,
        chains,
        enableCoinbase,
        enableInjected: true,
        enableWalletConnect: true,
        enableEIP6963: true,
        enableEmail: false,
        metadata
    })

    createWeb3Modal({
        wagmiConfig,
        projectId: config.PROJECT_ID, 
        chains,
        themeMode: 'dark',
    })


    return (await getAccount()).address || null
}

export const prepareForTransaction = async ({
    stackAlertWarning,
    localWeb3Libs
}: {
    stackAlertWarning?: (msg: string) => void,
        localWeb3Libs: ReturnType<typeof web3Libs>
}) => {

    const { web3ModalWagmi, wgamiCore, wgamiChains } = localWeb3Libs
    const [lib1, wgamiCoreLib, lib3] = await Promise.all([web3ModalWagmi, wgamiCore, wgamiChains])
    const { createWeb3Modal, defaultWagmiConfig } = lib1
    const { polygon, mainnet, polygonMumbai } = lib3


    const chains = [polygon, mainnet, polygonMumbai]

    // const { publicClient } = configureChains(chains, [w3mProvider({ projectId: config.PROJECT_ID })])
    // const wagmiConfig = createConfig({
    //     autoConnect: true,
    //     connectors: w3mConnectors({ projectId: config.PROJECT_ID, chains }),
    //     publicClient
    // })
    // const ethereumClient = new EthereumClient(wagmiConfig, chains)

    const metadata = {
        name: 'Web3Modal',
        description: 'Web3Modal Example',
        url: 'https://web3modal.com',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    }

    const enableCoinbase = !(window as any)?.Ionic

    const wagmiConfig = defaultWagmiConfig({
        projectId: config.PROJECT_ID,
        chains,
        enableCoinbase,
        enableInjected: true,
        enableWalletConnect: true,
        enableEIP6963: true,
        enableEmail: false,
        metadata
    })

    const web3Modal = createWeb3Modal({
        wagmiConfig,
        projectId: config.PROJECT_ID, 
        chains,
        themeMode: 'dark',
    })

    if (web3Modal) {
        let conn = await wgamiCoreLib.getAccount()
        if (!conn?.isConnected) {
            await web3Modal.open()
            const modalStateProm = new Promise((resolve) => {
                const unsub = web3Modal.subscribeEvents((event: { data: { event: string }, timestamp: number }) => {
                    const eventType = event.data.event
                    if (eventType === 'CONNECT_SUCCESS' || eventType === 'MODAL_CLOSE') {
                        resolve(event)
                        unsub()
                    }
                })
            })
            await modalStateProm
            conn = await wgamiCoreLib.getAccount()
            if (!conn.isConnected) {
                stackAlertWarning && stackAlertWarning('User closed connect modal.')
                return false
            }
        } else {
            await wagmiConfig.autoConnect()
        }
        return {
            wgamiCore: wgamiCoreLib
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

export const signedTypeData = async ({
    domain,
    types,
    value,
    primaryType = 'SetDispatcherWithSig',
    signTypedData
}: {
        domain: Record<string, any>,
    types: Record<string, any>,
    value: Record<string, any>,
        primaryType?: string,
        signTypedData: typeof TsignTypedData
}
) => {
    try {

    return await signTypedData({
        domain,
        types,
        message: value,
        primaryType,
    }
    )
    } catch (error) {
        console.error(error)
    }
}