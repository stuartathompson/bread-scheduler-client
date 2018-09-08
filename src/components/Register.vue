<template>
  <div class="login container-fluid p-6">
    <b-row>
      <b-col md="12">
        <h4>Register {{ username }}</h4>
        <b-card>
          <b-form-group>
            <b-input id="username" v-model="username" type="text" placeholder="Username"></b-input>
            <b-input id="password" type="password" v-model="password" placeholder="Password"></b-input>
            <b-button @click="register" type="submit" variant="primary">Register</b-button>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import UsersService from '@/services/UsersService'
export default {
  name: 'register',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
  },
  methods: {
    async register () {
      console.log('ok trying')
      const response = await UsersService.register({username: this.username, password: this.password})
      if (this.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        if (response.data.redirect) {
          // window.location.href = response.data.redirect
          // this.$router.push()
        }
      }
    }
  }
}
</script>
