<template>
  <div class="nav-right nav-menu">
      <router-link class="nav-item is-tab" :to="{ path: '/dataset' }">Task/Dataset</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/methods' }">Methods</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/heatmap' }">Results</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/about' }">About</router-link>
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';

export default {
}
</script>

<style media="screen">
.nav {
    margin-top: 10px
}
</style>
