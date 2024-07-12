import type { Ref } from 'vue'

export const gini = function (data: number[], unordered = true) {
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

export const convertToCSV = (arr: unknown[]) => {
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

export const exportFile = (fileName: string, content: string, type = 'csv') => {
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


export const formatNumber = (num: number, digits = 0) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: digits
  }).format(num)
}

export const truncteEVMAddr = (addr: string) => ((addr ?? '').length > 4 ? addr.substring(0, 5) + '...' + addr.substring(addr.length - 3) : '')

export const truncateSocialHandle = (handle: string) => ((handle ?? '').length > 18 ? handle.substring(0, 9) + '..' + handle.substring(handle.length - 9) : handle)

export const truncateText = (text: string, maxLength: number): string => {
  if ((text ?? "").length <= maxLength) {
    return text;
  }

  const truncatedText = text.slice(0, maxLength - 3);
  return truncatedText + '...';
}

export const openLink = (url: string) => {
  const win = window?.open(url, '_blank')
  win?.focus()
}
export const isValidAddress = (addr: string) => addr.match(/0x[0-9a-f]{40}/i) !== null

export const makeRandomPreview = (remote = false) => remote ? `https://yup-live.pages.dev/picsum/${Math.floor(Math.random() * 99)}.webp` : `/picsum/${Math.floor(Math.random() * 99)}.webp`;

export const isImage = (url: string, images: string[]) => {
  if (images.includes(url)) return true
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}

export const isVideo = (url: string) => {
  return /^https?:\/\/.+\.(mp4|webm|ogg|avi|mov|m3u8|mkv)$/.test(url)
}

export const getVideoTypeFromUrl = (url: string) => {
  if (url.endsWith('.mp4')) return 'video/mp4'
  if (url.endsWith('.webm')) return 'video/webm'
  if (url.endsWith('.ogg')) return 'video/ogg'
  if (url.endsWith('.avi')) return 'video/avi'
  if (url.endsWith('.mov')) return 'video/mov'
  if (url.endsWith('.m3u8')) return 'application/x-mpegURL'
  if (url.endsWith('.mkv')) return 'video/x-matroska'
  return 'video/mp4'
}

export const isProbablyPage = (url: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg']
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'm3u8', 'mkv']
  const knownAssetHost = ['imagedelivery.net']
  if (knownAssetHost.some(h => url.includes(h))) return false
  let extension = url.split('.').pop()?.trim()?.toLowerCase()
  if (extension?.includes('?')) extension = extension.split('?')[0].trim()
  return ![...imageExtensions, ...videoExtensions].some(e => e === extension)
}

export const digestSha256 = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

export const linkify = (text: string) => {
  return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
}

export const breakify = (text: string) => {
  return text.replace(/(?:\r\n|\r|\n)/g, '<br>')
}

export const deRef = <T> (ref: Ref<T>): T => {
  return (ref as any)._rawValue
}
export class CancelablePromise {
  promise: Promise<any>;
  cancel = () => { };

  constructor(promise: Promise<any>) {
    this.promise = Promise.race([
      promise,
      new Promise((resolve) => {
        this.cancel = () => {
          resolve(false);
        };
      }),
    ]);
  }
}

export const getPostType = (post: any) => {
  if (post?.web3Preview?.meta?.parents?.length > 0) return 'reply'
  if (post?.web3Preview?.meta?.postType === 'comment') return 'reply'
  if (post?.web3Preview?.meta?.parentPost?._id) return 'reply'
  return 'single'
}

export const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const corsify = (url: string) => {
  // return 'https://corsproxy.io/?' + encodeURIComponent(url)
  return `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
}

// export const decodeJWT = (jwt: string) => {
//   const base64urlDecode = (str: string) => {
//     while (str.length % 4 !== 0) {
//       str += '=';
//     }
//     const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
//     return atob(base64);
//   };

//   const parts = jwt.split('.');
//   if (parts.length !== 3) {
//     console.log('Invalid JWT', parts.length);
//     return null; // Invalid JWT format, return null
//   }

//   try {
//     const [header, payload] = parts.map(base64urlDecode);
//     console.log(header, payload)
//     return {
//       header: JSON.parse(header),
//       payload: JSON.parse(payload),
//     };
//   } catch (error) {
//     console.error(error);
//     return null; // Error decoding or parsing the JWT, return null
//   }
// };