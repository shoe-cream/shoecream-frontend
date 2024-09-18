import React, { useEffect, useState } from 'react';
import '../../App.css';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import SalesChart from '../../components/chart/SalesChart';
import SalesCircleChart from '../../components/chart/CircleSalesChart';
import { useAuth } from '../../auth/AuthContext';
import sendGetReportsRequest from '../../requests/GetReports';
import MonthChart from '../../components/chart/MonthSalesChart';

const LandingPage = () => {
    const { state } = useAuth();
    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [monthReport, setMonthReport] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

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

    const lineChartData = reports.map(report => ({
        itemCd: report.itemCd,
        itemNm: report.itemNm,
        totalOrderedPrice: report.totalOrderedPrice
    }));

    const generateMonthlyRanges = (year) => {
        const ranges = [];
        for (let month = 0; month < 12; month++) {
            const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
            const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10); // 해당 월의 마지막 날
            ranges.push({ startDate, endDate });
        }
        console.log("asdasd",ranges)
        return ranges;
    };
    
    const flatData = (data) => {
        let totalAmount = 0;
        for(let i = 0; i < data.length; i++){
            totalAmount += data[i].totalOrderedPrice;
        }
        return totalAmount;
      }
    

    useEffect(() => {
        const fetchMonthlyReports = async () => {
            const year = new Date().getFullYear();
            const ranges = generateMonthlyRanges(year);
            const monthlyTotals = [];

            for (const range of ranges) {
                await sendGetReportsRequest(state, range.startDate, range.endDate, setMonthReport, setIsLoading);
                console.log("MOnthReport", monthReport)
                const totalAmount = flatData(monthReport);  // 월별 총 금액 계산
                monthlyTotals.push({
                    name: new Date(range.startDate).toLocaleString('default', { month: 'short' }),  // 월 이름 (예: Jan)
                    totalAmount: totalAmount,
                });
            }
            setMonthlyData(monthlyTotals);  // 월별 데이터를 상태로 저장
        };
        fetchMonthlyReports();
    }, [state]);

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
                            <div style={{ width: '80%', margin: '20px auto' }}>
                                <h2>아이템 코드별 주문 수량</h2>
                                <MonthChart data={monthlyData} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;