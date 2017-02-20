<template>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-mobile">
          <h1 class="title is-2">
            Demixing Professionally Produced Music
          </h1>
          <figure class="image">
            <img src="./assets/hero_header.svg" alt="Description">
          </figure>
          <h2 class="subtitle is-5">
              This website aims to introduce state-of-the-art algorithms in
              audio source separation.
              Here we present the <strong>Music (MUS)</strong> task of the <strong>sixth
              community-based Signal Separation Evaluation Campaign (SiSEC 2016)</strong>.
              We show both, objective and subjective results of 100 full-track songs of
              different styles separated into five components: <strong>vocals, accompaniment, drums, bass and other</strong>.
          </h2>
          <br>
          <p class="has-text-centered">
              <router-link class="button is-large" :to="{ path: '/results' }">Show Results</router-link>
              <router-link class="button is-large" :to="{ path: '/results' }">Paper</router-link>
          </p>

        </div>
      </div>
    </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';

export default {
}
</script>

<style media="screen">
</style>
