import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// 데이터: 신발 모델명과 판매 금액
const data = [
  { model: 'Nike Air Max', sales: 500, color: '#8884d8' },
  { model: 'Adidas UltraBoost', sales: 700, color: '#82ca9d' },
  { model: 'Converse All Star', sales: 300, color: '#ffc658' },
  { model: 'Puma RS-X', sales: 400, color: '#d84c73' },
  { model: 'New Balance 990', sales: 600, color: '#b884d8' },
];

// 차트 컴포넌트
const SalesBarChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <XAxis dataKey="model" /> {/* X축에 신발 모델명 */}
      <YAxis /> {/* Y축에 판매 금액 */}
      <Tooltip /> {/* 마우스 hover 시 정보 표시 */}
      <Legend />
      <Bar dataKey="sales" barSize={50}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default SalesBarChart;
