<template>
  <div>
    <o-tooltip
      v-model:active="menuOpen"
      :triggers="['click', 'contextmenu']"
      :autoClose="['outside', 'escape']"
      :multiline="true"
      @click="menuOpen = !menuOpen"
    >
      <template #content>
        <ul class="w-30 text-justify postMenu">
          <li class="pt-1 cursor-pointer" @click="showVoters"><RadarIcon class="w-5 inline -mt-1 mr-1" />View Voters</li>
          <li v-if="refHasVote" class="pt-1 cursor-pointer" @click="deleteVote">
            <DeleteIcon :class="`w-5 inline -mt-1 mr-1 ${delLoading ? 'rotate' : ''}`" />Delete Vote
          </li>
          <li class="pt-1 cursor-pointer" @click="sharePost"><ShareIcon class="w-5 inline -mt-1 mr-1" />Share Post</li>
          <li class="pt-1 cursor-pointer" @click="goToPost"><GoToIcon class="w-5 inline -mt-1 mr-1" />Post Details</li>
          <li class="pt-1 cursor-pointer" @click="refreshPreview"><RetryIcon class="w-6 -ml-1 inline -mt-1 mr-1" />Refresh Data</li>
        </ul>
      </template>
      <PostMenuIcon role="button" class="w-6" />
    </o-tooltip>
    <o-modal v-model:active="modalOpen" contentClass="modal-body">
      <!-- <DangLoader v-if="libWallLoading" />
    <component
      :is="!libWallLoading ? refDynLogComp : undefined"
      :key="libWallLoading"
      :loadState="compLoadState"
      :setAlert="setAlert"
      :alertProps="alertProps"
    /> -->
      <DangLoader v-if="modalLoading" />
      <template v-else-if="modalContent === 'voters'">
        <h2>Last 20 Interactions</h2>
        <ul class="m-auto">
          <li v-for="voter of voters" :key="voter.a._id" class="p-4">
            <AvatarBtn class="m-auto" :pSource="voter.a.avatar" :pAccount="voter.a._id" :isSelf="false" />
            <p>
              <b>{{ voter.a.username }}</b> voted
            </p>
            <p>{{ timeAgo(voter.timestamp) }}</p>
          </li>
        </ul>
      </template>
    </o-modal>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref, PropType } from 'vue'
import PostMenuIcon from 'icons/src/postMenuIcon.vue'
import { useMainStore, openConnectModal } from '@/store/main'
import DangLoader from 'components/vote-list/loader.vue'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import { timeAgo } from 'shared/dist/utils/time'
import { useRouter } from 'vue-router'
import RadarIcon from 'icons/src/radar.vue'
import ShareIcon from 'icons/src/share.vue'
import DeleteIcon from 'icons/src/delete.vue'
import GoToIcon from 'icons/src/goTo.vue'
import RetryIcon from 'icons/src/retry.vue'
import { wait } from 'shared/dist/utils/time'
import { fetchWAuth } from 'shared/dist/utils/auth'
import { stackAlertError, stackAlertSuccess, stackAlertWarning } from '@/store/alertStore'

import type { PartialAccountInfo } from 'shared/dist/types/account'
import type { Vote } from 'shared/dist/types/vote'

const API_BASE = import.meta.env.VITE_YUP_API_BASE

interface Voter {
  a: PartialAccountInfo
  timestamp: string
}

export default defineComponent({
  name: 'PostMenu',
  components: {
    PostMenuIcon,
    RadarIcon,
    ShareIcon,
    DeleteIcon,
    GoToIcon,
    DangLoader,
    AvatarBtn,
    RetryIcon
  },
  props: {
    postId: {
      type: String,
      required: true
    },
    postShareInfo: {
      type: Object,
      required: false,
      default: () => ({})
    },
    hasVote: {
      type: Promise as PropType<Promise<Vote[]>>,
      required: true
    }
  },
  emits: ['update:vote', 'deletedvote'],
  setup(props, ctx) {
    const router = useRouter()
    const store = useMainStore()
    const isError = ref(false)
    const isLoading = ref(true)
    const isAuth = ref(store.isLoggedIn)
    const modalOpen = ref(false)
    const modalLoading = ref(false)
    const modalContent = ref('')
    const voters = ref([]) as Ref<Voter[]>
    const menuOpen = ref(false)
    const delLoading = ref(false)
    const refHasVote = ref(false)
    const vote = ref({}) as unknown as Ref<Vote>

    store.$subscribe(() => {
      isAuth.value = store.isLoggedIn
    })

    const onError = () => {
      isError.value = true
      isLoading.value = false
      console.log('error', isError.value)
    }

    const onLoad = () => {
      isLoading.value = false
      console.log('onload', isLoading.value)
    }

    const sharePost = () => {
      const share = {
        title: props.postShareInfo.title,
        text: props.postShareInfo.text,
        url: props.postShareInfo.url
      }
      console.log('share', share)
      if (navigator.share) {
        navigator
          .share(share)
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error))
      }
    }

    const goToPost = () => {
      router.push(`/post/${props.postId}`)
    }

    const refreshPreview = async () => {
      try {
        const reqReFetch = await fetch(`${API_BASE}/posts/re-fetch/preview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            postid: props.postId
          })
        })
        if (reqReFetch.ok) {
          stackAlertSuccess('Refresh request successful, reload after a few seconds.')
        } else {
          stackAlertWarning('Refresh data was requested already recently.')
        }
        menuOpen.value = false
      } catch {
        stackAlertError('API not available, please try again later.')
        menuOpen.value = false
      }
    }

    const deleteVote = async () => {
      if (isAuth.value) {
        try {
          delLoading.value = true
          const reqVote = await fetch(`${API_BASE}/votes/post/${props.postId}/voter/${store.userData.account}`)
          const voteId = (await reqVote.json())[0]._id.voteid
          const p1 = fetchWAuth(store, `${API_BASE}/votes/${voteId}`, {
            method: 'DELETE'
          })
          const p2 = wait(350)
          const [req] = await Promise.all([p1, p2])
          if (req.ok) {
            store.deletePost = props.postId
            ctx.emit('update:vote', Promise.resolve([]))
            ctx.emit('deletedvote')
          } else {
            stackAlertError('There was an error with authorization, please try to re-login.')
          }
          delLoading.value = false
        } catch (error) {
          console.log('error', error)
          stackAlertError('The vote could not be deleted!')
        }

        menuOpen.value = false
      } else {
        openConnectModal(store)
      }
    }

    const showVoters = async () => {
      modalContent.value = 'voters'
      modalLoading.value = true
      modalOpen.value = true
      const req = await fetch(`${API_BASE}/posts/interactions/${props.postId}?limit=20`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (req.status === 200) {
        const data = await req.json()
        const pArr = data.map(async (v: { voter: string; timestamp: string }) => {
          return await new Promise((resolve) => {
            fetch(`${API_BASE}/accounts/${v.voter}`).then((r) => {
              r.json().then((d) => {
                resolve({
                  a: d,
                  timestamp: v.timestamp
                })
              })
            })
          })
        })
        const p = await Promise.allSettled(pArr)
        const pArr2 = p.map((e) => {
          if (e.status === 'fulfilled') {
            return e.value
          } else {
            return null
          }
        })
        const result = pArr2
          .filter((a) => a !== null)
          .map((a) => ({
            a: a.a,
            timestamp: new Date(Number(a?.timestamp)).toISOString()
          }))
          .sort((a, b) => {
            return new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime()
          })
        voters.value = result as unknown as Voter[]
        console.log(voters.value)
        modalLoading.value = false
      }
    }

    onMounted(() => {
      props.hasVote.then((v) => {
        if (v.length > 0) {
          vote.value = v[0]
          refHasVote.value = true
        }
      })
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      sharePost,
      deleteVote,
      modalOpen,
      modalLoading,
      modalContent,
      showVoters,
      voters,
      timeAgo,
      goToPost,
      menuOpen,
      delLoading,
      refHasVote,
      refreshPreview
    }
  }
})
</script>

<style lang="scss">
.postMenu {
  font-size: 0.9rem;
  li:hover {
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transform: scale(1.03) translateX(-0.6rem);
    background-color: var(--glassBg);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.3rem;
    opacity: 1;
  }

  .rotate {
    animation: spin 3.3s linear infinite;
    color: coral;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>