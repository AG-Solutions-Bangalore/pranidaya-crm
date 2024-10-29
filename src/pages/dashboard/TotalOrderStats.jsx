// DonationBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DonationBarChart = ({ chartData }) => {
  const data = {
    labels: chartData.labels, 
    datasets: [
      {
        label: 'Donation Amount',
        data: chartData.values, // Values for the Y-axis
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Set a color for the bars
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Donation Receipts',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DonationBarChart;
