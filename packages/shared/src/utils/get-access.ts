import { prepareForTransaction, TWeb3Libs } from 'shared/src/utils/evmTxs'
import type { Ref } from 'vue'
import { yupliveAccessPABI } from 'shared/src/partial-abis/yuplive-acces'
import { ERC20PartialAbi } from 'shared/src/partial-abis/ERC20'
import { digestSha256 } from 'shared/src/utils/misc'
import { wait } from 'shared/src/utils/time'

const TESTING = false

const viemImport = import('viem')

const DEV_TOKEN_ADDRESS = '0x87199a908dd71b0E0E64cA1a708Da9BaB125C0fc'
const DEV_YUPLIVE_ACCESS_PROXY_ADDRESS = '0x78D9c3FF0Ac682426C4DCdc10f21A4dB6575b256'

const TOKEN_ADDRESS = TESTING ? DEV_TOKEN_ADDRESS : "0x086373fad3447f7f86252fb59d56107e9e0faafa"
const YUPLIVE_ACCESS_PROXY_ADDRESS = TESTING ? DEV_YUPLIVE_ACCESS_PROXY_ADDRESS : "0x4C4F0334D7ACE843D920258ce26cFd02afD15b94" as `0x${string}`
const TOKEN_ALLOWANCE = 310
const CHAIN_ID = TESTING ? 80001 : 137

export const getAccess = async ({
    email,
    password,
    Web3Libs,
    buttonText,
    stackAlertSuccess,
    stackAlertWarning
}: {
    email: Ref<string>
    password: Ref<string>
    Web3Libs: Ref<TWeb3Libs>
        buttonText: Ref<string>
        stackAlertWarning?: (msg: string) => void
        stackAlertSuccess?: (msg: string) => void
}) => {
    const wgamiLib = (await prepareForTransaction({
        localWeb3Libs: Web3Libs.value,
        stackAlertWarning,
    }))
    if (!(wgamiLib)) {
        return false
    }
    try {
        const { parseEther } = (await viemImport)

        const connector = (await wgamiLib.wgamiCore.getAccount(wgamiLib.wgConfig.wagmiConfig)).connector

        const clientChainId = await connector?.getChainId()

        if (clientChainId !== CHAIN_ID) {
            try {
                const switched = await wgamiLib.wgamiCore.switchChain(wgamiLib.wgConfig.wagmiConfig, { chainId: CHAIN_ID })
                if (!switched || switched.id !== CHAIN_ID) {
                    stackAlertWarning && stackAlertWarning('User rejected switch network')
                    return false
                }
            } catch {
                stackAlertWarning && stackAlertWarning(`Wallet does not support network switch, please switch to chainid ${CHAIN_ID} manually and try again`)
                return false
            }
        }


        const approveAmount = parseEther(TOKEN_ALLOWANCE.toString())

        const request = (await wgamiLib.wgamiCore.simulateContract(wgamiLib.wgConfig.wagmiConfig, {
            abi: ERC20PartialAbi,
            address: TOKEN_ADDRESS,
            functionName: 'approve',
            args: [YUPLIVE_ACCESS_PROXY_ADDRESS, approveAmount],
            chainId: CHAIN_ID
        })).request

        await wgamiLib.wgamiCore.writeContract(wgamiLib.wgConfig.wagmiConfig, request)

        let tenSeconds = 10
        buttonText.value = `Wait ${tenSeconds} for first tx to be confirmed`
        while (tenSeconds > 0) {
            await wait(1000)
            tenSeconds--
        }

        const addAccessArgs = [email.value, await digestSha256(password.value)]

        try {


            const request2 = (await wgamiLib.wgamiCore.simulateContract(wgamiLib.wgConfig.wagmiConfig, {
                abi: yupliveAccessPABI,
                address: YUPLIVE_ACCESS_PROXY_ADDRESS,
                functionName: 'addAccess',
                args: addAccessArgs,
                chainId: CHAIN_ID
            })).request


            await wgamiLib.wgamiCore.writeContract(wgamiLib.wgConfig.wagmiConfig, request2)
        } catch (e) {
            console.error(e)
            if (String(e).includes('Not enough tokens to execute transaction')) {
                stackAlertWarning && stackAlertWarning(`Contract call 'addAccess'reverted, insufficient tokens, you need at least ${TOKEN_ALLOWANCE - 1} Yup tokens`)
                return false
            }
            stackAlertWarning && stackAlertWarning('User rejected or tx failed')
            return false
        }
        stackAlertSuccess && stackAlertSuccess(`Access granted to ${email.value} wait 5 minutes before login`)
        return true

    } catch (e) {
        console.error(e)
        stackAlertWarning && stackAlertWarning('User rejected or tx failed')
        return false
    }
}


export const checkAccess = async () => {
    try {
        const emailValue = localStorage.getItem('emailValue')
        const pwdValue = localStorage.getItem('pwdValue')

        if (!emailValue || !pwdValue) {
            return 0
        }

        const authResponse = await fetch('https://cf-wk-yupliveaccess-periodic.t-worker.workers.dev/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValue, pass: pwdValue }),
        })

        if (authResponse.ok) {
            const resp = await authResponse.json()
            if (resp?.expired) {
                return 2
            }
            return (resp?.ok ? 1 : 0)
        }
        return 0
    } catch {
        return 1
    }
}

export const isOnLocalhost = (): boolean => {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('::1');
};

export const isBot = (): boolean => {
    if (window.navigator.userAgent) {
        return /bot|google|baidu|bing|msn|teoma|slurp|yandex/i
            .test(navigator.userAgent)
    }
    return false
}

export const setAccess = ({
    email,
    password
}: {
    email: string
    password: string
}) => {
    if (!email || !password) {
        return
    }
    localStorage.setItem('emailValue', email)
    localStorage.setItem('pwdValue', password)
}