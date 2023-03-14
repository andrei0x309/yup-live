import type { Ref } from 'vue'

const gini = function (data: number[], unordered = true) {
  if (!Array.isArray(data)) {
    throw new Error('Data set is not an array.')
  }

  if (data.length <= 0) {
    throw new Error('Data set is an empty array.')
  }

  data = data.map(function (value) {
    value = Number(value)

    if (isNaN(value)) {
      throw new Error('Data set contains non-numbers.')
    }

    if (value < 0) {
      throw new Error('Data set contains negative numbers.')
    }

    return value
  })

  let sum1 = 0
  let sum2 = 0
  if (unordered) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (i != j) {
          sum1 += Math.abs(data[i] - data[j])
        }
      }

      sum2 += data[i]
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      sum1 += (2 * (i + 1) - data.length - 1) * data[i]
      sum2 += data[i]
    }
  }

  if (sum2 == 0) {
    return 0
  }

  return sum1 / (2 * Math.pow(data.length, 2) * (sum2 / data.length))
}

const convertToCSV = (arr: unknown[]) => {
  const array = typeof arr != 'object' ? JSON.parse(arr) : arr
  let str = ''
  for (let i = 0; i < array.length; i++) {
    let line = ''
    for (const index in array[i]) {
      if (line != '') line += ','
      line += array[i][index]
    }
    str += line + '\n'
  }
  return str
}

const exportFile = (fileName: string, content: string, type = 'csv') => {
  const link = document.createElement('a')
  const blob = new Blob([content], { type: `text/${type};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const formatNumber = (num: number, digits = 0) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: digits
  }).format(num)
}

const truncteEVMAddr = (addr: string) => ((addr ?? '').length > 4 ? addr.substring(0, 5) + '...' + addr.substring(addr.length - 3) : '')

const isValidAddress = (addr: string) => addr.match(/0x[0-9a-f]{40}/i) !== null

export const makeRandomPreview = (remote = false) => remote ? `https://yup-live.pages.dev/picsum/${Math.floor(Math.random() * 99)}.webp` : `/picsum/${Math.floor(Math.random() * 99)}.webp`;

export const isImage = (url: string) => {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}

export const digestSha256 = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

export const deRef = <T> (ref: Ref<T>): T => {
  return (ref as any)._rawValue
}

export { gini, exportFile, convertToCSV, formatNumber, truncteEVMAddr, isValidAddress }
