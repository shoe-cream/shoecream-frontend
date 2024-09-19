import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// 색상 배열
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d84c73', '#b884d8'];

// 커스텀 Tooltip 컴포넌트
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        <p><strong>{`제품코드: ${data.itemCd}`}</strong></p>
        <p>{`제품 이름: ${data.itemNm}`}</p>
        <p>{`주문 총 금액: ${data.totalOrderedPrice.toLocaleString()}$`}</p>
      </div>
    );
  }
  return null;
};

// 차트 컴포넌트
const SalesChart = ({ data }) => {
  // 데이터가 없을 경우 처리
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
      <BarChart data={data}>
        <XAxis 
          dataKey="itemCd" 
          tickFormatter={(value) => `${value}`}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
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