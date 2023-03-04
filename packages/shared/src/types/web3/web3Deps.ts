import { IMainStore } from 'shared/src/types/store'

export interface IDepsWeb3Profile {
    useMainStore: () => IMainStore,
    openConnectModal?: (store: IMainStore, signup?: boolean) => void,
    stackAlertWarning?: (message: string) => void,
    stackAlertSuccess?: (message: string) => void
    apiBase: string
}