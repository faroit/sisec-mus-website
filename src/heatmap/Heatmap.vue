<template>
  <section>
      <div id="d3container">
        <svg id='heatmap' width="900" height="300"></svg>
        <div id='tracktip'></div>
        <div id='methodtip'></div>
      </div>
      <map-menu></map-menu>
    <transition name="slide-fade">
      <div v-if="tracklist.length > 0">
        <div class="hero-body">
          <div class="container">
            <player
              :urls="tracklist"
              :availableMethods="availableMethods"
              :decompose='decompose'
              v-on:toggleMode="toggleMode"
            >
            </player>
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
      data: [],
      availableMethods: []
    }
  },
  mounted: function() {
    plot.setRoute(
        this.$route.params.is_train,
        this.$route.params.target_id,
        this.$route.params.metric_id,
        this.$route.params.track_id,
        this.$route.params.method
    );
    plot.init();
    d3.csv("/data/data.csv", function(data) {this.data = data}.bind(this));
  },
  methods: {
    update: function() {
      plot.setRoute(
          this.$route.params.is_train,
          this.$route.params.target_id,
          this.$route.params.metric_id,
          this.$route.params.track_id,
          this.$route.params.method
      );
      plot.update(this.subset);
    },
    addReferences: function () {
        console.log("references added")
    },
    toggleMode: function(d) {
      console.log(d)
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

      if (this.$route.params.method == 'REF') {
        trackstoload.push(
          { 'name': 'Mixture',
            "muted": false,
            'file': [
              this.$route.params.track_id,
              'MIX'
            ].join("_") + '.m4a'
          }
        );

        for (let target of headers.targets) {
          trackstoload.push(
            { 'name': target,
              "muted": true,
              'file': [
                this.$route.params.track_id,
                'REF',
                target
              ].join("_") + '.m4a'
            }
          );
        }
        return trackstoload;
      }

      var filterByMethod = this.data.filter(function(d) {
        return (
          d.track_id == this.$route.params.track_id &&
          d.method_id == headers.methods.indexOf(this.$route.params.method) &&
          d.metric_id == this.$route.params.metric_id
        );
      }.bind(this));

      var filterByTarget = this.data.filter(function(d) {
        return (
          d.track_id == this.$route.params.track_id &&
          d.target_id == this.$route.params.target_id &&
          d.metric_id == this.$route.params.metric_id
        );
      }.bind(this));

      if(this.$route.params.track_id == null || !filterByMethod.length) {
        return [];
      }

      this.availableMethods = []
      for (let track of filterByTarget) {
        this.availableMethods.push(
          {
            'name': headers.methods[track.method_id],
            'id': track.method_id
          }
        );
      }

      if ( this.decompose ) {
        trackstoload.push(
          { 'name': 'Mixture',
            "muted": false,
            'file': [
              this.$route.params.track_id,
              'MIX'
            ].join("_") + '.m4a'
          }
        );

        for (let track of filterByMethod) {
          trackstoload.push(
            { 'name': headers.targets[track.target_id],
              "muted": true,
              'file': [
                track.track_id,
                headers.methods[track.method_id],
                headers.targets[track.target_id]
              ].join("_") + '.m4a'
            }
          );
        }
      }
      else {
        console.log(headers.targets[filterByTarget[0].target_id])
        trackstoload.push(
          { 'name': 'Reference',
            "muted": false,
            'file': [
              this.$route.params.track_id,
              'REF',
              headers.targets[filterByTarget[0].target_id]
            ].join("_") + '.m4a'
          }
        );

        for (let track of filterByTarget) {
          trackstoload.push(
            { 'name': headers.methods[track.method_id],
              "muted": true,
              'file': [
                track.track_id,
                headers.methods[track.method_id],
                headers.targets[track.target_id]
              ].join("_") + '.m4a'
            }
          );
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
    '$route.params.method' : 'update',
    '$route.params.track_id' : 'update'
  }
}
</script>

<style>
#d3container {
  margin-top: -3em;
}

#tracktip {
    position: absolute;
    text-align: center;
    width: 0px;
    height: 100px;
    padding: 2px;
    font: 12px sans-serif;
    background-color: transparent;
    border-left: 1px solid white;
    border-right: 1px solid white;
    pointer-events: none;
}

#methodtip {
    position: absolute;
    text-align: center;
    width: 0px;
    height: 100px;
    padding: 2px;
    background-color: transparent;
    font: 12px sans-serif;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    pointer-events: none;
}

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
