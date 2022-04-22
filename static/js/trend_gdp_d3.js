// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth*0.4;
    var svgHeight = window.innerHeight*0.6;
  
    var margin = {
      top: 50,
      bottom: 150,
      right: 150,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select("#trend_chart")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read API
    d3.json('/api/yearly_suicide_rate').then(function(data){
        console.log(data);
  
        // Create a function to parse date and time
        var parseTime = d3.timeParse("%Y");
        data.forEach(function(data) {
            data.year = parseTime(data.year);
            data.yearly_suicide_rate = +data.yearly_suicide_rate;
          });

        // create scales
        var xTimeScale = d3.scaleTime()
          .domain(d3.extent(data, d => d.year))
          .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
          .domain([10, d3.max(data, d => d.yearly_suicide_rate)+2])
          .range([height, 0]);
  
        // create axes
        var xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
        var yAxis = d3.axisLeft(yLinearScale);
  
        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
  
        chartGroup.append("g")
          .call(yAxis);
  
        // line generator
        var line = d3.line()
          .x(d => xTimeScale(d.year))
          .y(d => yLinearScale(d.yearly_suicide_rate));

        // append line
        chartGroup.append("path")
          .attr("d", line(data))
          .classed("line", true);

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xTimeScale(d.year))
          .attr("cy", d => yLinearScale(d.yearly_suicide_rate))
          .attr("r", "8")
          .attr("fill", "steelblue")
          .attr("stroke-width", "0.5")
          .attr("stroke", "black");
  
        // Date formatter to display dates nicely
        var dateFormatter = d3.timeFormat("%Y");
  
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>Year: ${dateFormatter(d.year)}<strong><br>World Suicide Rate: ${d.yearly_suicide_rate}`);
          });
  
        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);
  
        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
            toolTip.hide(d);
          });
        
        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Suicide Rate per 100k pop");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("Year");

      }).catch(function(error) {
        console.log(error);
      });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  