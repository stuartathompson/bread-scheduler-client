<template>
  <div id="app" class="">
    <nav class="navbar navbar-expand navbar-dark bg-primary">
      <a href="/" class="navbar-brand">CityScheduler</a>
    </nav>
    <div class="d-flex">
    <div v-if="auth" :show="auth" class="sidebar nav">
      <ul>
        <li class="nav-item"><router-link v-bind:to="{ name: 'Records' }" class="nav-link" role="">Your cases</router-link></li>
        <li class="nav-item"><router-link v-bind:to="{ name: 'addrecord' }" class="nav-link" role="">New case</router-link></li>
        <li class="nav-item"><b-link @click="logout" class="nav-link" role="">Log out</b-link></li>
        <!--<li class="nav-item"><router-link v-bind:to="{ name: 'addrecord' }" class="nav-link" role="">Calendar</router-link></li>-->
        <!--<li class="nav-item"><router-link v-bind:to="{ name: 'logout' }" class="nav-link" role="">Logout</router-link></li>-->
        <!--<li class="nav-item"><a role="" class="nav-link" href="Home">Reports</a></li>
        <li class="nav-item"><a role="" class="nav-link" href="Home">Upcoming dates</a></li>-->
      </ul>
    </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import UsersService from '@/services/UsersService'

export default {
  name: 'app',
  data () {
    return {
      auth: false,
      message: this.$route.params
    }
  },
  created () {
    this.authenticate()
  },
  updated () {
    console.log('before update')
  },
  mounted () {
    console.log('app mounted')
    let that = this
    this.$root.$on('authStatus', (status) => {
      if (status) that.auth = true
    })
  },
  methods: {
    async authenticate () {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({ name: 'login', params: { message: 'You must log in.' } })
      } else {
        this.auth = true
        const response = await UsersService.auth({ token: token })
        if (response.data.success) {
          this.auth = true
        } else {
          this.$router.push({ name: 'login', params: { message: 'You must log in.' } })
        }
      }
    },
    logout () {
      localStorage.removeItem('token')
      this.auth = false
      this.$router.push({ name: 'login', params: {message: 'You’ve been logged out.'} })
    }
  }
}
</script>
