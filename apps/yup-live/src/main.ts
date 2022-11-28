// import { createApp } from 'vue'
import { ViteSSG } from 'vite-ssg'
import App from '@/app.vue'
import { routes } from '@/router'
import 'virtual:windi.css'
// import { createHead } from "@vueuse/head";
import { Dropdown, Button, Sidebar, Tabs, Table, Modal, Skeleton, Switch, Radio, Tooltip } from '@oruga-ui/oruga-next'
import '@/assets/oruga-patched.css'
import { createPinia } from 'pinia'
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer
export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes },
  // function to have custom setups
  // ({ app, router, routes, isClient, initialState }) => {
  ({ app, initialState }) => {
    const pinia = createPinia()
    app.use(pinia)
    // app.use(createHead())
    // app.use(router)
    app.use(Dropdown)
    app.use(Button)
    app.use(Sidebar)
    app.use(Tabs)
    app.use(Modal)
    app.use(Skeleton)
    app.use(Switch)
    app.use(Radio)
    app.use(Table)
    app.use(Tooltip)

    if (import.meta.env.SSR) {
      // this will be stringified and set to window.__INITIAL_STATE__
      initialState.pinia = pinia.state.value
    } else {
      // on the client side, we restore the state
      pinia.state.value = initialState?.pinia || {}
    }

    // router.beforeEach((to, from, next) => {
    //     const store = useMainStore(pinia)

    //     store.initialize()
    //     next()
    //   })
  }
)

// createApp(App)
//     .use(router)
//     .use(Dropdown)
//     .use(Button)
//     .use(Sidebar)
//     .use(Tabs)
//     .use(Modal)
//     .use(Skeleton)
//     .use(Switch)
//     .use(Radio)
//     .use(Table)
//     .use(Tooltip)
//     .use(createPinia())
//     .provide('routes', routes)
//     .use(createHead())
//     .mount('#app')
