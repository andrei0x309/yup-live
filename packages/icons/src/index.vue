<script lang="ts">
import ClockIcon from './clock.vue'
import ThumbsDown from './thumbsDown.vue';
import ThumbsUp from './thumbsDown.vue';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AllIcons',
  setup() {
    {
        return {
            ClockIcon,
            ThumbsDown,
            ThumbsUp
        }
    }
  }
})

</script>