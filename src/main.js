import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/all.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.prototype.$http = axios

import {Button,Input,FormItem,Form,Message} from "element-ui";


Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$msg = Message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
