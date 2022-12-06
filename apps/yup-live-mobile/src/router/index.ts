import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import ConnectPage from '@/views/ConnectPage.vue'
import BottomNavigation from '@/components/template/bottom-navigation.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: ConnectPage
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
        path: 'account/:userId',
        component: () => import('@/views/AccountPage.vue')
      },
      {
        path: 'post/:postId',
        component: () => import('@/views/PostPage.vue')
      },
      {
        path: 'metrics',
        component: () => import('@/views/TokenMetrics.vue')
      },
      {
        path: 'live',
        component: () => import('@/views/ActivityPage.vue')
      },
      {
        path: 'search',
        component: () => import('@/views/SearchPage.vue')
      },
    ],
  },
  // {
  //   path: '/settings',
  //   component: () => import('../views/SettingsPage.vue')
  // },
  // {
  //   path: '/stake',
  //   component: () => import('../views/StakingPage.vue')
  // },
  // {
  //   path: '/latest-votes',
  //   component: () => import('../views/ProfilePage.vue')
  // },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// useBackButton(99, () => {
//   if (router.can === '/') {
//     CapApp.minimizeApp()
//   }
// })


export default router
