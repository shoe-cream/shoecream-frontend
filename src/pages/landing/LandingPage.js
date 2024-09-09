import Header from '../../components/header/Header';
import React, { useState } from 'react';
import SalesChart from '../../components/chart/SalesChart';  // 방금 만든 차트 컴포넌트
import MonthSalesChart from '../../components/chart/MonthSalesChart'
import CircleSalesChart from '../../components/chart/CircleSalesChart'
import Sidebar from '../../components/sidebar/Sidebar';
import Table from '../../components/Table/TableExample';
import { useAuth } from '../../auth/AuthContext';

const LandingPage = () => {
    const { state } = useAuth();
    const [selectedRows, setSelectedRows] = useState([]);
    const columns = ['Name', 'Age', 'Location'];
    const data = [
      { Name: 'John Doe', Age: 30, Location: 'New York' },
      { Name: 'Jane Smith', Age: 25, Location: 'Los Angeles' },
      { Name: 'Sam Green', Age: 35, Location: 'Chicago' },
    ];
  
    const handleSendData = (selected) => {
      setSelectedRows(selected);
      console.log('Selected Rows in LandingPage:', selected);
      // 선택된 데이터를 다른 컴포넌트로 전달하거나 API 호출 등을 할 수 있습니다.
    };
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>랜딩 페이지~</div>
                    <p>이 페이지는 데이터를 시각화하여 보여줍니다.</p>

                    {/* 차트 삽입 */}
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <h2>판매 추이</h2>
                        <SalesChart /> {/* 차트 컴포넌트 추가 */}
                    </div>
                    
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <h2>판매 추이</h2>
                        <MonthSalesChart /> {/* 차트 컴포넌트 추가 */}
                    </div>
                    
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <h2>판매 추이</h2>
                        <CircleSalesChart /> {/* 차트 컴포넌트 추가 */}
                    </div>

                    <div style={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
                        <h2>판매 데이터</h2>
                        <Table columns={columns} data={data} onSendData={handleSendData} />
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default LandingPage;