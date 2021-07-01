import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axios';

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

// 原型上加上axios
Vue.prototype.$axios = axios;
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
