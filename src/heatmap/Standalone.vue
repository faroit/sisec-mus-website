<template>
  <section>
      <div class="columns">
        <div class="column is-narrow">
          <div class="control-label">
            <label id='track-label' class="label">Selected Track</label>
          </div>
          <p class="control has-addons has-addons-centered">
            <a  v-on:click="changeTrack(-1)" class="button">
              <span class="fa fa-minus"></span>
            </a>
            <span class="select">
              <select v-model="selectedID">
                <option v-for="track in availableIDs" v-bind:value="track.id">
                  {{ track.id }}
                </option>
              </select>
            </span>
        <a v-on:click="changeTrack(1)" class="button">
          <span class="fa fa-plus"></span>
        </a>
      </p>
        </div>
        <div class="column is-narrow">
          <div class="control-label">
            <label class="label">Method</label>
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
            <player :urls="tracklist" :title="title" :method='method'></player>
        </div>
      </div>
    </transition>
    <method :short='selectedMethod'></method>
  </section>
</template>

<script>
import * as d3 from 'd3'
import Player from './Player.vue'
import Method from '../Method.vue'
import plot from './render.js'
import store from '../store.js'
import headers from './headers.js'
import balloon from 'balloon-css/balloon.css';

import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'

export default {
  components: {
    Selection, Player, ScaleLoader, Method
  },
  data: function() {
    return {
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
    this.availableMethods.push(
      {
        'name': 'REF'
      }
    );
    for (let method of headers.methods) {
      this.availableMethods.push(
        {
          'name': method
        }
      );
    };
    this.selectedMethod = this.$route.params.method
    this.selectedID = this.$route.params.track_id
  },
  updated: function() {
    this.isLoading = false;
  },
  mounted: function() {
    d3.csv("/data/sisec_mus_2017.csv", function(data) {this.data = data}.bind(this));
    this.$http.get('/data/tracklist.json').then((response) => { return response.json(); }).then((json) => {
      for (let track of json) {
        this.availableIDs.push(
          {
            'id': track.id,
            'title': track.name
          }
        );
      };
    });
  },
  methods: {
    changeTrack: function(add) {
      for (let track of this.availableIDs) {
        if (track.id == parseInt(this.selectedID) + add) {
          this.selectedID = parseInt(this.selectedID) + add
          return true
        }
      }
    },
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
      this.decompose =! this.decompose
    }
  },
  computed: {
    title: function() {
      for (let track of this.availableIDs) {
        if (track.id == this.selectedID) {
          return track.title;
        }
      }
    },
    method: function() {
      for (let method of this.availableMethods) {
        if (method.name == this.selectedMethod) {
          return method.name;
        }
      }
    },
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
      }
      else {
        var filterByMethod = this.data.filter(function(d) {
          return (
            d.track_id == this.$route.params.track_id &&
            d.method_id == headers.methods.indexOf(this.selectedMethod) &&
            d.metric_id == 2
          );
        }.bind(this));

        if(!filterByMethod.length) {
          return [];
        }

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
