// Function to fetch data from samples.json and populate dropdown
async function fetchData() {
    try {
        // Fetch data from the provided URL using fetch API
        const response = await fetch('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json');
        const data = await response.json();

        // Populate dropdown with subject IDs
        const dropdown = document.getElementById('selDataset');
        data.names.forEach(subjectID => {
            const option = document.createElement('option');
            option.text = subjectID;
            option.value = subjectID;
            dropdown.appendChild(option);
        });

        // Call function to update bar chart with default subject ID
        optionChanged(data.names[0]);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update bar chart based on selected subject ID
function optionChanged(selectedSubjectID) {
    // Use the selected subject ID to filter data and create top10OTUs array
    // For example:
    const top10OTUs = getTop10OTUs(selectedSubjectID);

    // Create data for bar chart
    const barData = [{
        type: 'bar',
        x: top10OTUs.map(otu => otu.sampleValue),
        y: top10OTUs.map(otu => `OTU ${otu.otuID}`),
        text: top10OTUs.map(otu => otu.otuLabel),
        orientation: 'h'
    }];

    // Create layout for bar chart
    const barLayout = {
        title: 'Top 10 OTUs Found',
        yaxis: {
            autorange: 'reversed'
        }
    };

    // Plot bar chart using Plotly
    Plotly.newPlot('bar', barData, barLayout);
}

// Function to get the top 10 OTUs for a given subject ID
function getTop10OTUs(subjectID) {
    // Implement logic to filter data and return the top 10 OTUs for the given subject ID
    // For example:
    const sampleData = getDataForSubjectID(subjectID);
    const top10OTUs = sampleData.slice(0, 10); // Assuming sampleData is an array of OTU objects
    return top10OTUs;
}

// Function to get data for a specific subject ID from samples.json
function getDataForSubjectID(subjectID) {
    // Implement logic to fetch and filter data for the given subject ID from samples.json
    // For example:
    const samples = {}; // Assuming you have loaded samples.json data into this variable
    return samples[subjectID] || [];
}

// Call fetchData() when the page loads to populate the dropdown
window.onload = fetchData;
