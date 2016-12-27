<template>
  <div class="hero-body">
    <table class="table">
  <thead>
    <tr>
      <th>Method Shortname</th>
      <th>Authors</th>
      <th>Affiliation</th>
      <th>Supervised Method</th>
      <th>Uses Data-Augmentation</th>
      <th>Code</th>
      <th>More</th>
    </tr>
  </thead>
  <tbody>
  <tr v-for="record in json">
    <td>{{record.short}}</td>
    <td>{{record.authors}}</td>
    <td>{{record.affiliation}}</td>
    <td class="is-icon">
      <span v-if="record.is_supervised">
        <i class="fa fa-check"></i>
      </span>
    </td>
    <td class="is-icon">
      <span v-if="record.uses_augmentation">
        <i class="fa fa-check"></i>
      </span>
    </td>
    <td class="is-icon">
      <a v-if="record.code" :href="record.code">
        <i class="fa fa-code"></i>
      </a>
    </td>
    <td class="is-icon">
      <a v-if="record.references" :href="record.code">
        <i class="fa fa-eye"></i>
      </a>
    </td>
  </tr>
  </tbody>
</table>
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
