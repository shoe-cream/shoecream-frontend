import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import sendGetEmployeeReportRequest from '../../requests/GetReportEmployee';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const generateRecentFiveDaysRanges = () => {
  const ranges = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i);

    const startDate = currentDate.toISOString().slice(0, 10);
    const endDate = currentDate.toISOString().slice(0, 10);

    ranges.unshift({ startDate, endDate });
  }

  return ranges;
};

const SalesPerformanceChart = ({ employee }) => {
  const [recentFiveDaysReport, setRecentFiveDaysReport] = useState([]);
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDailyReports = async () => {
      const ranges = generateRecentFiveDaysRanges();
      const dailyReport = [];

      for (const range of ranges) {
        await sendGetEmployeeReportRequest(state, range.startDate, range.endDate, (data) => {
          const filteredData = data.filter(item => item.employeeId === employee.data.employeeId);
          
          if (filteredData.length > 0) {
            const firstData = filteredData[0];
            dailyReport.push({
              date: range.startDate,
              margin: firstData.marginRate,
              totalOrderCount: firstData.totalOrderCount,
              totalOrderPrice: firstData.totalOrderPrice
            });
          } else {
            dailyReport.push({
              date: range.startDate,
              margin: 0,
              totalOrderCount: 0,
              totalOrderPrice: 0
            });
          }
        }, setIsLoading);
      }
      setRecentFiveDaysReport(dailyReport);
    };

    if (employee.data && employee.data.employeeId) {
      fetchDailyReports();
    }
  }, [state, employee.data]);

  const chartData = useMemo(() => {
    const labels = recentFiveDaysReport.map(item => item.date);
    const orderCounts = recentFiveDaysReport.map(item => item.totalOrderCount);
    const totalPrices = recentFiveDaysReport.map(item => item.totalOrderPrice);
    const margins = recentFiveDaysReport.map(item => item.margin);

    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: '주문 건수',
          data: orderCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: '총 금액 (원)',
          data: totalPrices,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: '마진율 (%)',
          data: margins,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          yAxisID: 'y1',
        },
      ],
    };
  }, [recentFiveDaysReport]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '주문 건수',
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: '총 금액 (원) / 마진율 (%)',
        },
        ticks: {
          callback: function (value, index, ticks) {
            if (index === 0) {
              return value + '%';
            }
            return value.toLocaleString() + '원';
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.dataset.label === '마진율 (%)') {
              return tooltipItem.raw + '%';
            } else if (tooltipItem.dataset.label === '총 금액 (원)') {
              return tooltipItem.raw.toLocaleString() + '원';
            }
            return tooltipItem.raw;
          },
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Bar data={chartData} options={options} />;
};

export default SalesPerformanceChart;