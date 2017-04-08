<template>
  <section>
    <h1 class="title is-2">Objective Evaluation Results</h1>
    <div class="content">
      The participants were asked to provide estimates for the separated targets
      for all mixtures. The quality of these estimates was then evaluated by
      comparison with the true source images using four objective
      performance criteria. For more information about the evaluation metrics see <a href='http://bass-db.gforge.inria.fr/bss_eval/'>BSSeval</a>.
    </div>
    <div class="notification subtitle">
      The <b>heatmap</b> below shows the result for each audio track and each submitted method.
      You can use the selections below the heatmap to filter the results by <b>target source</b>, <b>metric</b> or if the track belongs to the <b>test or train data</b>.
      </p></p>
        You can click on each rectangle to open the multitrack player. For details about the selected method, click on the "Show Details" button below the player.
    </div>
      <span><scale-loader :color="loaderColor" :size="loaderHeight" :loading="isLoading"></scale-loader></span>
      <div id="d3container" v-bind:class="{ 'hide': isLoading }" data-balloon="Click on any square to start playback" data-balloon-pos="top" >
        <svg id='heatmap'width="900" height="300"></svg>
        <div id='tracktip'></div>
        <div id='methodtip'></div>
        <div id='tracktiph'></div>
        <div id='methodtiph'></div>
      </div>
      <map-menu></map-menu>
    <transition name="slide-fade">
      <div v-if="tracklist.length > 0">
          <div class="container">
            <player :urls="tracklist" :title="title" :method='method'></player>
          </div>
          <div class='column has-text-right'>
            <router-link class='button is-danger' :to="{ name: 'listen', params: { track_id: this.$route.params.track_id, method: this.$route.params.method }}">
              Show details
            </router-link>
          </div>
      </div>
    </transition>
    <div>
      <a href="https://sisec17.audiolabs-erlangen.de/data/sisec_mus_2017_full.csv" class="button is-danger is-outlined">Download all results as CSV</a>
    </div>

  </div>

  </section>

</template>

<script>
import * as d3 from 'd3'
import MapMenu from './Menu.vue'
import Player from '../player/Player.vue'
import plot from './heatmap.js'
import store from '../store.js'
import headers from '../headers.js'
import balloon from 'balloon-css/balloon.css';

import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'

export default {
  components: {
    MapMenu, Player, ScaleLoader
  },
  data: function() {
    return {
      data: [],
      isLoading: true,
      loaderColor: 'orange',
      loaderHeight: '26px',
      availableIDs: [],
    }
  },
  created: function() {
    this.isLoading = true;
  },
  beforeUpdate: function() {
    this.isLoading = false;
  },
  mounted: function() {
    plot.setRoute(
        this.$route.params.is_dev,
        this.$route.params.target_id,
        this.$route.params.metric_id,
        this.$route.params.track_id,
        this.$route.params.method
    );
    plot.init();
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
    update: function() {
      plot.setRoute(
          this.$route.params.is_dev,
          this.$route.params.target_id,
          this.$route.params.metric_id,
          this.$route.params.track_id,
          this.$route.params.method
      );
      plot.update(this.subset);
    },
  },
  computed: {
    title: function() {
      for (let track of this.availableIDs) {
        if (track.id == this.$route.params.track_id) {
          return track.title;
        }
      }
    },
    method: function() {
      return this.$route.params.method
    },
    subset: function() {
      return this.data.filter(function(d) {
        return (
          d.target_id == this.$route.params.target_id &&
          d.metric_id == this.$route.params.metric_id &&
          d.is_dev == this.$route.params.is_dev
        );
      }.bind(this));
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
            'customClass': track.method_id
          }
        );
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
      return trackstoload;
    }
  },
  watch: {
    'data': 'update',
    '$route.params.is_dev': 'update',
    '$route.params.target_id': 'update',
    '$route.params.metric_id': 'update',
    '$route.params.method' : 'update',
    '$route.params.track_id' : 'update'
  }
}
</script>

<style>

#d3container {
  margin-top: 0em;
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
