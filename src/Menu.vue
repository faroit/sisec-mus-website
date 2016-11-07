<template>
  <div class="columns">
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" :to="{ path: '/heatmap' }">Results</router-link>
        <router-link class="button" :to="{ path: '/about' }">About</router-link>
      </div>
    </div>
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
