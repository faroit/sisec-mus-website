<template>
  <div class="columns">
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: '4', metric: $route.params.metric }}">Vocals</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: '0', metric: $route.params.metric }}">Accompaniment</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: '2', metric: $route.params.metric }}">Drums</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: '1', metric: $route.params.metric }}">Bass</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: '3', metric: $route.params.metric }}">Other</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: '2' }}">SDR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: '0' }}">ISR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: '3' }}">SIR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: '1' }}">SAR</router-link>
      </div>
    </div>
    <div class="column">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: '0', target: $route.params.target, metric: $route.params.metric }}">Training</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: '1', target: $route.params.target, metric: $route.params.metric }}">Test</router-link>
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
