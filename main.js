// Variable to track whether both date and symbol have been selected
var isSymbolSelected = false;
var isDateSelected = false;

var selectedOption;
var selectedDate;

function updateSymbol(ticker) {
    // Get the selected value from the dropdown
    selectedOption = ticker;

    // Log the selected option and date
    console.log("Selected Option:", selectedOption);

    document.getElementById('symbolHeader').innerHTML = 'Stock Selected: ' + selectedOption;

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

const apiKey = 'PKLNK477GT4FKEW3LH4S';
const apiSecret = '9o1RkCbSHVZVWLt7mfv3O0oCgelX1H0afPg5ppBV';

async function apiRequest(symbol,date){

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
            label: 'Close Price',
            data: closePrices,
            borderWidth: 1
          },
          {
            label: 'High Price',
            data: highPrices,
            borderWidth: 1
          },
          {
            label: 'Open Price',
            data: openPrices,
            borderWidth: 1
          },
          {
            label: 'Low Price',
            data: lowPrices,
            borderWidth: 1
          }
        
        ]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'white'
              },
            },
            x: {
              grid: {
                color: 'white'
              },
            },
          }
        }
    });
}

const headlines = [];
const newsUrls = [];
const imgUrls = [];

async function requestNews(symbol, date) {
    const apiUrl = "https://data.alpaca.markets/v1beta1/news?start="+ date +"T00%3A00%3A00Z&sort=asc&symbols="+ symbol +"&limit=6"

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

  console.log(data);

  for(let i=0; i<6; i++){
    headlines.push(data.news[i].headline)
    newsUrls.push(data.news[i].url)
    imgUrls.push(data.news[i].images[1])
  }

  console.log(headlines[0])
  console.log(newsUrls[0])
  console.log(imgUrls[0].url)
  
  displayImage("imgOne",0)
  updateHeader("headerOne",headlines[0])
  updateLink("linkOne",newsUrls[0])

  displayImage("imgTwo",1)
  updateHeader("headerTwo",headlines[1])
  updateLink("linkTwo",newsUrls[1])

  displayImage("imgThree",2)
  updateHeader("headerThree",headlines[2])
  updateLink("linkThree",newsUrls[2])

  displayImage("imgFour",3)
  updateHeader("headerFour",headlines[3])
  updateLink("linkFour",newsUrls[3])

  displayImage("imgFive",4)
  updateHeader("headerFive",headlines[4])
  updateLink("linkFive",newsUrls[4])

  displayImage("imgSix",5)
  updateHeader("headerSix",headlines[5])
  updateLink("linkSix",newsUrls[5])
  
}

function updateHeader(headerId, value) {
    var headerElement = document.getElementById(headerId);
    headerElement.innerHTML = value;
}

function displayImage(imageId, index) {
  // Get the image URL from the array
  var imageUrl = imgUrls[index].url;

  // Get the image container element from the HTML
  var imageContainer = document.getElementById(imageId);

  imageContainer.setAttribute('src', imageUrl)
}

function updateLink(id, value){
    var link = document.getElementById(id);

    link.setAttribute('href', value)
}


// Function to execute the desired action when both symbol and date are selected
async function executeAction() {

    console.log("Both symbol and date selected. Performing the desired action.");
    console.log(selectedOption, selectedDate);

    // Clear previous data
    closePrices.length = 0;
    highPrices.length = 0;
    openPrices.length = 0;
    lowPrices.length = 0;
    timeData.length = 0;

    headlines.length = 0;
    imgUrls.length = 0;
    newsUrls.length= 0;

    // Make API request for Price Data
    await apiRequest(selectedOption, selectedDate);

    // Check if the chart already exists
    if (myChart) {
        // Update the existing chart
        myChart.data.labels = timeData;
        myChart.data.datasets[0].label = 'Close Prices';
        myChart.data.datasets[0].data = closePrices;
        myChart.data.datasets[1].label = 'High Prices';
        myChart.data.datasets[1].data = highPrices;
        myChart.data.datasets[2].label = 'Open Prices';
        myChart.data.datasets[2].data = openPrices;
        myChart.data.datasets[3].label = 'Low Prices';
        myChart.data.datasets[3].data = lowPrices;
        myChart.update();
    } else {
        // Create a new chart if it doesn't exist
        drawChart(selectedOption);
    }

    await requestNews(selectedOption, selectedDate);
}