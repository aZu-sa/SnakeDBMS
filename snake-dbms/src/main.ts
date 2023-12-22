import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'echarts'
import ECharts from 'vue-echarts'

createApp(App).use(store).use(router).use(ElementPlus, { locale }).component('v-chart', ECharts).mount('#app')
