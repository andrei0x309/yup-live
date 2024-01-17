import { config } from 'shared/src/utils/config'
const API_BASE = import.meta.env.VITE_YUP_API_BASE
const POLY_RPC = import.meta.env.VITE_POLYGON_RPC
config.setConfig({ API_BASE, POLY_RPC })

import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login/login.vue'

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: LoginPage
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/login.html',
        name: 'GetAccess',
        component: LoginPage,
    },
    {
        path: '/login.html/:errorCode',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/get-access',
        name: 'GetAccess',
        component: () => import('@/pages/login/get-access.vue')
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
        path: '/change-log',
        name: 'ChangeLog',
        component: () => import('@/pages/changeLog.vue')
    },
    {
        name: 'ErrorPage',
        path: '/:pathMatch(.*)*',
        component: LoginPage
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export { routes, router }
