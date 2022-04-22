 // Suicides by Country
 d3.json('/api/suicide_rate_by_TopTenCountry').then(function(data){
    
  // Sort the objects in ascending order
  let sortedlist = Object.entries(data).sort((a, b) => a[1] - b[1]);
  console.log(sortedlist)

  var keys = []
  var values = []

  sortedlist.forEach(country=>{
    keys.push(country[0]);
    values.push(country[1])
  })
  
  var data = [
    {
      type: 'bar',
      x: values,
      y: keys,
      orientation: "h"
    },
  ];
  var layout = {
      title: "2002-2015 World Countries with Highest Suicide Rates",
      autosize: false,
      width: 600,
      height: 600,
      margin: {
        l: 150,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      }
  }
  var config = {responsive: true}
  Plotly.newPlot('bar_by_country', data, layout, config);
});

// Suicides by Country
d3.json('/api/suicides_by_country').then(function(data){

  // Sort the objects in descending order
  var sortedlist = Object.entries(data).sort((a, b) => b[1]['suicides'] - a[1]['suicides']);
  console.log(sortedlist)
  var countries = []
  var values = []

  sortedlist.forEach(result=>{
    countries.push(result[1].country);
    values.push(result[1].suicides)
  })
  var data = [
    {
      type: 'bar',
      x: countries,
      y: values
    }
  ];
  var layout = {
      title: "2002-2015 World Suicide Numbers by Country",
      autosize: false,
      width: 800,
      height: 500,
      margin: {
        l: 150,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      }
  }
  var config = {responsive: true}
  Plotly.newPlot('bar_by_country_all', data, layout, config);
});