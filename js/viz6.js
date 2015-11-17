// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();





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
    height = 370 - margin.top - margin.bottom,
    buckets = 9,
    colors = ['#d580ff','#c994c7','#d4b9da','#e7e1ef'
      ,'#df65b0'
      ,'#ffcce5'//'#e7298a'
      ,'#ce1256'
      ,'#980043'
      ,'#67001f'],
    cluster = d3.range(0,10)
    feature = ['rewards_programs','rewards_apps' ,'rewards_general','rewards_all_gratitude','rewards_all_links' ,'rewards_all_kloutScore50' ,'rewards_all_not_retweets','rewards_all_bio_beer','rewards_all_bio_mom','rewards_all_bio_dad','rewards_all_bio_wine','rewards_all_bio_dog' ,'rewards_all_bio_cat'];
    gridSize = Math.floor(width / feature.length),
    legendElementWidth = gridSize*1.43,
    datasets = ["line"],
        feature = ['influencers'
  ,'frustration'
  ,'gratitude'
  ,'mom']

  col_name = ['coffee_rewards_programs'
  ,'loyalty_rewards_programs'
  ,'online_gift_cards'
  ,'survey_rewards'
  ,'methods_to_earn_more_points'
  ,'fuel_rewards_programs'
  ,'starbucks_rewards'
  ,'employment'
  ,'apps_online'
  ,'household_rewards_conversation']
  ,cluster = d3.range(0,col_name.length)
    ;

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
        feature: d.feature
       , coffee_rewards_programs: +d.coffee_rewards_programs
       , loyalty_rewards_programs: +d.loyalty_rewards_programs
       , online_gift_cards: +d.online_gift_cards
       , survey_rewards:+d.survey_rewards
       , methods_to_earn_more_points: +d.methods_to_earn_more_points
       , fuel_rewards_programs: +d.fuel_rewards_programs
       , starbucks_rewards: +d.starbucks_rewards
       , employment: +d.employment
       , apps_online: +d.apps_online
       , household_rewards_conversation: +d.household_rewards_conversation
      };
    },
    function(error, data) {
      console.log(data)
/*
      var colorScale = d3.scale.quantile()
          .domain([-70, 0, 70])
          .range(colors);
*/
      var colorScale = d3.scale.linear()
          .domain([-70, 0, 70])
          .range(['#d580ff','#ffe5f2','#ff1a8c']);
      var textColorScale = d3.scale.linear()
          .domain([-2,10])
          .range(['#ffffff','#1a1a1a']);
      var color_set = [colorScale(-60), colorScale(-45), colorScale(-25), colorScale(0), colorScale(25), colorScale(45), colorScale(60)];
      var color_set_values = [-70, -45, -25, 0, 25, 45, 70];
      var rows = heatmap.selectAll(".features")
          .data(data, function(d) {return d.feature;});
      var rectText = heatmap.selectAll('.rectText')
          .data(data)

      rows.append("title");

      var make_rectangles = function(row,colCount){
          for (i in d3.range(colCount)){
              var col = col_name[i];
              rows.enter().append("rect")
                  .attr("x", i * gridSize)
                  .attr("y", function(d,i) { 
                    return (i * gridSize); })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("fill", colors[0])
                  .transition().duration(3000)
                  .style("fill", function(d) { return colorScale(d[col]); });

              rectText.enter().append('text')
                  .classed('rectText',true)
                  .text(function(d,i){return Math.round10(+d[col],-1)})
                  .attr('x',(i * gridSize) + (0.15 * gridSize))
                  .attr('y',function(d,i) { return (i * gridSize) + (0.6 * gridSize); })
                  .style('text-anchor','right')
                  .attr('fill', function(d,i){ return textColorScale(+d[col])})
                  //.style('stroke','#787878')
                  //.style('stroke-width','0.4px')
                  ;
          }
      }
      make_rectangles(rows,cluster.length)
     
      var legend = heatmap.selectAll(".legend")
          .data(color_set);

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) { return colors[i]; });

      var legendText = heatmap.selectAll('.heatMap_Legend_text')
        .data(color_set_values).enter()
        .append("text")
        .attr("class", "legendText")
        .text(function(d) { 
          console.log(d)
          if (d < 0) {
            return '<'+d;
          }else{
            return '>'+d;
          } })
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", height + gridSize);

      legend.exit().remove();
    });
};

heatmapChart('./data/chi-square_normalized.csv')

