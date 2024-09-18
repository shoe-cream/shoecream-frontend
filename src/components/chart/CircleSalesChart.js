import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 원형 그래프의 색상 배열
const COLORS = ['#82ca9d', '#8884d8', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// 차트 컴포넌트
const SalesCircleChart = ({ data }) => {
  // 데이터가 없을 경우 처리
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Legend에 표시될 내용을 itemNm으로 포맷
  const renderLegendText = (value, entry) => {
    const item = data.find(item => item.itemCd === entry.itemCd);
    console.log("itemNm" , data[0].itemNm);
    return item ? item.itemNm : value; // itemNm이 없으면 기본값 사용
  };

  const flatData = () => {
    let itemName = [];
    for(let i = 0; i < data.length; i++){
        itemName[i] = data[i].itemNm;
    }
    return itemName ? itemName : [];
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" // 중앙 X 위치
          cy="50%" // 중앙 Y 위치
          outerRadius={150} // 원형 그래프의 외부 반지름
          label={({ itemCd, itemNm }) => `${itemCd} - ${itemNm}`} // 각 조각 안에 이름과 값 표시
          fill="#8884d8"
          dataKey="totalOrdered"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend formatter={flatData} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesCircleChart;
