const displayChart = generatedData => {
  const ctx = document.getElementById('myChart').getContext('2d');
  ctx.canvas.width = 1000;
  ctx.canvas.height = 300;

  const cfg = {
    data: {
      datasets: [{
        label: 'Blood Sugar',
        backgroundColor: '#148be8',
        borderColor: '#148be8',
        data: generatedData,
        type: 'bar',
        pointRadius: 0,
        fill: false,
        lineTension: 0,
        borderWidth: 2
      }]
    },
    options: {
      animation: {
        duration: 0
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'series',
          offset: true,
          ticks: {
            major: {
              enabled: true,
              fontStyle: 'bold'
            },
            source: 'data',
            autoSkip: true,
            autoSkipPadding: 75,
            maxRotation: 0,
            sampleSize: 100
          },
          afterBuildTicks: function(scale, ticks) {
            const majorUnit = scale._majorUnit;
            const firstTick = ticks[0];
            let i, ilen, val, tick, currMajor, lastMajor;

            val = moment(ticks[0].value);
            if ((majorUnit === 'minute' && val.second() === 0)
                || (majorUnit === 'hour' && val.minute() === 0)
                || (majorUnit === 'day' && val.hour() === 9)
                || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
                || (majorUnit === 'year' && val.month() === 0)) {
              firstTick.major = true;
            } else {
              firstTick.major = false;
            }
            lastMajor = val.get(majorUnit);

            for (i = 1, ilen = ticks.length; i < ilen; i++) {
              tick = ticks[i];
              val = moment(tick.value);
              currMajor = val.get(majorUnit);
              tick.major = currMajor !== lastMajor;
              lastMajor = currMajor;
            }
            return ticks;
          }
        }],
        yAxes: [{
          gridLines: {
            drawBorder: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Target Range (70 - 110)'
          }
        }]
      },
      tooltips: {
        intersect: false,
        mode: 'index',
        callbacks: {
          label: function(tooltipItem, myData) {
            let label = myData.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += parseFloat(tooltipItem.value).toFixed(2);
            return label;
          }
        }
      }
    }
  };

  const chart = new Chart(ctx, cfg);
}