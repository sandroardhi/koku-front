import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth';

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const authStore = useAuthStore();
authStore.checkAuthenticationOnReload();

app.use(autoAnimatePlugin).mount('#app')
