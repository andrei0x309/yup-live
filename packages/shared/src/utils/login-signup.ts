import { editProfile } from './requests/accounts'
import { config } from './config'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const w3libsP = Promise.all([
    import('@web3modal/ethereum'),
    import('@wagmi/core'),
    import('@web3modal/html'),
    import('@wagmi/core/chains'),
])

export const web3ModalInstantiate = async (
    { loadState = null, setAlert = null }: { loadState: null | Function, setAlert: null | Function }
) => {
    try {
        const [lib1, lib2, lib3, lib4] = await w3libsP
        const { EthereumClient, w3mConnectors, w3mProvider } = lib1
        const { configureChains, createConfig, getAccount } = lib2
        const { Web3Modal } = lib3
        const { polygon, mainnet } = lib4

        const chains = [polygon, mainnet]

        const { publicClient } = configureChains(chains, [w3mProvider({ projectId: config.PROJECT_ID })])
        const wagmiConfig = createConfig({
            autoConnect: true,
            connectors: w3mConnectors({ projectId: config.PROJECT_ID, chains }),
            publicClient
        })
        const ethereumClient = new EthereumClient(wagmiConfig, chains)



        const web3Modal = new Web3Modal({ projectId: config.PROJECT_ID }, ethereumClient)

        if (web3Modal) {
            let conn = await getAccount()
            if (!conn?.isConnected) {
                await web3Modal.openModal()
                const modalStateProm = new Promise((resolve) => {
                    const unsub = web3Modal.subscribeModal(async (state) => {
                        unsub()
                        resolve(state)
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
    const [, lib2] = await w3libsP
    const { disconnect } = lib2
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
    const [, lib2] = await w3libsP
    const { signMessage, disconnect } = lib2
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
