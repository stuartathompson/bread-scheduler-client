<template>
  <div class="login container-fluid p-5">
    <b-row>
      <b-col class="mx-auto" lg="4" md="5" sm="6" xs="12">
        <h5 class="mt-4 mb-4 text-center">Register</h5>
        <b-card>
          <b-form-group>
            <b-form @submit="register">
              <b-input class="mb-3" id="username" v-model="username" type="text" placeholder="Username"></b-input>
              <b-input class="mb-3" id="password" type="password" v-model="password" placeholder="Password"></b-input>
              <b-dropdown size="sm" text="Select a user role" class="mb-3" style="width:100%">
                <b-dropdown-item-button>User</b-dropdown-item-button>
                <b-dropdown-item-button>Admin</b-dropdown-item-button>
              </b-dropdown>
              <b-button type="submit" variant="primary">Register</b-button>
            </b-form>
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
