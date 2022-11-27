import type { Vote } from '../../types/vote'

import { config } from '../config'

const { API_BASE } = config

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
