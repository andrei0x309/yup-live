<template>
  <ThumbsUp :key="`${hasVote}-${lastVote}`" class="w-6" :isSolid="hasVote && lastVote" @click="doVote('up')" />
  <span v-html="positiveWeightRef"></span>
  <ThumbsDown :key="`${hasVote}-${lastVote}`" class="w-6" :isSolid="hasVote && !lastVote" @click="doVote('down')" />
  <span v-html="negativeWeightRef"></span>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import ThumbsUp from '../icons/thumbsUp.vue'
import ThumbsDown from '../icons/thumbsDown.vue'
import { formatNum } from '@/utils/format'
import { useMainStore } from '@/store/main'
import { fetchWAuth } from '@/utils/auth'

const API_BASE = import.meta.env.VITE_YUP_API_BASE

export default defineComponent({
  name: 'Voting',
  components: {
    ThumbsUp,
    ThumbsDown
  },
  props: {
    postId: {
      type: String,
      required: true
    },
    positiveWeight: {
      required: false,
      type: Number,
      default: 0
    },
    negativeWeight: {
      required: false,
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const positiveWeightRef = ref(formatNum(props.positiveWeight * 0.05, 2))
    const negativeWeightRef = ref(formatNum(props.negativeWeight * 0.05, 2))
    const store = useMainStore()
    const isAuth = ref(store.isLoggedIn)
    interface Vote {
      like: boolean
      voter: string
      voteid: string
      rating: number
    }
    let lastVoteType = ''
    let rating = 0
    let timer: undefined | number | string = undefined
    let doingVote = false
    const vote = ref([]) as unknown as Ref<Vote[]>
    const hasVote = ref(false) as unknown as Ref<boolean>
    const lastVote = ref(false) as unknown as Ref<boolean>

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn
    })

    const executeVote = async () => {
      const req = await fetchWAuth(`${API_BASE}/votes`, {
        postId: props.postId,
        rating
      })
      if (req.ok) {
        console.log('Vote sent')
      } else {
        console.log('Vote failed')
      }
    }

    const doVote = (voteType: string) => {
      if (timer && !doingVote) {
        clearTimeout(timer)
      }

      if (voteType !== lastVoteType) {
        lastVoteType = voteType
        rating = 0
      }
      if (voteType === 'up' && rating < 3) {
        rating += 1
      } else if (voteType === 'down' && rating < 2) {
        rating += 1
      }
      if (!doingVote) {
        timer = setTimeout(async () => {
          doingVote = true
          await executeVote()
          rating = 0
          lastVoteType = ''
          doingVote = false
        }, 200) as unknown as number | string
      }
    }

    onMounted(() => {
      if (props.postId) {
        const hasVotePromReq = isAuth.value
          ? () => {
              return new Promise((resolve, reject) => {
                fetch(`${API_BASE}/votes/post/${props.postId}/voter/${store.userData.account}`).then((res) => {
                  if (res.ok) {
                    res.json().then((json) => {
                      resolve(json)
                    })
                  } else {
                    reject()
                  }
                })
              })
            }
          : () => {
              return Promise.resolve([])
            }
        hasVotePromReq().then((res) => {
          vote.value = res as Vote[]
          hasVote.value = vote.value?.length > 0
          lastVote.value = vote.value[0]?.like
          console.log(vote.value, hasVote.value, lastVote.value)
        })
      }
    })

    return {
      positiveWeightRef,
      negativeWeightRef,
      doVote,
      hasVote,
      lastVote
    }
  }
})
</script>