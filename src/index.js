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

  const dates = objectified.map(o => o.date);
  const historic = objectified.map(o => o.historic);
  const scanned = objectified.map(o => o.scanned);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Auto Data',
        data: historic,
      },
      {
        label: 'Scanned Data',
        data: scanned,
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