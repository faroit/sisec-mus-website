<template>
  <div class="columns">
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: '4', metric_id: $route.params.metric_id }}">Vocals</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: '0', metric_id: $route.params.metric_id }}">Accompaniment</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: '2', metric_id: $route.params.metric_id }}">Drums</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: '1', metric_id: $route.params.metric_id }}">Bass</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: '3', metric_id: $route.params.metric_id }}">Other</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: $route.params.target_id, metric_id: '2' }}">SDR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: $route.params.target_id, metric_id: '0' }}">ISR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: $route.params.target_id, metric_id: '3' }}">SIR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: $route.params.is_train, target_id: $route.params.target_id, metric_id: '1' }}">SAR</router-link>
      </div>
    </div>
    <div class="column">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: '0', target_id: $route.params.target_id, metric_id: $route.params.metric_id }}">Training</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { is_train: '1', target_id: $route.params.target_id, metric_id: $route.params.metric_id }}">Test</router-link>
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
    background-color: #1F2F86;
    color: white;
    border-width: 0;
}

.button.is-acc {
    background-color: #f818f1;
    color: white;
    border-width: 0;
}

.nav {
    margin-top: 10px
}
</style>
