<template>
  <div class="container">
    <main-menu></main-menu>
    <router-view><router-view>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            The source code of this website is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
          </p>
          <p>
          </p>
        </div>
      </div>
  </footer>
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
