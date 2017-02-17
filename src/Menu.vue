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
      <section class="modal-card-body">
        <div v-if="!showBibtex">
          Antoine Liutkus, Fabian-Robert Stöter, Zafar Rafii, Daichi Kitamura,</br>
          Bertrand Rivet, Nobutaka Ito, Nobutaka Ono, and Julie Fontecave </br>
          Latent Variable Analysis and Signal Separation (LVA/ICA 2017)</br>
          Lecture Notes in Computer Science, vol 10169. Springer, Cham
        </div>
        <pre v-if="showBibtex">@inproceedings{
  Liutkus2017,
  Title = {The 2016 Signal Separation Evaluation Campaign},
  Address = {Cham},
  Author = {Liutkus, Antoine and St{\"o}ter, Fabian-Robert and Rafii, Zafar and
    Kitamura, Daichi and Rivet, Bertrand and Ito, Nobutaka and
    Ono, Nobutaka and Fontecave, Julie},
  Editor = {Tichavsk{\'y}, Petr and Babaie-Zadeh, Massoud and
    Michel, Olivier J.J. and Thirion-Moreau, Nad{\`e}ge},
  Pages = {323--332},
  Publisher = {Springer International Publishing},
  Year = {2017},
  booktitle = {Latent Variable Analysis and Signal Separation - 12th International
    Conference, {LVA/ICA} 2015, Liberec, Czech Republic, August 25-28,
    2015, Proceedings},
}</pre>
      </section>
      <footer class="modal-card-foot">
        <a class="button" v-bind:class="{ 'is-danger is-outlined': showBibtex }" v-on:click="toggleBibtex">
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
    margin-top: 10px
}

.modal-card-body pre {
  text-align: left;
}
</style>
