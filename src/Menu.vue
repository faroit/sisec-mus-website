<template>
  <div class="nav-center nav-menu">
      <router-link class="nav-item is-tab" :to="{ path: '/dataset' }">Dataset</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/methods' }">Methods</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/results' }">Results</router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/listen' }">
        <span class="icon">
           <i class="fa fa-volume-up"></i>
        </span>
        <span>Listen</span>
      </router-link>
      <router-link class="nav-item is-tab" :to="{ path: '/about' }">About</router-link>
      <span class="nav-item">
        <a
        href="http://sisec.inria.fr" class="button is-info is-outlined"
        >
          <span>SiSEC Website</span>
        </a>
      </span>
      <span class="nav-item">
        <a
        class="button is-primary"
        v-on:click="toggleCite"
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
        <p class="modal-card-title">The 2016 Signal Separation Evaluation Campaign</p>
        <button class="delete" v-on:click="toggleCite"></button>
      </header>
      <section class="modal-card-body" v-bind:class="{ 'bibtex': showBibtex }" >
        <div v-if="!showBibtex">
          Antoine Liutkus, Fabian-Robert Stöter, Zafar Rafii, Daichi Kitamura,</br>
          Bertrand Rivet, Nobutaka Ito, Nobutaka Ono, and Julie Fontecave </br>
          13th International Conference on Latent Variable Analysis and Signal Separation (LVA/ICA 2017)</br>
        </div>
        <pre v-if="showBibtex">@inproceedings{
  SiSEC17,
  Title = {The 2016 Signal Separation Evaluation Campaign},
  Author = {
      Liutkus, Antoine and St{\"o}ter, Fabian-Robert and
      Rafii, Zafar and Kitamura, Daichi and
      Rivet, Bertrand and Ito, Nobutaka and
      Ono, Nobutaka and Fontecave, Julie},
  booktitle = {
    Latent Variable Analysis and Signal Separation:
    13th International Conference, LVA/ICA 2017, Grenoble, France},
  Pages = {323--332},
  Publisher = {Springer International Publishing},
  Year = {2017},
  2017, Proceedings}
}</pre>
      </section>
      <footer class="modal-card-foot">
        <a class="button" v-bind:class="{ 'is-danger': showBibtex }" v-on:click="toggleBibtex">
          <span class="icon">
             <i class="fa fa-book"></i>
          </span>
          <span>BibTex</span>
        </a>
        <a class="button" href="mailto:antoine.liutkus@inria.fr">
          <span class="icon">
             <i class="fa fa-envelope"></i>
          </span>
          <span>Contact</span>
        </a>
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
      showBibtex: false,
    }
  },
  methods: {
    toggleCite: function() {
      this.showCite = !this.showCite
    },
    toggleBibtex: function() {
      this.showBibtex = !this.showBibtex
    },
  }
}
</script>

<style media="screen">
.nav {
    margin-top: 10px;
    z-index: 1000;
}

.modal-card-body pre {
  text-align: left;
}

.modal {
  z-index: 9998;
}

.modal-card {
  z-index: 9999;
}

.bibtex {
  background-color: #ff3860;
  color: white;
}

.bibtex pre {
  background-color: #ff3860;
  color: white;
}

</style>
