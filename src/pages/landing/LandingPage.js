import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../../App.css';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import SalesChart from '../../components/chart/SalesChart';
import SalesCircleChart from '../../components/chart/CircleSalesChart';
import MonthChart from '../../components/chart/MonthSalesChart';
import { useAuth } from '../../auth/AuthContext';
import sendGetReportsRequest from '../../requests/GetReports';

const flatData = (data) => {
    let totalAmount = 0;
    for(let i = 0; i < data.length; i++){
        totalAmount += data[i].totalOrderedPrice;
    }
    return totalAmount;
}

const generateMonthlyRanges = (year) => {
    const ranges = [];
    for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
        const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);
        ranges.push({ startDate, endDate });
    }
    return ranges;
};

const LandingPage = () => {
    const { state } = useAuth();
    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        // BarChart와 PieChart를 위한 데이터 요청 (topNumber = 5)
        sendGetReportsRequest(state, startDate, endDate, setReports, setIsLoading, 5);
    }, [state, startDate, endDate]);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const barChartData = reports.map(report => ({
        itemCd: report.itemCd,
        itemNm: report.itemNm,
        totalOrderedPrice: report.totalOrderedPrice
    }));

    const pieChartData = reports.map(report => ({
        itemCd: report.itemCd,
        itemNm: report.itemNm,
        totalOrdered: report.totalOrdered
    }));

    useEffect(() => {
        const fetchMonthlyReports = async () => {
            const year = new Date().getFullYear();
            const ranges = generateMonthlyRanges(year);
            const monthlyTotals = [];
    
            for (const range of ranges) {
                await sendGetReportsRequest(state, range.startDate, range.endDate, (data) => {
                    const totalAmount = flatData(data);
                    monthlyTotals.push({
                        name: new Date(range.startDate).toLocaleString('default', { month: 'short' }),
                        totalAmount: totalAmount,
                    });
                }, setIsLoading);
            }
            setMonthlyData(monthlyTotals);
        };
        fetchMonthlyReports();
    }, [state]);

    const handleResetDates = () => {
        setStartDate('');
        setEndDate('');
    };

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
                         <button 
                            onClick={handleResetDates}
                            className="reset-button"
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            초기화
                        </button>
                    </div>
                    {isLoading ? (
                        <div></div>
                    ) : (
                        <Tabs>
                            <TabList>
                                <Tab>제품 코드별 주문 총금액</Tab>
                                <Tab>제품 코드별 주문 수량</Tab>
                                <Tab>월별 주문 금액</Tab>
                            </TabList>

                            <TabPanel>
                                <div style={{ width: '80%', margin: '20px auto' }}>
                                    <SalesChart data={barChartData} />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div style={{ width: '80%', margin: '20px auto' }}>
                                    <SalesCircleChart data={pieChartData} />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div style={{ width: '80%', margin: '20px auto' }}>
                                    <MonthChart data={monthlyData} />
                                </div>
                            </TabPanel>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;