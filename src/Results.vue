<template>
  <div class="hero-body">
    <div class="container">
    <h1 class="title is-2">Objective Evaluation Results</h1>
    <div class="content">
      The participants were asked to provide estimates for the separated targets
      for all mixtures. The quality of these estimates was then evaluated by
      comparison with the true source images using four objective
      performance criteria. For more information about the evaluation metrics see <a href='http://bass-db.gforge.inria.fr/bss_eval/'>BSSeval</a>.
    </div>
    <div class='content  has-text-centered'>
      <div class="card">
        <table class="table">
            <tr>
              <td>SDR</td>
              <td>Signal to Distortion Ratio</td>
            </tr>
            <tr>
              <td>ISR</td>
              <td>Image to Spatial distortion Ratio </td>
            </tr>
            <tr>
              <td>SIR</td>
              <td>Source to Interference Ratio</td>
            </tr>
            <tr>
              <td>SAR</td>
              <td>Sources to Artifacts Ratio</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="content">
      <p>In the following we present boxplots of all tracks grouped by
        <strong>target source</strong>, <strong>Metric</strong> and
        <strong>Subset (Test/Train)</strong>
      </p>
    </div>
      <section>
        <div class="container">
          <h1 class='title'>Vocals</h1>
          <img src="./assets/vocals.png" alt="Description">
        </div>
      </section>
      <section>
        <h1 class='title'>Accompaniment</h1>
        <img src="./assets/accompaniment.png" alt="Description">
      </section>
      <section>
        <h1 class='title'>Drums</h1>
        <img src="./assets/drums.png" alt="Description">
      </section>
      <section>
        <h1 class='title'>Bass</h1>
        <img src="./assets/bass.png" alt="Description">
      </section>
      <section>
        <h1 class='title'>Other</h1>
        <img src="./assets/other.png" alt="Description">
      </section>
  </div>
</div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';

export default {
  data: function() {
    return {
      json: null
    }
  },
  filters: {
    truncate: function(string, value) {
      	return string.substring(0, value) + '...';
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', '/data/metadata.json')
      xhr.onload = function () {
        self.json = JSON.parse(xhr.responseText)
        console.log(self.json[0])
      }
      xhr.send()
    }
  }
}
</script>

<style media="screen">
</style>
