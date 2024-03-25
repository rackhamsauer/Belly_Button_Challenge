// Function to fetch data from samples.json
async function fetchData('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json') {
    try {
        const response = await fetch('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
// define the function
function fetchData() {
    // Fetch the JSON data and console log it
    d3.json("samples.json").then(function(data){
        console.log(data);
    });
}
// Call the function
fetchData();

// Function to create horizontal bar chart
function createBarChart(sample) {
    const sampleValues = sample.sample_values.slice(0, 10).reverse();
    const otuIDs = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const otuLabels = sample.otu_labels.slice(0, 10).reverse();

    const trace = {
        x: sampleValues,
        y: otuIDs,
        text: otuLabels,
        type: 'bar',
        orientation: 'h'
    };

    const layout = {
        title: 'Top 10 OTUs Found',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID' }
    };

    Plotly.newPlot('bar', [trace], layout);
}

// Function to create bubble chart
function createBubbleChart(sample) {
    const trace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids
        }
    };

    const layout = {
        title: 'OTU ID vs Sample Values',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bubble', [trace], layout);
}

// Function to create gauge chart
function createGaugeChart(sample) {
    const trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: sample.wfreq,
        title: { text: 'Belly Button Washing Frequency' },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
            axis: { range: [0, 9] },
            steps: [
                { range: [0, 1], color: 'rgb(248, 243, 236)' },
                { range: [1, 2], color: 'rgb(244, 241, 229)' },
                { range: [2, 3], color: 'rgb(233, 230, 202)' },
                { range: [3, 4], color: 'rgb(229, 231, 179)' },
                { range: [4, 5], color: 'rgb(213, 228, 157)' },
                { range: [5, 6], color: 'rgb(183, 204, 146)' },
                { range: [6, 7], color: 'rgb(140, 191, 136)' },
                { range: [7, 8], color: 'rgb(138, 187, 143)' },
                { range: [8, 9], color: 'rgb(133, 180, 138)' }
            ]
        }
    };

    const layout = {
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot('gauge', [trace], layout);
}

// Function to update demographic info
function updateDemographicInfo(metadata) {
    const panel = d3.select('#sample-metadata');
    panel.html('');

    Object.entries(metadata).forEach(([key, value]) => {
        panel.append('p').text(`${key}: ${value}`);
    });
}

// Function to create dropdown
function createDropdown(samples) {
    const dropdown = d3.select('#selDataset');

    samples.forEach(sample => {
        dropdown.append('option').attr('value', sample).text(sample);
    });
}

// Initialize the dashboard
async function init() {
    const data = await fetchData('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json');
    if (!data) {
        return;
    }

    createDropdown(data.names);
    createBarChart(data.samples[0]);
    createBubbleChart(data.samples[0]);
    createGaugeChart(data.metadata[0]);
    updateDemographicInfo(data.metadata[0]);
}

// Function to update the charts
async function optionChanged(id) {
    const data = await fetchData('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json');
    if (!data) {
        return;
    }

    const sample = data.samples.find(sample => sample.id === id);
    const metadata = data.metadata.find(metadata => metadata.id.toString() === id);

    createBarChart(sample);
    createBubbleChart(sample);
    createGaugeChart(metadata);
    updateDemographicInfo(metadata);
}

// Initialize the dashboard
init();

// Event listener for dropdown change
d3.select('#selDataset').on('change', function() {
    optionChanged(this.value);
});
