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

const stackAlert = ({ message, type }: { message: string; type: string }) => {
  if (alertStack && alertStack.alertStack.length < 4) {
    const id = crypto.randomUUID()
    alertStack.alertStack.push({ message, type, id })
  }
}

const stackAlertSuccess = (message: string) => {
  stackAlert({ message, type: 'success' })
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
