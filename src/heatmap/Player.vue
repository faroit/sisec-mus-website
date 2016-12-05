<template>
  <div>
    <h1 class="title">Playback Method <em>{{ this.$route.params.method }}</em>, Track {{ this.$route.params.track_id }}</h1>.
    <span class="control has-addons">
      <a class="button is-success"
        v-bind:class="{ 'is-active': isPlaying }"
        v-on:click='playpause'><icon v-bind:name="isPlaying ? 'pause' : 'play' "></icon>
      </a>
      <a class="button is-light" v-on:click='stop'><icon name="stop"></icon></a>
    </span>
    <div id="playlist"></div>
    <div class="sound-status"></div>
    <div class="loading-data"></div>
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import Icon from 'vue-awesome/components/Icon.vue'
import 'vue-awesome/icons'

import * as WaveformPlaylist from 'waveform-playlist'
import * as player from './player.js'

export default {
  components: {
    Icon
  },
  props: {
    urls: Array
  },
  mounted: function() {
    player.init();
    player.loadTargets(this.urls);
    player.playlist.getEventEmitter().on('finished', this.stop )
  },
  data: function () {
    return {
      isPlaying: false
    }
  },
  methods: {
    update: function() {
      player.loadTargets(this.urls);
    },
    playpause: function() {
      if (this.isPlaying) {
        player.playlist.getEventEmitter().emit('pause')
      }
      else {
        player.playlist.getEventEmitter().emit('play')
      }
      this.isPlaying = ! this.isPlaying
    },
    stop: function() {
      player.playlist.getEventEmitter().emit('stop')
      this.isPlaying = false
    }
  },
  watch: {
    'urls': 'update'
  }
}
</script>

<style media="screen">
.playlist {
  margin: 2em 0; }
  .playlist .playlist-time-scale {
    height: 30px; }
  .playlist .playlist-tracks {
    background: #E0EFF1; }
  .playlist .channel {
    background: grey; }
  .playlist .channel-progress {
    background: orange; }
  .playlist .cursor {
    background: black; }
  .playlist .wp-fade {
    background-color: rgba(0, 0, 0, 0.1); }
  .playlist .state-cursor,
  .playlist .state-select {
    cursor: text; }
  .playlist .state-fadein {
    cursor: w-resize; }
  .playlist .state-fadeout {
    cursor: e-resize; }
  .playlist .state-shift {
    cursor: ew-resize; }
  .playlist .selection.point {
    background: red; }
  .playlist .selection.segment {
    background: rgba(0, 0, 0, 0.1); }
  .playlist .channel-wrapper.silent .channel {
    opacity: 0.3; }
  .playlist .controls {
    background: white;
    text-align: center; }
    .playlist .controls header {
      overflow: hidden;
      color: white;
      background-color: blueviolet;
      margin-bottom: 1em;
      height: 20px; }
    .playlist .controls label {
      margin: 1em auto;
      width: 100%;
      display: inline-block;
      font: normal normal normal 14px/1 FontAwesome;
      font-size: inherit;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transform: translate(0, 0); }
    .playlist .controls label:before {
      content: "\f027";
      color: black;
      font-size: 18px;
      padding-right: 5px;
      -moz-osx-font-smoothing: grayscale; }
    .playlist .controls label:after {
      content: "\f028";
      color: black;
      font-size: 18px;
      padding-left: 5px; }
    .playlist .controls input[type=range] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: inline-block;
      width: 75%; }
    .playlist .controls input[type=range]::-webkit-slider-runnable-track {
      height: 8px;
      background: #ddd;
      border: none;
      border-radius: 3px;
      padding: 1px; }
    .playlist .controls input[type=range]::-moz-range-track {
      height: 8px;
      background: #ddd;
      border: none;
      border-radius: 3px;
      padding: 1px; }
    .playlist .controls input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: goldenrod;
      margin-top: -5px;
      cursor: ew-resize; }
    .playlist .controls input[type=range]::-moz-range-thumb {
      border: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: goldenrod;
      margin-top: -5px;
      cursor: ew-resize; }
    .playlist .controls input[type=range]:focus {
      outline: none; }
    .playlist .controls input[type=range]:focus::-webkit-slider-runnable-track {
      background: #ccc; }
    .playlist .controls input[type=range]:focus::-moz-range-track {
      background: #ccc; }

</style>
