import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import router from './router/index.js'
import App from './App.vue'
import './assets/main.css'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import pt from './locales/pt.json'

const savedLocale = localStorage.getItem('ridgeline_locale') ?? 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, es, fr, pt },
})

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
