<template>
  <div class="recipes">
    <div class="cover mb-5" style="background-image:url('static/bread.jpg')">
      <b-card @click="openRecipe(recipe)" class="text-center cover-card bg-light">
        <div>
          <star-icon v-for="i in [1, 2, 3, 4, 5]"></star-icon>
          <h2><b-link>County Bread</b-link></h2>
          <p class="card-text">
            A full-flavored, open crumb, Tartine-inspired sourdough. Start now and eat this bread by <strong class="text-primary"><timer-icon></timer-icon> 2 p.m.</strong> tomorrow
          </p>
          <b-link class="text-bold text-caps text-dark">Start now »</b-link>
        </div>
      </b-card>
    </div>
    <b-container>
      <b-row>
        <b-col class="mt-3 mb-5 text-center">
          <h3>Slow bread. Made easy.</h3>
          <p class="w-50 m-auto">
            Our bread recipes use an easy scheduling system to help plan your baking. Create amazing sourdough bread - exactly when you want.
          </p>
        </b-col>
      </b-row>
      <b-card-group deck>
        <b-card
          @click="openRecipe(recipe)"
          :title="recipe.title"
          img-src="static/bread1.jpg"
          v-if="recipes"
          v-for="recipe of recipes">
            <p class="mb-2 md-3 card-text">
              {{ recipe.description }}
            </p>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
// import moment from 'moment'
export default {
  name: 'Recipes',
  data () {
    return {
      data: []
    }
  },
  components: {
  },
  created () {
    this.$store.dispatch('getRecipes')
  },
  beforeMount () {
  },
  mounted () {
  },
  filters: {
  },
  computed: {
    recipes: function () {
      return this.$store.state.recipes
    }
  },
  methods: {
    openRecipe: function (recipe) {
      this.$router.push('recipe/' + recipe._id)
    }
  }
}
</script>
