<template>
  <div>
    <div class="flex justify-between -mt-2 px-4 poap" style="z-index: 1">
      <span class="inline-block favIco">
        <PoapIcon class="w-5" />
      </span>
      <span class="flex mtime h-min space-x-1 items-center rounded-full text-xs font-medium mt-2">
        <ClockIcon class="w-5 h-5" />
        <p class="font-semibold text-xs">Minted</p>
        <p class="font-semibold text-xs">
          {{ post.createdAt }}
        </p>
      </span>
    </div>
    <div class="py-2 px-2">
      <div class="flex p-2">
        <AvatarBtn
          :key="`${mainPost.userAvatar}`"
          class="w-9 h-9"
          imgClass="w-9 h-9"
          :pSource="mainPost.userAvatar"
          :isSelf="false"
          :isTwitter="true"
          :pAccount="mainPost.userAddr"
        />
        <div class="flex flex-col text-justify pl-3">
          <span>{{ mainPost.yupAccount.username ?? mainPost.userEns ?? truncteEVMAddr(mainPost.userAddr) }}</span>
          <span v-if="mainPost.yupAccount.username && mainPost.userEns" class="opacity-70">@{{ mainPost.userEns }}</span>
        </div>
      </div>
    </div>
    <p class="w-full text-left pl-14">Claimed POAP:</p>
    <div class="py-1 px-4 flex" style="margin: 0.9rem 1rem 1rem 1rem; font-size: 1.1rem">
      <ImagePreview
        :key="mainPost.eventImage"
        :noPreviewParagraph="false"
        :source="mainPost.eventImage"
        imgClass="rounded-full min-h-35 min-w-35 max-h-45 max-w-45"
        noPreviewClass="rounded-full min-h-35 min-w-35 max-h-45 max-w-45"
      />
      <div>
        <p class="ml-2">{{ mainPost.eventName }}</p>
        <p class="pt-4 px-4 ml-2 text-[0.9rem] leading-7 text-left indent-4">{{ mainPost.eventDescription }}</p>
        <p class="pt-6 ml-2 text-[0.85rem] opacity-70">Took place on: {{ mainPost.eventStarted }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, Ref, ref } from 'vue'
import ClockIcon from 'icons/src/clock.vue'
import PoapIcon from 'icons/src/poap.vue'
import { truncteEVMAddr } from 'shared/src/utils/misc'
import ImagePreview from '../post/imagePreview.vue'
import AvatarBtn from 'components/functional/avatarBtn.vue'
import type { Web3PostPOAP, Web3POAPRaw } from 'shared/src/types/web3/poap'

export default defineComponent({
  name: 'PostPOAP',
  components: {
    ClockIcon,
    ImagePreview,
    PoapIcon,
    AvatarBtn
  },
  props: {
    post: {
      required: false,
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const mainPost = ref({
      userAvatar: '',
      userAddr: '',
      userEns: '',
      userEnsAvatar: '',
      eventDescription: '',
      eventName: '',
      eventStarted: '',
      eventImage: '',
      eventUrl: '',
      yupAccount: {
        avatar: '',
        username: '',
        _id: ''
      }
    }) as unknown as Ref<Web3PostPOAP>

    const fillPost = (filler: Web3POAPRaw) => {
      const postBuilder = {} as Web3PostPOAP
      postBuilder.yupAccount = {}
      postBuilder.userAddr = filler?.creator?.address ?? ''
      postBuilder.userEns = filler?.creator?.ens ?? ''
      postBuilder.yupAccount.username = filler?.creator?.meta?.username ?? ''
      postBuilder.yupAccount.avatar = filler?.creator?.meta?.avatar ?? ''
      postBuilder.yupAccount._id = filler?.creator?.meta?._id ?? ''
      postBuilder.eventDescription = filler?.content ?? ''
      postBuilder.eventName = filler?.title ?? ''
      postBuilder.eventStarted = filler?.meta?.event?.start_date ?? ''
      postBuilder.eventImage = filler?.meta?.event?.image_url ?? ''
      postBuilder.eventUrl = filler?.meta?.event?.event_url ?? ''
      postBuilder.userAvatar = filler?.creator?.meta?.avatar ?? filler?.creator?.meta?.ensAvatar ?? ''
      return postBuilder
    }

    onMounted(() => {
      const poap = Object.assign({}, props.post.web3Preview, { createdAt: props?.post?.createdAt })
      mainPost.value = fillPost(poap)
    })

    return {
      mainPost,
      truncteEVMAddr
    }
  }
})
</script>

<style scoped lang="scss">
div.poap {
  .mtime {
    width: 100%;
    max-width: 10.5rem;
  }
}
</style>