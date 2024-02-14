import { defineStore } from 'pinia'
import { AlertInfo } from 'shared/src/types/common'

const useAlertStack = defineStore('alertStack', {
  state: () => {
    return {
      alertStack: [] as unknown as AlertInfo[]
    }
  }
})

type AlertStorType = ReturnType<typeof useAlertStack>

let alertStack: AlertStorType

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stackAlert = ({ message, type, update, router }: { message: string; type: string, update?: boolean, router?: any }) => {
  if (alertStack && alertStack.alertStack.length < 4) {
    const id = crypto.randomUUID()
    if (update && router) {
      alertStack.alertStack.push({ message, type, id, update: true, router })
    } else {
      alertStack.alertStack.push({ message, type, id, update: false })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stackAlertSuccess = (message: string, update = false, router: any = null) => {
  stackAlert({ message, type: 'success', update, router })
}

const stackAlertError = (message: string) => {
  stackAlert({ message, type: 'error' })
}

const stackAlertWarning = (message: string): void => {
  stackAlert({ message, type: 'warning' })
}

const setAlertStack = (store: AlertStorType) => {
  alertStack = store
}

export { useAlertStack, setAlertStack, stackAlertSuccess, stackAlertError, stackAlertWarning }
