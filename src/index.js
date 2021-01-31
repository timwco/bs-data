const ctx = document.getElementById('myChart').getContext('2d');

const manipulate = (payload) => {
  const {data} = payload;
  data.splice(0,2);
  
  const objectified = data.map(d => (
    {
      date: Date.parse(d[2]),
      historic: Number(d[4]),
      scanned: Number(d[5]),
    }
  ));

  const dataArray = [];
  objectified.forEach(d => {
    if (d.historic > 0) {
      dataArray.push({ t: d.date, y: d.historic });
    }
    // } else if (d.scanned > 0) {
    //   dataArray.push({ t: d.date, y: d.scanned }); 
    // }
  })

  const sortedData = dataArray.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate - bDate;
  })

  console.log(sortedData);

  displayChart(sortedData);

}

const config = {
	complete: function(results) {
    manipulate(results);
  },
}

const parseBtn = document.getElementById('parse');

parseBtn.onclick = () => {
  const fileInput = document.getElementById('files');
  const file = fileInput.files[0];
  if (file) {
    Papa.parse(file, config);
  } else {
    alert('Please select a file first!!');
  }
}