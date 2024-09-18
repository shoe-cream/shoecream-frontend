import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthChart = ({ data }) => {
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