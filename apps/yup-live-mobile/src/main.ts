import { SplashScreen } from '@capacitor/splash-screen';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import { IonicVue } from '@ionic/vue';
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer

if (window) {
    (<any>window).global = globalThis
        ; (<any>globalThis).globalThis = globalThis
}

import 'virtual:windi.css'
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

import 'windi.css'

const app = createApp(App).use(IonicVue).use(router).use(createPinia());


router.isReady().then(() => {
    app.mount('#app');
    setTimeout(() => {
        SplashScreen.hide();
    }, 200)
});

