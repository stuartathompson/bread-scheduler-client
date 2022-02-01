<template>
  <div class="app-details container pt-5 pb-5">
    <b-row>
      <b-col md="9" class="m-auto">
        <b-row>
          <b-col sm-order="2" class="d-none d-sm-block d-md-block text-right pull-right">
            <video src="static/app-video.mp4" class="w-100" autoplay muted playsinline loop></video>
          </b-col>
          <b-col md="7" sm="7" sm-order="1">
            <h1 class="text-primary mt-4">Bread Scheduler, now on your iPhone</h1>
            <video id="app-video" src="static/app-video.mp4" class="w-50" style="float:right" autoplay muted playsinline loop></video>
            <p class="text-very-large text-hint">
              We’re excited to announce our new free iPhone app! It includes all the great features you love – with some new surprises.
            </p>
            <p class="text-very-large text-hint">
              Download the app and try it now!
            </p>
            <p>
              <a href="https://apps.apple.com/us/app/id1523116271"><img width="150px" src="static/app-store-badge.png" /></a>
            </p>
            <!-- <p class="text-very-large text-hint">
              Send us your email for updates, feedback and more information.
            </p>
            <div class="text-large text-hint">
              <div v-if="!success">
                <div id="email-box" class="text-large text-hint"  :class="{opacity50: loading}">
                  <strong class="">Be the first to know</strong>
                  <form @submit="sendEmail" class="pb-1" ref="form">
                    <b-input v-model="userEmail" style="display:inline-block;width:60%" placeholder="Your email"></b-input>
                    <b-button type="submit" style="display:inline-block;margin-top:-2px">Send</b-button>
                  </form>
                  <div v-if="emailError" class="text-primary text-medium text-bold">Please enter a valid email</div>
                  <div v-if="otherError" class="text-primary text-medium text-bold">Sorry, there was a problem sending your email. Try again.</div>
                  <p class="mt-2 text-small text-lighter">
                    Your email will only be used to notify you when the app is released on the App Store. It will never be shared with anyone else or used for any other purpose.
                  </p>
                </div>
              </div>
              <div v-else>
                <p class="text-large text-hint">
                    <div class="text-bold"><check-icon></check-icon> Got it! We’ll be in touch!</div>
                </p>
              </div>
            </div> -->
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- <b-row>
      <b-col>
        <div class="cover" style="background-image:url('static/bread1.jpg')"></div>
      </b-col>
    </b-row> -->
    <!-- <b-row class="mt-5">
      <b-col sm="4" class="">
        <h2><timer-icon class="text-very-large"></timer-icon>Bread Scheduler</h2>
        <p class="text-large">
          The scheduling tool makes planning your bakes a little easier. See each step in one simple view. Tweak the start and end times so you can plan your day. Your edits are saved automatically for next time.
        </p>
        <p class="">
          <span class="text-strong text-primary">Try it on this page right now!</span><br />
          Drag the calendar or the steps to make the recipe timing fit your schedule.
        </p>
      </b-col>
      <b-col>
        <Viz class="pb-3" :initialRecipe="getRecipe()"></Viz>
      </b-col>
    </b-row>
    <hr />
    <b-row class="mt-5 text-center">
      <b-col sm="4" class="">
        <img class="w-100 mb-2" src="static/timer.png" />
        <h3>Built-in Timers</h3>
        <p class="text-large">
          Each step in our collection of recipes includes built-in timers for each step so you can easily keep track of your progress without using any other tools.
        </p>
      </b-col>
      <b-col sm="4" class="">
        <h3>Add Your Own Recipes</h3>
        <p class="text-large">
          Paste your own recipes into our guide and upload them to the cloud. We’ll process them into <timer-icon></timer-icon> Bread Scheduler.
        </p>
      </b-col>
      <b-col sm="4" class="">
        <h3>Quick Plan Your Day</h3>
        <p class="text-large">
          Add steps for your existing recipes to help plan your bake without uploading the entire recipe.
        </p>
      </b-col>
    </b-row> -->
  </div>
</template>

<script>
import RecipeService from '@/services/RecipeService'

export default {
  name: 'addRecipe',
  data () {
    return {
      userEmail: '',
      emailError: false,
      otherError: false,
      success: false,
      loading: false
    }
  },
  filters: {
  },
  computed: {
  },
  components: {
  },
  methods: {
    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    async sendEmail (e) {
      e.preventDefault()
      if (this.userEmail != null && this.validEmail(this.userEmail)) {
        this.loading = true
        this.emailError = false
        this.otherError = false
        var data = { email: this.userEmail }
        var response = await RecipeService.addEmail(data)
        this.loading = false
        if (response.data.success) {
          this.success = true
        } else {
          this.otherError = true
        }
      } else {
        this.emailError = true
      }
    }
  }
}
</script>
