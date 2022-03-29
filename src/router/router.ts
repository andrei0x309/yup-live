import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home.vue'

const routes = [
  {
    name: "ErrorPage",
    path: "/:pathMatch(.*)*",
    alias: "/error/code/:code",
    component: () => import('@/pages/custom-error.vue')
  },
  // {
  //   path: "/error",
  //   name: "CustmError",
  //   component: () =>
  //     import( "@/pages/custom-eror.vue"),
  // },
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
    path: '/emissions',
    name: 'EmissionsPage',
    component: () => import('@/pages/emissions.vue')
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
    type: "yup",
    text: "YUP DOCS",
    path: "/docs",
    href: "https://docs.yup.io",
    redirect: 'https://docs.yup.io'
  },
  {
    type: "yup",
    text: "YUP Staking",
    path: "/finance",
    href: "https://yup.finance/",
    redirect: 'https://app.yup.io/staking'
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export { routes, router }
