// height of each row in the heatmap
// width of each column in the heatmap

var legendWidth = 20;

var margin = {top: 50, right: 20, bottom: 30, left: 50},
  width = parseInt(d3.select("#d3container").style("width")) - legendWidth - margin.left - margin.right;

// grid is defined by maximum number of tracks = 50
var gridSize = width / 50,
  h = gridSize,
  w = gridSize,
  height = gridSize * headers.methods.length;   // height is defined by maximum number of methods


var method_scale = d3.scaleBand()
    .round(1)
    .range([0, height]);

var track_scale = d3.scaleBand()
    .round(1)
    .range([0, width]);

// Set color scale
// TODO: make this dependent on min and mix of data.score
// TODO: Also mage this log scales (d3.scaleLog does only allow neg. or pos. values)
// TODO: Also defined a custom color scheme for each target

var colorLow = '#FFFFDD', colorMed = '#3E9583', colorHigh = '#1F2F86';

var colorScale = d3.scaleLinear()
  .range([colorLow, colorMed, colorHigh]);

// Create svg element
var svg = d3.select("#d3container #heatmap")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

// add the legend now
var legendFullHeight = height;
var legendFullWidth = legendWidth;

var legendMargin = { top: 20, bottom: 20, left: 5, right: 20 };

// use same margins as main plot
var legendWidth = legendFullWidth - legendMargin.left - legendMargin.right;
var legendHeight = legendFullHeight - legendMargin.top - legendMargin.bottom;

var legendSvg = d3.select('#legend')
    .attr('width', legendFullWidth)
    .attr('height', legendFullHeight)
    .append('g')
    .attr('transform', 'translate(' + legendMargin.left + ',' +
    legendMargin.top + ')');

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

  var t = d3.transition()
    .duration(950);

  // Bind data to rectangles
  var heatmap = d3.select(this).selectAll("rect")
    .data(data.value.payload, function(d) { return d.estimate_name; });

  // Draw rectangles here
  // render only as many rows as there are methods (using array length instead of data)
  heatmap
    .transition(t)
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
         "<br/>" + headers.metrics[d.metric] + ': ' + d.score +
         "<br/>Mean" + data.value.meanScoreByTrack +
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
function update(data) {
  var t = d3.transition()
    .duration(950);
  // read https://bost.ocks.org/mike/join/ to understand the concept of update and enter

  colorScale.domain([
    d3.min(data, function(d) { return parseInt(d.score); }),
    0,
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
  method_scale.domain(methods.map(function(d) { return headers.methods[d.key]; }));
  method_scale.range([0, height]);

  svg.transition(t).attr("height", height)

  track_scale.domain(d3.values(tracks).map(function(d) {
    return d.key;
  }));

  // bind data to class
  var track_column = g.selectAll("g")
    .data(tracks, function(d) { return [d.key, d.value.payload[0].target_name, d.value.payload[0].metric] });

  var method_label = svg.selectAll("text.method_label")
    .data(methods, function(d) { return d.key; });

  // update method_label
  method_label
      .text(function(d) { return headers.methods[d.key]})
      .style("alignment-baseline", "middle")
      .attr("dy", 63)
      .transition(t)
      .attr("y", function(d) { return method_scale(headers.methods[d.key]); })

  // exit method_label
  method_label.enter()
      .append("text")
      .attr("class", "method_label")
      .classed("oracle", function(d) { return d.value.isOracle == true; })
      .attr("x", 50)
      .style("text-anchor", "end")
      .style("alignment-baseline", "middle")
      .text(function(d) { return headers.methods[d.key]})
      .attr("y", function(d) { return method_scale(headers.methods[d.key]); })
      .attr("height", method_scale.bandwidth())
      .attr("dy", 63)
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
    .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    .each(rect);

  // render actual column data (=tracks) into group elements
  var track_column_enter = track_column.enter()
    .append("g")

  track_column_enter.append("text")
    .attr("class", "track_label")
    .style("text-anchor", "middle")
    .attr("y", -16)
    .attr("x", 12)
    .text(function(d) { return d.key });

  track_column.select("text")
    .style("text-anchor", "middle")
    .attr("x", 12)
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
      d3.selectAll(".grid .track_label").
        classed("active", function(d) { return d.key == dclick.key; });
      d3.selectAll(".grid .method_label").classed("active", function(d) { return d.key == dclick.key; });
      d3.selectAll(".track:not(.active) rect").attr("width", function(d, i) { return "5"; });
    })
    .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", -1000)"; })
    .style("fill-opacity", 1e-6)
    .transition(t)
    .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    .style("fill-opacity", 1)
    .each(rect);

  track_column.exit()
    .transition(t)
    .style("fill-opacity", 1e-6)
    // .attr("transform", function(d, i) { return "translate(0, 1000)"; })
    .remove();

  d3.selectAll(".oracle").attr("transform", "translate(0, -10)");
}

// encapsulate init data
function init(data) {
  update(data.filter(function(d) {
    return d.target_name == 0 && d.metric == 0 && d.track_id <= 51;
  }));
  // setInterval(function () {
  //   var randval = Math.random() * 50;
  //   var randval2 = Math.random() * 50;
  //   var randmin = Math.min(randval, randval2);
  //   var randmax = Math.max(randval, randval2);
  //   var randtarget = Math.floor(Math.random() * 4);
  //   update(data.filter(function(d) {
  //     return d.target_name == randtarget && d.metric == 0 && randmin < d.track_id && d.track_id <= randmax;
  //   }));
  // }, 5000);
}
