import { createRouter as crateIonicRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import ConnectPage from '@/views/ConnectPage.vue'
import BottomNavigation from '@/components/template/bottom-navigation.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: ConnectPage
  },
  {
    path: '/post/',
    redirect () {
      return `/tabs/post/`
    },
  },
  {
    path: '/post/:postId',
    redirect (to) {
      return `/tabs/post/${to.params.postId}`
    },
  },
  {
    path: '/profile/:userId',
    redirect (to) {
      return `/tabs/profile/${to.params.userId}`
    },
  },
  {
    path: '/web3-profile/:addr',
    redirect (to) {
      return `/tabs/web3-profile/${to.params.addr}`
    },
  },
  {
    path: '/score',
    redirect () {
      return `/tabs/score`
    },
  },
  {
    path: '/score/:addr',
    redirect (to) {
      return `/tabs/score/${to.params.addr}`
    },
  },
  {
    path: '/change-log',
    redirect () {
      return `/tabs/info/true`
    },
  },
  {
    path: '/tabs/',
    component: BottomNavigation,
    children: [
      {
        path: '',
        redirect: 'feeds',
      },
      {
        path: 'web3-profile/:addr',
        name: 'Web3ProfileWithAddr',
        component: () => import('@/views/Web3ProfilePage.vue')
      },
      {
        path: 'feeds',
        component: () => import('@/views/FeedsPage.vue')
      },
      {
        path: 'notifications',
        component: () => import('@/views/NotificationsPage.vue')
      },
      {
        path: 'account',
        component: () => import('@/views/AccountPage.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/AccountPage.vue')
      },
      {
        path: 'profile/:userId',
        component: () => import('@/views/AccountPage.vue')
      },
      {
        path: 'account/:userId',
        component: () => import('@/views/AccountPage.vue')
      },
      {
        path: 'web3-profile/:addr',
        component: () => import('@/views/Web3ProfilePage.vue')
      },
      {
        path: 'post/:postId',
        component: () => import('@/views/PostPage.vue')
      },
      {
        path: 'metrics',
        component: () => import('@/views/TokenMetrics.vue')
      },
      // {
      //   path: 'live',
      //   component: () => import('@/views/ActivityPage.vue')
      // },
      {
        path: 'channels',
        component: () => import('@/views/FarcasterChannels.vue')
      },
      {
        path: 'search',
        component: () => import('@/views/SearchPage.vue')
      },
      {
        path: 'info',
        component: () => import('@/views/InfoPage.vue')
      },
      {
        path: 'info/:openChanges',
        component: () => import('@/views/InfoPage.vue')
      },
      {
        path: 'score',
        component: () => import('@/views/ScorePage.vue')
      },
      {
        path: 'score/:addr',
        component: () => import('@/views/ScorePage.vue')
      },
      {
        path: 'stake',
        component: () => import('@/views/StakingPage.vue')
      }
    ],
  },

]

export const IonicRouter = crateIonicRouter({
  history: createWebHistory('/'),
  routes
})


