<template>
  <div class="container">
    <main-menu></main-menu>
    <router-view><router-view>
  </div>
</template>

<script>
import MainMenu from './Menu.vue'

export default {
  components: { MainMenu }
}
</script>

<style>
</style>
