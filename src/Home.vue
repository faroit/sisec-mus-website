<template>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="columns is-vcentered">
          <div class="column is-5">
            <figure class="image is-4by3">
              <img src="./assets/hero.svg" alt="Description">
            </figure>
          </div>
          <div class="column is-6 is-offset-1">
            <h1 class="title is-2">
                Separating Professionally Produced Music
            </h1>
            <h2 class="subtitle is-4">
                This website presents the state-of-the-art algorithms in
                audio source separation.
                We present the results of 100 full-track songs of
                different styles separated into five components:
                vocals, accompaniment, drums, bass and other.
            </h2>
            <br>
            <p class="has-text-centered">
                <router-link class="button is-large" :to="{ path: '/heatmap' }">View Results</router-link>
            </p>
          </div>
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
