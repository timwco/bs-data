const ctx = document.getElementById('myChart').getContext('2d');

const manipulate = (payload) => {
  const {data} = payload;
  data.splice(0,2);
  
  const objectified = data.map(d => (
    {
      id: d[1],
      date: d[2],
      method: d[3],
      historic: d[4],
      scanned: d[5],
    }
  ));

  const sortedData = objectified.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate - bDate;
  })

  const dates = sortedData.map(o => o.date);
  const historic = sortedData.map(o => o.historic);
  const scanned = sortedData.map(o => o.scanned);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Auto Data',
        data: historic,
        backgroundColor: '#1d80ab',
        borderColor: '#1d80ab',
      },
      {
        label: 'Scanned Data',
        data: scanned,
        backgroundColor: '#148be8',
        borderColor: '#148be8',        
      }
    ],
  }

  new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {}
  });

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