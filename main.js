// Variable to track whether both date and symbol have been selected
var isSymbolSelected = false;
var isDateSelected = false;

var selectedOption;
var selectedDate;

function logSymbol() {
    // Get the selected value from the dropdown
    selectedOption = document.getElementById("dropdown").value;

    // Log the selected option and date
    console.log("Selected Option:", selectedOption);

    // Update the flag indicating that the symbol has been selected
    isSymbolSelected = true;

    // Check if both symbol and date are selected before executing the action
    if (isSymbolSelected && isDateSelected) {
        executeAction();
    }
}

function logDate() {
    var datePicker = document.getElementById('datePicker');

    // Access the selected date
    selectedDate = datePicker.value;

    // Display the selected date (for example, in the console)
    console.log("Selected Date: " + selectedDate);

    // Update the flag indicating that the date has been selected
    isDateSelected = true;

    // Check if both symbol and date are selected before executing the action
    if (isSymbolSelected && isDateSelected) {
        executeAction();
    }
}

const closePrices = [];
const highPrices = [];
const openPrices = [];
const lowPrices = [];
const timeData = [];

async function apiRequest(symbol,date){
    const apiKey = 'PKLNK477GT4FKEW3LH4S';
    const apiSecret = '9o1RkCbSHVZVWLt7mfv3O0oCgelX1H0afPg5ppBV';

    const apiUrl = 'https://data.alpaca.markets/v2/stocks/bars?symbols='+ symbol + '&timeframe=1day&start='+ date +'&limit=7&adjustment=raw&feed=sip&sort=asc'

    const headers = new Headers({
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret,
      });

      function createRequest(url) {
        const request = new Request(url, {
          method: 'GET',
          headers: headers,
        });
        return request;
      }

    const request = createRequest(apiUrl);

    const response = await fetch(request);
    const data = await response.json();

    //Close Prices
    for(let i=0; i<7; i++){
        closePrices.push(data.bars[symbol][i].c)
    }

    for(let i=0; i<7; i++){
        highPrices.push(data.bars[symbol][i].h)
    }

    for(let i=0; i<7; i++){
        openPrices.push(data.bars[symbol][i].o)
    }

    for(let i=0; i<7; i++){
        lowPrices.push(data.bars[symbol][i].l)
    }

    for(let i=0; i<7; i++){
        timeData.push(data.bars[symbol][i].t)
    }

    // console.log(closePrices);
    // console.log(openPrices);
    // console.log(highPrices);
    // console.log(lowPrices);
    // console.log(data);
}

var myChart;

function drawChart(symbol) {
    const ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeData,
          datasets: [{
            label: symbol,
            data: closePrices,
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
    });
}




// Function to execute the desired action when both symbol and date are selected
async function executeAction() {

    //Destroys previous Chart
    //myChart.destroy();

    // console.log("Both symbol and date selected. Performing the desired action.");
    // console.log(selectedOption, selectedDate);
    // await apiRequest(selectedOption,selectedDate);
    // drawChart(selectedOption);

    console.log("Both symbol and date selected. Performing the desired action.");
    console.log(selectedOption, selectedDate);

    // Clear previous data
    closePrices.length = 0;
    highPrices.length = 0;
    openPrices.length = 0;
    lowPrices.length = 0;
    timeData.length = 0;

    // Make API request
    await apiRequest(selectedOption, selectedDate);

    // Check if the chart already exists
    if (myChart) {
        // Update the existing chart
        myChart.data.labels = timeData;
        myChart.data.datasets[0].label = selectedOption;
        myChart.data.datasets[0].data = closePrices;
        myChart.update();
    } else {
        // Create a new chart if it doesn't exist
        drawChart(selectedOption);
    }

}



