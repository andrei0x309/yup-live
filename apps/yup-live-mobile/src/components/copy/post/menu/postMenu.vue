<template>
  <div>
  <PostMenuIcon role="button" class="w-6" @click="presentActionSheet" />

    <ion-modal :is-open="modalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title v-if="modalContent === 'voters'">Recent Voters</ion-title>
          <ion-title v-else>Modal</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalOpen = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <BtnSpinner v-if="modalLoading" />
        <template v-else-if="modalContent === 'voters'">
        <h2>Last 10 Interactions</h2>
        <ul class="m-auto">
          <li v-for="voter of voters" :key="voter.a._id" class="p-4">
            <div class="flex p-2">
              <AvatarBtn :mobile="true" :pSource="voter.a.avatar" :pAccount="voter.a._id" :isSelf="false" />
              <ion-button fill="outline" size="small" class="ml-auto opacity-70 text-[0.6rem]" :router-link="`/tabs/account/${voter.a.username}`" @click="modalOpen = false">View Profile</ion-button>
            </div>
            <p>
              <b>{{ voter.a.username }}</b> voted

            </p>
            <p>{{ timeAgo(voter.timestamp) }}</p>
          </li>
        </ul>
        </template>
        <template v-else-if="modalContent === 'report'">
          <h2>Report Post</h2>
          <p>Are you sure you want to report this post?</p>
          <div class="relative my-4">
        <p class="">Reason: (required)</p>
        <ion-radio-group v-model="reportReason" value="relevance">
          <ion-item v-for="reason of reasons" :key="reason">
          <ion-label>{{ reason }}</ion-label>
          <ion-radio :value="reason" class="mt-2 mr-4"/>
          </ion-item>
        </ion-radio-group>
        <div class=" mt-2">
          <label for="bioField" class="leading-7 text-sm text-gray-600 dark:text-gray-300">Details: (required)</label>
          <textarea id="bioField" v-model="reportDetails" class="text-white w-full rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-30 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out">
          </textarea>
        </div>
        </div>
        <button :disabled="isReporting" class="bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg" @click="() => modalOpen = false" >
      <BtnSpinner v-if="isReporting" class="inline mr-2"/>Cancel 
      </button>
        <button :disabled="isReporting" class="ml-8 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg" @click="reportPost()" >
      <BtnSpinner v-if="isReporting" class="inline mr-2"/>Report 
      </button>
        </template>
      </ion-content>
    </ion-modal>

  </div>
</template>

<script lang="ts">
import { actionSheetController,
   IonModal, 
   IonContent,
    IonToolbar,
     IonTitle,
      IonButtons,
       IonButton,
        IonHeader,
        IonItem,
        IonRadioGroup,
        IonRadio,
        IonLabel,

} from '@ionic/vue';
import { onMounted, defineComponent, ref, Ref, PropType } from 'vue'
import PostMenuIcon from 'icons/src/postMenuIcon.vue'
import { useMainStore } from '@/store/main'
// import DangLoader from 'components/vote-list/loader.vue'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import { timeAgo } from 'shared/src/utils/time'
import { useRouter } from 'vue-router'
// import RadarIcon from 'icons/src/radar.vue'
// import ShareIcon from 'icons/src/share.vue'
// import DeleteIcon from 'icons/src/delete.vue'
// import GoToIcon from 'icons/src/goTo.vue'
// import RetryIcon from 'icons/src/retry.vue'
import { wait } from 'shared/src/utils/time'
import { fetchWAuth } from 'shared/src/utils/auth'
import { stackAlertError, stackAlertSuccess, stackAlertWarning } from '@/store/alertStore'
import type { PartialAccountInfo } from 'shared/src/types/account'
import type { Vote } from 'shared/src/types/vote'
import { Share } from '@capacitor/share';
import { report } from 'shared/src/utils/requests/report'
import { reasons, reportType } from 'shared/src/types/report'

import { trashBinOutline, shareOutline, arrowDownOutline, refreshOutline, exitOutline, eye, flag, openOutline  } from "ionicons/icons";

import { config } from 'shared/src/utils/config'
import BtnSpinner from 'icons/src/btnSpinner.vue';

const { API_BASE } = config

interface Voter {
  a: PartialAccountInfo
  timestamp: string
}

export default defineComponent({
  name: 'PostMenu',
  components: {
    PostMenuIcon,
    IonModal,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonHeader,
    AvatarBtn,
    IonItem,
    IonRadioGroup,
        IonRadio,
        IonLabel,
    // RadarIcon,
    // ShareIcon,
    // DeleteIcon,
    // GoToIcon,
    // DangLoader,

    // RetryIcon
    BtnSpinner
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
    },
    post: {
      type: Object as PropType<{ url: string }>,
      required: false
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
    const isReporting = ref(false)

    const reportReason = ref(reasons[0]) as unknown as Ref<typeof reasons[0]>
    const reportDetails = ref('') as unknown as Ref<string>
    

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
        Share
          .share(share)
    }

    const goToPost = () => {
      router.push(`/tabs/post/${props.postId}`)
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
            stackAlertSuccess('Vote successfully deleted')
          } else {
            stackAlertError('There was an error with authorization, please try to re-login.')
          }
          delLoading.value = false
        } catch (error) {
          console.log('error', error)
          stackAlertError('The vote could not be deleted!')
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


    const reportPost = async () => {
      try {
      if(!reportDetails.value.length || reportDetails.value.length < 10) {
        stackAlertError('Please enter a reason for the report.')
        return
      }
      isReporting.value = true
      const res = await report(store, {
        type: reportType[0],
        reason: reportReason.value,
        details: reportDetails.value,
        resourceId: props.postId
      })
      if(res) {
        stackAlertSuccess('Report successful.')
        modalOpen.value = false
      } else {
        stackAlertError('There was an error with the report, please try again later.')
      }
    } catch {
      stackAlertError('There was an error with the report, please try again later.')
    }
    isReporting.value = false
  }

  const openReportPost = () => {
      modalContent.value = 'report'
      modalOpen.value = true
      modalLoading.value = false
    }

    const presentActionSheet = async () => {

       const buttons = []

      const isWebUrl = props.post?.url?.startsWith('http')

       if(isWebUrl) {
        buttons.push( {
              text: 'Open in Browser',
              role: 'open-in-browser',
              icon: openOutline,
              data: {
                action: 'open-in-browser',
              },
            })
      }

      buttons.push( {
              text: 'Share',
              icon: shareOutline,
              role: 'share',
              data: {
                action: 'share',
              },
            })

       buttons.push( {
              text: 'Re-fetch Metadata',
              role: 're-fetch',
              icon: refreshOutline,
              data: {
                action: 'refetch',
              },
            })

        buttons.push( {
              text: 'Open Post',
              role: 'go-to-post',
              icon: exitOutline,
              data: {
                action: 'open-post',
              },
            })
        
        buttons.push( {
              text: 'Recent Voters',
              role: 'recent',
              icon: eye,
              data: {
                action: 'recent-voters',
              },
        })

       buttons.push( {
              text: 'Report Post',
              role: 'refresh',
              icon: flag,
              data: {
                action: 'report',
              },
        })

       if( refHasVote.value ) {
       buttons.push({
              text: 'Delete Vote',
              role: 'destructive',
              icon: trashBinOutline,
              data: {
                action: 'delete',
              },
            })
        }

        buttons.push( {
              text: 'Cancel',
              role: 'cancel',
              icon: arrowDownOutline,
              data: {
                action: 'cancel',
              },
        })
        

        const actionSheet = await actionSheetController.create({
          subHeader: 'Post Menu',
          buttons
        });

        await actionSheet.present();

        const res = await actionSheet.onDidDismiss();
        if(res?.data?.action) { 
        switch (res.data.action) {
          case 'share': {
            sharePost()
            break
          }
          case 'delete': {
            deleteVote()
            break
          }
          case 'refetch': {
            refreshPreview()
            break
          }
          case 'open-post': {
            goToPost()
            break
          }
          case 'recent-voters': {
            showVoters()
            break
          }
          case 'report': {
            openReportPost()
            break
          }
          case 'open-in-browser': {
            window.open(props?.post?.url)
            break
          }
        }
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
      refreshPreview,
      presentActionSheet,
      reportDetails,
      reasons,
      reportReason,
      reportPost,
      isReporting
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