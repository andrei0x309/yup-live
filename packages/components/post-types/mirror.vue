<template>
  <div>
  <BtnSpinner v-if="loading" />
  <template v-else>
    <div class="flex justify-between mt-4 px-4" style="z-index: 1;z-index: 1;position: absolute;width: 100%;">
    <span class="flex mtime h-min space-x-1 items-center rounded-full text-xs font-medium">
      <ClockIcon class="w-5 h-5" />
      <p class="font-semibold text-xs">
        {{ post.createdAt }}
      </p>
    </span>
    <span class="inline-block mfavIco">
      <MirrorIcon class="w-5 tIcon" />
    </span>
  </div>
    <div class="py-2 px-4" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
      <h1 class="text-xl font-medium leading-6 tracking-wide dark:text-gray-300 text-gray-900 cursor-pointer mt-8">
        {{ mirrorPost.title }}
      </h1>
      <span class="text-[0.7rem] opacity-70 text-center block-inline w-full mt-4">Author: {{ mirrorPost.author }}</span>
      <ImagePreview v-if="featureImage" :showPlaceholder="false" :key="featureImage" :source="featureImage" imgClass="min-w-60 max-w-100" />
    </div>
    <div class="px-4 space-y-2" style="font-size: 0.9rem">
      <div class="font-normal leading-6 indent-4 mirror-content" v-html="mirrorPost.content"></div>
      <div v-if="!full && (post?.web3Preview?.content ?? '').length >= 500" class="flex justify-center">
        <router-link :to="`/post/${post?.id}`">
        <CustomButton
          class="text-xs font-medium"
          :text="`Read&nbsp;&nbsp;&nbsp;more`"
        />
      </router-link>
      </div>
    </div>
  </template>
</div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'
import ClockIcon from 'icons/src/clock.vue'
import MirrorIcon from 'icons/src/mirror.vue'
import { marked } from 'marked'
import clip from 'shared/src/utils/3p/clipper'
import BtnSpinner from 'icons/src/btnSpinner.vue'
import { parseIpfs } from 'shared/src/utils/web3/ipfs'
import ImagePreview from 'components/post/imagePreview.vue'
import CustomButton from 'components/functional/customButton.vue'

export default defineComponent({
  name: 'PostMirror',
  components: {
    ClockIcon,
    MirrorIcon,
    BtnSpinner,
    ImagePreview,
    CustomButton
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
    const featureImage = ref('')
    const loading = ref(true)

    onMounted(async () => {
      const dom = new DOMParser().parseFromString(marked.parse((props.post?.web3Preview?.content ?? '').replace(/\\/gi, '')), 'text/html')
      
      const html = (dom.querySelector('body')?.innerHTML ?? '').replace(/([^>])(https?.*? )( |\n|\t|$)/gms, '$1<a href="$2">$2</a>$3')

      mirrorPost.value.content = props.full ? html : clip(html, 500, { html: true, maxLines: 8 })
      mirrorPost.value.title = props.post.web3Preview?.title
      let ens = props.post.web3Preview?.creator?.ens
      if (ens?.includes('%')) {
        ens = undefined
      }
      mirrorPost.value.author = ens ?? props.post.web3Preview?.creator?.address
      mirrorPost.value.createdAt = props.post.createdAt
      const wnftImage = props.post.web3Preview?.wnft?.imageURI
      if(wnftImage) {
        featureImage.value = parseIpfs(`ipfs://${wnftImage}`)
      }
      loading.value = false
    })

    return {
      mirrorPost,
      featureImage,
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

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  } 
}
</style>
