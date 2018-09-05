import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
import Records from '@/components/Records'
import addrecord from '@/components/AddRecord'
import editrecord from '@/components/EditRecord'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: Home
    // },
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
    }
  ]
})
