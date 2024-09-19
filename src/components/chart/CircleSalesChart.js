import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#82ca9d', '#8884d8', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SalesCircleChart = ({ data }) => {

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

  const renderLegendText = (value, entry, index) => {
    return data[index].itemNm;
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p>{`${data.itemCd} : ${data.totalOrdered}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          dataKey="totalOrdered"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend formatter={renderLegendText} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesCircleChart;