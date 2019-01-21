function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var meta_url = `/metadata/${sample}`;
  d3.json(meta_url).then(function(results) {
    console.log(results);

    data = results;

    // Select sample-metadata id and store as a variable
    var sample_metadata = d3.select("#sample-metadata")
    
    // use .html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function(object) {
      var row = sample_metadata.append("p");
      row.text(`${object}`);
    });

  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(results) {

    // @TODO: Build a Bubble Chart using the sample data
    data = results;
    console.log(data);

    //create variables for the otu_ids, labels, and sample_values
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;
    
    //create trace for bubble chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        text: otu_labels
      },
      hovertext: otu_labels,
      type: 'scatter'
    };

    var data = [trace1];

    var layout = {
      title: "Belly Button Bubble",
      xaxis: {
        title: 'OTU ID'}
    };

    //plot the bubble chart
    Plotly.newPlot("bubble", data, layout);
  });
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  // fetch the sample data from /samples route
  var url = `/samples/${sample}`;
  d3.json(url).then(function(results) {

    data = results;

    //create variables for the otu_ids, labels, and sample_values
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;

    //Build a pie Chart
    var trace2 = {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels,
      type: "pie"
    };

    var data = [trace2]

    var layout = {
      title: "Belly Button Pie",
      height: 500,
      weight: 500
    }

    //Plot the pie chart
    Plotly.newPlot("pie", data, layout)

  });
};

buildCharts();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();