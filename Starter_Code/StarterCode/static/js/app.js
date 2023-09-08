const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
  var dropDownMenu = d3.select("#selDataset");

  d3.json(url).then(function(data) {
  // d3.json("data/samples.json").then((data) => {
      var sampleNames = data.names;

      console.log(data);

      sampleNames.forEach(sample => {
          dropDownMenu
              .append("option")
              .text(sample)
              .property("value", sample);
      });
      
      // Display first sampleName from list to build initial plots
      var initialSample = sampleNames[0];

      buildMetaData(initialSample);
      buildBarChart(initialSample);
      buildBubbleChart(initialSample);
  });
}

// Initialize the dashboard
init();

// Function to update metadata and charts when new sample selected
function optionChanged(newSample) {
  buildMetaData(newSample);
  buildBarChart(newSample);
  buildBubbleChart(newSample);
}

function buildMetaData(sample) {
  d3.json(url).then((data) => {

    // retrieve metadata
    let metadata = data.metadata;

    // filter depending on the sample
    let dataArray = metadata.filter(result => result.id == sample);

    // first index
    let dataSample = dataArray[0];

    d3.select("#sample-metadata").html("");

    // adding to the panel
    Object.entries(dataSample).forEach(([key,value]) => {

      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });

  });
};

function buildBarChart(sample) {

  d3.json(url).then((data) => {

    // all the sample data
    let samples = data.samples;

    // Filter depending on the sample
    let valueOfSample = samples.filter(result => result.id == sample);

    // first index
    let sampleData = valueOfSample[0];

    // otu_ids, labels and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // Trace for the bar chart
    let trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    // Data array
    let traceData = [trace1];

    // apply title to layout
    let layout = {
      title: "Top 10 OTUs Present",
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", traceData, layout);
  });
};

function buildBubbleChart(sample) {

  d3.json(url).then((data) => {
    
    // all the sample data
    let samples = data.samples;

    // Filter depending on the sample
    let valueOfSample = samples.filter(result => result.id == sample);

    // first index
    let sampleData = valueOfSample[0];

    // otu_ids, labels and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // trace for bubble chart
    let trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
    }
    };

    // Data array
    let traceData = [trace2];

    // apply title to layout
    let layout = {
      xaxis: {title: "OTU ID"},
    };

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", traceData, layout);
  });
};