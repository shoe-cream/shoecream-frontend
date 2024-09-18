import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// 색상 배열
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d84c73', '#b884d8'];

// 차트 컴포넌트
const SalesChart = ({ data }) => {
  // 데이터가 없을 경우 처리
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
      <XAxis 
          dataKey="itemCd" 
          tickFormatter={(value, index) => `${value} (${data[index].itemNm})`}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalOrderedPrice" barSize={50} name="주문 금액">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;