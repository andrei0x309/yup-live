import WalletConnectProvider from '@walletconnect/web3-provider'

const POLY_RPC = import.meta.env.VITE_POLYGON_RPC

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
