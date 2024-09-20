import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// 색상 배열
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d84c73', '#b884d8'];

// 커스텀 Tooltip은 Chart.js에서 기본 제공되므로 따로 작성할 필요가 없음

// 차트 컴포넌트
const SalesChart = ({ data }) => {
  // 데이터가 없을 경우 처리
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        데이터가 없습니다. 다른 날짜 범위를 선택해 주세요.
      </div>
    );
  }

  // 차트에 사용할 데이터와 옵션 설정
  const chartData = {
    labels: data.map((item) => item.itemNm),
    datasets: [
      {
        label: '주문 총 금액 ($)',
        data: data.map((item) => item.totalOrderedPrice),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataItem = data[context.dataIndex];
            return [
              `제품코드: ${dataItem.itemCd}`,
              `제품 이름: ${dataItem.itemNm}`,
              `주문 총 금액: ${dataItem.totalOrderedPrice.toLocaleString()}$`,
            ];
          },
        },
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '제품 이름',
        },
      },
      y: {
        title: {
          display: true,
          text: '주문 총 금액 ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
