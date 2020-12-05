import React from 'react';
import { Bar } from 'react-chartjs-2';
import { store } from "../../redux/store";
import 'chartjs-plugin-colorschemes';

function BarChart() {
  const data : any = {
      labels: [],
      datasets: [
        {
          label: 'Vacation Followers ❤︎',
          data: [], 
          // backgroundColor: ['red', 'blue', 'green'],
        }
      ],
  }

  const options : any = {
      maintainAspectRatio: true,
      plugins: {
        colorschemes: {
          scheme: 'brewer.SetTwo5'
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              min: 0,
            },
          },
        ],
      },
  }
  
  for (let item of store.getState().vacations) {
    data.labels.push(item.destination);
    data.datasets[0].data.push(item.amountOfFollowers);
  }

  return <Bar data={data} options={options} width={800} height={500}/>
}

export default BarChart
