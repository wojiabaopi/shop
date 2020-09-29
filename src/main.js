import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/all.css'
import 'element-ui/lib/theme-chalk/index.css'


import VueQuillEditor from "vue-quill-editor/src";
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(res => {
  res.headers.Authorization = window.sessionStorage.getItem('token')
  return res
})
Vue.prototype.$http = axios

Vue.use(VueQuillEditor)

import {
  Timeline,
  TimelineItem,
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
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Step,
  Steps,
  Checkbox,
  CheckboxGroup,
  Upload
} from "element-ui";
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)


Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Upload)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Select)
Vue.use(Cascader)
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

Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`

})

Vue.prototype.$msg = Message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
