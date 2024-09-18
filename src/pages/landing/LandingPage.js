import React, { useEffect, useState } from 'react';
import '../../App.css';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import SalesChart from '../../components/chart/SalesChart';
import SalesCircleChart from '../../components/chart/CircleSalesChart';
import { useAuth } from '../../auth/AuthContext';
import sendGetReportsRequest from '../../requests/GetReports';

const LandingPage = () => {
    const { state } = useAuth();
    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        sendGetReportsRequest(state, startDate, endDate, setReports, setIsLoading);
    }, [state, startDate, endDate]);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // 막대 차트 데이터 가공
    const barChartData = reports.map(report => ({
        itemCd: report.itemCd,
        itemNm: report.itemNm,
        totalOrderedPrice: report.totalOrderedPrice
    }));

    // 원형 차트 데이터 가공
    const pieChartData = reports.map(report => ({
        itemCd: report.itemCd,
        itemNm: report.itemNm,
        totalOrdered: report.totalOrdered
    }));

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className="date-range-inputs">
                        <span>조회기간:</span>
                        <input
                            type="date"
                            className="input w-40"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <span>~</span>
                        <input
                            type="date"
                            className="input w-40"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    {isLoading ? (
                        <div></div>
                    ) : (
                        <>
                            <div style={{ width: '80%', margin: '20px auto' }}>
                                <h2>아이템 코드별 주문 금액</h2>
                                <SalesChart data={barChartData} />
                            </div>
                            <div style={{ width: '80%', margin: '20px auto' }}>
                                <h2>아이템 코드별 주문 수량</h2>
                                <SalesCircleChart data={pieChartData} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;