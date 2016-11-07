<template>
  <div id="d3container">
    <map-menu></map-menu>
    <svg id='heatmap' width="900" height="300"></svg>
  </div>
</template>

<script>
import d3 from 'd3'
import MapMenu from './Menu.vue'
import render from './render.js'

export default {
  components: { MapMenu },
  mounted: function() {
    render()
  },
  watch: {
    '$route.params.subset': function(v) {
      console.log(v);
    },
    '$route.params.target': function(v) {
      console.log(v);
    },
    '$route.params.metric': function(v) {
      console.log(v);
    },
  }
}
</script>
