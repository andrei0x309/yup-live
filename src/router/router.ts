import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/page/:pageNo',
    name: 'PaginatedHomePage',
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
    path: '/emissions',
    name: 'EmissionsPage',
    component: () => import('@/pages/emissions.vue')
  },
  {
    path: '/raw-influence',
    name: 'RawInfluence',
    component: () => import('@/pages/raw-influnece.vue')
  },
  // {
  //   path: '/web3',
  //   name: 'Web3Auth',
  //   component: () => import('@/pages/web3Auth.vue')
  // },
  // {
  //   path: '/lens',
  //   name: 'Lens',
  //   component: () => import('@/pages/lens.vue')
  // },
  {
    path: '/web3-social',
    name: 'Web3Social',
    component: () => import('@/pages/web3Social.vue')
  },
  {
    path: '/web3-social/:addr',
    name: 'Web3SocialWithAddr',
    component: () => import('@/pages/web3Social.vue')
  },
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
    path: '/notifications/:userId',
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
    path: '/feeds/:feedId',
    name: 'FeedsWithId',
    component: () => import('@/pages/feeds.vue')
  },
  {
    path: '/feeds',
    name: 'Feeds',
    component: () => import('@/pages/feeds.vue')
  },
  // {
  //   path: "/meeting-recording/:id",
  //   name: "SingleMeetingRecording",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "singleMeetingRecording" */ "../views/SingleMeetingRecording.vue"
  //     ),
  // },
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
    name: 'ErrorPage',
    path: '/error/code/:code',
    component: () => import('@/pages/custom-error.vue')
  },
  {
    name: 'ErrorPage',
    path: '/:pathMatch(.*)',
    component: () => import('@/pages/custom-error.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export { routes, router }
