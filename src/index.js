// Grab Our Elements
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const parseBtn = document.getElementById('parse');
const standfordBtn = document.getElementById('standfordBtn');
const filterBtn = document.getElementById('filter');
const resetBtn = document.getElementById('reset');
const hiddenArea = document.querySelector('.hidden');

// Parse for Stanford
const standord = (payload) => {
  const {data} = payload;
  // Remove first two rows (two header rows)
  data.splice(0,2);
  
  // Convert data into an object, for easier use
  const objectified = [];
  data.forEach(d => {
    if (d[4]){
      objectified.push({
        "GlucoseDisplayTime": `${moment(d[2]).format('YYYY-MM-DD HH:mm:ss')}`,
        "GlucoseValue": `${Number(d[4])}`,
      })
    }
  })

  const tsvConfig = { delimiter: '\t' }
  const csvData = Papa.unparse(JSON.stringify(objectified), tsvConfig);
  const csvObj = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
  let csvURL =  null;
  if (navigator.msSaveBlob) {
    csvURL = navigator.msSaveBlob(csvObj, 'standford-upload.tsv');
  } else {
    csvURL = window.URL.createObjectURL(csvObj);
  }
  const tempLink = document.createElement('a');
  tempLink.href = csvURL;
  tempLink.setAttribute('download', 'standford-upload.tsv');
  tempLink.click();
}

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
  if (sdv && edv) {
    const startTimeStamp = Date.parse(sdv);
    const endTimeStamp = Date.parse(edv) + 86400000;
    graphedData = uniqueData.filter(d => (d.t > startTimeStamp && d.t < endTimeStamp));
  }

  if (graphedData.length === 0) {
    return alert('No data found in these filters! Please select different dates.');
  }

  displayChart(graphedData);
  hiddenArea.classList.remove('hidden');
}

// Parse Config (Manipulate)
const config = {
	complete: function(results) {
    manipulate(results);
  },
}

// Parse Config (Stanford)
const config2 = {
  complete: function(results) {
    standord(results);
  }
}

// Kick off the File Reader{
const readAndParseFile = (standford = false) => {
  const fileInput = document.getElementById('files');
  const file = fileInput.files[0];
  if (file) {
    if (standford) {
      Papa.parse(file, config2);
    } else {
      Papa.parse(file, config);
    }
  } else {
    alert('Please select a file first!!');
  }
}



// Parse Button Click Event Func
parseBtn.onclick = () => {
  readAndParseFile();
}

// Parse Button Click Event Func
standfordBtn.onclick = () => {
  console.log('HERE')
  readAndParseFile(true);
}

// Filter Button Click Event Func
filterBtn.onclick = () => {
  if (startDate.value !== '' && endDate.value !== '') {
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