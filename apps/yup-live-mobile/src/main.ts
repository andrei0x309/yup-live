import '@/assets/twind.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
// import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';


import { Buffer } from 'buffer'
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicRouter } from '@/router'
import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import App from './App.vue'


const app = createApp(App)
    // .use(router)
    .use(IonicRouter)
    .use(IonicVue)
    .use(createPinia())


IonicRouter.isReady().then(() => {
    app.mount('#app');
    setTimeout(() => {
        SplashScreen.hide();
    }, 200)
});


globalThis.Buffer = Buffer

if (window) {
    (<any>window).global = globalThis
        ; (<any>globalThis).globalThis = globalThis
}


