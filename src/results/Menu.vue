<template>
  <div class="columns">
    <div class="column is-narrow">
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button is-vocals" active-class="is-primary"   :to="{ name: $route.name, params: Object.assign({}, $route.params, { target_id: '4' })}">Vocals</router-link>
        <router-link class="button is-acc" active-class="is-primary"      :to="{ name: $route.name, params: Object.assign({}, $route.params, { target_id: '0' })}">Accompaniment</router-link>
        <router-link class="button is-drums" active-class="is-primary"    :to="{ name: $route.name, params: Object.assign({}, $route.params, { target_id: '2' })}">Drums</router-link>
        <router-link class="button is-bass" active-class="is-primary"     :to="{ name: $route.name, params: Object.assign({}, $route.params, { target_id: '1' })}">Bass</router-link>
        <router-link class="button is-other" active-class="is-primary"    :to="{ name: $route.name, params: Object.assign({}, $route.params, { target_id: '3' })}">Other</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary"             :to="{ name: $route.name, params: Object.assign({}, $route.params, { metric_id: '2' })}">SDR</router-link>
        <router-link class="button" active-class="is-primary"             :to="{ name: $route.name, params: Object.assign({}, $route.params, { metric_id: '0' })}">ISR</router-link>
        <router-link class="button" active-class="is-primary"             :to="{ name: $route.name, params: Object.assign({}, $route.params, { metric_id: '3' })}">SIR</router-link>
        <router-link class="button" active-class="is-primary"             :to="{ name: $route.name, params: Object.assign({}, $route.params, { metric_id: '1' })}">SAR</router-link>
      </div>
    </div>
    <div class="column is-narrow">
      <div class="control has-addons">
        <router-link class="button" active-class="is-primary"             :to="{ name: $route.name, params: Object.assign({}, $route.params, { is_dev: '0' })}">Training</router-link>
        <router-link class="button" active-class="is-primary"             :to="{ name: $route.name, params: Object.assign({}, $route.params, { is_dev: '1' })}">Test</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import headers from '../headers.js'

export default {
}
</script>

<style media="screen">

.button.is-vocals.is-primary,
.button.is-vocals.is-primary:hover {
  color: white;
  background-color: #56B4E9;
  border: 1px solid #56B4E9;
}

.button.is-vocals:hover {
  color: #56B4E9;
  border: 1px solid #56B4E9;
}

.button.is-acc.is-primary,
.button.is-acc.is-primary:hover {
  color: white;
  background-color: #818181;
  border: 1px solid #818181;
}

.button.is-acc:hover {
  color: #818181;
  border: 1px solid #818181;
}

.button.is-drums.is-primary,
.button.is-drums.is-primary:hover {
  color: white;
  background-color: #009E73;
  border: 1px solid #009E73;
}

.button.is-drums:hover {
  color: #009E73;
  border: 1px solid #009E73;
}

.button.is-bass.is-primary,
.button.is-bass.is-primary:hover {
  color: white;
  background-color: #D55E00;
  border: 1px solid #D55E00;
}

.button.is-bass:hover {
  color: #D55E00;
  border: 1px solid #D55E00;
}

.button.is-other.is-primary,
.button.is-other.is-primary:hover {
  color: white;
  background-color: #CC79A7;
  border: 1px solid #CC79A7;
}

.button.is-other:hover {
  color: #CC79A7;
  border: 1px solid #CC79A7;
}

.nav {
    margin-top: 10px
}
</style>
