import { config } from 'shared/src/utils/config'
const API_BASE = import.meta.env.VITE_YUP_API_BASE
const POLY_RPC = import.meta.env.VITE_POLYGON_RPC
config.setConfig({ API_BASE, POLY_RPC })

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    alias: ['/', '/index.html']
  },
  {
    path: '/page/:pageNo',
    name: 'PaginatedHomePage',
    component: HomePage
  },
  {
    path: '/vote-list',
    name: 'VoteList',
    component: HomePage
  },
  {
    path: '/vote-list/:pageNo',
    name: 'PaginatedVoteList',
    component: HomePage
  },
  {
    path: '/rewards',
    name: 'Rewards',
    component: HomePage
  },
  {
    path: '/rewards/type/:type/page/:pageNo',
    name: 'RewardsWithTypeAndPage',
    component: HomePage
  },
  {
    path: '/sellers',
    name: 'Sellers',
    component: HomePage
  },
  {
    path: '/sellers/page/:pageNo',
    name: 'SellersPaginated',
    component: HomePage
  },
  {
    path: '/gini',
    name: 'GiniWeeks',
    component: HomePage
  },
  {
    path: '/gini-trend',
    name: 'Gini Trend',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: HomePage
  },
  {
    path: '/sign-up',
    name: 'Sign Up',
    component: HomePage
  },
  {
    path: '/team-panel',
    name: 'Team Panel',
    component: () => import('@/pages/team-panel.vue')
  },
  {
    path: '/emissions',
    name: 'EmissionsPage',
    component: () => import('@/pages/emissions.vue')
  },
  {
    path: '/raw-influence',
    name: 'RawInfluence',
    component: () => import('@/pages/raw-influnece.vue')
  },
  {
    path: '/raw-influence/:user',
    name: 'RawInfluenceWithUser',
    component: () => import('@/pages/raw-influnece.vue')
  },
  {
    path: '/change-log',
    name: 'ChangeLog',
    component: () => import('@/pages/changeLog.vue')
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: () => import('@/pages/search.vue')
  },
  // {
  //   path: '/web3-social',
  //   name: 'Web3Social',
  //   component: () => import('@/pages/web3Social.vue')
  // },
  // {
  //   path: '/web3-social/:addr',
  //   name: 'Web3SocialWithAddr',
  //   component: () => import('@/pages/web3Social.vue')
  // },
  {
    path: '/post/:postId',
    name: 'PostDetail',
    component: () => import('@/pages/postDetail.vue')
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: () => import('@/pages/profile.vue')
  },
  {
    path: '/profile/:userId/:accountRoute',
    name: 'ProfileWithRoute',
    component: () => import('@/pages/profile.vue')
  },
  {
    path: '/web3-profile/:addr',
    name: 'Web3ProfileWithAddr',
    component: () => import('@/pages/web3Profile.vue')
  },
  {
    path: '/web3-profile/:addr/:accountRoute',
    name: 'Web3ProfileWithAddrAndRoute',
    component: () => import('@/pages/web3Profile.vue')
  },
  {
    path: '/notifications/:address',
    name: 'NotificationsWithAddress',
    component: () => import('@/pages/notifications.vue')
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/pages/notifications.vue')
  },
  {
    path: '/collection/:collectionId',
    name: 'CollectionDetail',
    component: () => import('@/pages/collection.vue')
  },
  {
    path: '/staking',
    name: 'Staking',
    component: () => import('@/pages/stake.vue')
  },
  {
    path: '/claim',
    name: 'RewardClaim',
    component: () => import('@/pages/reward-claim.vue')
  },
  {
    path: '/feeds',
    name: 'Feeds',
    component: () => import('@/pages/feeds.vue')
  },
  {
    path: '/feeds/:feedId',
    name: 'FeedsWithId',
    component: () => import('@/pages/feeds.vue')
  },
  {
    path: '/channel/:channelId',
    name: 'FcChannel',
    component: () => import('@/pages/fc-channel.vue')
  },
  {
    path: '/test',
    name: 'TestPage',
    component: () => import('@/pages/test.vue')
  },
  {
    path: '/meetings',
    name: 'MeetingsPage',
    component: () =>
      import(
        "@/pages/meetings.vue"
      ),
  },
  {
    path: "/meetings/:id",
    name: "SingleMeetingRecording",
    component: () =>
      import(
        "@/pages/meetings.vue"
      ),
  },
  {
    type: 'yup',
    text: 'YUP APP',
    path: '/app',
    href: 'https://app.yup.io',
    redirect: 'https://app.yup.io'
  },
  {
    type: 'yup',
    text: 'YUP DOCS',
    path: '/docs',
    href: 'https://docs.yup.io',
    redirect: 'https://docs.yup.io'
  },
  {
    type: 'yup',
    text: 'YUP Staking',
    path: '/finance',
    href: 'https://yup.finance/',
    redirect: 'https://app.yup.io/staking'
  },
  {
    path: '/error/code/:code',
    name: 'ErrorPage',
    component: () => import('@/pages/custom-error.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    component: () => import('@/pages/custom-error.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior () {
    return { top: 0, left: 0 }
  }
})

const allowedFids = [1791]

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/raw-influence') || to.path.startsWith('/rewards')) {
    try {
      const connected = JSON.parse(localStorage.getItem('connected') || '{}')
      if (!connected.farcaster) {
        next({ path: '/error/code/403' })
      }
    } catch {
      next({ path: '/error/code/403' })
    }
    if (Number(localStorage.getItem('fid')) && !allowedFids.includes(Number(localStorage.getItem('fid')))) {
      next({ path: '/error/code/403' })
    }
  }
  next()
})

export { routes, router }
