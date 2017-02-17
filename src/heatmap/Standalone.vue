<template>
  <section>
      <div class="columns">
        <div class="column is-narrow">
          <div class="control-label">
            <label id='track-label' class="label">Selected Track</label>
          </div>
          <p class="control has-addons has-addons-centered">
            <a  v-on:click="selectedID = parseInt(selectedID) - 1" class="button">
              -
            </a>
            <span class="select">
              <select v-model="selectedID">
                <option v-for="track in availableIDs" v-bind:value="track.id">
                  {{ track.id }}
                </option>
              </select>
            </span>
        <a v-on:click="selectedID = parseInt(selectedID) + 1" class="button">
          +
        </a>
      </p>
        </div>
        <div class="column is-narrow">
          <div class="control-label">
            <label class="label">Selected Method</label>
          </div>
          <div class="control">
            <span class="select">
              <select v-model="selectedMethod">
                <option v-for="method in availableMethods" v-bind:value="method.name">
                  {{ method.name }}
                </option>
              </select>
            </span>
          </div>
        </div>
    </div>
    <transition name="slide-fade">
      <div v-if="tracklist.length > 0">
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
    </transition>
  </section>

</template>

<script>
import * as d3 from 'd3'
import Selection from './PlayerSelect.vue'
import Player from './Player.vue'
import plot from './render.js'
import store from '../store.js'
import headers from './headers.js'
import balloon from 'balloon-css/balloon.css';

import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'

export default {
  components: {
    Selection, Player, ScaleLoader
  },
  data: function() {
    return {
      decompose: true,
      data: [],
      availableMethods: [],
      selectedMethod: '-1',
      availableIDs: [],
      selectedID: '1',
      isLoading: true,
      loaderColor: 'orange',
      loaderHeight: '26px',
    }
  },
  created: function() {
    this.isLoading = true;
    for (let method of headers.methods) {
      this.availableMethods.push(
        {
          'name': method
        }
      );
    };

    for (var i = 1; i < 100; i++) {
      this.availableIDs.push(
        {
          'id': i
        }
      );
    }
  },
  updated: function() {
    this.isLoading = false;
  },
  mounted: function() {
    d3.csv("/data/sisec_mus_2017.csv", function(data) {this.data = data}.bind(this));
    this.selectedMethod = this.$route.params.method
    this.selectedID = this.$route.params.track_id
  },
  methods: {
    updateMethod: function() {
      this.selectedMethod = this.$route.params.method
    },
    updateID: function() {
      this.selectedID = this.$route.params.track_id
    },
    updateURLforMethod: function() {
      this.$router.push({ params: { method: this.selectedMethod }})
    },
    updateURLforID: function() {
      this.$router.push({ params: { track_id: this.selectedID }})
    },
    toggleMode: function(d) {
      this.decompose = ! this.decompose
    }
  },
  computed: {
    tracklist: function() {
      var trackstoload = []

      if (this.$route.params.method == 'REF') {
        trackstoload.push(
          { 'name': 'Mixture',
            'customClass': 'mix',
            'solo': true,
            'mute': true,
            'file': [
              this.$route.params.track_id,
              'MIX'
            ].join("_") + '.m4a'
          }
        );

        for (let target of headers.targets) {
          trackstoload.push(
            { 'name': target,
              'customClass': target,
              'solo': false,
              'mute': false,
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
      console.log(trackstoload)
      var filterByMethod = this.data.filter(function(d) {
        return (
          d.track_id == this.$route.params.track_id &&
          d.method_id == headers.methods.indexOf(this.selectedMethod) &&
          d.metric_id == 2
        );
      }.bind(this));

      if ( this.decompose ) {
        trackstoload.push(
          { 'name': 'Mixture',
            'customClass': 'mix',
            'solo': true,
            'mute': true,
            'file': [
              this.$route.params.track_id,
              'MIX'
            ].join("_") + '.m4a'
          }
        );

        for (let track of filterByMethod) {
          trackstoload.push(
            { 'name': headers.targets[track.target_id],
              'customClass': headers.targets[track.target_id],
              'solo': false,
              'mute': false,
              'file': [
                track.track_id,
                headers.methods[track.method_id],
                headers.targets[track.target_id]
              ].join("_") + '.m4a'
            }
          );
        }
      }
      return trackstoload;
    }
  },
  watch: {
    '$route.params.method' : 'updateMethod',
    '$route.params.track_id' : 'updateID',
    'selectedMethod': 'updateURLforMethod',
    'selectedID': 'updateURLforID'
  }
}
</script>

<style>

#d3container {
  margin-top: -1em;
}

.hide {
  opacity: 0;
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
