<template>
  <div class="card">
    <div class="ds-top">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <slot name="settings"></slot>
    </div>
    <div class="avatar-holder">
      <img :src="source" :alt="userData.username" loading="lazy" @error="onError" />
    </div>
    <div class="name">
      {{ userData.username }}
      <h6 title="Followers">
        <ion-icon :icon="PeopleIcon" class="w-6" /><span class="followers">{{ userData.followers }}</span>
      </h6>
    </div>
    <!-- <button class="button">FOLLOW <ion-icon :icon="personAdd" /></button> -->
    <div class="ds-info">
      <div class="ds pens">
        <h6 title="Number of pens created by the user">Tokens</h6>
        <p>{{ userData.balance }}</p>
      </div>
      <div class="ds projects">
        <h6 title="Number of projects created by the user">Influence</h6>
        <p>{{ userData.weight }}/10</p>
      </div>
      <div class="ds posts">
        <h6 title="Number of posts">Score</h6>
        <p>{{ userData.score }}/100</p>
      </div>
    </div>
    <div class="ds-actions">
      <h6 class="pt-2">Actions Remaining</h6>
      <p class="nextReset">
        Next Reset: <b>{{ userData.nextReset }}</b>
      </p>
      <div class="flex mx-auto justify-center my-2">
      <ion-chip style="display: flex;flex-direction: column;" class="opacity-70 h-14" ><div><p>Like</p><b>{{userData.actionBars.vote}}</b></div></ion-chip>
      <ion-chip style="display: flex;flex-direction: column;" class="opacity-70 h-14" ><div><p>Delete</p><b>{{userData.actionBars.deleteVote}}</b></div></ion-chip>
      <ion-chip style="display: flex;flex-direction: column;" class="opacity-70 h-14" ><div><p>Follow</p><b>{{userData.actionBars.follow}}</b></div></ion-chip>
      </div>
      <div v-if="canDoPost">
        <h6 class="pt-2">Connected Socials</h6>
        <div class="flex mx-auto justify-center my-2">
          <TwitterIcon class="w-8 mx-2" v-if="store?.userData?.connected?.twitter" />
          <ProfileFarcasterIcon class="w-6 mx-2" v-if="store?.userData?.connected?.farcaster" />
          <ProfileLensIcon class="w-6 mx-2" v-if="store?.userData?.connected?.lens" />
          <ProfileBskyIcon class="w-10 mx-1" v-if="store?.userData?.connected?.bsky" />
          <ThreadsIcon class="w-6 mx-2" v-if="store?.userData?.connected?.threads" />
      </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, PropType } from 'vue'
// import ProfileUseBar from '@/components/content/profile/useBar.vue'
// import FollowersIcon from 'icons/src/followers.vue'
// import AddFollow from 'icons/src/addFollow.vue'
import { makeRandAvatar } from 'shared/src/utils/accounts'
import type { NameValue } from 'shared/src/types/account'
import {
  IonIcon,
  IonChip
} from '@ionic/vue'

import {
people as PeopleIcon,
personAdd
} from "ionicons/icons";
import ProfileLensIcon from "icons/src/profileLens.vue";
import ProfileFarcasterIcon from "icons/src/profileFarcaster.vue";
import ProfileBskyIcon from "icons/src/bskyClouds.vue";
import TwitterIcon from "icons/src/twitter.vue";
import { canPost } from 'shared/src/utils/requests/crossPost';
import { useMainStore } from '@/store/main';
import ThreadsIcon from 'icons/src/threads.vue'

export default defineComponent({
  name: 'PostInfo',
  components: {
    // ProfileUseBar,
    // AddFollow,
    IonIcon,
    IonChip,
    ProfileLensIcon,
    ProfileBskyIcon,
    TwitterIcon,
    ProfileFarcasterIcon,
    ThreadsIcon
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
    }
  },
  setup(props) {
    const source = ref(props.userData.avatar)
    // const isLoading = ref(true)

    const onError = () => {
      source.value = makeRandAvatar(props.userData.username)
    }

    const store = useMainStore()
    const canDoPost = canPost(store)

    // const onLoad = () => {
    //   isLoading.value = false
    // }

    onMounted(() => {
      // nothing
    })

    return {
      onError,
      source,
      PeopleIcon,
      personAdd,
      canDoPost,
      store

      // onLoad,
      // isLoading,
      // isError,
    }
  }
})
</script>

<style lang="scss">
html {
  --profile-card-bg: #ffffff61;  
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
    margin: 1rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 21rem;
    border-radius: 10px;
    box-shadow: 0 10px 25px 5px rgb(0 0 0 / 20%);
    background: #485e830d;
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
    height: 5.4rem;
    background: radial-gradient(ellipse at bottom, #4e4691 0%, #1d102a 100%);
    overflow: hidden;
  }
  #stars {
    width: 1px;
    height: 1px;
    box-shadow: $shadows-small;
    animation: animStar 50s linear infinite;

    &:after {
      content: ' ';
      position: absolute;
      top: 500px;
      width: 1px;
      height: 1px;
      box-shadow: $shadows-small;
    }
  }
  #stars2 {
    width: 2px;
    height: 2px;
    box-shadow: $shadows-medium;
    animation: animStar 100s linear infinite;

    &:after {
      content: ' ';
      position: absolute;
      top: 500px;
      width: 2px;
      height: 2px;
      box-shadow: $shadows-medium;
    }
  }
  #stars3 {
    width: 3px;
    height: 3px;
    box-shadow: $shadows-big;
    animation: animStar 130s linear infinite;

    &:after {
      content: ' ';
      position: absolute;
      top: 500px;
      width: 3px;
      height: 3px;
      box-shadow: $shadows-big;
    }
  }
  @keyframes animStar {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-500px);
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
    border-radius: 30%;
    box-shadow: 0 0 0 5px var(--profile-av-holder-sh1), inset 0 0 0 5px var(--profile-av-holder-sh2);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      z-index: 9; 
    }
  }
  .name {
    margin-top: 2.2rem;
    text-align: center;
    line-height: 2.2rem;
    font-size: 1.12rem;
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
    padding: 0.3rem 0.8rem;
    border-radius: 0.4rem;
    letter-spacing: 0.02em;
    transition: all 1s;
    border: 1px solid rgba(182, 179, 38, 0.368627451);
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1.1rem;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    margin-top: 0.8rem;
    &:hover {
      background: rgb(255 94 0 / 4%);
    }
  }
  .ds-info {
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    .pens,
    .projects,
    .posts {
      width: calc(250px / 3);
      text-align: center;
      color: white;
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
    text-align: center;
    margin-top: 1.1rem;
    h6 {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
}


.followers {
  position: relative;
  left: 0.2rem;
  top: 0.05rem;
}

.nextReset {
  font-size: 0.8rem;
}
</style>