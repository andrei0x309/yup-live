
import { ref } from 'vue'
import type { Iweb3Mprom, IethersLib, IproviderOptionsProm, IuserProvider, Iweb3Modal, Iethers } from 'shared/src/types/evm'
import { deRef } from './misc'
import omitDeep from 'omit-deep'
import { TypedDataDomain } from '@ethersproject/abstract-signer'


const canonicalize = import("canonicalize");

export const web3Libs = () => {
    return {
        providerOptionsProm: import('shared/src/utils/evm'),
        web3Mprom: import("web3modal"),
        ethers: import("ethers")
    }
}

export const getWeb3Modal = async ({
    providerOptionsProm,
    web3Mprom,
    theme = 'dark',
    disableInjectedProvider = false
}: {
    providerOptionsProm: IproviderOptionsProm,
    web3Mprom: Iweb3Mprom,
    theme?: 'dark' | 'light',
    disableInjectedProvider?: boolean
}) => {
    const { default: libDefault } = await web3Mprom
    const { providerOptions } = await providerOptionsProm
    return new libDefault({
        network: 'matic', // optional
        cacheProvider: false, // optional
        providerOptions, // required
        theme,
        disableInjectedProvider
    })
}

export const ethersLib = ref() as IethersLib
export const userProvider = ref() as IuserProvider
export const web3Modal = ref() as Iweb3Modal

export const prepareForTransaction = async ({
    depUserProvider,
    w3Modal,
    ethersLib,
    stackAlertWarning,
    web3Mprom,
    ethers
}: {
    depUserProvider: IuserProvider,
    w3Modal: Iweb3Modal,
    ethersLib: IethersLib,
    stackAlertWarning?: (msg: string) => void,
    web3Mprom: Iweb3Mprom,
    ethers: Iethers
}) => {
    if (!depUserProvider.value) {
        try {
            await web3Mprom
            const inst = await w3Modal.value.connect()
            ethersLib.value = await ethers
            depUserProvider.value = new ethersLib.value.providers.Web3Provider(inst)
        } catch {
            stackAlertWarning && stackAlertWarning('User rejected connection')
            return false
        }
    }
    const { chainId } = await deRef(depUserProvider).getNetwork()
    if (chainId !== 137) {
        depUserProvider.value = null as any
        stackAlertWarning && stackAlertWarning(`You are on wrong network(${chainId}), please switch to polygon(137)`)
        return false
    }
    return true
}

export const signCanonChallenge = async (payload: Record<string, unknown>, signer: unknown) => {
    const canFn = (await canonicalize).default;
    let signature;
    try {
        signature = await (signer as {
            signMessage: (a: string) => typeof a;
        }).signMessage(canFn(payload) as string);
    } catch (error) {
        return;
    }
    return signature;
};

export const signArbitraryText = async ({
    text,
    web3Mprom,
    w3Modal,
    ethers,
    ethersLib,
    userProvider,
}: {
    text: string,
    web3Mprom: Promise<any>,
    w3Modal: Iweb3Modal,
    ethers: Iethers,
    ethersLib: IethersLib,
    userProvider: IuserProvider
}) => {
    let signature;
    try {
        await web3Mprom;
        const inst = await w3Modal.value.connect();
        ethersLib.value = await ethers;
        userProvider.value = new ethersLib.value.providers.Web3Provider(inst);
        const signer = userProvider.value.getSigner();

        signature = await (signer as unknown as {
            signMessage: (a: string) => typeof a;
        }).signMessage(text);
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
    userProvider
}: {
    domain: TypedDataDomain,
    types: Record<string, any>,
    value: Record<string, any>,
    userProvider: IuserProvider
}
) => {
    const signer = userProvider.value.getSigner();
    return await signer._signTypedData(
        omit(domain, '__typename'),
        omit(types, '__typename') as any,
        omit(value, '__typename')
    )
}