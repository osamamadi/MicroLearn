// src/Components/ComponentsAdmin/MostSearchedPieChart.jsx
'use client';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components required for a pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const MostSearchedPieChart = ({ labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Searches',
        data: data,
        backgroundColor: [
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(255, 99, 132, 0.7)', // Red
          'rgba(75, 192, 192, 0.7)', // Green (if more than 3, though we only show top 3)
          'rgba(255, 206, 86, 0.7)', // Yellow (if more than 3)
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control the height/width via CSS
    plugins: {
      legend: {
        position: 'bottom', // Place legend at the bottom
        labels: {
          color: 'rgb(107 114 128)', // Tailwind gray-500 for dark mode compatibility
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + ' searches';
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-80 flex items-center justify-center">
      {' '}
      {/* Fixed height for the chart container */}
      {labels.length > 0 && data.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No search data available for charting.
        </p>
      )}
    </div>
  );
};

export default MostSearchedPieChart;
