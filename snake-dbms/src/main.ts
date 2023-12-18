import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

createApp(App).use(store).use(router).use(ElementPlus, { locale }).mount('#app')
