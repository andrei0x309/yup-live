import type { Vote } from '../../types/vote'

export const API_BASE = import.meta.env.VITE_YUP_API_BASE;
// export const API_BASE = import.meta.env.VITE_YUP_API_BASE.replace('api.yup.io', 'fstun.flashsoft.eu');

export const hasVote = (postId: string, account: string): Promise<Vote[]> => {
  return new Promise((resolve) => {
    fetch(`${API_BASE}/votes/post/${postId}/voter/${account}`).then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          resolve(json)
        })
      } else {
        resolve([] as Vote[])
      }
    })
  })
}
