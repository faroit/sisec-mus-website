import * as d3 from 'd3';
import headers from '../headers.js'

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
var tracktip
var methodtip
var tracktiph
var methodtiph
var width
var height
var h
var w
var svgLegend
var svgLegendRect
var svgLegendText
var lgstop1
var lgstop2

var current_target_id
var current_metric_id
var current_is_dev
var current_play_track_id
var current_play_method

var colors
var basecolor

function setRoute(
    is_dev,
    target_id,
    metric_id,
    play_track_id = undefined,
    play_method = undefined
) {
  current_is_dev = is_dev;
  current_target_id = target_id;
  current_metric_id = metric_id;
  current_play_track_id = play_track_id;
  current_play_method = play_method;
};

function init() {
  colors = {
    vocals: '#56B4E9',
    drums: '#009E73',
    bass: '#D55E00',
    other: '#CC79A7',
    accompaniment: '#818181'
  };

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
  lgstop1 = linearGradient.append("stop")
        .attr("offset", "0%");

    //Set the color for the end (100%)
  lgstop2 = linearGradient.append("stop")
        .attr("offset", "100%");

  g = svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g.append("text")
    .attr("class", "xlabel")
    .attr("transform", "translate(" + ((width / 2) - 20) + ", -34)")
    .attr("style", "font-size: 18")
    .text('Audio Track');

  svgLegend = g.append('g')
    .attr("class", "legend")
    .attr("transform", "translate("+ (d3.max(track_scale.range()) + gridSize + gridSize) + ", 0)");

  svgLegendText = svgLegend.append("text")
      .style("fill", "black");

  svgLegendRect = svgLegend.append("rect")
    .attr("width", gridSize)
    .attr("transform", "translate("+ (- gridSize) + ", 0)");

  // Create HUD element that displays information about currently selected data
  tooltip = d3.select(".columns")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  tracktip = d3.select("#tracktip")
    .style("opacity", 0);

  methodtip = d3.select("#methodtip")
    .style("opacity", 0);

  tracktiph = d3.select("#tracktiph")
    .style("opacity", 0);

  methodtiph = d3.select("#methodtiph")
    .style("opacity", 0);

}

// plot the actual score rectangles row-wise for each track column
function rect(data) {

  // Bind data to rectangles
  var heatmap = d3.select(this).selectAll("rect_group")
    .data(data.value.payload, function(d) { return d.method_id; });

  // Draw rectangles here
  // render only as many rows as there are methods (using array length instead of data)
  heatmap
    .attr("width", function(d) { return track_scale.bandwidth(); })
    .attr("height", function(d) { return method_scale.bandwidth(); })
    .attr("y", function(d) { return method_scale(headers.methods[d.method_id]); });

  heatmap.enter()
    .append("g")
      .attr("class", "rect_group")
    .append("svg:a")
      .attr("xlink:href", function(d){
        return "/#/results/" + current_is_dev + '/' + current_target_id + '/' + current_metric_id + '/play/' + d.track_id + '/' + headers.methods[d.method_id];
      })
    .append("rect")
    .classed("oracle", function(d) { return d.method_id == headers.methods.indexOf("IBM"); })
    .attr("width", function(d) { return track_scale.bandwidth(); })
    .attr("height", function(d) { return method_scale.bandwidth(); })
    // shift them for numbers of rows available
    .attr("y", function(d, i) { return method_scale(headers.methods[d.method_id]); })
    // fill with defined colorscale
    .style("fill", function(d) { return colorScale(d.score); })
    .style("cursor", "pointer")
    // render tooltip data
    .on("mouseover", function(d) {
      methodtiph.transition()
       .duration(200)
       .style("opacity", .9);
      methodtiph
         .style("width", (width + 'px'))
         .style("left", '50px')
         .style("height", method_scale.bandwidth() + 'px')
         .style("top",  method_scale(headers.methods[d.method_id]) + 50 + "px");
       tracktiph.transition()
        .duration(200)
        .style("opacity", .9);
       tracktiph
          .style("height", ( height + 'px'))
          .style("left", (track_scale(d.track_id)) + 50 + "px")
          .style("width", (track_scale.bandwidth()) + "px")
          .style("top",  50 + "px");
       tooltip.transition()
         .duration(200)
         .style("opacity", .9);
       tooltip.html(
         headers.metrics[d.metric_id] + ': ' + d.score
       )
       d3.selectAll(".method_label").classed("active", function(x) { return d.method_id == x.key; });
      })
     .on("mouseout", function(d) {
         tooltip.transition()
           .duration(200)
           .style("opacity", 0);
          tracktiph.transition()
          .duration(200)
          .style("opacity", 0);
          methodtiph.transition()
          .duration(200)
          .style("opacity", 0);

      });

    // delete rectangles
    heatmap.exit().remove();

}

function update(data) {
  // Set color scale
  colorLow = 'black', colorHigh = colors[headers.targets[current_target_id]];

  colorScale = d3.scaleLinear()
    .range([colorLow, colorHigh]);

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
        meanScoreByTrack: d3.mean(v, function(d) { return d.score; }),
        payload: v
      };
    })
    .entries(data);

  tracks.sort(function(a, b) { return d3.ascending(parseInt(a.key), parseInt(b.key)); });

  // group by method_name (=method_id)
  var methods = d3.nest()
    .key(function(d) { return d.method_id; })
    .rollup(function(v) { return {
        meanScoreByMethod: d3.mean(v, function(d) { return d.score; }),
        isOracle: v[0].method_id == headers.methods.indexOf("IBM"),
        payload: v
      };
    })
    .entries(data);

  // sort alphabetically
  // methods.sort(function(a, b) {
  //   return d3.descending(+a.value.isOracle, +b.value.isOracle) || d3.ascending(headers.methods[a.key], headers.methods[b.key]);
  // });

  methods.sort(function(a, b) {
    return d3.descending(a.value.meanScoreByMethod, b.value.meanScoreByMethod);
  });


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
    .data(tracks, function(d) { return [d.key, d.value.payload[0].target_id, d.value.payload[0].metric_id] });

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

    methodtiph
      .style("width", (width + 'px'))
      .style("left", '50px')
      .style("height", method_scale.bandwidth() + 'px')
      .style("top",  method_scale(current_play_method) + 50 + "px");

    tracktiph
      .style("height", ( height + 'px'))
      .style("left", (track_scale(current_play_track_id)) + 50 + "px")
      .style("width", (track_scale.bandwidth()) + "px")
      .style("top",  50 + "px");

    if (typeof current_play_method !== 'undefined') {
      tracktip
        .style("opacity", 1);

      if (current_play_method == 'REF') {
        methodtip
          .style("opacity", 0);
      } else {
        methodtip
          .style("opacity", 1);
      }

      methodtip
        .style("width", (width + 'px'))
        .style("left", '50px')
        .style("height", method_scale.bandwidth() + 'px')
        .style("top",  method_scale(current_play_method) + 50 + "px");

      tracktip
        .style("height", ( height + 'px'))
        .style("left", (track_scale(current_play_track_id)) + 50 + "px")
        .style("width", (track_scale.bandwidth()) + "px")
        .style("top",  50 + "px");
    } else {
      methodtip.transition()
        .duration(200)
        .style("opacity", 0);
      tracktip.transition()
        .duration(200)
        .style("opacity", 0);
    }

  // render actual column data (=tracks) into group elements
  var track_column_enter = track_column.enter()
    .append("g")
    .attr("class", "track")

  track_column_enter
    .on("click", function(dclick) {
      // render new site that displays more detailed track information
      // update(data.filter(function(d) {
      //   return d.track_id == dclick.key;
      // }));
    })
    .on("mouseover", function(dclick) {
      d3.selectAll(".grid .track_label").
        classed("active", function(d) { return d.key == dclick.key; });
    })
    .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    .style("fill-opacity", 1e-6)
    .transition(t)
    .attr("transform", function(d) { return "translate(" + track_scale(d.key) + ", 0)"; })
    .style("fill-opacity", 1)
    .each(rect)

  var track_column_enter_label = track_column_enter
    .append("g")
    .attr("class", "track_label_group");

  track_column_enter_label
    .append("svg:a")
    .attr("xlink:href", function(d){
      return "/#/results/" + current_is_dev + '/' + current_target_id + '/' + current_metric_id + '/play/' + d.key + '/' + 'REF';
    })
    .append('text')
    .attr("class", "track_label")
    .style("text-anchor", "start")
    .style("font-size", .66 * gridSize + "px")
    .style("cursor", "pointer")
    .attr("y", - 0.5 * (.66 * gridSize))
    .attr("x", 4)
    .text(function(d) {
        if (d.key == current_play_track_id && current_play_method == 'REF') {
          return '\u25B6';
        } else {
          return d.key;
        }
    })
    .on("mouseover", function(dclick) {
        d3.select(this)
          .text(function(d) { return '\u25B6' });
    })
    .on("mouseout", function(dclick) {
        d3.select(this)
          .text(function(d) { return d.key });
    });


  track_column.exit()
    .transition(t)
    .style("fill-opacity", 1e-6)
    // .attr("transform", function(d, i) { return "translate(0, 1000)"; })
    .remove();

  d3.selectAll(".oracle").attr("transform", "translate(0, 0)");

  var legend = svg.select('g.legend');

  var legendRect = legend.select('rect');

  //Set the color for the start (0%)
  lgstop1.attr("stop-color", colorLow);

    //Set the color for the end (100%)
  lgstop2.attr("stop-color", colorHigh);

  console.log(colorScale.range()[1].toString())
  svgLegendRect.style("fill", "url(#linear-gradient)");

  legendRect
    .attr("y", d3.extent(method_scale.range())[0])
    .attr("height", d3.extent(method_scale.range())[1]);

  var yScale = d3.scaleLinear()
  	 .range([parseInt(svgLegendRect.attr('height')), parseInt(svgLegendRect.attr('y'))])
  	 .domain(colorScale.domain());

  //Define x-axis
  var yAxis = d3.axisRight()
  	  .ticks(10)
  	  .scale(yScale);

  //Set up X axis
  legend
    .call(yAxis);

  svgLegendText
    .attr("width", gridSize)
    .style("fill", "black")
    .attr("x", -1.5 * gridSize)
    .attr("y", -0.5 * gridSize)
    .text(function(d) { return headers.metrics[data[0].metric_id] + " in dB"; });
}

export default { init, update, setRoute }
