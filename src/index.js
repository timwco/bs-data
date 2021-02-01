// Grab Our Elements
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const parseBtn = document.getElementById('parse');
const filterBtn = document.getElementById('filter');
const resetBtn = document.getElementById('reset');
const hiddenArea = document.querySelector('.hidden');

let initial = true;

// Parse Callback
const manipulate = (payload) => {
  const {data} = payload;
  // Remove first two rows (two header rows)
  data.splice(0,2);
  
  // Convert data into an object, for easier use
  const objectified = data.map(d => (
    {
      date: Date.parse(d[2]),
      historic: Number(d[4]),
      scanned: Number(d[5]),
    }
  ));

  // Split out the historical and scanned data.
  // Could do this earlier, but we might use this differently later
  const historicalData = [];
  const scannedData = [];
  objectified.forEach(d => {
    if (d.historic > 0) {
      historicalData.push({ t: d.date, y: d.historic });
    } else if (d.scanned > 0) {
      scannedData.push({ t: d.date, y: d.scanned }); 
    }
  })

  // Merge data stream together (updates and overrides if need be)
  const mergedData = [...historicalData, ...scannedData];
  // Sort Data by timestamp
  const sortedData = mergedData.sort((a, b) => (a.t - b.t));
  // Removed Duplicate Data (this is an extra check)
  const uniqueData = sortedData.filter((v,i,a)=>a.findIndex(t=>(t.t === v.t))===i);

  let graphedData = uniqueData;


  // Check Filters
  const sdv = startDate.value;
  const edv = endDate.value;
  if (!initial && sdv && edv) {
    const startTimeStamp = Date.parse(sdv);
    const endTimeStamp = Date.parse(edv) + 86400000;
    graphedData = uniqueData.filter(d => (d.t > startTimeStamp && d.t < endTimeStamp));
  }

  if (graphedData.length === 0) {
    return alert('No data found in these filters! Please select different dates.');
  }

  // Load that chart!
  if (initial) {
    displayChart(graphedData);
    hiddenArea.classList.remove('hidden');
  } else {
    updateChart(graphedData);
  }
  
}

// Parse Config
const config = {
	complete: function(results) {
    manipulate(results);
  },
}

// Kick off the File Reader{
const readAndParseFile = () => {
  const fileInput = document.getElementById('files');
  const file = fileInput.files[0];
  if (file) {
    Papa.parse(file, config);
  } else {
    alert('Please select a file first!!');
  }
}

// Parse Button Click Event Func
parseBtn.onclick = () => {
  initial = true;
  readAndParseFile();
}

// Filter Button Click Event Func
filterBtn.onclick = () => {
  if (startDate.value !== '' && endDate.value !== '') {
    initial = false;
    readAndParseFile();
  } else {
    alert('Please Select a Start & End Date');
  }
}

// Reset Button
resetBtn.onclick = () => {
  startDate.value = '';
  endDate.value = '';
  readAndParseFile();
}

// Date Picker
new Pikaday({ field: startDate });
new Pikaday({ field: endDate });


// Timestamps are Same
const timesSameDay = (time1, time2) => {
  const date1 = new Date(time1);
  const date2 = new Date (time2);
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}