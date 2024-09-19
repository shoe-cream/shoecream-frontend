import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthChart = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        color: '#666',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        데이터가 없습니다. 다른 날짜 범위를 선택해 주세요.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" />  {/* totalAmount로 라인 표시 */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthChart;