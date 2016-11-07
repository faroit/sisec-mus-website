<template>
  <div class="nav-right nav-menu">
    <span class="nav-item">
      <router-link :to="{ path: '/heatmap' }">Results</router-link>
    </span>
    <span class="nav-item">
      <router-link :to="{ path: '/about' }">About</router-link>
    </span>
  </div>
</template>

<script>
export default {
}
</script>

<style media="screen">
@import '~bulma/css/bulma.css';

.nav {
    margin-top: 10px
}
</style>
