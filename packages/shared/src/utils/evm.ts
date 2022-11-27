import WalletConnectProvider from '@walletconnect/web3-provider'
import { config } from './config'

const { POLY_RPC } = config

export const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                137: POLY_RPC
            }
        }
    }
}
