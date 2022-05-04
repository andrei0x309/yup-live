<template>
  <o-dropdown class="table-nav" aria-role="list" @active-change="dropActive = !dropActive">
    <template #trigger>
      <span>{{ `${act} ${dropActive ? '▲' : '▼'}` }}</span>
    </template>
    <o-dropdown-item v-for="link of linksWithoutActive" :key="link.name" aria-role="listitem" @click="goTo(link.path)">{{
      link.name
    }}</o-dropdown-item>
  </o-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TableNav',
  props: {
    linkActive: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const links = [
      {
        name: 'Vote List',
        path: '/'
      },
      {
        name: 'Top Rewards',
        path: '/rewards'
      },
      {
        name: 'Top Sellers',
        path: '/sellers'
      },
    ]

    const linksWithoutActive = links.filter((link) => link.name !== props.linkActive)
    const dropActive = ref(false)
    const act = ref(props.linkActive)
    const router = useRouter()

    const goTo = (path: string) => {
      router.push({ path })
    }

    return {
      act,
      linksWithoutActive,
      dropActive,
      goTo
    }
  }
})
</script>

<style lang="scss">
.table-nav {
  font-size: 0.8rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  width: 10rem;
  color: aliceblue;
  border: 1px solid rgba(204, 204, 204, 0.295);
  border-radius: 0.2rem;

  .o-drop__menu {
    background-color: var(--glassBg);
  }
}
</style>
