<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color table-list w-full mb-4">
    <nav>
  <ul>
    <li>
      <a href="#">Daily Hits</a>
    </li>
    <li>
      <a href="#">Crypto</a>
    </li>
    <li>
      <a href="#">NFTs</a>
    </li>
    <li>
      <a href="#">Mirror</a>
    </li>
  </ul>
</nav>
    <nav>
  <ul>
    <li>
      <a href="#">Recent</a>
    </li>
    <li>
      <a href="#">Farcaster</a>
    </li>
    <li>
      <a href="#">Lens</a>
    </li>
    <li>
      <a href="#">Politics</a>
    </li>
  </ul>
</nav>
    </div>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  reactive,
  computed,
  onUnmounted,
  Ref,
//   ref,
} from "vue";
import { useHead, HeadObject } from "@vueuse/head";
// import DangLoader from "@/components/content/vote-list/loader.vue";
// import DateIcon from '@/components/content/icons/date.vue'
// import { useMainStore } from '@/store/main'


export default defineComponent({
  name: "RawInfluence",
  components: {
    // DangLoader,
    // DateIcon
  },
  setup() {
    // const API_BASE = import.meta.env.VITE_YUP_API_BASE;
    // const search = ref("");
    // const store = useMainStore();
    // const apiError = ref(false);
    // const apiErrorMsg = ref("");
    // const userId = ref("");
    // const isDataLoading = ref(false);
    // const influence: Ref<null | string> = ref(null);
    // const historicInfluence: Ref<Array<Record<string, string | number>>> = ref([]);
    // const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')

    const FEED_APIS  = {
        dailyHits: 'https://api.yup.dev/feed/dailyHits',
        crypto: 'https://api.yup.dev/feed/crypto',
        nfts: 'https://api.yup.dev/feed/nfts',
        mirror: 'https://api.yup.dev/feed/mirror',
        recent: 'https://api.yup.dev/feed/recent',
        farcaster: 'https://api.yup.dev/feed/farcaster',
        lens: 'https://api.yup.dev/feed/lens',
        politics: 'https://api.yup.dev/feed/politics'
    }
   
    


    const siteData = reactive({
      title: `YUP Live - Check your raw influence`,
      description: `LiveCheck your raw influence for YUP DApp...`,
    });

    onMounted(async () => {
      // do nothing
    });

    onUnmounted(() => {
      // do nothing
    });

    useHead(({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
    } as unknown) as Ref<HeadObject>);

  },
});
</script>

<style lang="scss">


html {
  height:100%;
  background-image: linear-gradient(to right top, #8e44ad 0%, #3498db 100%);
}

nav {
  max-width: 100%;
  mask-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #ffffff 25%, #ffffff 75%, rgba(255, 255, 255, 0) 100%);
  margin: 0 auto;
  padding: 2rem 0;
  margin:1rem;
}

nav ul {
  text-align: center;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1), inset 0 0 1px rgba(255, 255, 255, 0.6);
}

nav ul li {
  display: inline-block;
}

nav ul li a {
  padding: 1rem;
  text-transform:uppercase;
  color: rgba(0, 35, 122, 0.5);
  font-size: 1.2rem;
  text-decoration: none;
  display: block;
}

nav ul li a:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), inset 0 0 1px rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(0, 35, 122, 0.7);
}



</style>
