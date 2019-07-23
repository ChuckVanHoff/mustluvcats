function init() {
  // Grab a reference to the dropdown select element
  var selector = lovecats.select("#selDataset");

  // Populate the select options with the food group
  lovecats.json("/group").then((sampleNames) => {
    console.log("sampleNames" + sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
  // Plot the all data scatter plot
  buildCharts();
  });
}

function secdrop(sample) {
  // Grab a reference to the second dropdown select element
  var selector = lovecats.select("#selDataset2");
  
  // clean the current dropdown
  $("#selDataset2")
  .find('option')
  .remove()
  .end();

  // Populate the select options with the food names
  var values = [];
  lovecats.json(`/names/${sample}`).then((sampleNames) => {
    
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
      values.push(sample)
    });
  
  // Give the autocomplete within the food names for the input
  $( "#set2input" ).autocomplete({
      source: values
    });

  });
}

// Input the nutrients data of the selected food to a panel
function buildNutrientsdata(sample) {
  lovecats.json(`/print/${sample}`).then((data) => {
    // Grab the reference ID to put the data
    var PANEL = lovecats.select("#sample-metadata");
    // console.log(data);
    // Clear any existing panel data
    PANEL.html("");

    // Input the panel data with the select food nutrients
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

    // Build the Gauge with the selected food's calories data
    buildGauge(data.calories);
  });
}

// Record the selected food history
function selectedfood() {
  lovecats.json(`/print2`).then((data) => {
    // select the reference ID to input the data
    var PANEL = lovecats.select("#searchedfood");
    // console.log(data);
    // Clear any existing metadata
    PANEL.html("");
    // Create the table and input the data 
    data.forEach((sample) => {
      PANEL
          .append("tr");
      PANEL
          .append('td')
          .text(sample.group);
      PANEL
          .append('td')
          .text(sample.name);
      PANEL
          .append('td')
          .text(sample.calories);
        
        })
  });
}

// While the first dropdown changed, act the below fuctions
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // console.log(newSample);
  secdrop(newSample);
  buildCharts2(newSample)
}

// While the second dropdown and autocomplete input changed, act the below fuctions
function pChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // console.log(newSample);
  buildNutrientsdata(newSample);
  buildCharts3(newSample)
  selectedfood()
}
// Initialize the dashboard
init();