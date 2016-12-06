<template>
  <section class='hero'>
      <div id="d3container">
        <map-menu></map-menu>
        <svg id='heatmap' width="900" height="300"></svg>
      </div>
      <span>
        <a class="button is-danger"
          v-on:click='toggleMode'
          v-bind:class="{ 'is-active': decompose }"><span>{{ decompose ? 'Decompose Tracks' : 'Compare Methods' }}</span>
        </a>
      </span>
    <transition name="slide-fade">
      <div v-if="tracklist.length > 0">
        <div class="hero-body">
          <div class="container">
            <player :urls="tracklist" v-on:addReferences="addReferences"></player>
            <!-- <player :urls="tracklist"></player> -->
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
    return {
      decompose: true,
      data: []
    }
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
    },
    addReferences: function () {
        console.log("references added")
    },
    toggleMode: function() {
      this.decompose = ! this.decompose
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

      var trackstoload = []

      if ( this.decompose ) {
        var filtered_data = this.data.filter(function(d) {
          return (
            d.track_id == this.$route.params.track_id &&
            d.method_id == headers.methods.indexOf(this.$route.params.method) &&
            d.metric_id == this.$route.params.metric_id
          );
        }.bind(this));

        trackstoload.push(
          { 'name': 'Mixture',
            "muted": false,
            'file': [
              this.$route.params.track_id,
              'MIX'
            ].join("_") + '.wav'
          }
        );

        for (let track of filtered_data) {
          trackstoload.push(
            { 'name': headers.targets[track.target_id],
              "muted": true,
              'file': [
                track.track_id,
                headers.methods[track.method_id],
                headers.targets[track.target_id]
              ].join("_") + '.wav'
            }
          );
        }
        if(this.$route.params.track_id == null || !filtered_data.length) {
          return [];
        }
      }
      else {
        var filtered_data = this.data.filter(function(d) {
          return (
            d.track_id == this.$route.params.track_id &&
            d.target_id == this.$route.params.target_id &&
            d.metric_id == this.$route.params.metric_id
          );
        }.bind(this));
        console.log(headers.targets[filtered_data[0].target_id])
        trackstoload.push(
          { 'name': 'Reference',
            "muted": false,
            'file': [
              this.$route.params.track_id,
              'REF',
              headers.targets[filtered_data[0].target_id]
            ].join("_") + '.wav'
          }
        );

        for (let track of filtered_data) {
          trackstoload.push(
            { 'name': headers.methods[track.method_id],
              "muted": true,
              'file': [
                track.track_id,
                headers.methods[track.method_id],
                headers.targets[track.target_id]
              ].join("_") + '.wav'
            }
          );
        }
        if(this.$route.params.track_id == null || !filtered_data.length) {
          return [];
        }

      };

      return trackstoload;
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
