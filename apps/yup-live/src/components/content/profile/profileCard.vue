<template>
  <div class="card">
    <div class="ds-top">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>
    <div class="avatar-holder">
      <img :src="source" :alt="userData.username" loading="lazy" @error="onError" />
    </div>
    <div class="name">
      {{ userData.username }}
      <h6 title="Followers">
        <FollowersIcon class="inline w-4" /><span class="followers">{{ userData.followers }}</span>
      </h6>
    </div>
    <template v-if="isOwnAccount">
      <o-tooltip :triggers="['hover']" :autoClose="true" :multiline="true">
              <template #content>
                <div class="followToolTip">
                  <p class="p-2">You can't follow yourself</p>
                </div>
              </template>
              <button :disabled="true" class="button opacity-70 cursor-not-allowed">FOLLOW <AddFollow /></button>
            </o-tooltip>
    </template>
    <template v-else-if="!isAuth">
      <o-tooltip :triggers="['hover']" :autoClose="true" :multiline="true">
              <template #content>
                <div class="followToolTip">
                  <p class="p-2">You can't follow if you're not connected</p>
                </div>
              </template>
              <button :disabled="true" class="button opacity-70 cursor-not-allowed">FOLLOW <AddFollow /></button>
            </o-tooltip>
    </template>
    <template v-else>
      <button :disabled="isActionLoading" class="button" @click="localIsFollowing ? follow() : unfollow()">
      <BtnSpinner v-if="isActionLoading" class="inline w-3" />
      {{ FOLLOW_TEXT }} <AddFollow /></button>
  </template>
    <div class="ds-info">
      <div class="ds pens">
        <h6 title="Number of pens created by the user">Tokens</h6>
        <p>{{ userData.balance }}</p>
      </div>
      <div class="ds projects">
        <h6 title="Number of projects created by the user">Influence</h6>
        <p><b>{{ userData.weight }}</b> out of 10</p>
      </div>
      <div class="ds posts">
        <h6 title="Number of posts">Score</h6>
        <a :href="`/score/${userData.evmAddress}`" class="scoreLink" >{{ userData.score }}</a>
      </div>
    </div>
    <div class="ds-actions">
      <h6 class="pt-2">Actions Remaining</h6>
      <ProfileUseBar text="Likes" :percentage="userData.actionBars.vote" />
      <ProfileUseBar text="Deleting Likes" :percentage="userData.actionBars.deleteVote" />
      <ProfileUseBar text="Follows" :percentage="userData.actionBars.follow" />
      <p class="nextReset mt-4">
        Next Reset: <b>{{ userData.nextReset }}</b>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType } from 'vue'
import ProfileUseBar from '@/components/content/profile/useBar.vue'
import FollowersIcon from '@/components/content/icons/followers.vue'
import AddFollow from '@/components/content/icons/addFollow.vue'
import { makeRandAvatar } from 'shared/src/utils/accounts'
import type { NameValue } from 'shared/src/types/account'
import { stackAlertError, stackAlertSuccess } from '@/store/alertStore'
import { fetchWAuth } from 'shared/src/utils/auth'
import { useMainStore } from '@/store/main'
import BtnSpinner from 'icons/src/btnSpinner.vue'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export default defineComponent({
  name: 'ProfileCard',
  components: {
    ProfileUseBar,
    AddFollow,
    FollowersIcon,
    BtnSpinner
  },
  props: {
    postInfo: {
      type: Array as PropType<Array<NameValue>>,
      default: () => [
        {
          name: '',
          value: ''
        }
      ]
    },
    userData: {
      type: Object,
      default: () => ({
        username: '',
        avatar: '',
        nextReset: '',
        followers: 0,
        balance: 0,
        weight: 0,
        score: 0,
        actionBars: {
          vote: 0,
          deleteVote: 0,
          follow: 0
        }
      })
    },
    isOwnAccount: {
      type: Boolean,
      default: false
    },
    isAuth: {
      type: Boolean,
      default: false
    },
    isFollowing: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const source = ref(props.userData.avatar)
    const localIsFollowing = ref(props.isFollowing)
    const store = useMainStore()
    const isActionLoading = ref(false)
    const FTEXT = 'FOLLOW'
    const UTEXT = 'UNFOLLOW'
    const FOLLOW_TEXT = ref(localIsFollowing.value ? FTEXT : UTEXT)
    // const isLoading = ref(true)

    const onError = () => {
      source.value = makeRandAvatar(props.userData.username)
    }

    // const onLoad = () => {
    //   isLoading.value = false
    // }

    const follow = () => {
      isActionLoading.value = true
      fetchWAuth(store, `${API_BASE}/v2/followers?accountToFollow=${props.userData._id}`, {
        method: 'POST'
      })
        .then((res) => {
          if (res.ok) {
            localIsFollowing.value = false
            FOLLOW_TEXT.value = UTEXT
            stackAlertSuccess('You are now following ' + props.userData.username)
          } else {
            stackAlertError('Something went wrong')
          }
          isActionLoading.value = false
        })
        .catch((err) => {
          stackAlertError(String(err))
          isActionLoading.value = false
        })
    }

    const unfollow = () => {
      isActionLoading.value = true
      fetchWAuth(store, `${API_BASE}/v2/followers?accountToUnfollow=${props.userData._id}`, {
        method: 'DELETE'
      })
        .then((res) => {
          if (res.ok) {
            FOLLOW_TEXT.value = FTEXT
            localIsFollowing.value = true
            stackAlertSuccess('You are no longer following ' + props.userData.username)
          } else {
            stackAlertError('Something went wrong')
          }
          isActionLoading.value = false
        })
        .catch((err) => {
          stackAlertError(String(err))
          isActionLoading.value = false
        })
    }

    onMounted(() => {
      // nothing
    })

    return {
      onError,
      source,
      unfollow,
      follow,
      localIsFollowing,
      isActionLoading,
      FOLLOW_TEXT
      // onLoad,
      // isLoading,
      // isError,
    }
  }
})
</script>

<style lang="scss">
html {
  --profile-card-bg: #c7bfb8eb;
  --profile-card-head1: #ffd375d9;
  --profile-card-head2: #818181;
  --profile-av-holder-sh1: #cbcbcb;
  --profile-av-holder-sh2: #c3c3c3ed;
}

html[class='dark'] {
  --profile-card-bg: #151515;
  --profile-card-head1: #1d55ab;
  --profile-card-head2: #0a1c3826;
  --profile-av-holder-sh1: #151515;
  --profile-av-holder-sh2: #3c3c3c;
}

.card {
  position: relative;
  margin: 2rem;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 18rem;
  height: 31rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px 5px rgb(0 0 0 / 20%);
  background: var(--profile-card-bg);
  overflow: hidden;

  @function multiple-box-shadow($n) {
    $value: '#{random(2000)}px #{random(2000)}px #FFF';
    @for $i from 2 through $n {
      $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
    }

    @return unquote($value);
  }
  $shadows-small: multiple-box-shadow(700);
  $shadows-medium: multiple-box-shadow(200);
  $shadows-big: multiple-box-shadow(100);

  .ds-top {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    height: 4.4rem;
    background: radial-gradient(ellipse at bottom, var(--profile-card-head1) 0%, var(--profile-card-head2) 100%);
    overflow: hidden;
  }
  #stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: $shadows-small;
    animation: animStar 50s linear infinite;

    &:after {
      content: ' ';
      position: absolute;
      top: 2000px;
      width: 1px;
      height: 1px;
      background: transparent;
      box-shadow: $shadows-small;
    }
  }
  #stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: $shadows-medium;
    animation: animStar 100s linear infinite;

    &:after {
      content: ' ';
      position: absolute;
      top: 2000px;
      width: 2px;
      height: 2px;
      background: transparent;
      box-shadow: $shadows-medium;
    }
  }
  #stars3 {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: $shadows-big;
    animation: animStar 150s linear infinite;

    &:after {
      content: ' ';
      position: absolute;
      top: 2000px;
      width: 3px;
      height: 3px;
      background: transparent;
      box-shadow: $shadows-big;
    }
  }
  #title {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;

    text-align: center;
    font-weight: 300;
    font-size: 50px;
    letter-spacing: 10px;

    margin-top: -60px;
    padding-left: 10px;

    span {
      background: -webkit-linear-gradient(white, #38495a);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  @keyframes animStar {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-2000px);
    }
  }
  .avatar-holder {
    position: relative;
    margin: auto;
    top: 1.5rem;
    right: 0;
    left: 0;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    box-shadow: 0 0 0 5px var(--profile-av-holder-sh1), inset 0 0 0 5px var(--profile-av-holder-sh2);
    overflow: hidden;
    animation: mvTop 1.5s;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .name {
    position: relative;
    width: inherit;
    animation: fadeIn 2s ease-in;
    top: 2.2rem;
    a {
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 18px;
      &:hover {
        text-decoration: underline;
        color: #24799b;
      }
    }
    h6 {
      margin-top: -0.3rem;
    }
  }
  .button {
    position: relative;
    top: 2.8rem;
    animation: fadeIn 2s ease-in;
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    letter-spacing: 0.02em;
    transition: all 1s;
    border: 1px solid #b6b3265e;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1.3rem;
    &:hover {
      background: rgb(255 94 0 / 4%);
    }
  }
  .ds-info {
    position: relative;
    top: 4rem;
    left: 8%;
    display: flex;

    .pens,
    .projects,
    .posts {
      position: relative;
      left: -300px;
      width: calc(250px / 3);
      text-align: center;
      color: white;
      animation: fadeInMove 2s;
      animation-fill-mode: forwards;
      h6 {
        text-transform: uppercase;
        font-size: 0.86rem;
      }
      p {
        font-size: 12px;
      }
    }
    .ds {
      &:nth-of-type(2) {
        animation-delay: 0.5s;
      }
      &:nth-of-type(1) {
        animation-delay: 1s;
      }
    }
  }
  .ds-actions {
    position: relative;
    right: 0;
    left: 5%;
    width: 90%;
    top: 5.3rem;
    animation: mvBottom 1.5s;
    h6 {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
}

@keyframes fadeInMove {
  0% {
    opacity: 0;
    left: -300px;
  }
  100% {
    opacity: 1;
    left: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes mvBottom {
  0% {
    bottom: -150px;
  }
  100% {
    bottom: 10px;
  }
}

@keyframes mvTop {
  0% {
    top: -150px;
  }
  100% {
    top: 40px;
  }
}

@keyframes dsTop {
  0% {
    top: -150px;
  }
  100% {
    top: 0;
  }
}

.following {
  color: white;
  background: #316be9;
}

.followers {
  position: relative;
  left: 0.2rem;
  top: 0.05rem;
}

.nextReset {
  font-size: 0.8rem;
}

.followToolTip {
  font-size: 0.81rem;
    display: inline-flex;
    min-width: 12rem;
    flex-direction: column;
}

.scoreLink {
     display: block;
    border: 1px solid #39527c;
    border-radius: 100%;
    width: 1.5rem;
    margin: auto;
    font-size: 12px;
}

</style>