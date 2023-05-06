import type { Ref } from 'vue'
import type { providers } from 'ethers'
import { editProfile } from './requests/accounts'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const web3ModalInstantiate = async (
    { web3M = null, loadState = null, setAlert = null }: { web3M: null | Ref<any>, loadState: null | Function, setAlert: null | Function }
) => {
    try {
        if (web3M) {
            await web3M.value.clearCachedProvider();
            return await web3M.value.connect()
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

const getAccount = async ({
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
            return
        }
        return true
    }
    return false
}

const signChallenge = async ({
    address, signer, loadState = null, setAlert = null, web3M = null
}: {
    address: string, signer: providers.JsonRpcSigner,
    loadState: null | Function
    setAlert: null | Function
        web3M: null | Ref<any>
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
    try {
        signature = await Promise.race([signer.signMessage(challenge), timeout]) as string
        if (!signature) {
            if (loadState && setAlert) {
                loadState('end')
                setAlert({
                    type: 'error',
                    message: 'Wallet did not respond in 90s. Please try again later'
                })
                if (web3M) {
                    await web3M.value.clearCachedProvider();
                }
            }
            return
        }
    } catch (error) {
        if (loadState && setAlert) {
            loadState('end')
            setAlert({
                type: 'error',
                message: 'User cancelled the signature'
            })
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
        return
    } else {
        return await req.json()
    }
}

export const onSignup = async (
    {
        web3M,
        provider,
        ethers,
        username,
        loadState = null,
        setAlert = null,
        bio = null,
        fullname = null
    }: {
        web3M: Ref<any>,
        provider: Ref<any>,
        ethers: any,
        username: string
        loadState: null | Function,
        setAlert: null | Function,
        bio?: null | string,
        fullname?: null | string
    }) => {
    if (loadState) {
        loadState('start')
    }
    const inst = await web3ModalInstantiate({ web3M, loadState, setAlert })
    if (inst) {
        provider.value = new ethers.providers.Web3Provider(inst)
        const signer = provider.value.getSigner()
        const address = await signer.getAddress()
        const account = await getAccount({ address, type: 'signup', loadState, setAlert })
        if (!account) return
        const signature = await signChallenge({ address, signer, loadState, setAlert, web3M })
        if (!signature) return
        const accountSignUp = await createAccount({ address, signature, username: username, loadState, setAlert })
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
            _id: account._id,
            avatar: account.avatar,
            weight: account.weight,
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
    web3M,
    provider,
    ethers,
    loadState = null,
    setAlert = null
}: {
    web3M: Ref<any>,
    provider: Ref<any>,
    ethers: any,
    loadState: null | Function,
    setAlert: null | Function,
}) => {
    if (loadState) {
        loadState('start')
    }

    const inst = await web3ModalInstantiate({ web3M, loadState, setAlert })
    if (inst) {
        provider.value = new ethers.providers.Web3Provider(inst)
        const signer = provider.value.getSigner()
        const address = await signer.getAddress()
        const account = await getAccount({ address, type: 'login', loadState, setAlert })
        if (!account) return
        const signature = await signChallenge({ address, signer, loadState, setAlert, web3M })
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
