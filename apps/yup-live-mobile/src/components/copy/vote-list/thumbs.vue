<template>
  <span style="opacity: 0.7">{{ thumbs }}</span>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Thumbs',
  props: {
    vote: {
      required: true,
      type: Object
    }
  },
  setup(props) {
    const thumbs = ref('👍')

    onMounted(() => {
      const rating = props.vote.rating
      const like = props.vote.like

      const ratingMap: Record<number, string> = { 1: '👍', 2: '👍👍', 3: '👍👍👍' }
      const ratingMapFalse: Record<number, string> = { 1: '👎', 2: '👎👎' }
      if (like) {
        thumbs.value = ratingMap[rating]
      } else {
        thumbs.value = ratingMapFalse[rating]
      }
    })

    return {
      thumbs
    }
  }
})
</script>
