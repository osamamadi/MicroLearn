// src/Components/ComponentsAdmin/CategorySearchCountBarChart.jsx
'use client';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components required for a bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategorySearchCountBarChart = ({ labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Searches',
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)', // Green
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(255, 99, 132, 0.7)', // Red
          'rgba(255, 159, 64, 0.7)', // Orange
          // Add more colors if you expect many categories
          'rgba(199, 199, 199, 0.7)', // Light Gray
          'rgba(83, 109, 254, 0.7)', // Indigo
          'rgba(255, 100, 100, 0.7)', // Light Red
          'rgba(100, 255, 100, 0.7)', // Light Green
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 109, 254, 1)',
          'rgba(255, 100, 100, 1)',
          'rgba(100, 255, 100, 1)',
        ],
        borderWidth: 1,
        barPercentage: 0.8, // Adjusts the width of the bars relative to the category width
        categoryPercentage: 0.7, // Adjusts the spacing between categories
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control the height/width via CSS
    plugins: {
      legend: {
        position: 'top', // Position legend at the top
        labels: {
          color: 'rgb(107 114 128)', // Tailwind gray-500 for dark mode compatibility
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Total Searches Per Category',
        color: 'rgb(107 114 128)', // Title color for dark mode compatibility
        font: {
          size: 18,
          weight: 'bold', // Make title bold
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' searches';
            }
            return label;
          },
        },
        backgroundColor: 'rgba(30, 41, 59, 0.9)', // Darker background for tooltips (slate-800 equivalent)
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(107 114 128)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
          color: 'rgb(107 114 128)', // X-axis title color
          font: {
            size: 16,
            weight: 'bold', // Make axis title bold
          },
        },
        ticks: {
          color: 'rgb(107 114 128)', // X-axis label (tick) color
          font: {
            size: 12, // Slightly smaller font for rotated labels
          },
        },
        grid: {
            color: 'rgba(200, 200, 200, 0.05)', // Very subtle grid lines
            drawBorder: false, // Do not draw axis line itself
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Searches',
          color: 'rgb(107 114 128)', // Y-axis title color
          font: {
            size: 16,
            weight: 'bold', // Make axis title bold
          },
        },
        ticks: {
          color: 'rgb(107 114 128)', // Y-axis label (tick) color
          beginAtZero: true,
          callback: function(value) { if (value % 1 === 0) return value; }, // Show only whole numbers
          font: {
            size: 12,
          },
        },
        grid: {
            color: 'rgba(200, 200, 200, 0.05)', // Very subtle grid lines
            drawBorder: false, // Do not draw axis line itself
        }
      },
    },
  };

  return (
    // Height adjusted to give more space, width will be controlled by parent container
    <div className="w-full h-[400px] flex items-center justify-center p-4">
      {labels.length > 0 && data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No categorized search data available for charting (excluding 'Other').
        </p>
      )}
    </div>
  );
};

export default CategorySearchCountBarChart;