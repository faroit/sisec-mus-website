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
          d.target_id == this.$route.params.target_id &&
          d.metric_id == this.$route.params.metric_id &&
          d.is_dev == this.$route.params.is_dev
        );
      }.bind(this)));
    }
  },
  watch: {
    'data': 'update',
    '$route.params.is_dev': 'update',
    '$route.params.target_id': 'update',
    '$route.params.metric_id': 'update',
  }
}
</script>
<style>
div.tooltip {
  position: relative;
  text-align: right;
  width: 300px;
  height: 30px;
  padding: 0px;
  margin-top: 0px;
  margin-right: 50px;
  font: 12px sans-serif;
  border: 0px;
  color: black;
}

text.method_label.active {
  fill: orange;
}

.grid text.track_label.active {
  fill: red;
}

.grid .track_label_group rect.active {
  fill: blue;
  fill-opacity: 1;
}

</style>
