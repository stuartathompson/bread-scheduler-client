// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import FilePlusIcon from 'vue-material-design-icons/FilePlus.vue'
import FileIcon from 'vue-material-design-icons/File.vue'
import TableIcon from 'vue-material-design-icons/TableOfContents.vue'
import LogoutIcon from 'vue-material-design-icons/Logout.vue'
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import StarIcon from 'vue-material-design-icons/Star.vue'
import HomeIcon from 'vue-material-design-icons/Home.vue'
import TimerIcon from 'vue-material-design-icons/Timer.vue'
import MinimizeIcon from 'vue-material-design-icons/WindowMinimize.vue'
import LoadingIcon from 'vue-material-design-icons/Loading.vue'
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeftBold.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'
import Calendar from 'vue-material-design-icons/Calendar.vue'

import RecipeService from './services/RecipeService'
import UsersService from './services/UsersService'

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.component('file-plus-icon', FilePlusIcon)
Vue.component('file-icon', FileIcon)
Vue.component('table-icon', TableIcon)
Vue.component('logout-icon', LogoutIcon)
Vue.component('timer-icon', TimerIcon)
Vue.component('edit-icon', EditIcon)
Vue.component('plus-icon', PlusIcon)
Vue.component('star-icon', StarIcon)
Vue.component('home-icon', HomeIcon)
Vue.component('minimize-icon', MinimizeIcon)
Vue.component('arrow-left-icon', ArrowLeftIcon)
Vue.component('loading-icon', LoadingIcon)
Vue.component('close-icon', CloseIcon)
Vue.component('calendar-icon', Calendar)

import 'vue-material-design-icons/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

require('../static/style.css')

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    count: 0,
    recipes: null,
    allRecords: null,
    recipe: {
    },
    authStatus: false,
    editing: true,
    editing_id: '',
    loadingMore: false,
    noRecords: false
  },
  mutations: {
    increment (state) {
      state.count++
    },
    authStatus (state, authStatus) {
      console.log('setting authstatus', authStatus)
      state.authStatus = authStatus
    },
    loadingMore (state, loadingMore) {
      state.loadingMore = loadingMore
    },
    recipe (state, recipe) {
      state.recipe = recipe
      // if (record === null) {
      //   state.record = {
      //     _id: '',
      //     record_id: '',
      //     description: '',
      //     notes: '',
      //     date: '',
      //     children: [],
      //     attachments: []
      //   }
      // } else {
      //   state.record._id = record._id
      //   state.record.record_id = record.record_id
      //   state.record.description = record.description
      //   state.record.notes = record.notes
      //   state.record.date = record.date
      //   state.record.attachments = record.attachments
      //   state.record.children = record.children === null ? [] : record.children
      // }
    },
    parentAttachments (state, params) {
      if (!params) return
      if (!params.attachments) return
      for (var attachment of params.attachments) {
        state.record.attachments.push(attachment)
      }
    },
    childAttachments (state, params) {
      if (!params) return
      if (!params.attachments) return
      if (!params.record_id) return
      // Go through each child and find right one
      for (var child of state.record.children) {
        if (child.record_id === params.record_id) {
          // Push each attachment into it
          for (var childAttachment of params.attachments) {
            if (!child.attachments) child.attachments = []
            child.attachments.push(childAttachment)
          }
        }
      }
    },
    recipes (state, params) {
      if (params.append) {
        for (var newRecipe of params.recipes) {
          state.recipes.push(newRecipe)
        }
      } else {
        console.log('ok', params)
        state.recipes = params.recipes
        console.log('state', state.recipes)
      }
    },
    allRecords (state, allRecipes) {
      state.recipes = allRecipes
    },
    editing (state, val) {
      state.editing = val
    },
    editing_id (state, val) {
      state.editing_id = val
    },
    noRecords (state, noRecords) {
      state.noRecords = noRecords
    }
  },
  actions: {
    logout (state) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      state.commit('authStatus', false)
      router.push({ name: 'login', params: {message: 'You’ve been logged out.'} })
    },
    async auth (state) {
      if (!localStorage.getItem('token')) {
        // No token, so must log in
        state.dispatch('logout')
      } else {
        const response = await UsersService.auth({ token: localStorage.getItem('token') })
        if (response.data.success) {
          state.commit('authStatus', true)
        } else {
          // Invalid token, so must log in
          state.dispatch('logout')
        }
      }
      // const token = localStorage.getItem('token')
      // this.auth = true
      // const response = await UsersService.auth({ token: token })
      // if (response.data.success) {
      //   this.auth = true
      // } else {
      //   this.auth = false
      //   this.$router.push({ name: 'login', params: { message: 'You must log in.' } })
      // }
    },
    async updateRecord (state, params) {
      var response = await RecipeService.updateRecord({
        _id: params.id,
        record_id: params.record_id,
        description: params.description,
        notes: params.notes,
        date: params.date,
        children: params.children,
        attachments: params.attachments_results
      })
      state.commit('record', response.data)
    },
    async searchRecords (state, params) {
      if (params.filter === '') {
        // state.commit('records', state.allRecords)
        state.dispatch('getRecords')
        return
      }
      const response = await RecipeService.searchRecord({record_id: params.filter, username: localStorage.getItem('username')})
      state.commit('records', { records: response.data.records })
      state.commit('noRecords', response.data.records.legnth === 0)
    },
    async getRecipe (state, params) {
      // state.commit('editing_id', '')
      // state.commit('editing', false)
      const response = await RecipeService.getRecipe({
        id: params._id
      })
      state.commit('recipe', response.data)
    },
    async getRecipes (state, params) {
      // console.log('getting', params)
      if (!params) params = {}
      const response = await RecipeService.recipes(params)
      console.log('vuex records', response)
      state.commit('loadingMore', false)
      state.commit('recipes', { recipes: response.data.recipes, append: params.append })
      // state.count = 10
      // console.log(state.records)
      // if (response.data.success) {
      //   if (append) {
      //     this.records = this.records.concat(response.data.records)
      //   } else {
      //     this.records = response.data.records
      //     // If no records and not part of an appaned, then there are no records so show warning
      //     if (this.records.length === 0) {
      //       this.noRecords = true
      //     }
      //   }
      //   this.allRecords = this.records
      //   // this.totalRows = this.records.length
      // } else if (response.data.redirect) {
      //   // window.location = response.data.redirect
      //   this.$router.push(response.data.redirect)
      // } else {
      //   // Default redirect : Only logged in users should be here
      //   // window.location = '/login'
      //   // this.$router.push('login')
      //   // ERR
      // }
    },
    async addRecipe (state, recipe) {
      const response = await RecipeService.addRecipe(recipe)
      console.log(response)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
