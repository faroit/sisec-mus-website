import * as d3 from 'd3';
import headers from './headers.js'

var margin = {}
var width = 0, h = 0, w = 0, gridSize = 0, height = 0
var colorLow = {}, colorMed = {}, colorHigh = {}, colorScale = {}
var svg = {}, g = {}, tooltip = {}


function init() {
  // height of each row in the heatmap
  // width of each column in the heatmap
  margin = {top: 50, right: 0, bottom: 30, left: 50},
    width = parseInt(d3.select("#heatmap").style("width")) - margin.left - margin.right;

  // grid is defined by maximum number of tracks = 50
  gridSize = width / 50,
    h = gridSize,
    w = gridSize,

  // height is defined by maximum number of methods
  height = gridSize * headers.methods.length;

  // Set color scale
  // TODO: make this dependent on min and mix of data.score
  // TODO: Also mage this log scales (d3.scaleLog does only allow neg. or pos. values)
  // TODO: Also defined a custom color scheme for each target
  colorLow = '#FFFFDD', colorMed = '#3E9583', colorHigh = '#1F2F86';
  colorScale = d3.scaleLinear()
   .domain([-10, 2, 28])
   .range([colorLow, colorMed, colorHigh]);

  // Create svg element
  svg = d3.select("#heatmap")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  g = svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create HUD element that displays information about currently selected data
  tooltip = d3.select(".columns")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // load data in init function
  d3.csv("/data/data.csv", draw);
}

// plot the actual score rectangles row-wise for each track column
function rect(data) {
  var data = data.values;

  // Bind data to rectangles
  var heatmap = d3.select(this).selectAll("rect")
    .data(data);

  // Draw rectangles here
  // render only as many rows as there are methods (using array length instead of data)
  heatmap.enter().append("rect")
      .attr("width", function(d) { return w; })
      .attr("height", function(d) { return h; })
    .merge(heatmap)
      // shift them for numbers of rows available
      .attr("y", function(d, i) { return (i - 1) * h; })
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
           "<br/>" + headers.metrics[d.metric] + ': ' + d.score +
           "<br/>" + headers.targets[d.target_name]
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

// Update callback: Filters data and displays updated data
// TODO: aggregrates data and show means as well
// TODO: Add sort based on mean, so that better methods appears on top
// TODO: Make IBM render on top in any case. Add spacing for IBM
function update(data) {
  // read https://bost.ocks.org/mike/join/ to understand the concept of update and enter

  // group by track_id
  var tracks = d3.nest()
    .key(function(d) { return d.track_id; })
    .entries(data);

  // group by method_name (=estimate_name)
  var methods = d3.nest()
    .key(function(d) { return d.estimate_name; })
    .entries(data);

  // bind data to class
  var track_column = g.selectAll("g")
    .data(tracks);

  var method_label = svg.selectAll("text.method_label")
    .data(methods);

  // render method axis labels
  method_label.enter()
      .append("text")
      .attr("class", "method_label")
    .merge(method_label)
      .text(function(d) { return headers.methods[d.key]})
      .attr("x", 45)
      .attr("y", function(d, i) { return (i + 2) * h - 3; })
      .style("text-anchor", "end");

  // remove method labels
  method_label.exit()
    .remove();

  // render actual column data (=tracks) into group elements
  var track_column_enter = track_column.enter()
    .append("g")
    .merge(track_column)

  track_column_enter
    .append("text")
    .attr("class", "track_label")
    .attr("y", -28)
    .style("text-anchor", "start");

  track_column_enter.select("text")
    .text(function(d) { return d.key });

  track_column_enter
      .on("click", function(dclick) {
        // // render new site that displays more detailed track information
        // update(data.filter(function(d) {
        //   return d.track_id == dclick.key;
        // }));
      })
      .on("mouseover", function(dclick) {
        // d3.selectAll(".track").classed("active", function(d) { return d.key == dclick.key; });
        d3.selectAll(".grid .track_label").classed("active", function(d) { return d.key == dclick.key; });
        d3.selectAll(".grid .method_label").classed("active", function(d) { return d.key == dclick.key; });
        // d3.selectAll(".track:not(.active) rect").attr("width", function(d, i) { return "5"; });
      })
      .attr("transform", function(d, i) { return "translate(" + i * w + ", 0)"; })
      .each(rect);

  track_column.exit()
    .remove();
}

// encapsulate init data
function draw(data) {
  update(data.filter(function(d) {
    return d.target_name == 2 && d.metric == 2 && d.track_id >= 51;
  }));
  setTimeout(function () {
    update(data.filter(function(d) {
      return d.target_name == 0 && d.metric == 2 && d.track_id < 20;
    }));
  }, 1000);
}

export default init;
