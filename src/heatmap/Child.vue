<template>
  <div class="columns">
    Show the player {{ data }}
  </div>
</template>

<script>
import bulma from 'bulma/css/bulma.css';
import headers from './headers.js'

export default {
  props: {
    data: Object
  },
  mounted: function() {
    
  },
}
</script>

<style media="screen">

</style>
