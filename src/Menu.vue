<template>
  <div class="nav-right nav-menu">
    <span class="nav-item">
      <router-link :to="{ path: '/heatmap' }">Results</router-link>
    </span>
    <span class="nav-item">
      <router-link :to="{ path: '/dataset' }">Dataset</router-link>
    </span>
    <span class="nav-item">
      <router-link :to="{ path: '/methods' }">Methods</router-link>
    </span>
    <span class="nav-item">
      <router-link :to="{ path: '/about' }">About</router-link>
    </span>
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
