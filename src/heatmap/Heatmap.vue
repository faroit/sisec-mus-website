<template>
  <div id="d3container">
    <map-menu></map-menu>
    <svg id='heatmap'></svg>
  </div>
</template>

<script>
import d3 from 'd3'
import MapMenu from './Menu.vue'

export default {
  components: { MapMenu }
}
</script>
