import { editProfile } from './requests/accounts'
import { web3Libs, getConfig, prepareForTransaction } from './evmTxs'
import { wait } from './time'
import type { Ref } from 'vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// const API_BASE = (import.meta.env.VITE_YUP_API_BASE).replace('api.', 'dev.api.')


const w3libsP = web3Libs()

type TloginMap = {
    username: string
    authToken: string,
    account: string,
    weight: number,
    address: string,
    fid: string,
    avatar: string,
    isOwner: boolean
    bio: string,
    fullname: string
    connected: {
        farcaster: boolean
        twitter: boolean
        lens: boolean
        bsky: boolean
        threads: boolean
    }
}

export const web3ModalInstantiate = async (
    { loadState = null, setAlert = null }: { loadState: null | Function, setAlert: null | Function } = { loadState: null, setAlert: null }
) => {
    try {
        await wait(100)
        const wgGami = await prepareForTransaction({ localWeb3Libs: await w3libsP, stackAlertWarning: () => { } })
        if (!wgGami) {
            if (loadState && setAlert) {
                loadState('end')
                setAlert({
                    type: 'error',
                    message: 'User closed connect modal.'
                })
            }
            return
        }
        return wgGami.wgamiCore.getAccount(wgGami.wgConfig.wagmiConfig)
    } catch (error) {
        if (loadState && setAlert) {
            loadState('end')
            setAlert({
                type: 'error',
                message: 'User closed connect modal.'
            })
        }
    }
}

export const walletDisconnect = async () => {
    try {
        const wgConfig = await getConfig(w3libsP)
        const { disconnect, reconnect } = wgConfig.wgamiC
        const { wagmiConfig } = wgConfig
        await reconnect(wagmiConfig)
        await disconnect(wagmiConfig)
    } catch {
        // do nothing
    }
}

const getYupAccount = async ({
    address,
    type = 'login',
    loadState = null,
    setAlert = null
}: {
    address: string
    type?: string
    loadState?: null | Function
    setAlert?: null | Function
}) => {
    const reqUser = await fetch(`${API_BASE}/accounts/eth?address=${address}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (type === 'login') {
        if (!reqUser.ok) {
            if (loadState && setAlert) {
                loadState('end')
                setAlert({
                    type: 'error',
                    message: `User with connected address ${address} does not exist.`
                })
            }
            walletDisconnect()
            return
        }
        return await reqUser.json()
    } else if (type === 'signup') {
        if (reqUser.ok) {
            if (loadState && setAlert) {
                loadState('end')
                setAlert({
                    type: 'error',
                    message: `User with address ${address} already exists.`
                })
            }
            walletDisconnect()
            return
        }
        return true
    }
    return false
}

const signChallenge = async ({
    address, loadState = null,
    setAlert = null,
    timeout = null,
    cancelPromise = null,
    mobile = false
}: {
        address: string,
    loadState: null | Function
        setAlert: null | Function,
        timeout?: null | Ref<number>,
        cancelPromise?: null | Promise<any>
        mobile?: boolean
}) => {
    const uri = window?.location?.hostname ?? 'yup.live'
    const isHttps = window?.location?.protocol?.includes('https') ?? true

    const req = await fetch(`${API_BASE}/v1/eth/challenge?address=${address}&uri=${uri}&https=${isHttps}&enableSIWE=${mobile ? 'false' : 'true'}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const res = await req.json()
    const challenge = res.data
    let signature: string
    let localTimeout = timeout ? timeout.value : 80000
    let decInterval: null | number = null
    if (timeout) {
        timeout.value = 80000
        decInterval = setInterval(() => {
            if (timeout.value > 0) {
                timeout.value -= 1000
            }
            localTimeout -= 1000
        }, 1000) as unknown as number
    }
    const timeoutP = new Promise((resolve) => setTimeout(() => resolve(0), localTimeout))
    const wgConfig = await getConfig(w3libsP)
    const { signMessage, disconnect } = wgConfig.wgamiC
    const { wagmiConfig } = wgConfig
    try {
        const promises = [signMessage(wagmiConfig, {
            message: challenge,
        }), timeoutP]
        if (cancelPromise) {
            promises.push(cancelPromise)
        }
        signature = await Promise.race(promises) as string
        if (decInterval) {
            clearInterval(decInterval)
        }
        if (!signature || typeof signature !== 'string') {
            if (loadState && setAlert) {
                loadState('end')
                if (localTimeout > 0) {
                    setAlert({
                        type: 'error',
                        message: 'User cancelled the signature'
                    })
                } else {
                    setAlert({
                        type: 'error',
                        message: `Wallet did not respond in ${localTimeout / 1000}s. Please try again later`
                    })
                }
            }
            disconnect(wagmiConfig).catch(() => { })
            return
        }
    } catch (error) {
        console.error(error)
        if (loadState && setAlert) {
            loadState('end')
            setAlert({
                type: 'error',
                message: 'User cancelled the signature'
            })
            disconnect(wagmiConfig).catch(() => { })
        }
        return
    }
    return signature
}

const logIn = async ({
    address, signature, loadState = null, setAlert = null
}: {
    address: string, signature: string
    loadState: null | Function
    setAlert: null | Function
}) => {
    const reqLogin = await fetch(`${API_BASE}/accounts/log-in`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address,
            signature,
            enableTeamAccounts: true
        })
    })
    if (reqLogin.status !== 200) {
        if (loadState && setAlert) {
            loadState('end')
            setAlert({
                type: 'error',
                message: "Signature doesn't match the address"
            })
        }
        walletDisconnect()
        return
    }
    return await reqLogin.json()
}

const createAccount = async ({ username, address, signature, loadState = null, setAlert = null }:
    {
        username: string
        address: string; signature: string
        loadState: null | Function
        setAlert: null | Function
    }) => {
    if (loadState) {
        loadState('start', "Setting up an account don't close modal, it can take up to 90 seconds. ")
    }
    const req = await fetch(`${API_BASE}/accounts/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address,
            username,
            signature,
            enableTeamAccounts: true
        })
    })
    if (!req.ok) {
        if (loadState && setAlert) {
            loadState('end')
            setAlert({
                type: 'error',
                message: 'User registration failed: ' + (await req.text())
            })
        }
        walletDisconnect()
        return
    } else {
        return await req.json()
    }
}


export const getWalletAddress = async () => {
    const inst = await web3ModalInstantiate()
    if (inst) {
        return inst.address
    }
    return null
}

export const onSignup = async (
    {
        username,
        loadState = null,
        setAlert = null,
        bio = null,
        fullname = null,
        timeout = null,
        cancelPromise = null,
        mobile = false
    }: {
        username: string
        loadState: null | Function,
        setAlert: null | Function,
        bio?: null | string,
            fullname?: null | string,
            timeout?: null | Ref<number>
            cancelPromise?: null | Promise<any>,
            mobile?: boolean
    }) => {
    if (loadState) {
        loadState('start')
    }
    const inst = await web3ModalInstantiate({ loadState, setAlert })
    if (inst) {
        const address = inst.address ?? ""
        const account = await getYupAccount({ address, type: 'signup', loadState, setAlert })
        if (!account) {
            loadState && loadState('end')
            return
        }
        const signature = await signChallenge({ address, loadState, setAlert, timeout, cancelPromise, mobile })

        if (!signature) {
            loadState && loadState('end')
            return
        }

        await logSignup({
            address,
            username,
        })

        const accountSignUp = await createAccount({ address, signature, username, loadState, setAlert })
        const firstAccount = accountSignUp[0]

        if (!accountSignUp.length) {
            loadState && loadState('end')
            return
        }
        try {
            if (bio || fullname) {
                await editProfile({
                    authToken: accountSignUp.jwt,
                    fullname: fullname ?? '',
                    bio: bio ?? '',
                    loadState
                })
            }
        } catch {
            // ignore
        }
        return {
            address,
            _id: firstAccount.accountId,
            avatar: '',
            weight: 1,
            signature,
            authToken: firstAccount.jwt,
            username: firstAccount.username
        }
    } else {
        if (loadState) {
            loadState('end')
        }
        if (setAlert) {
            setAlert({
                type: 'error',
                message: 'User cancelled the signature'
            })
        }
    }
}

const logSignup = async (data: Record<string, any>) => {
    const ENDPOINT = 'https://whole-boa-62.deno.dev/sign-up'
    try {
        const req = await fetch(`${ENDPOINT}/${data.address}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!req.ok) {
            console.error('Failed to log signup')
        }
    }
    catch {
        console.error('Failed to log signup')
    }
}

export const onLogin = async ({
    loadState = null,
    setAlert = null,
    timeout = null,
    cancelPromise = null,
    mobile = false
}: {
    loadState: null | Function,
    setAlert: null | Function,
        timeout?: null | Ref<number>
        cancelPromise?: null | Promise<any>
    mobile?: boolean
} = { loadState: null, setAlert: null, timeout: null, cancelPromise: null, mobile: false }
): Promise<undefined |
    TloginMap[]> => {
    if (loadState) {
        loadState('start')
    }
    const inst = await web3ModalInstantiate({ loadState, setAlert })
    if (inst) {
        const address = inst.address ?? ""
        const account = await getYupAccount({ address, type: 'login', loadState, setAlert })
        if (!account) {
            loadState && loadState('end')
            return
        }
        const signature = await signChallenge({ address, loadState, setAlert, timeout, cancelPromise, mobile })
        if (!signature) {
            loadState && loadState('end')
            return
        }
        const accountLogIn = await logIn({ address, signature, loadState, setAlert })
        if (!accountLogIn) {
            loadState && loadState('end')
            return
        }

        const loginMap = accountLogIn.map((item: any) => {
            return {
                address: item.address,
                username: item.username,
                connected: item.connected,
                avatar: item.avatar,
                weight: item.weight,
                authToken: item.jwt,
                account: item.accountId,
                isOwner: item.isOwner,
                bio: item.bio,
                fullname: item.fullname,
                fid: item?.fid || ''
            } as TloginMap
        })

        return loginMap
    } else {
        if (loadState) {
            loadState('end')
        }
        if (setAlert) {
            setAlert({
                type: 'error',
                message: 'User cancelled the signature'
            })
        }
    }
}