// Grab Our Elements
const startDate = document.getElementById('startDate');
const parseBtn = document.getElementById('parse');

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
  if (startDate.value !== '') {
    const selectedTimeStamp = Date.parse(startDate.value);
    graphedData = uniqueData.filter(d => timesSameDay(d.t, selectedTimeStamp))
  }

  // Load that chart!
  displayChart(graphedData);
}

// Parse Config
const config = {
	complete: function(results) {
    manipulate(results);
  },
}

// Parse Button Click Event Func
parseBtn.onclick = () => {
  const fileInput = document.getElementById('files');
  const file = fileInput.files[0];
  if (file) {
    Papa.parse(file, config);
  } else {
    alert('Please select a file first!!');
  }
}


// Date Picker
new Pikaday({ field: startDate });


// Timestamps are Same
const timesSameDay = (time1, time2) => {
  const date1 = new Date(time1);
  const date2 = new Date (time2);
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}