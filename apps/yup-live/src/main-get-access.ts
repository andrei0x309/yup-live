import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { ViteSSG } from 'vite-ssg'
import App from '@/app-get-access.vue'
import { routes, router } from '@/router/router-access'

const pinia = createPinia()

import '@/assets/twind.css'
import '@/assets/oruga-patched.scss'
import '@/assets/app.scss'

import { createHead } from '@unhead/vue'
import {
    Dropdown,
    Button,
    Sidebar,
    Tabs,
    Table,
    Modal,
    Skeleton,
    Switch,
    Radio,
    Checkbox,
} from '@oruga-ui/oruga-next'
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer



// export const createApp = ViteSSG(
//     // the root component
//     App,
//     // vue-router options
//     {
//         routes
//     },
//     // function to have custom setups
//     // ({ app, router, routes, isClient, initialState }) => {
//     async ({ app, initialState }) => {
//         app.use(pinia)
//         // app.use(createHead())
//         // app.use(router)
//         app.use(Dropdown)
//         app.use(Button)
//         app.use(Sidebar)
//         app.use(Tabs)
//         app.use(Modal)
//         app.use(Skeleton)
//         app.use(Switch)
//         app.use(Radio)
//         app.use(Table)
//         app.use(Checkbox)


//         if (import.meta.env.SSR) {
//             // this will be stringified and set to window.__INITIAL_STATE__
//             initialState.pinia = pinia.state.value
//         } else {
//             // on the client side, we restore the state
//             pinia.state.value = initialState?.pinia || {}
//         }
//         // router.beforeEach((to, from, next) => {
//         //     const store = useMainStore(pinia)

//         //     store.initialize()
//         //     next()
//         //   })
//     }
// )

createApp(App)
    .use(router)
    .use(Dropdown)
    .use(Button)
    .use(Sidebar)
    .use(Tabs)
    .use(Modal)
    .use(Skeleton)
    .use(Switch)
    .use(Radio)
    .use(Table)
    .use(Checkbox)
    .use(createHead())
    // .use(Tooltip)
    .use(pinia)
    .provide('routes', routes)
    .mount('#login')
