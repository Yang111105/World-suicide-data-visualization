// function for plotting pie
function plotPie(labels, values){
    var trace = {
        type: 'pie',
        labels: labels,
        values: values
    }   
    var layout = {
        width: 600,
        height: 600,
        title:'Suicides by Gender'
    }
    var config = {responsive: true}
    Plotly.newPlot('pie_gender', [trace], layout, config);
}

for (var i = 1985; i < 2017; ++i) {
    var option = "<option value='" + i + "'>" + i + "</option>";
    $("#selectYear").append(option);
}

// Load the data and plot the default pie chart
d3.json('/api/suicides_by_gender').then(function(data){
    // console.log(data) 
    var labels = Object.keys(data)
    var values = Object.values(data)
    plotPie(labels,values)
});

// Add click event to plot the pie chart for the selected year
$('.btn').click(function(){
    event.preventDefault();
    const year = $('#selectYear').val()
    console.log("year ",year)

    d3.json('/api/yearly_suicides_by_gender').then(function(data){
        var selected_output
        Object.entries(data).forEach(function([key,value]){
            if (key==year){
                selected_output = value
            }
        })
        
        var labels = []
        var values = []
        selected_output.forEach(output => {
            labels.push(output.sex)
            values.push(output.suicides)
        })
        plotPie(labels, values)
    })
})

d3.json('/api/yearly_suicides_by_gender').then(function(data){
    
    var year = [];
    var male = [];
    var female = [];
    Object.entries(data).forEach(function([key,value]){
        year.push(key);
        value.forEach(v=>{
            if (v.sex == "male"){
                male.push(v.suicides);
            } else {
                female.push(v.suicides);
            }
        })
    })
    
    var trace1 = {
        x: year,
        y: male,
        name: 'Male',
        type: 'bar'
    };
    
    var trace2 = {
        x: year,
        y: female,
        name: 'Female',
        type: 'bar'
    };
    
    var data = [trace1, trace2];
    
    var layout = {
        barmode: 'group',
        title: 'Suicides by Gender <br> from 1985 to 2016'
    };
    
    Plotly.newPlot('line_gender', data, layout);
})