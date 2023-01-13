const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Test Subject ID for selection
function init(){
    let selector = d3.select("#selDataset");

    d3.json(url).then((data) => {
      BB_data = data;
        let subject_ID = data.names;
        subject_ID.forEach((ID) => {
            selector
            .append('option')
            .text(ID)
            .property('value', ID);
        });
    });
    buildMetadata(940);
    buildCharts(940);
}

function optionChanged(newID) {
    buildMetadata(newID);
    buildCharts(newID);
};

// Demographic Info Based on ID selected
function buildMetadata(ID) {

    d3.json(url).then((data) => {
        
        // Define metadata
        let metadata = data.metadata;

        // Filter by patient ID
        let filteredMetadata = metadata.filter(metaObj => metaObj.id == ID)[0];
    

        // PANEL 
        let demo_panel = d3.select("#sample-metadata");
        demo_panel.append("h6").text("ID: " + filteredMetadata.id);
        demo_panel.append("h6").text("ETHNICITY: " + filteredMetadata.ethnicity);
        demo_panel.append("h6").text("GENDER: " + filteredMetadata.gender);
        demo_panel.append("h6").text("AGE: " + filteredMetadata.age);
        demo_panel.append("h6").text("LOCATION: " + filteredMetadata.location);
        demo_panel.append("h6").text("BBTYPE: " + filteredMetadata.bbtype);
        demo_panel.append("h6").text("WFREQ: " + filteredMetadata.wfreq);

        // GAUGE CHART
        var wash_freq = filteredMetadata.wfreq;
        var gauge_data = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: wash_freq,
                title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'darkred'},
                    axis: { range: [null, 9], },
                    steps: [
                        { range: [0, 1], color: '#F0FFFF' },
                        { range: [1, 2], color: '#B6D0E2' },
                        { range: [2, 3], color: '#A7C7E7' },
                        { range: [3, 4], color: '#87CEEB' },
                        { range: [4, 5], color: '#4682B4' },
                        { range: [5, 6], color: '#1434A4' },
                        { range: [6, 7], color: '#00008B' },
                        { range: [7, 8], color: '#000080' },
                        { range: [8, 9], color: '#191970' },
                    ],
                }
            }
        ];

         // Define Plot layout
         var gauge_layout = { 
            width: 500, 
            height: 400, 
            margin: { t: 0, b: 0 } };

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    });
};

function buildCharts(ID) {

    d3.json(url).then((data) => {

        // Define samples
        let sample = data.samples

        // Filter by patient ID
        let filteredSample = sample.filter(bacteriaInfo => bacteriaInfo.id == ID)[0];


        // BAR CHART
        let sample_values = filteredSample.sample_values
        let otu_ids = filteredSample.otu_ids
        let otu_labels = filteredSample.otu_labels
        
  
        var bar_data = [{
            // Use otu_ids for the x values
            x: sample_values.slice(0, 10).reverse(),
            // Use sample_values for the y values
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]

        // Define plot layout
        var bar_layout = {
            title: "Top 10 Microbial Species in Belly Buttons",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // Display plot
        Plotly.newPlot('bar', bar_data, bar_layout)


        // BUBBLE CHART
        var bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Use otu_ids for the marker colors
                color: otu_ids,
                size: sample_values,
                colorscale: 'Earth'
            }
        }];

        // Define plot layout
        var layout = {
            title: "Belly Button Samples",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display plot
        Plotly.newPlot('bubble', bubble_data, layout)

    }); 
};
init();
