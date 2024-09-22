import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const COLORS = [
  'rgba(75, 192, 192, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(153, 102, 255, 0.6)'
];

const SalesChart = ({ amountData, quantityData }) => {
  if (!amountData || !quantityData || amountData.length === 0 || quantityData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        데이터가 없습니다. 다른 날짜 범위를 선택해 주세요.
      </div>
    );
  }

  const chartData = {
    labels: amountData.map((item) => item.itemNm),
    datasets: [
      {
        label: '주문 총 금액 ($)',
        data: amountData.map((item) => item.totalOrderedPrice),
        backgroundColor: COLORS[0],
        borderColor: COLORS[0].replace('0.6', '1'),
        borderWidth: 1,
        yAxisID: 'y-axis-1',
      },
      {
        label: '주문 수량',
        data: quantityData.map((item) => item.totalOrdered),
        backgroundColor: COLORS[1],
        borderColor: COLORS[1].replace('0.6', '1'),
        borderWidth: 1,
        yAxisID: 'y-axis-2',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        titleFont: { weight: 'bold' },
        bodyColor: '#fff',
        bodySpacing: 4,
        padding: 10,
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            const dataItem = context.dataset.data[context.dataIndex];
            return [
              `${datasetLabel}: ${value.toLocaleString()}`,
              `제품코드: ${amountData[context.dataIndex].itemCd}`,
              `제품 이름: ${amountData[context.dataIndex].itemNm}`,
            ];
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '제품 이름',
          font: { size: 14, weight: 'bold' },
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      'y-axis-1': {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: '주문 총 금액 ($)',
          font: { size: 14, weight: 'bold' },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      'y-axis-2': {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '주문 수량',
          font: { size: 14, weight: 'bold' },
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;