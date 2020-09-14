import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/all.css'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(res => {
  res.headers.Authorization = window.sessionStorage.getItem('token')
  return res
})
Vue.prototype.$http = axios

import {
  Button,
  Input,
  FormItem,
  Form,
  Message,
  Container,
  Header,
  Main,
  Aside,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Row,
  Col,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from "element-ui";

Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Table)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)

Vue.prototype.$confirm = MessageBox.confirm

Vue.prototype.$msg = Message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
