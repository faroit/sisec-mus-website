<template>
  <section class='hero'>
      <div id="d3container">
        <map-menu></map-menu>
        <svg id='heatmap' width="900" height="300"></svg>
      </div>
    <transition name="slide-fade">
      <div v-if="tracklist.length > 0">
        <div class="hero-body">
          <div class="container">
            <player :urls="tracklist"></player>
          </div>
        </div>
      </div>
    </transition>
  </section>

</template>

<script>
import * as d3 from 'd3'
import MapMenu from './Menu.vue'
import Player from './Player.vue'
import plot from './render.js'
import store from '../store.js'
import headers from './headers.js'

export default {
  components: {
    MapMenu, Player
  },
  data: function() {
    return { data: [] }
  },
  mounted: function() {
    plot.setRoute(this.$route.params.is_train, this.$route.params.target_id, this.$route.params.metric_id);
    plot.init();
    d3.csv("/data/data.csv", function(data) {this.data = data}.bind(this));
  },
  methods: {
    update: function() {
      plot.setRoute(this.$route.params.is_train, this.$route.params.target_id, this.$route.params.metric_id);
      plot.update(this.subset);
    }
  },
  computed: {
    subset: function() {
      return this.data.filter(function(d) {
        return (
          d.target_id == this.$route.params.target_id &&
          d.metric_id == this.$route.params.metric_id &&
          d.is_train == this.$route.params.is_train
        );
      }.bind(this));
    },
    tracklist: function() {
      if(this.$route.params.track_id == null) {
        return [];
      }
      var subset = this.data.filter(function(d) {
        return (
          d.track_id == this.$route.params.track_id &&
          d.method_id == headers.methods.indexOf(this.$route.params.method) &&
          d.metric_id == this.$route.params.metric_id
        );
      }.bind(this));
      var tracklist = []
      for (let track of subset) {
        tracklist.push(
          { 'name': headers.targets[track.target_id],
            'file': [
              track.track_id,
              headers.methods[track.method_id],
              headers.targets[track.target_id]
            ].join("_") + '.wav'
          }
        );
      }
      return tracklist;
    }
  },
  watch: {
    'data': 'update',
    '$route.params.is_train': 'update',
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

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  opacity: 0;
}

</style>
