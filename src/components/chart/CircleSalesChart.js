import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 차트 데이터
const data = [
  { name: 'Cotton', value: 400 },
  { name: 'Silk', value: 300 },
  { name: 'Uncategorized', value: 300 },
];

// 원형 그래프의 색상 배열
const COLORS = ['#82ca9d', '#8884d8', '#ff7300'];

// 차트 컴포넌트
const SalesPieChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        cx="50%" // 중앙 X 위치
        cy="50%" // 중앙 Y 위치
        outerRadius={150} // 원형 그래프의 외부 반지름
        label={({ name }) => name} // 각 조각 안에 이름 표시
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default SalesPieChart;