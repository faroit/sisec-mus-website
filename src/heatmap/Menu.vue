<template>
  <div class="columns">
    menu {{$route.query.metric}}
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: 'vocals', metric: $route.params.metric }}">Vocals</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: 'accompaniment', metric: $route.params.metric }}">Accompaniment</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: 'drums', metric: $route.params.metric }}">Drums</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: 'bass', metric: $route.params.metric }}">Bass</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: 'other', metric: $route.params.metric }}">Other</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: 'sdr' }}">SDR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: 'isr' }}">ISR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: 'sir' }}">SIR</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: $route.params.subset, target: $route.params.target, metric: 'sar' }}">SAR</router-link>
      </div>
    </div>
    <div class="column">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: 'training', target: $route.params.target, metric: $route.params.metric }}">Training</router-link>
        <router-link class="button" active-class="is-primary" :to="{ name: 'heatmap', params: { subset: 'test', target: $route.params.target, metric: $route.params.metric }}">Test</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style media="screen">
@import '~bulma/css/bulma.css';

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
