<template>
  <div id="nexus6p" :key="anim" :style="anim">
    <div class="profile">
      <div class="profile-top">
        <div class="profile-bg"></div>
        <div class="profile-mask"></div>
        <div class="post-details">
          <InfoIcon class="w-16" style="opacity: 0.6" />
          <div class="personal-details">
            <div>Post Info:</div>
          </div>
        </div>
      </div>
      <div class="profile-bottom">
        <div class="profile-container contact-info open">
          <p v-for="info of postInfo" :key="info.name" class="px-4 py-2">
            <b>{{ info.name }}:</b> <span v-html="info.value"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, Ref } from 'vue'
import InfoIcon from '../icons/infoIcon.vue'
import type { NameValue } from '@/types/account'

export default defineComponent({
  name: 'PostInfo',
  components: {
    InfoIcon
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const isError = ref(false)
    const isLoading = ref(true)
    const anim = ref('')

    const onError = () => {
      isError.value = true
    }

    const onLoad = () => {
      isLoading.value = false
    }
    const postInfo = ref([]) as unknown as Ref<Array<NameValue>>

    onMounted(() => {
      if (props?.post?._id?.postid) {
        anim.value = 'animation: pinfoChange 0.3s linear;'
        postInfo.value = [
          {
            name: 'Post Id',
            value: props.post?._id?.postid ?? 'Invalid PostId'
          },
          {
            name: 'Tag',
            value: props.post?.tag ?? 'Unknown'
          },
          {
            name: 'URL',
            value: `<a href="${props.post.url}">Link</a>`
          },
          {
            name: 'Positive Weight',
            value: props.post?.rawPositiveWeight ?? props.post?.positiveWeight ?? 0
          },
          {
            name: 'Negative Weight',
            value: props.post?.rawNegativeWeight ?? props.post?.negativeWeight ?? 0
          },
          {
            name: 'Total Likes',
            value: props.post?.catVotes?.overall?.up ?? props
          },
          {
            name: 'Total Dislikes',
            value: props.post?.catVotes?.overall?.down ?? props
          },
          {
            name: 'Total Creator Rewards',
            value: props.post.totalCreatorRewards.toFixed(2)
          }
        ]
        setTimeout(() => {
          anim.value = ''
        }, 400)
      }
    })

    return {
      onError,
      onLoad,
      isLoading,
      isError,
      postInfo,
      anim
    }
  }
})
</script>

<style lang="scss">
html {
  --post-info-card-top-bg-from1: #c98d0b;
  --post-info-card-top-bg-from2: #cba655;
  --post-info-card-bottom-bg: #ffffff61;
}

html[class='dark'] {
  --post-info-card-top-bg-from1: #1d55ab;
  --post-info-card-top-bg-from2: #1d55ab;
  --post-info-card-bottom-bg: #2626263b;
}

#nexus6p {
  width: 18rem;
  position: sticky;
  margin: 2.5rem;
  align-self: flex-start;
  top: 20vh;
  transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.profile {
  width: 100%;
  height: 100%;
}

.profile-top {
  position: relative;
  width: 100%;
  height: 13rem;
  display: block;
}

.profile-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  -webkit-clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
  clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
  background: radial-gradient(ellipse at bottom, var(--post-info-card-top-bg-from1) 0%, rgba(10, 28, 56, 0.15) 100%);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.profile-mask {
  position: absolute;
  width: 100%;
  height: 92%;
  background: radial-gradient(ellipse at bottom, var(--post-info-card-top-bg-from2) 0%, rgba(10, 28, 56, 0.15) 100%);
  -webkit-clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
  clip-path: polygon(0% 0%, 0% 80%, 100% 100%, 100% 0%);
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
}

.post-details {
  z-index: 1;
  width: 100%;
  position: absolute;
  top: 30%;
  left: 0;
  padding: 10px 0;
  //background: rgba(50,50,50, 0.7);
  & * {
    display: inline-block;
    vertical-align: top;
  }
  & img {
    border: 2px solid white;
    width: 20%;
    border-radius: 50%;
    position: relative;
    left: 5%;
  }
}

.personal-details {
  margin-left: 2rem;
  padding-top: 1rem;
}

.profile-bottom {
  text-align: left;
  font-size: 0.88rem;
  margin-top: -4rem;
}

.profile-bottom .profile-container {
  height: 100%;
  padding: 4rem 1rem 1rem 1rem;
  background-color: var(--post-info-card-bottom-bg);
  border-radius: 0.5rem;
}

@keyframes pinfoChange {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>