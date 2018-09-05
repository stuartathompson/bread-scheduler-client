<template>
  <div id="app" class="">
    <nav class="navbar navbar-expand navbar-dark bg-primary">
      <a href="/" class="navbar-brand">CityScheduler</a>
    </nav>
    <div class="d-flex">
    <div class="sidebar nav">
      <ul>
        <li class="nav-item"><router-link v-bind:to="{ name: 'Records' }" class="nav-link" role="">Your cases</router-link></li>
        <li class="nav-item"><router-link v-bind:to="{ name: 'addrecord' }" class="nav-link" role="">New case</router-link></li>
        <li class="nav-item"><router-link v-bind:to="{ name: 'addrecord' }" class="nav-link" role="">Calendar</router-link></li>
        <!--<li class="nav-item"><a role="" class="nav-link" href="Home">Reports</a></li>
        <li class="nav-item"><a role="" class="nav-link" href="Home">Upcoming dates</a></li>-->
      </ul>
    </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
