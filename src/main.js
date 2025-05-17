import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createI18n} from 'vue-i18n'
import en from './locales/en.json'
import ar from './locales/ar.json'
import fa from './locales/fa.json'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from './App.vue'
import router from './router'
import {getCurrentLanguage} from "@/utils/index.js";

const messages = {en: en, ar: ar, fa: fa};
const locale = getCurrentLanguage();
const i18n = createI18n({
    // something vue-i18n options here ...
    locale: locale,
    fallbackLocale: 'en',
    messages,
    legacy: false
})


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, {
    maxToasts: 3,
})

app.mount('#app')
