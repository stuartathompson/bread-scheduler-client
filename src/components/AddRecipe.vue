category<template>
  <div class="add-recipe container">
  <b-row>
    <div class="col-5">
      <form @submit="addRecipe" ref="form">
          <b-container class="mb-2">
            <b-row>
              <b-col>
                <h6>Title</h6>
                <b-input v-model="recipe.title" placeholder="Country bread"></b-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h6>Description</h6>
                <b-textarea rows="6" v-model="recipe.description"></b-textarea>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <hr />
                <h6>Recipe Ingredients</h6>
              </b-col>
            </b-row>
            <b-row class="mb-2" v-for="ingredient of recipe.ingredients">
              <b-col md="3" class="pr-0">
                <b-input placeholder="100g" v-model="ingredient.amount"></b-input>
              </b-col>
              <b-col>
                <b-input placeholder="White flour" v-model="ingredient.ingredient"></b-input>
              </b-col>
              <b-col md="1" class="text">
                <close-icon></close-icon>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mt-2">
                <b-link @click="addIngredient"><plus-icon></plus-icon>Ingredient</b-link>
              </b-col>
            </b-row>
          </b-container>
          <b-container class="mb-2">
            <b-row>
              <b-col>
                <hr />
                <h6>Steps</h6>
              </b-col>
            </b-row>
            <div class="mb-2" v-for="step of recipe.steps">
              <b-row class="mb-2">
                <b-col md="3" class="pr-0">
                  <b-input placeholder="Bulk" v-model="step.category"></b-input>
                </b-col>
                <b-col>
                  <b-textarea rows="4" placeholder="Bulk for 3-4 hours" v-model="step.step"></b-textarea>
                </b-col>
              </b-row>
              <b-row v-if="step.ingredients.length > 0" v-for="ingredient of step.ingredients">
                <b-col offset="3" md="3" class="pr-0">
                  <b-input placeholder="100g" v-model="ingredient.amount"></b-input>
                </b-col>
                <b-col>
                  <b-input placeholder="White flour" v-model="ingredient.ingredient"></b-input>
                </b-col>
                <b-col md="1" class="text">
                  <close-icon></close-icon>
                </b-col>
              </b-row>
              <b-row>
                <b-col offset="3">
                  <b-link @click="addIngredientToStep(step)"><plus-icon></plus-icon>Ingredient</b-link>
                </b-col>
              </b-row>
            </div>
            <b-row>
              <b-col class="mt-2">
                <b-link @click="addStep"><plus-icon></plus-icon>Step</b-link>
              </b-col>
            </b-row>
          </b-container>
      </form>
    </div>
    <b-col md="4" class="p-4 bg-light">

      <b-container>
        <b-row>
          <h4>{{ recipe.title }}</h4>
        </b-row>
        <b-row>
          <b-btn variant="link" @click="setPreference('measurement', 'grams')">Grams</b-btn>
          <b-btn variant="link" @click="setPreference('measurement', 'ounces')">Ounces</b-btn>
          <b-btn variant="link" @click="setPreference('measurement', 'volume')">Volume</b-btn>
        </b-row>
          <b-row>
            <b-col>
              <h6>Recipe ingredients</h6>
              <b-table thead-class="d-none" small v-if="recipe.ingredients.length > 0" :items="recipe.ingredients" :fields="ingredientTableFields">
                <template slot="amount" slot-scope="data">
                  {{ convertMeasurement(data.item) }}
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-container>

      <b-container>
        <b-row>
          <b-col>
            <h6>Steps</h6>
            <div v-for="step of recipe.steps">
              <strong v-if="step.category">{{ step.category }}<br /></strong>
              <p>
                {{ step.step }}
                <b-table thead-class="d-none" small v-if="step.ingredients.length > 0" :fields="ingredientTableFields" :items="step.ingredients">
                  <template slot="amount" slot-scope="data">
                    {{ convertMeasurement(data.item) }}
                  </template>
                </b-table>
              </p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <div>
        <button type="submit" @click="submitRecipe" class="btn btn-primary">Save</button>
        <b-alert variant="danger">There was an error. Please try again.</b-alert>
      </div>
    </b-col>
  </b-row>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
// import FormData from 'form-data'

export default {
  name: 'addRecipe',
  data () {
    return {
      recipe: {
        title: '',
        description: '',
        steps: [{
          'category': '',
          'step': '',
          'ingredients': []
        }],
        ingredients: [{
          'amount': '',
          'ingredient': ''
        }]
      },
      preferences: {
        measurement: 'grams' // ounces, grams, volume
      },
      ingredientTableFields: [
        {
          key: 'amount'
        },
        {
          key: 'ingredient'
        }
      ]
    }
  },
  filters: {
    date: function (value) {
      // if (!value) return
      // console.log(moment)
      return moment(value).format('D MMM, YYYY')
    }
  },
  computed: {
  },
  components: {
    Datepicker
  },
  methods: {
    setPreference: function (preference, value) {
      this.preferences[preference] = value
    },
    convertMeasurement: function (ingredient) {
      ingredient.amount = Number(String(ingredient.amount).replace(/[A-Za-z]/gi, ''))
      if (this.preferences.measurement === 'grams') {
        // Return as default grams
        return ingredient.amount + 'g'
      } else if (this.preferences.measurement === 'ounces') {
        // Calculate to ounces
        return (ingredient.amount * 0.035274).toFixed(2) + 'oz'
      } else if (this.preferences.measurement === 'volume') {
        return (ingredient.amount / 120).toFixed(2) + 'cups'
      }
    },
    addRecipe () {
      console.log('adding!')
    },
    addIngredient () {
      this.recipe.ingredients.push({
        'amount': '',
        'ingredient': ''
      })
    },
    addIngredientToStep (step) {
      step.ingredients.push({
        'amount': '',
        'ingredient': ''
      })
    },
    addStep () {
      this.recipe.steps.push({
        'category': '',
        'step': '',
        'ingredients': []
      })
    },
    submitRecipe () {
      console.log('ok', this.recipe)
      this.$store.dispatch('addRecipe', this.recipe)
    }
  }
}
</script>
