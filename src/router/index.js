import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../views/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Roles from "../components/user/Roles";
import Rights from "../components/user/Rights";
import Goods from "../components/goods/Goods";
import Params from "../components/goods/Params";
import Categories from "../components/goods/Categories";
import AddPage from "../components/goods/AddPage";
import Orders from "../components/goods/Orders";
import Reports from "../components/Reports/Reports";

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods/addPage',
        component: AddPage
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }

    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
