import Header from '../../components/header/Header';
import React from 'react';
import SalesChart from '../../components/chart/SalesChart';  // 방금 만든 차트 컴포넌트
import MonthSalesChart from '../../components/chart/MonthSalesChart'
import CircleSalesChart from '../../components/chart/CircleSalesChart'
import Sidebar from '../../components/sidebar/Sidebar';

const LandingPage = () => {
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

                </div>
            </div>
        </div> 
    );
}

export default LandingPage;