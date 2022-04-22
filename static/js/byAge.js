
function plotBubble(labels, values){
  var trace1 = {
    x: labels,
    y: values,
    mode: 'markers',
    marker: {
      size: 40,
      color: values,
      colorscale: [
            ['0.0', 'rgb(165,0,38)'],
            ['0.111111111111', 'rgb(215,48,39)'],
            ['0.222222222222', 'rgb(244,109,67)'],
            ['0.333333333333', 'rgb(253,174,97)'],
            ['0.444444444444', 'rgb(254,224,144)'],
            ['0.555555555556', 'rgb(224,243,248)'],
            ['0.666666666667', 'rgb(171,217,233)'],
            ['0.777777777778', 'rgb(116,173,209)'],
            ['0.888888888889', 'rgb(69,117,180)'],
            ['1.0', 'rgb(49,54,149)']
          ],
    }
  }
  var data = [trace1];
  var layout = {
      width: 600,
      height: 600,
      xaxis: {
          title: 'Age Group'
      },
      yaxis: {
          title: 'Suicides'
      },
      title: 'Suicides by Age'
  }
  var config = {responsive: true}
  Plotly.newPlot("bubble_age", data, layout, config);
}
// Plotting the default bubble plot
d3.json('/api/suicides_by_age').then(function(data){
  console.log(data)
  var bubbleLabels = Object.keys(data)
  var bubbleValues = Object.values(data)
  // var bubbleSize = bubbleValues.map(x=>x/20000)
  plotBubble(bubbleLabels,bubbleValues)
});
// Adding country names to the select options
d3.json('/api/yearly_suicides_by_age_country_plot').then(function(data){
  Object.entries(data).forEach(function([key,value]){
    var option = "<option value='" + key + "'>" + key + "</option>";
    $("#selectCountry").append(option);
  })
})
for (var i = 2002; i < 2016; ++i) {
      var option = "<option value='" + i + "'>" + i + "</option>";
      $("#selectYear").append(option);
  }

$(document).ready(function(){
  $('#filter-btn').click(function(){
    event.preventDefault();
    const country = $('#selectCountry option:selected').val()
    console.log("country",country)
    const year = $('#selectYear option:selected').val()
    console.log("year",year)
    d3.json('/api/yearly_suicides_by_age_country_plot').then(function(data){
        var selectedCountryOutput = Object.entries(data).filter(([key,value])=> key==country)[0][1]
        var filteredOutput = selectedCountryOutput.filter(data=>data.year == year)
        console.log('filteredOutput',filteredOutput)
        var labels = []
        var values = []
        filteredOutput.forEach(output => {
            labels.push(output.age)
            values.push(output.suicides)
        })
        plotBubble(labels, values)
    })
  })
})
