import type { Vote } from '@/types/vote'

const API_BASE = import.meta.env.VITE_YUP_API_BASE

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
