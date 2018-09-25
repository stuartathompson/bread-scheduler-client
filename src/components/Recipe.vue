<template>
  <div class="recipe mt-5">
    <div class="timer shadow-sm bg-light text-center border border-bottom-0">
      <nav class="bg-light p-1 text-right">
        <minimize-icon></minimize-icon>
        <close-icon></close-icon>
      </nav>
      <div class="border border-left-0 border-right-0 bg-white p-3 big-num text-primary">
        <timer-icon></timer-icon> {{ timer.timeLeft }}
      </div>
      <p class="p-2 pb-4">
        Time left on until you can start the <b-link>mix</b-link>.
      </p>
    </div>
    <b-container>
      <b-row>
        <b-col>
          <h1 class="">{{ recipe.title }}</h1>
        </b-col>
      </b-row>
      <b-row class="">
        <b-col class="">
          <p class="pt-2 mt-2 border border-dark border-left-0 border-bottom-0 border-right-0">
            <span class="text-primary mr-1">Time</span> 12-14 hours
            <span class="text-primary ml-4 mr-1">Rating</span><star-icon v-for="i in [1, 2, 3, 4, 5]"></star-icon>
            <b-link variant="primary" class="float-right text-primary"><plus-icon></plus-icon>Save to my recipes</b-link>
          </p>
        </b-col>
      </b-row>
      <b-row class="mb-5">
        <b-col>
          <div class="cover" style="background-image:url('static/bread2.jpg')"></div>
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col md="3">
          <h3>Start now and finish {{ finishTimeMin }}</h3>
          <p class="pb-4">
            {{ recipe.description }}
          </p>
          <div class="pb-1">
            <strong>What you'll need</strong>
          </div>
          <b-table thead-class="d-none" v-if="recipe && recipe.ingredients && recipe.ingredients.length > 0" :items="recipe.ingredients" :fields="ingredientTableFields"
          class="table-no-top-rule">
            <template slot="amount" slot-scope="data">
              {{ convertMeasurement(data.item) }}
            </template>
          </b-table>

          <!-- <b-btn variant="primary">Start this recipe</b-btn> -->
        </b-col>
        <b-col offset="1">

          <h4>Bread Sked</h4>
          <b-card>
            <p>
              If you started right now, you would finish between {{ finishTimeMin }} and {{ finishTimeMax }}. Adjust your schedule by choosing a time that works for you.
            </p>
            <!-- <b-btn small>6 p.m.</b-btn> <b-btn>9 a.m.</b-btn> <b-btn>Noon</b-btn> -->
            <div v-if="recipe" id="scheduler" class="viz">&nbsp;</div>
          </b-card>

          <h4 class="mt-4">Steps</h4>
          <b-card no-body>
            <b-card-body v-for="step of recipe.steps" class="border mb-4 border-left-0 border-right-0 border-top-0 ">
              <b-row>
                <b-col>
                  <h6 v-if="step.category">{{ step.category }}</h6>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p>
                    {{ step.step }}
                  </p>
                  <b-table thead-class="d-none" small v-if="step.ingredients && step.ingredients.length > 0" :fields="ingredientTableFields" :items="step.ingredients">
                    <template slot="amount" slot-scope="data">
                      {{ convertMeasurement(data.item) }}
                    </template>
                  </b-table>
                  <b-btn @click="startTimer" size="sm" class="" variant="primary">
                    <timer-icon></timer-icon> Start 3-4 hour timer
                  </b-btn>

                </b-col>
                <b-col md="6">
                  <img class="w-100" src="/static/bread.jpg" />
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
const d3 = require('d3')
export default {
  name: 'Recipe',
  data () {
    return {
      data: [],
      finishTimeMin: null,
      finishTimeMax: null,
      preferences: {
        measurement: 'grams'
      },
      ingredientTableFields: [
        {
          key: 'amount'
        },
        {
          key: 'ingredient'
        }
      ],
      stepsTableFields: [
        {
          category: 'Steps'
        }
      ],
      timer: {
        start: null,
        end: null,
        timeLeft: 0
      }
    }
  },
  components: {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.getRecipe()
    this.makeViz()
  },
  filters: {
  },
  computed: {
    recipe: function () {
      return this.$store.state.recipe
    }
  },
  watch: {
    '$route' (to, from) {
      // Force a change to records on back button when hash is cleared...
      console.log(to.path)
    }
  },
  methods: {
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
    endTimer: function () {
      clearInterval(this.t)
    },
    startTimer: function () {
      var that = this
      this.timer.start = moment()
      this.timer.end = moment().add(3, 'hours')
      function getFreshTime () {
        var now = moment()
        var diff = moment.duration(that.timer.end.diff(now))
        var hours = diff.hours()
        var minutes = diff.minutes()
        var seconds = diff.seconds()
        that.timer.timeLeft = hours + ':' + minutes + ':' + seconds
      }
      this.t = setInterval(function () {
        getFreshTime()
      }, 1000)
      getFreshTime()
    },
    getRecipe: function (recipe) {
      // this.$router.push('recipe/' + recipe._id + '/edit')
      if (!recipe) recipe = {_id: this.$route.path.replace('recipe', '').replace('edit', '').replace(/\//gi, '')}
      console.log(recipe)
      if (recipe._id !== '') {
        // window.location.hash = `${record._id}/edit`
        // this.$router.push({ path: `${recipe._id}/edit` })
        this.$store.dispatch('getRecipe', recipe)
      }
    },
    makeViz: function () {
      const numberOfSteps = 6
      const margin = 50
      const barHeight = 20
      const height = barHeight * numberOfSteps + margin

      const width = 569 - margin
      const primary = '#808080'
      // '#ff3300'
      const secondary = '#eee'
      // '#ffc6b8'

      const svgW = d3.select('#scheduler')
        .append('svg')
        .attr('width', width + margin)
        .attr('height', height + margin * 2)

      let minDate = moment()
      let maxDate = moment()
      let minEndDate

      // const data = this.$store.state.recipe.steps

      // for (var step of data) {
      //   step.timeMin = (Math.random() * 4) + 1
      //   step.timeMax = step.timeMin + (Math.random() * 2)
      // }
      let data = [
        {
          'category': 'Levain',
          'timeMin': 5,
          'timeMax': 6
        },
        {
          'category': 'Mix',
          'timeMin': 1,
          'timeMax': 1
        },
        {
          'category': 'Salt',
          'timeMin': 1,
          'timeMax': 1
        },
        {
          'category': 'Bulk',
          'timeMin': 3,
          'timeMax': 4
        },
        {
          'category': 'Divide and Preshape',
          'timeMin': 1,
          'timeMax': 1
        },
        {
          'category': 'Proof',
          'timeMin': 3,
          'timeMax': 4
        },
        {
          'category': 'Bake',
          'timeMin': 1,
          'timeMax': 1
        }
      ]

      // Add previous minMax times together
      var i = 0
      for (var datum of data) {
        if (i === 0) {
          datum.startTime = moment()
          datum.additiveTimeMin = minDate.clone().add(datum.timeMin, 'hours')
          datum.additiveTimeMax = minDate.clone().add(datum.timeMax, 'hours')
        } else {
          datum.startTime = data[i - 1].additiveTimeMin.clone()
          datum.additiveTimeMin = data[i - 1].additiveTimeMin.clone().add(datum.timeMin, 'hours')
          datum.additiveTimeMax = data[i - 1].additiveTimeMax.clone().add(datum.timeMax, 'hours')
          maxDate = datum.additiveTimeMax
          minEndDate = datum.additiveTimeMin
        }
        i++
      }

      this.finishTimeMax = maxDate.calendar(moment()).toLowerCase()
      this.finishTimeMin = minEndDate.calendar(moment()).toLowerCase()

      const x = d3.scaleUtc().domain([minDate, maxDate]).range([0, width])
      const y = d3.scaleLinear().domain([0, data.length]).range([0, height])

      const svg = svgW.append('g')
        .attr('transform', `translate(${10}, ${margin})`)

      svg.append('g')
        .attr('transform', 'translate(0,' + -10 + ')')
        .call(d3.axisTop(x))

      const steps = svg.selectAll('g.step')
        .data(data).enter()
      .append('g')
        .attr('class', 'step')
        .attr('transform', (d, i) => {
          return `translate(${x(d.startTime)}, ${y(i)})`
        })

      steps.append('rect')
        .attr('width', d => {
          return x(d.additiveTimeMax.utc()) - x(d.startTime.utc()) - barHeight
        })
        .attr('x', barHeight / 2)
        .attr('height', barHeight)
        .attr('fill', secondary)

      steps.append('circle')
        .attr('r', barHeight / 2)
        .attr('cx', d => x(d.additiveTimeMax.utc()) - x(d.startTime.utc()) - barHeight / 2)
        .attr('cy', barHeight / 2)
        .attr('fill', secondary)

      steps.append('rect')
        .attr('width', d => {
          return x(d.additiveTimeMin.utc()) - x(d.startTime.utc()) - barHeight / 2
        })
        .attr('x', barHeight / 2)
        .attr('height', barHeight)
        .attr('fill', primary)

      steps.append('circle')
        .attr('r', barHeight / 2)
        .attr('cx', barHeight / 2)
        .attr('cy', barHeight / 2)
        .attr('fill', primary)

      steps.append('circle')
        .attr('r', barHeight / 2)
        .attr('cx', d => x(d.additiveTimeMin.utc()) - x(d.startTime.utc()))
        .attr('cy', barHeight / 2)
        .attr('fill', primary)

      steps.append('text')
        .text(d => d.category)
        .style('font-family', 'sans-serif')
        .attr('x', barHeight / 2)
        .style('font-size', 12)
        .attr('y', barHeight - 6)
        .style('fill', 'white')

      svg.select('.domain').remove()

      svg.selectAll('.tick line')
        .attr('y2', height + 15)
        .attr('opacity', 0.15)

      svg.selectAll('.tick text')
        .attr('y', -5)

      // return svgW.node()
    }
  }
}
</script>
