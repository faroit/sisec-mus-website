<template>
  <div class="hero-body">
      <div class="container">
        <div class="column is-8 is-offset-2">
          <h1 class="title">The DSD100 Dataset</h1>
        </div>
        <div class="columns is-mobile">
          <div class="column is-8 is-offset-2">

The data set consists of a total of 100 full-track songs of different
styles and includes the mixtures and four original sources: </br>

<p><img src="./assets/hero.svg" alt="Description"></p>

The dataset is evenly split divided between a development subset and a test subset.
The <a href="#/Methods">participants</a> are then t
separation function and return the estimated sources and the performance
results, and send us back the performance results

<p>
  The dataset called Demixing Secrets Dataset 100 (DSD100).
  The sources for MSD100 were created from stems downloaded
  from The <a href="http://www.cambridge-mt.com/ms-mtk.htm">
  ‘Mixing Secrets’ Free Multitrack Download Library.</a>
  We would like to thank Mike Senior, not only for giving
  us the permission to use this multitrack material, but also
  for maintaining such resources for the audio community.
</p>

<p>
  The complete dataset (~14 GB) can be downloaded
  <a href="https://infinit.io/_/332Augp">here</a>.
  For testing and development we provide a subset of the DSD100 <a href="https://www.loria.fr/~aliutkus/DSD100subset.zip">here</a>.
  It has the same file and folder structure as well as the same audio
  file formats but consists of only 4 tracks of 30s each.
</p>
<br/>
<h1 class='title'>Listing of all Tracks</h1>
<table class="table">
<thead>
<tr>
  <th>Track ID</th>
  <th>Artist - Title</th>
  <th>Genre</th>
  <th></th>
</tr>
</thead>
<tbody v-for="record in tracklist">
<tr>
  <td>{{record.id}}</td>
  <td>{{record.name}}</td>
  <td>{{record.genre}}</td>
  <td class="is-icon">
    <router-link :to="{ name: 'player', params: { is_dev: record.id > 50 ? 0 : 1, target_id: 0, track_id: record.id, metric_id: '2', method: 'REF' }}">
      <i class="fa fa-play"></i>
    </router-link>
    <button type="button" name="button" v-on:click="play(record.id)">Preview</button>
  </td>
</tr>
</tbody>
</table>

          </div>
        </div>
      </div>
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import * as Howler from 'howler'

export default {
  data: function() {
    return {
      tracklist: null,
      howlerlist: null,
      howler: Object,
    }
  },
  mounted: function() {
    var sprites = {};

    for (track in this.howlerlist) {
      sprites[String(track)] = track.pos;
    }
    console.log(this.howlerlist)
    this.howler = new Howler.Howl({
        preload: false,
        src: ['/data/howler.m4a'],
        sprite: sprites
      });
  },
  created: function () {
    this.fetchHowler();
    this.fetchTracklist();
  },
  methods: {
    play: function(id) {
      this.howler.load().stop().play(String(id))
    },
    fetchTracklist: function () {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', '/data/tracklist.json')
      xhr.onload = function () {
        self.tracklist = JSON.parse(xhr.responseText)
      }
      xhr.send()
    },
    fetchHowler: function () {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', '/data/howler.json')
      xhr.onload = function () {
        self.howlerlist = JSON.parse(xhr.responseText)
      }
      xhr.send()
    }
  }
}
</script>

<style media="screen">
</style>
