<template>
  <div class="hero-body">
      <div class="container">
        <section>
          <h1 class="title is-2">The DSD100 Dataset</h1>
          <div class="columns">
            <div class="column is-half">
              <img src="./assets/hero.svg" width="512" alt="Description">
            </div>

            <div class="column">
              The Demixing Secrets Dataset 100 (DSD100) consists of a total of
              100 full-track songs of different styles and includes the
              mixtures and four original sources/stems. </br>

              <p>
                The stems for MSD100 were created from sources downloaded
                from the <a href="http://www.cambridge-mt.com/ms-mtk.htm">
                ‘Mixing Secrets’ Free Multitrack Download Library.</a>
                We would like to thank Mike Senior, not only for giving
                us the permission to use this multitrack material, but also
                for maintaining such resources for the audio community.
              </p>
              <p>
                The dataset is evenly split divided between a development
                (<i>Dev</i>) subset and a test (<i>Test</i>) subset. Methods
                that are using supervised learning, do not use the Test data during
                training.
                The <a href="#/Methods">participants</a> are asked to develop a
                separation function and return the estimated sources and the performance
                results, and send us back the performance results.
              </p>
              <p>
                The complete dataset is freely available. For testing we
                provide a small subset of the DSD100.
                It has the same file and folder structure as well as the
                same audio file formats but consists of only 4 tracks of
                30s each.
              </p>
              <br/>
                <div class="block">
                  <a href="http://liutkus.net/DSD100.zip" class="button is-danger is-outlined">Download DSD100 (14 GB)</a>
                  <a href="https://www.loria.fr/~aliutkus/DSD100subset.zip" class="button is-primary is-outlined">Download Subset (120 MB)</a>
                </div>
                <br/>
            </div>
          </div>
        </section>
        <section>
          <h1 class='title'>Listing of all Tracks</h1>
          <table class="table">
            <thead>
            <tr>
              <th>Track ID</th>
              <th>Artist - Title</th>
              <th>Genre</th>
              <th></th>
              <th></th>
            </tr>
            </thead>
            <tbody v-for="record in tracklist">
              <tr>
                <td>{{record.id}}</td>
                <td>{{record.name}}</td>
                <td>{{record.genre}}</td>
                <td class="is-icon playback" v-on:mouseover="play(record.id.toString())" v-on:mouseout="stop()">
                    <span class="icon">
                       <i class="fa fa-volume-up"></i>
                    </span>
                </td>
                <td class="is-icon">
                  <router-link class='button is-info is-outlined' :to="{ name: 'listen', params: { track_id: record.id.toString(), method: 'REF' }}">
                    Decompose
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

        </section>
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
    this.$http.get('/data/tracklist.json').then((response) => { return response.json(); }).then((json) => { this.tracklist = json; });
    this.$http.get('/data/howler.json').then((response) => { return response.json(); }).then((json) => { this.howlerlist = json; });
  },
  methods: {
    play: function(id) {
      this.howler.fade(0, 1, 300).play(id)
    },
    stop: function() {
      this.howler.stop()
    }
  },
  computed: {
    sprites: function() {
      var tmp = {};
      for (let i in this.howlerlist) {
        let track = this.howlerlist[i];
        tmp[track.id.toString()] = track.pos;
      }
      return tmp
    }
  },
  watch: {
    'sprites': function() {
      this.howler = new Howler.Howl({
        preload: true,
        src: ['/data/howler.m4a'],
        sprite: this.sprites
      });
    }
  }
}
</script>

<style media="screen">
.playback:hover {
  color: orange;
}
</style>
