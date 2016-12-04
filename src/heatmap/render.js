import * as d3 from 'd3';
import headers from './headers.js'

var margin
var gridSize
var method_scale
var track_scale
var colorHigh
var colorLow
var colorScale
var svg
var defs
var linearGradient
var g
var tooltip
var width
var height
var h
var w
var svgLegend
var svgLegendRect

function init() {
  margin = {top: 50, right: 100, bottom: 30, left: 50},
    width = parseInt(d3.select("#d3container").style("width")) - margin.left - margin.right;

  // grid is defined by maximum number of tracks = 50
  gridSize = width / 50,
    h = gridSize,
    w = gridSize,
    height = gridSize * headers.methods.length;   // height is defined by maximum number of methods


  method_scale = d3.scaleBand()
      .round(1)
      .range([0, height]);

  track_scale = d3.scaleBand()
      .round(1)
      .range([0, width]);

  // Set color scale
  colorLow = '#FFFFDD', colorHigh = '#1F2F86';

  colorScale = d3.scaleLinear()
    .range([colorLow, colorHigh]);

  // Create svg element
  svg = d3.select("#d3container #heatmap")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  //Append a defs (for definition) element to your SVG
  defs = svg.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

  //Vertical gradient
  linearGradient
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

  //Set the color for the start (0%)
  linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorLow);

  //Set the color for the end (100%)
  linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorHigh);

  g = svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svgLegend = g.append('g')
    .attr("class", "legend")
    .attr("transform", "translate("+ (d3.max(track_scale.range()) + gridSize + gridSize) + ", 0)");

  svgLegendRect = svgLegend.append("rect")
    .attr("width", gridSize)
    .attr("transform", "translate("+ (- gridSize) + ", 0)")
    .style("fill", "url(#linear-gradient)");

  // Create HUD element that displays information about currently selected data
  tooltip = d3.select(".columns")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

// plot the actual score rectangles row-wise for each track column
function rect(data) {

  // Bind data to rectangles
  var heatmap = d3.select(this).selectAll("rect")
    .data(data.value.payload, function(d) { return d.estimate_name; });

  // Draw rectangles here
  // render only as many rows as there are methods (using array length instead of data)
  heatmap
    .attr("width", function(d) { return track_scale.bandwidth(); })
    .attr("height", function(d) { return method_scale.bandwidth(); })
    .attr("y", function(d) { return method_scale(headers.methods[d.estimate_name]); });

  heatmap.enter().append("rect")
    .classed("oracle", function(d) { return d.estimate_name == "6"; })
    .attr("width", function(d) { return track_scale.bandwidth(); })
    .attr("height", function(d) { return method_scale.bandwidth(); })
    // shift them for numbers of rows available
    .attr("y", function(d) { return method_scale(headers.methods[d.estimate_name]); })
    // fill with defined colorscale
    .style("fill", function(d) { return colorScale(d.score); })
    // render tooltip data
    .on("mouseover", function(d) {
       tooltip.transition()
         .duration(200)
         .style("opacity", .9);
       tooltip.html(
         "Track: "  + d.track_id +
         "<br/>Method: " + headers.methods[d.estimate_name] +
         "<br/>" + headers.metrics[d.metric] + ': ' + d.score
       )
       d3.selectAll(".method_label").classed("active", function(x) { return d.estimate_name == x.key; });
      })
     .on("mouseout", function(d) {
         tooltip.transition()
           .duration(200)
           .style("opacity", 0);
      });

    // delete rectangles
    heatmap.exit().remove();

}

function update(data) {
  var t = d3.transition()
    .duration(500);
  // read https://bost.ocks.org/mike/join/ to understand the concept of update and enter

  colorScale.domain([
    d3.min(data, function(d) { return parseInt(d.score); }),
    d3.max(data, function(d) { return parseInt(d.score); })
  ]);

  // group by track_id
  var tracks = d3.nest()
    .key(function(d) { return d.track_id; })
    .rollup(function(v) { return {
        meanScoreByTrack: d3.median(v, function(d) { return d.score; }),
        payload: v
      };
    })
    .entries(data);

  tracks.sort(function(a, b) { return d3.ascending(parseInt(a.key), parseInt(b.key)); });

  // group by method_name (=estimate_name)
  var methods = d3.nest()
    .key(function(d) { return d.estimate_name; })
    .rollup(function(v) { return {
        meanScoreByMethod: d3.median(v, function(d) { return d.score; }),
        isOracle: v[0].estimate_name == "6",
        payload: v
      };
    })
    .entries(data);

  // sort alphabetically
  methods.sort(function(a, b) {
    return d3.ascending(headers.methods[a.key], headers.methods[b.key]);
  }).sort(function(a, b) {
    return d3.descending(+a.value.isOracle, +b.value.isOracle);
  });
  // // sort by mean
  // methods.sort(function(a, b) {
  //   return d3.ascending(a.value.meanScoreByMethod, b.value.meanScoreByMethod);
  // });

  height = gridSize * methods.length;   // height is defined by maximum number of methods

  method_scale
    .domain(methods.map(function(d) { return headers.methods[d.key]; }))
    .range([0, height]);

  svg.transition(t).attr("height", height + 3 * gridSize)

  track_scale.domain(d3.values(tracks).map(function(d) {
    return d.key;
  }));

  var method_label = svg.selectAll("text.method_label")
    .data(methods, function(d) { return d.key; });

  // bind data to class
  var track_column = g.selectAll("g.track")
    .data(tracks, function(d) { return [d.key, d.value.payload[0].target_name, d.value.payload[0].metric] });

  // update method_label
  method_label
    .text(function(d) { return headers.methods[d.key]})
    .style("alignment-baseline", "middle")
    .style("font-size", .66 * gridSize + "px")
    .attr("dx", 48)
    .attr("dy", 62)
    .transition(t)
    .attr("y", function(d) { return method_scale(headers.methods[d.key]); })

  // exit method_label
  method_label.enter()
    .append("text")
    .attr("class", "method_label")
    .classed("oracle", function(d) { return d.value.isOracle == true; })
    .attr("dx", 48)
    .attr("dy", 62)
    .style("font-size", .66 * gridSize + "px")
    .style("text-anchor", "end")
    .style("alignment-baseline", "middle")
    .text(function(d) { return headers.methods[d.key]})
    .attr("y", function(d) { return method_scale(headers.methods[d.key]); })
    .attr("height", method_scale.bandwidth())
    .style("fill-opacity", 1e-6)
    .transition(t)
    .style("fill-opacity", 1);

  // remove method_label
  method_label.exit()
    .transition(t)
    .style("fill-opacity", 1e-6)
    .remove();

  track_column
    .transition(t)
    // .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    .each(rect);

  // render actual column data (=tracks) into group elements
  var track_column_enter = track_column.enter()
    .append("g")
    .attr("class", "track")

  track_column_enter.append("text")
    .attr("class", "track_label")
    .style("text-anchor", "start")
    .style("font-size", .66 * gridSize + "px")
    .attr("y", - (.66 * gridSize))
    .attr("x", 3)
    .text(function(d) { return d.key });

  track_column.select("text")
    .style("text-anchor", "start")
    .attr("y", - (.66 * gridSize))
    .attr("x", 3)
    .text(function(d) { return d.key });

  track_column_enter
    .on("click", function(dclick) {
      // render new site that displays more detailed track information
      update(data.filter(function(d) {
        return d.track_id == dclick.key;
      }));
    })
    .on("mouseover", function(dclick) {
      d3.selectAll(".grid .track_label").
        classed("active", function(d) { return d.key == dclick.key; });
    })
    .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    // .style("fill-opacity", 1e-6)
    // .transition(t)
    // // .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    // .style("fill-opacity", 1)
    .each(rect);

  track_column.exit()
    .transition(t)
    .style("fill-opacity", 1e-6)
    // .attr("transform", function(d, i) { return "translate(0, 1000)"; })
    .remove();

  d3.selectAll(".oracle").attr("transform", "translate(0, -10)");

  var legend = svg.select('g.legend');

  var legendRect = legend.select('rect');

  legendRect
    .attr("y", d3.extent(method_scale.range())[0] - 10)
    .attr("height", d3.extent(method_scale.range())[1] + 10);

  var yScale = d3.scaleLinear()
  	 .range([parseInt(svgLegendRect.attr('height')) - 10, parseInt(svgLegendRect.attr('y'))])
  	 .domain(colorScale.domain());

  //Define x-axis
  var yAxis = d3.axisRight()
  	  .ticks(10)
  	  .scale(yScale);

  //Set up X axis
  legend
    .call(yAxis);
}

export default { init, update }
