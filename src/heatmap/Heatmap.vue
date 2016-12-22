<template>
  <section>
      <div id="d3container">
        <svg id='heatmap' width="900" height="300"></svg>
        <div id='tracktip'></div>
        <div id='methodtip'></div>
        <div id='tracktiph'></div>
        <div id='methodtiph'></div>
      </div>
      <map-menu></map-menu>
    <transition name="slide-fade">
      <div v-if="tracklist.length > 0">
        <div class="hero-body">
          <div class="container">
            <player
              :urls="tracklist"
              :dev="dev"
              :target="target"
              :metric="metric"
              :track="track"
              :method="method"
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
      d3data: [],
      availableMethods: [],
    }
  },
  mounted: function() {
    plot.setRoute(
        this.dev,
        this.target.id,
        this.metric.id,
        this.track.id,
        this.method.name
    );
    plot.init();
    d3.csv("/data/data.csv", function(d3data) {this.d3data = d3data}.bind(this));
  },
  methods: {
    update: function() {
      plot.setRoute(
          this.dev,
          this.target.id,
          this.metric.id,
          this.track.id,
          this.method.name
      );
      plot.update(this.subset);
    },
    toggleMode: function(d) {
      this.decompose = ! this.decompose
    }
  },
  computed: {
    method: function() {
      return {
        'name': this.$route.params.method,
        'id': headers.methods.indexOf(this.$route.params.method)
      };
    },
    target: function() {
      return {
        'id': this.$route.params.target_id
      };
    },
    metric: function() {
      return {
        'id': this.$route.params.metric_id
      };
    },
    track: function() {
      return {
        'id': this.$route.params.track_id
      };
    },
    dev: function() {
      return this.$route.params.is_dev === '1'
    },
    compoundProperty: function() {
        // `.join()` because we don't care about the return value.
        return [this.method.id, this.target.id, this.metric.id, this.track.id, this.dev].join()
    },
    subset: function() {
      return this.d3data.filter(function(d) {
        return (
          d.target_id == this.target.id &&
          d.metric_id == this.metric.id &&
          d.is_dev == this.dev
        );
      }.bind(this));
    },
    tracklist: function() {
      var out = []

      if (this.method.name == 'REF') {
        out.push(
          { 'name': 'Mixture',
            'customClass': 'mix',
            'solo': true,
            'file': [
              this.track.id,
              'MIX'
            ].join("_") + '.m4a'
          }
        );

        for (let target of headers.targets) {
          out.push(
            { 'name': target,
              'customClass': target,
              'solo': false,
              'file': [
                this.track.id,
                'REF',
                target
              ].join("_") + '.m4a'
            }
          );
        }
        return out;
      }

      var filterByMethod = this.d3data.filter(function(d) {
        return (
          d.track_id == this.track.id &&
          d.method_id == this.method.id &&
          d.metric_id == this.metric.id
        );
      }.bind(this));

      if(this.track.id == null || !filterByMethod.length) {
        return [];
      }

      out.push(
        { 'name': 'Mixture',
          'customClass': 'mix',
          'solo': true,
          'file': [
            this.track.id,
            'MIX'
          ].join("_") + '.m4a'
        }
      );

      for (let track of filterByMethod) {
        out.push(
          { 'name': headers.targets[track.target_id],
            'customClass': headers.targets[track.target_id],
            'solo': false,
            'file': [
              track.track_id,
              headers.methods[track.method_id],
              headers.targets[track.target_id]
            ].join("_") + '.m4a'
          }
        );
      }

      return out;
    },

    availableMethods: function() {
      var filterByTarget = this.d3data.filter(function(d) {
        return (
          d.track_id == this.track.id &&
          d.target_id == this.target.id &&
          d.metric_id == this.metric.id
        );
      }.bind(this));

      var out = []
      for (let track of filterByTarget) {
        out.push(
          {
            'name': headers.methods[track.method_id],
            'customClass': track.method_id
          }
        );
      }
      return out;
    }
  },
  watch: {
    'd3data': 'update',
    'compoundProperty': 'update',
  }
}
</script>

<style>
#d3container {
  margin-top: 0em;
}

#tracktiph {
    position: absolute;
    text-align: center;
    width: 0px;
    height: 100px;
    padding: 2px;
    opacity: 0;
    font: 12px sans-serif;
    background-color: transparent;
    border-left: 1px solid white;
    border-right: 1px solid white;
    pointer-events: none;
}

#methodtiph {
    position: absolute;
    text-align: center;
    width: 0px;
    height: 100px;
    padding: 2px;
    opacity: 0;
    background-color: transparent;
    font: 12px sans-serif;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    pointer-events: none;
}

#tracktip {
    position: absolute;
    text-align: center;
    width: 0px;
    height: 100px;
    padding: 2px;
    opacity: 0;
    font: 12px sans-serif;
    background-color: transparent;
    border-left: 2px solid #00d1b2;
    border-right: 2px solid #00d1b2;
    pointer-events: none;
}

#methodtip {
    position: absolute;
    text-align: center;
    width: 0px;
    height: 100px;
    opacity: 0;
    padding: 2px;
    background-color: transparent;
    font: 12px sans-serif;
    border-top: 2px solid #00d1b2;
    border-bottom: 2px solid #00d1b2;
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
