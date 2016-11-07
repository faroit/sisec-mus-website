<template>
  <div id="d3container">
    <map-menu></map-menu>
    <svg id='heatmap' width="900" height="300"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import MapMenu from './Menu.vue'
import plot from './render.js'

export default {
  components: { MapMenu },
  data: function() {
    return { data: {} }
  },
  mounted: function() {
    plot.init();
    d3.csv("/data/data.csv", function(data) {this.data = data}.bind(this));
  },
  methods: {
    update: function() {
      plot.update(this.data.filter(function(d) {
        return (
          d.target_name == this.$route.params.target &&
          d.metric == this.$route.params.metric &&
          (
            (this.$route.params.subset == 0 && d.track_id >= 51) ||
            (this.$route.params.subset == 1 && d.track_id <= 50)
          )
        );
      }.bind(this)));
    }
  },
  watch: {
    'data': 'update',
    '$route.params.subset': 'update',
    '$route.params.target': 'update',
    '$route.params.metric': 'update',
  }
}
</script>
