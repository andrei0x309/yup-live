<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div class="bg-color page-log w-full mb-4">
      <h1
        class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl m-8 text-[#d7a73cd1]"
        style="text-shadow: 2px 2px 2px var(--glass-menu-bg)"
      >
        Changelog
      </h1>
      
      <section v-for="change of subsetChanges" :id="change.date" :key="change.date" :aria-labelledby="change.date" class="md:flex">
        <h2
          id="2022-09-07-heading"
          class="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right"
        >
           {{ change.date }}
        </h2>
        <div class="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
          <div class="absolute bottom-0 left-0 w-px bg-slate-200 -top-3 md:top-2.5"></div>
          <div
            class="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"
          ></div>
          <div
            class="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600"
          >
            <h3 class="font-weight-800 mb-4">{{ change.title}}</h3>
            <div><ol>
              <li v-for="(c, i) of change.changes" :key="i">{{c}}</li>
            </ol></div>
          </div>
        </div>
      </section>
      <CustomButton v-if="hasMore" :icon="AddIcon" text="Load More" class="mx-auto mt-4 mb-4" @click="loadMore" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CustomButton from "components/functional/customButton.vue";
import AddIcon from "icons/src/add.vue"


export default defineComponent({
  name: "ChangeLog",
  components: {
    // DangLoader,
    CustomButton
  },
  setup() {

    const changes = [
    {
        date: '27 NOV 2022',
        title: 'Changes',
        changes: [
        'made repo into a monorepo for mobile app', 
        'inital mobile app with features login/signup/feeds/acitvity, etc',
        'added changeLog page on yup live to outline changes',
        'added community meetings page',
        'added json download for gini data',
        'made staking page more reactive',
        'added stake position on staking page',
        'added setting page with edit / delete account'
      ],
        milestone: true
      },
      {
        date: '8 NOV 2022',
        title: 'Changes',
        changes: ['added the default static metadata', 'changed the dynamic metadata'],
        milestone: false
    },
    {
        date: '7 NOV 2022',
        title: 'Changes',
        changes: ['updated all dependencies to latest version'],
        milestone: false
    },
    {
        date: '3 NOV 2022',
        title: 'Changes',
        changes: ['refactor fetchWithAuth', 'added auto login in extension if login/signup on yup live'],
        milestone: false
    },
    {
        date: '2 NOV 2022',
        title: 'Changes',
        changes: ['remove link to my EVM wallet until later', 'added changes required for new auth system'],
        milestone: false
    },
    {
        date: '7 OCT 2022',
        title: 'Changes',
        changes: ['add hotname to sitemap', 'change max vote'],
        milestone: false
    },
    {
        date: '25 SEP 2022',
        title: 'Changes',
        changes: ['misc UI fixes', 'remove some hardcoded values', 'fix some typos'],
        milestone: false
    },
      {
        date: '30 SEP 2022',
        title: 'Changes',
        changes: ['fix wallet connect network name'],
        milestone: false
    },
      {
        date: '25 SEP 2022',
        title: 'Changes',
        changes: ['fix wallet connect network name'],
        milestone: false
    },
    {
        date: '22 SEP 2022',
        title: 'Changes',
        changes: ['add web3socials page to check EVM for social accounts'],
        milestone: false
    },
    {
        date: '16 SEP 2022',
        title: 'Changes',
        changes: ['only allow polygon tx on staking page', 'use paginatied api for collection view'],
        milestone: false
    },
    {
        date: '14 SEP 2022',
        title: 'Changes',
        changes: ['added wallet profile page'],
        milestone: false
    },
    {
        date: '30 AUG - 14 SEP 2022',
        title: 'Changes',
        changes: ['deployed yup live v2', 'added signup, signin, voting, posts, staking, feeds, etc', 'various fixes & optimizations', 'added SSG build step'],
        milestone: true
    },
    {
        date: '6 AUG 2022',
        title: 'Changes',
        changes: ['revised sellers page'],
        milestone: false
    },
    {
        date: '3 AUG 2022',
        title: 'Changes',
        changes: ['replaced caption with urls in api calls'],
        milestone: false
    },
    {
        date: '3 JUL 2022',
        title: 'Changes',
        changes: ['convert dots to thumbs'],
        milestone: false
    },
    {
        date: '18 JUN 2022',
        title: 'Changes',
        changes: ['change account route due to permalink change'],
        milestone: false
    },
    {
        date: '9 JUN 2022',
        title: 'Changes',
        changes: ['added export to top sellers', 'added headers to csv export'],
        milestone: false
    },
    {
        date: '8 JUN ',
        title: 'Changes',
        changes: ['added historic raw influence to raw influence page', 'changed gini UI controls', 'refactor d3 components', 'added gini tren graph'],
        milestone: false
    },
    {
        date: '24 MAY 2022',
        title: 'Changes',
        changes: ['add pacge to check raw influence'],
        milestone: false
    },
    {
        date: '20 MAY 2022',
        title: 'Changes',
        changes: ['changed banned icon', 'made the check async'],
        milestone: false
    },
    {
        date: '19 MAY 2022',
        title: 'Changes',
        changes: ['fix check if user is really banned'],
        milestone: false
    },
    {
        date: '18 MAY 2022',
        title: 'Changes',
        changes: ['add gini data', 'switch to live endpoints', 'fixes to gini & misc fixes', 'added expremiment python as frontend code'],
        milestone: false
    },
    {
        date: '9 MAY 2022',
        title: 'Changes',
        changes: ['add link to users'],
        milestone: false
    },
    {
        date: '7 MAY 2022',
        title: 'Changes',
        changes: ['fix triming'],
        milestone: false

    },
    {
        date: '5 MAY 2022',
        title: 'Changes',
        changes: ['fix color table nav on light theme', 'fix table name', 'other misc fixes'],
        milestone: false

    },
    {
        date: '4 MAY 2022',
        title: 'Changes',
        changes: ['add top sellers page'],
        milestone: false

    },
    {
        date: '2 MAY 2022',
        title: 'Changes',
        changes: ['add top earners page'],
        milestone: false

    },
    {
        date: '2 APR 2022',
        title: 'Changes',
        changes: ['feat pagination on hard reload'],
        milestone: false
    },
    {
        date: '1 APR 2022',
        title: 'Changes',
        changes: ['correct total supply and diluted mcap' ],
        milestone: false
    },
    {
        date: '30 MAR 2022',
        title: 'Changes',
        changes: ['Add custom error page', 'fixed emissions' ],
        milestone: false
    },
    {
        date: '21 MAR 2022',
        title: 'Changes',
        changes: ['initial setup', 'first build'],
        milestone: true
    }]

    const subsetChanges = ref(changes.slice(0,10))
    const hasMore = ref(true)

    const loadMore = () => {
      const len = subsetChanges.value.length
      subsetChanges.value.push(...changes.slice(len, len+10))
      if((len + 10) >= changes.length) {
        hasMore.value = false
      }
    }

    return {
      subsetChanges,
      hasMore,
      loadMore,
      AddIcon

    };
  },
});
</script>

<style lang="scss">
.page-log {
  min-height: calc(100vh - 2rem);
  text-align: justify;

}
</style>
