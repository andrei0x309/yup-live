import { editProfile } from './requests/accounts'
import { config } from './config'
import { web3Libs, metadata } from './evmTxs'
import { wait } from './time'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const w3libsP = web3Libs()

export const web3ModalInstantiate = async (
    { loadState = null, setAlert = null }: { loadState: null | Function, setAlert: null | Function }
) => {
    try {
        await wait(500)
        const { web3ModalWagmi, wgamiCore, wgamiChains } = w3libsP
        const [lib1, lib2, lib3] = await Promise.all([web3ModalWagmi, wgamiCore, wgamiChains])
        const { createWeb3Modal, defaultWagmiConfig } = lib1
        const { getAccount } = lib2
        const { polygon, mainnet, polygonMumbai } = lib3

        const chains = [polygon, mainnet, polygonMumbai]

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
            let conn = await getAccount()
            if (!conn?.isConnected) {
                await web3Modal.open()
                const modalStateProm = new Promise((resolve) => {
                    const unsub = web3Modal.subscribeEvents((event: { data: { event: string }, timestamp: number }) => {
                        console.log(event, 'event')
                        const eventType = event.data.event
                        if (eventType === 'CONNECT_SUCCESS' || eventType === 'MODAL_CLOSE') {
                            resolve(event)
                            unsub()
                        }
                    })
                })
                await modalStateProm
                conn = await getAccount()
                if (!conn.isConnected) {
                    if (loadState && setAlert) {
                        loadState('end')
                        setAlert({
                            type: 'error',
                            message: 'User closed connect modal.'
                        })
                    }
                    return
                }
                return conn
            }
            return conn
        } else {
            if (loadState && setAlert) {
                loadState('end')
                setAlert({
                    type: 'error',
                    message: 'Web3 Instance is null.'
                })
            }
        }
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
        const wgamiCore = (await w3libsP.wgamiCore)
        const { disconnect } = wgamiCore
    await disconnect()
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
    address, loadState = null, setAlert = null
}: {
        address: string,
    loadState: null | Function
        setAlert: null | Function
}) => {
    const req = await fetch(`${API_BASE}/v1/eth/challenge?address=${address}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const res = await req.json()
    const challenge = res.data
    let signature: string
    const timeout = new Promise((resolve) => setTimeout(() => resolve(0), 90000))
    const wgamiCore = (await w3libsP.wgamiCore)
    const { signMessage, disconnect } = wgamiCore
    try {
        signature = await Promise.race([signMessage({
            message: challenge,
        }), timeout]) as string
        if (!signature) {
            if (loadState && setAlert) {
                loadState('end')
                setAlert({
                    type: 'error',
                    message: 'Wallet did not respond in 90s. Please try again later'
                })
                disconnect()
            }
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
            disconnect()
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
            signature
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
            signature
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

export const onSignup = async (
    {
        username,
        loadState = null,
        setAlert = null,
        bio = null,
        fullname = null
    }: {
        username: string
        loadState: null | Function,
        setAlert: null | Function,
        bio?: null | string,
        fullname?: null | string
    }) => {
    if (loadState) {
        loadState('start')
    }
    const inst = await web3ModalInstantiate({ loadState, setAlert })
    if (inst) {
        const address = inst.address ?? ""
        const account = await getYupAccount({ address, type: 'signup', loadState, setAlert })
        if (!account) return
        const signature = await signChallenge({ address, loadState, setAlert })

        await logSignup({
            address,
            username,
        })

        if (!signature) return
        const accountSignUp = await createAccount({ address, signature, username, loadState, setAlert })
        if (!accountSignUp) return
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
            _id: accountSignUp.accountId,
            avatar: '',
            weight: 1,
            signature,
            authToken: accountSignUp.jwt,
            username: accountSignUp.username
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
    setAlert = null
}: {
    loadState: null | Function,
    setAlert: null | Function,
}) => {
    if (loadState) {
        loadState('start')
    }
    const inst = await web3ModalInstantiate({ loadState, setAlert })
    if (inst) {
        const address = inst.address ?? ""
        const account = await getYupAccount({ address, type: 'login', loadState, setAlert })
        if (!account) return
        const signature = await signChallenge({ address, loadState, setAlert })
        if (!signature) return
        const accountLogIn = await logIn({ address, signature, loadState, setAlert })
        if (!accountLogIn) return
        return {
            address,
            _id: account._id,
            avatar: account.avatar,
            weight: account.weight,
            signature,
            authToken: accountLogIn.jwt,
            username: accountLogIn.username
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
