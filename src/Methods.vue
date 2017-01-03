<template>
  <div class="hero-body">
    <table class="table">
      <thead>
        <tr>
          <th>Method</th>
          <th>Authors</th>
          <th>Affiliation</th>
          <th>Mail</th>
          <th>Is Supervised?</th>
          <th>Uses Data-Augmentation</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody v-for="record in json">
      <tr>
        <td data-balloon-length='large' data-balloon-pos="right" :data-balloon="record.description">
          <router-link
            active-class="is-primary"
            :to="{ name: 'method', params: { short: record.short}}"
          >{{record.short}}
          </router-link>
        </td>
        <td>{{record.authors}}</td>
        <td>{{record.affiliation}}</td>
        <td class="is-icon">
          <a v-if="record.email" :href="'mailto:' + record.email">
            <i class="fa fa-envelope-o"></i>
          </a>
        </td>
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
            <i v-bind:class="gh(record.code) ? 'fa fa-github' : 'fa fa-code' "></i>
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
        if( string ) {
          return string.substring(0, value) + '...';
        } else {
          return ''
        }
    },
  },
  mounted: function () {
    this.$http.get('/data/metadata.json').then((response) => { return response.json(); }).then((json) => { this.json = json; });
  },
  methods: {
    gh: function(string) {
        return string.includes('github.com')
    }
  }
}
</script>

<style media="screen">
</style>
