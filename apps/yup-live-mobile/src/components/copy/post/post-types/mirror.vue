<template>
  <BtnSpinner v-if="loading" />
  <div v-else :key="`loading-${loading}`">
    <div class="flex flex-row-reverse justify-between mt-2 px-4" style="z-index: 1;position: absolute;right: 0;top: 0.5rem;">
      <span class="inline-block mfavIco"><MirrorIcon class="w-5 tIcon" /> </span>
    </div>
    <div class="py-2 px-4" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
      <h1 class="text-xl font-medium leading-6 tracking-wide text-gray-300 hover:text-blue-500 cursor-pointer">
        {{ mirrorPost.title }}
      </h1>
      <span class="text-[0.7rem] opacity-70 text-center block-inline w-full mt-4">Author: {{ mirrorPost.author }}</span>
    </div>
    <div class="px-4 space-y-2" style="font-size: 0.9rem">
      <div class="font-normal leading-6 indent-4 mirror-content" v-html="mirrorPost.content"></div>
      <span class="flex flex-row-reverse h-min items-center rounded-full text-xs font-medium">
        <p class="text-xs opacity-70">Published {{ mirrorPost.createdAt }}</p>
        <ClockIcon class="w-4 h-4 mx-1 block-inline" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import ClockIcon from 'icons/src/clock.vue'
import MirrorIcon from 'icons/src/mirror.vue'
import snarkdown from 'snarkdown'
import clip from 'text-clipper'
import BtnSpinner from 'icons/src/btnSpinner.vue'

export default defineComponent({
  name: 'PostMirror',
  components: {
    ClockIcon,
    MirrorIcon,
    BtnSpinner
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const mirrorPost = ref({
      content: '',
      author: '',
      title: '',
      createdAt: ''
    })
    const loading = ref(true)

    onMounted(() => {
      console.log(props.full, 'IS FULL PROP')
      const dom = new DOMParser().parseFromString(snarkdown((props.post?.web3Preview?.content ?? '').replace(/\\/gi, '')), 'text/html')
      const html = dom.querySelector('body')?.innerHTML ?? ''

      mirrorPost.value.content = props.full ? html : clip(html, 240, { html: true, maxLines: 5 })
      mirrorPost.value.title = props.post.web3Preview?.title
      mirrorPost.value.author = props.post.web3Preview?.creator?.ens ?? props.post.web3Preview?.creator?.address
      mirrorPost.value.createdAt = props.post.createdAt
      loading.value = false
    })

    return {
      mirrorPost,
      loading
    }
  }
})
</script>

<style lang="scss">
div.mirror-content {
  text-align: justify;
  line-height: 1.4rem;
  padding: 0.6rem;

  img {
    margin: auto;
  }
  hr {
    opacity: 0.5;
    margin: 0.5rem;
  }
  em,
  strong {
    text-align: left;
  }

  h2 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  strong {
    margin: 0.5rem 0.5rem 1rem 0.5rem;
    display: inline-block;
  }
}
</style>
