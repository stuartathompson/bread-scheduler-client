<template>
  <div id="app" class="">
    <b-nav class="p-3 text-dark text-large">
      <router-link to="/" class="text-primary logo"><timer-icon></timer-icon>Bread Sked</router-link>
      <b-col class="float-right">
        <router-link to="/" class="text-dark"><plus-icon></plus-icon>Add your recipe</router-link>
        <router-link to="/" class="text-dark">About</router-link>
        <router-link to="/" class="text-dark">Contact</router-link>

      </b-col>
    </b-nav>
    <router-view></router-view>
    <div class="container">
      <b-row class="p-4 m-4"></b-row>
    </div>
  </div>
</template>

<script>
// import UsersService from '@/services/UsersService'
import NewsFeed from '@/components/NewsFeed'
import EditRecipe from '@/components/EditRecipe'
import AddRecipe from '@/components/AddRecipe'

export default {
  name: 'app',
  data () {
    return {
      message: this.$route.params,
      currRoute: this.$route.name
    }
  },
  components: {
    EditRecipe,
    AddRecipe,
    NewsFeed
  },
  created () {
    // this.authenticate()
  },
  watch: {
    '$route' (to, from) {
      // Force a change to records on back button when hash is cleared...
      if (to.path === '/') {
        this.$store.commit('editing', false)
        this.$router.push({ name: 'Recipes' })
        this.$store.commit('editing_id', '')
        this.$store.commit('record', null)
      } else if (to.name === 'EditRecipe') {
        var record = {_id: to.params.id}
        if (record._id !== '') {
          // window.location.hash = `${record._id}/edit`
          this.$router.push({ path: to.path })
          this.$store.dispatch('getRecord', record)
        }
      }
    }
  },
  updated () {
  },
  computed: {
    authStatus: function () {
      return this.$store.state.authStatus
    },
    count: function () {
      return this.$store.state.count
    }
  },
  mounted () {
    // let that = this
    // this.$root.$on('authStatus', (status) => {
    //   if (status) that.auth = true
    // })
    this.$store.dispatch('auth')
  },
  methods: {
    openRecipe: function (recipe) {
      this.$router.push('recipe/' + recipe._id + '/edit')
    },
    // async authenticate () {
    //   const token = localStorage.getItem('token')
    //   this.auth = true
    //   const response = await UsersService.auth({ token: token })
    //   if (response.data.success) {
    //     this.auth = true
    //   } else {
    //     this.auth = false
    //     this.$router.push({ name: 'login', params: { message: 'You must log in.' } })
    //   }
    // },
    clearRecord () {
      this.$store.commit('editing_id', '')
      // this.$store.commit('editing', false)
      this.$store.commit('record', null)
      this.$router.push({ name: 'Records' })
    },
    logout () {
      this.$store.dispatch('logout')
      // localStorage.removeItem('token')
      // localStorage.removeItem('username')
      // this.auth = false
      // this.$router.push({ name: 'login', params: {message: 'You’ve been logged out.'} })
    }
  }
}
</script>
