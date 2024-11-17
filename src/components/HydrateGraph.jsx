import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,  
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const HydrateGraph = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      const timeLabels = [];
      const volumeData = [];
      const hydrateData = [];

      Object.entries(data).forEach(([timeString, values]) => {
        const time = dayjs(timeString).toDate();
        const volume = values["Inj Gas Meter Volume Instantaneous"];
        const hydrate = values["Hydrate"];

        // Push to arrays
        timeLabels.push(time);
        volumeData.push(volume);
        
        if (hydrate) {
          hydrateData.push({ x: time, y: volume });
        }
      });

      setChartData({
        labels: timeLabels,
        datasets: [
          {
            label: 'Volume Data',
            data: volumeData,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Hydrate Points',
            data: hydrateData,
            borderColor: 'red',
            backgroundColor: 'red',
            radius: 6,
            pointStyle: 'circle',
            showLine: false,  // Don't connect these points with a line
          },
        ],
      });
    }
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Hydrate Volume Data with Marked Points',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} units at ${dayjs(tooltipItem.label).format('YYYY-MM-DD hh:mm A')}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',  // Time-based x-axis
        time: {
          unit: 'minute',  // Adjust time granularity
          tooltipFormat: 'll',  // Date format in tooltips
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Volume (units)',
        },
      },
    },
  };

  return (
    <div>
      <h2>Hydrate Volume Summary</h2>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default HydrateGraph;
