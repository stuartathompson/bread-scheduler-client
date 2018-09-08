<template>
  <div class="login container-fluid p-5">
    <b-row>
      <b-col class="mx-auto" md="3">
        <h4 class="mt-4 text-center mb-4">
          <span v-if="message">{{ message }}</span>
          <span v-else>Welcome. Please log in.</span>
        </h4>
        <b-card>
          <b-form-group>
            <b-alert variant="danger" v-if="error" class="text-center" :show="error">Sorry, that didn't work. Try again.</b-alert>
            <b-input id="username" v-model="username" type="text" placeholder="Email" class="mb-3"></b-input>
            <b-input id="password" type="password" v-model="password" placeholder="Password" class="mb-3"></b-input>
            <b-button @click="login" type="submit" variant="primary">Log In</b-button>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import UsersService from '@/services/UsersService'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      error: '',
      success: '',
      message: ''
    }
  },
  mounted () {
    this.getMessage()
  },
  methods: {
    getMessage () {
      this.message = this.$route.params ? this.$route.params.message : ''
    },
    async getLogin () {
      const response = await UsersService.getLogin()
      this.error = response.data.error === 'invalid'
    },
    async login () {
      const response = await UsersService.login({username: this.username, password: this.password})
      console.log('response', response)
      this.error = !response.data.success
      this.success = response.data.success
      if (this.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          this.$root.$emit('authStatus', true)
          if (response.data.redirect) {
            // window.location.href = response.data.redirect
            this.$router.push(response.data.redirect)
          }
        }
      }
    }
  }
}
</script>
