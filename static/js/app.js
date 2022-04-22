console.log("plots.js loaded")

// Load the data and plot the default pie chart
function otherPlots(countrySelected,yearClicked){

  console.log(countrySelected);
  console.log(yearClicked);

  d3.json('/api/yearly_suicides_by_gender_country').then(function(data){
      console.log(data) 
      $("#pie_gender").html("")
      //debugger
      var selectedData = data[yearClicked].filter(d => d.iso_abr === countrySelected);
      if (Object.keys(selectedData).length > 0) {
      var labels = selectedData.map(x => x.sex);
      var values = selectedData.map(x => x.suicides);
      var trace = {
          type: 'pie',
          labels: labels,
          values: values
      }   
      var layout = {
          width: 450,
          height: 450,
          title:`In Year ${yearClicked} Country ${countrySelected} Suicides% by Gender`
      }
      var config = {responsive: true}
      Plotly.newPlot('pie_gender', [trace], layout);
    }
    else {
      $("#pie_gender").html("<h4>No Data</h4>");
    }
  });

  // Suicides by Country
  d3.json('/api/yearly_suicide_rate_by_TopTenCountry').then(function(data){
      
      var selectedData = data[yearClicked];

      // Sort the objects in ascending order
      let sortedlist = Object.entries(selectedData).sort((a, b) => a[1] - b[1]);
      console.log(sortedlist)
    
      var keys = []
      var values = []
    
      sortedlist.forEach(country=>{
        keys.push(country[1].country);
        values.push(country[1].suicide_rate_100k);
      })
      
      var data = [
        {
          type: 'bar',
          x: values.reverse(),
          y: keys.reverse(),
          orientation: "h"
        },
      ];
      var layout = {
          title: `In Year ${yearClicked} Countries with the highest suicide rates`,
          autosize: false,
          width: 450,
          height: 450,
          margin: {
            l: 150,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
      }
      var config = {responsive: true}
      Plotly.newPlot('bar_by_country', data, layout, config);
    });

  // Suicides by Age
  d3.json('/api/yearly_suicides_by_age_country').then(function(data){
    $("#bubble_age").html("")
    var selectedData = data[yearClicked].filter(d => d.iso_abr === countrySelected);
    if (Object.keys(selectedData).length > 0) {
      var bubbleLabels = selectedData.map(x => x.age);
      var bubbleValues = selectedData.map(x => x.suicides);
      
      var trace1 = {
        x: bubbleLabels,
        y: bubbleValues,
        mode: 'markers',
        marker: {
          size: [40, 50, 60, 30, 55, 35],
          color: bubbleValues,
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
          width: 450,
          height: 450,
          xaxis: {
              title: 'Age Group'
          },
          yaxis: {
              title: 'Suicides'
          },
          title: `In Year ${yearClicked} Country ${countrySelected} Suicides by Age`
      }
      var config = {responsive: true}

      Plotly.newPlot("bubble_age", data, layout, config);
    }

    else {
      $("#bubble_age").html("<h4>No Data</h4>");
    }
  });

  $.ajax({
      dataType: "json",
      url: '/api/yearly_suicides_by_generation_country',
      data: {},
      success: function(data){
        console.log(data);
        $("#pie_generation").html("")
        var selectedData = data[yearClicked].filter(d => d.iso_abr === countrySelected);
        if (Object.keys(selectedData).length > 0) {
            var generationLabels = selectedData.map(x => x.generation);
            var generationValues = selectedData.map(x => x.numsuicides);
              
            var trace = {
              width: 450,
              height: 450,
              type: 'pie',
              labels: generationLabels,
              values: generationValues
            }   
            var layout = {
              title:`In Year ${yearClicked} Country ${countrySelected} Suicide% by Generation`
            }
            Plotly.newPlot('pie_generation', [trace], layout);
          }

        else {
          $("#pie_generation").html("<h4>No Data</h4>");
        }  
      }
  });

}

 
function InitDashboard()
{ var countrySelected = "RUS";
  var yearClicked = 2002;
  otherPlots(countrySelected,yearClicked);
}

InitDashboard();

