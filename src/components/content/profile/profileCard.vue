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
        <FollowersIcon /><span class="followers">{{ userData.followers }}</span>
      </h6>
    </div>
    <button class="button">FOLLOW <AddFollow /></button>
    <div class="ds-info">
      <div class="ds pens">
        <h6 title="Number of pens created by the user">Tokens</h6>
        <p>{{ userData.balance }}</p>
      </div>
      <div class="ds projects">
        <h6 title="Number of projects created by the user">Influence</h6>
        <p>{{ userData.weight }}</p>
      </div>
      <div class="ds posts">
        <h6 title="Number of posts">Score</h6>
        <p>{{ userData.score }}</p>
      </div>
    </div>
    <div class="ds-actions">
      <h6 class="pt-2">Actions Remaining</h6>
      <ProfileUseBar text="Likes" :percentege="userData.actionBars.vote" />
      <ProfileUseBar text="Deleting Likes" :percentege="userData.actionBars.deleteVote" />
      <ProfileUseBar text="Follows" :percentege="userData.actionBars.follow" />
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
import { makeRandAvatar } from '@/utils/accounts'
import type { NameValue } from '@/types/account'

export default defineComponent({
  name: 'PostInfo',
  components: {
    ProfileUseBar,
    AddFollow,
    FollowersIcon
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

    // const onLoad = () => {
    //   isLoading.value = false
    // }

    onMounted(() => {
      // nothing
    })

    return {
      onError,
      source
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
    border: 1px solid rgb(114 83 213 / 77%);
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1.3rem;
    &:hover {
      background: #4e2adfa6;
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
</style>