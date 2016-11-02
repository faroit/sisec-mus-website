// height of each row in the heatmap
// width of each column in the heatmap
var margin = {top: 50, right: 0, bottom: 30, left: 50},
  width = parseInt(d3.select("#heatmap").style("width")) - margin.left - margin.right;

// grid is defined by maximum number of tracks = 50
var gridSize = width / 50,
  h = gridSize,
  w = gridSize,

// height is defined by maximum number of methods
height = gridSize * headers.methods.length;

// Set color scale
// TODO: make this dependent on min and mix of data.score
// TODO: Also mage this log scales (d3.scaleLog does only allow neg. or pos. values)
// TODO: Also defined a custom color scheme for each target
var colorLow = '#FFFFDD', colorMed = '#3E9583', colorHigh = '#1F2F86';
var colorScale = d3.scaleLinear()
 .domain([-10, 2, 28])
 .range([colorLow, colorMed, colorHigh]);

// Create svg element
var svg = d3.select("#heatmap")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var g = svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create HUD element that displays information about currently selected data
var tooltip = d3.select(".columns")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// load data in init function
d3.csv("/data/data.csv", init);

// plot the actual score rectangles row-wise for each track column
function rect(data) {
  var data = data.values;

  // Bind data to rectangles
  var heatmap = d3.select(this).selectAll("rect")
    .data(data, function(d) { return d.estimate_name; });

  // Draw rectangles here
  // render only as many rows as there are methods (using array length instead of data)
  heatmap.enter().append("rect")
    .attr("width", function(d) { return w; })
    .attr("height", function(d) { return h; })
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
  var t = d3.transition()
    .duration(950);
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
    .data(tracks, function(d) { return d.key; });

  var method_label = svg.selectAll("text.method_label")
    .data(methods, function(d) { return d.key; });

  // update method_label
  method_label
      .text(function(d) { return headers.methods[d.key]})
      .transition(t)
      .attr("y", function(d, i) { return (i + 2) * h - 3; })

  // exit method_label
  method_label.enter()
      .append("text")
      .attr("class", "method_label")
      .attr("x", 45)
      .style("text-anchor", "end")
      .text(function(d) { return headers.methods[d.key]})
      .attr("y", function(d, i) { return (i + 2) * h - 3; })
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
    .attr("transform", function(d, i) { return "translate(" + i * w + ", 0)"; })
    .each(rect);

  // render actual column data (=tracks) into group elements
  var track_column_enter = track_column.enter()
    .append("g")

  track_column_enter.append("text")
    .attr("class", "track_label")
    .attr("y", -28)
    .style("text-anchor", "start")
    .text(function(d) { return d.key });

  track_column.select("text")
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
    .attr("transform", function(d, i) { return "translate(" + i * w + ", -1000)"; })
    .style("fill-opacity", 1e-6)
    .transition(t)
    .attr("transform", function(d, i) { return "translate(" + i * w + ", 0)"; })
    .style("fill-opacity", 1)
    .each(rect);

  track_column.exit()
    .transition(t)
    .style("fill-opacity", 1e-6)
    .attr("transform", function(d, i) { return "translate(" + i * w + ", 1000)"; })
    .remove();
}

// encapsulate init data
function init(data) {
  update(data.filter(function(d) {
    return d.target_name == 2 && d.metric == 2 && d.track_id >= 31;
  }));
  setInterval(function () {
    var randval = Math.random() * 100;
    var randval2 = Math.random() * 100;
    var randmin = Math.min(randval, randval2);
    var randmax = Math.max(randval, randval2);
    update(data.filter(function(d) {
      return d.target_name == 2 && d.metric == 2 && d.track_id >= randmin && d.track_id < randmax;
    }));
  }, 5000);
}
