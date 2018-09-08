import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
import Records from '@/components/Records'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Flash from '@/components/Flash'
import Register from '@/components/Register'
import addrecord from '@/components/AddRecord'
import editrecord from '@/components/EditRecord'
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/flash',
      name: 'flash',
      component: Flash
    },
    {
      path: '/',
      name: 'Records',
      component: Records
    },
    {
      path: '/records/add',
      component: addrecord,
      name: 'addrecord'
    },
    {
      path: '/records/:id/edit',
      component: editrecord,
      name: 'editrecord'
    },
    {
      path: '/register',
      component: Register,
      name: 'register'
    },
    {
      path: '/logout',
      component: Logout,
      name: 'logout'
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
})
