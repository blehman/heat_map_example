// add chart and dataset-picker div
d3.select('body')
    .append('div')
    .attr('id','chart');
d3.select('body')
    .append('div')
    .attr('id','dataset-picker')

// build chart
var margin = { top: 50, right: 0, bottom: 100, left: 300 },
    width = 960 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    //days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    cluster = d3.range(0,10)
    //times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
    feature = ['r0','r1' ,'r3','r4','r5' ,'r6' ,'r7','r8','r9','r10','r11','r12' ,'r13'];
    gridSize = Math.floor(width / feature.length),
    legendElementWidth = gridSize*1.12,
    datasets = ["line"];

var plots = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    ;

var heatmap = plots.append("g")
    .classed ('heatmap',true)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var heatmap_cluster_labels = heatmap.selectAll('.heatmap_cluster_label')
    .data(cluster)
    .enter().append('text')
      .classed('heatmap_cluster_label',true)
      .text(function(d){return 'c'+d;})
      .attr('x',function (d,i){return (i * gridSize) + 0.5*gridSize})
      .attr('y',-2.0)
      .style("text-anchor", "middle")
      ;

var heatmap_feature_labels = heatmap.selectAll('.heatmap_feature_label')
    .data(feature)
    .enter().append('text')
      .classed('heatmap_feature_label',true)
      .text(function(d){return d;})
      .attr('y',function (d,i){return (i * gridSize) + 0.6*gridSize})
      .attr('x',-2.0)
      .style("text-anchor", "end")
      ;

var heatmapChart = function(csvFile) {
    d3.csv(csvFile,
    function(d) {
      return {
        feature: d.feature,
        c0: +d.c0,
        c1: +d.c1,
        c2: +d.c2,
        c3: +d.c3,
        c4: +d.c4,
        c5: +d.c5,
        c6: +d.c6,
        c7: +d.c7,
        c8: +d.c8,
        c9: +d.c9,
        total: +d.total
      };
    },
    function(error, data) {
      console.log(data)

      var colorScale = d3.scale.quantile()
          .domain([0, 100])
          .range(colors);
      var textColorScale = d3.scale.linear()
          .domain([0,30])
          .range(['#E4E4E4', '#787878']);

      var rows = heatmap.selectAll(".features")
          .data(data, function(d) {return d.feature;});
      var rectText = heatmap.selectAll('.rectText')
          .data(data)

      rows.append("title");

      var make_rectangles = function(row,colCount){
          for (i in d3.range(colCount)){
              var col = 'c'+i;
              rows.enter().append("rect")
                  .attr("x", i * gridSize)
                  .attr("y", function(d,i) { return (i * gridSize); })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("fill", colors[0])
                  .transition().duration(3000)
                  .style("fill", function(d) { return colorScale(d[col]); });

              rectText.enter().append('text')
                  .classed('rectText',true)
                  .text(function(d,i){return +d[col]})
                  .attr('x',(i * gridSize) + (0.2 * gridSize))
                  .attr('y',function(d,i) { return (i * gridSize) + (0.6 * gridSize); })
                  .style('text-anchor','right')
                  .attr('fill',function(d) { return textColorScale(d[col]) })
                  //.style('stroke','#787878')
                  //.style('stroke-width','0.4px')
                  ;
          }
      }
      make_rectangles(rows,cluster.length)

      var legend = heatmap.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) { return d; });

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) { return colors[i]; });

      legend.append("text")
        .attr("class", "legendText")
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height + gridSize);

      legend.exit().remove();
    });
};

heatmapChart('./data/t-mobile_feature_cluster_set.csv')
/*
var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
    datasets = ["data.tsv", "data2.tsv"];

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatmapChart = function(tsvFile) {
  d3.tsv(tsvFile,
  function(d) {
    return {
      day: +d.day,
      hour: +d.hour,
      value: +d.value
    };
  },
  function(error, data) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var cards = svg.selectAll(".hour")
        .data(data, function(d) {return d.day+':'+d.hour;});

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });
    
    cards.exit().remove();

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize);

    legend.exit().remove();

  });  
};

heatmapChart(datasets[0]);

var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
  .data(datasets);

datasetpicker.enter()
  .append("input")
  .attr("value", function(d){ return "Dataset " + d })
  .attr("type", "button")
  .attr("class", "dataset-button")
  .on("click", function(d) {
    heatmapChart(d);
  });
*/
