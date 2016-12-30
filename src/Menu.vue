<template>
  <div class="nav-center nav-menu">
      <router-link class="nav-item is-tab" :to="{ path: '/dataset' }">Task/Dataset</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/methods' }">Methods</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/results' }">Results</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/heatmap' }">
        <span class="icon">
           <i class="fa fa-volume-up"></i>
        </span>
        <span>Listen</span>
      </router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/about' }">About</router-link>
      <span class="nav-item">
        <a
        class="button is-primary"
        v-on:click="toggleCite"
        href="#"
        >
          <span class="icon">
            <i class="fa fa-quote-left"></i>
          </span>
          <span>Cite</span>
        </a>
      </span>
   <div class="modal" v-bind:class="{ 'is-active': showCite }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">SiSEC 2016</p>
        <button class="delete" v-on:click="toggleCite"></button>
      </header>
      <section class="modal-card-body">
        Antoine Liutkus, Fabian-Robert Stöter, Zafar Rafii, Daichi Kitamura, Bertrand Rivet, Nobutaka Ito, Nobutaka Ono, and Julie Fontecave </br>
        The 2016 Signal Separation Evaluation Campaign (SiSEC2016),
        in Proc. Int. Workshop on Machine Learning for Signal Processing, 2017.
      </section>
      <footer class="modal-card-foot">
        <a class="button">
          <span class="icon">
             <i class="fa fa-book"></i>
          </span>
          <span>BibTex</span>
        </a>
        <a class="button is-primary">SiSEC Website</a>
      </footer>
    </div>
  </div>
    </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import fontawesome from 'font-awesome/css/font-awesome.min.css';

export default {
  data: function () {
    return {
      showCite: false,
    }
  },
  methods: {
    toggleCite: function() {
      this.showCite = !this.showCite
    },
  }
}
</script>

<style media="screen">
.nav {
    margin-top: 10px
}
</style>
