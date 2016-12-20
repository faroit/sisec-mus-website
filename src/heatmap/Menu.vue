<template>
  <div class="columns">
    <div class="column">
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-vocals" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: '4', metric_id: $route.params.metric_id }}">Vocals</router-link>
        <router-link class="button" active-class="is-acc" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: '0', metric_id: $route.params.metric_id }}">Accompaniment</router-link>
        <router-link class="button" active-class="is-drums" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: '2', metric_id: $route.params.metric_id }}">Drums</router-link>
        <router-link class="button" active-class="is-bass" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: '1', metric_id: $route.params.metric_id }}">Bass</router-link>
        <router-link class="button" active-class="is-other" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: '3', metric_id: $route.params.metric_id }}">Other</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: $route.params.target_id, metric_id: '2' }}">SDR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: $route.params.target_id, metric_id: '0' }}">ISR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: $route.params.target_id, metric_id: '3' }}">SIR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_dev: $route.params.is_dev, target_id: $route.params.target_id, metric_id: '1' }}">SAR</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_dev: '0', target_id: $route.params.target_id, metric_id: $route.params.metric_id }}">Training</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_dev: '1', target_id: $route.params.target_id, metric_id: $route.params.metric_id }}">Test</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import headers from './headers.js'

export default {
}
</script>

<style media="screen">

.button.is-vocals {
  color: white;
  background-color: #56B4E9;
}

.button.is-acc {
  color: white;
  background-color: #818181;
}

.button.is-drums {
  color: white;
  background-color: #009E73;
}

.button.is-bass {
  color: white;
  background-color: #D55E00;
}

.button.is-other {
  color: white;
  background-color: #CC79A7;
}

.nav {
    margin-top: 10px
}
</style>
