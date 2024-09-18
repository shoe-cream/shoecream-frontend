import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 현재 월과 이전 3개월의 데이터 생성
const generateData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth(); // 현재 월 (0-11)
  
  // 이전 3개월 데이터 생성
  return months.slice(currentMonth - 3, currentMonth + 1).map(month => ({
    name: month,
    cotton: Math.floor(Math.random() * 200), // 임의의 데이터
  }));
};

// 차트 컴포넌트
const LineChart = () => {
  const data = generateData(); // 데이터 생성

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />  {/* 마우스 hover시 데이터 보여줌 */}
        <Legend />
        <Line type="monotone" dataKey="cotton" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;