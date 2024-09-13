import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import './CancelledOrdersPage.css';
import DatePicker from 'react-datepicker';
import getOrderAllRequest from '../../requests/GetOrders';
import { useAuth } from '../../auth/AuthContext';
import PageContainer from '../../components/page_container/PageContainer';

const CancelledOrdersPage = () => {
    const columns = [
        { Header: "담당자", accessor: "employeeId" },
        { Header: "주문번호", accessor: "orderId" },
        { Header: "주문상태", accessor: "status" },
        { Header: "등록일", accessor: "createdAt" },
        { Header: "납기일", accessor: "requestDate" },
        { Header: "고객사 명", accessor: "buyerNm" },
        { Header: "고객 코드", accessor: "buyerCd" },
        { Header: "제품 명", accessor: "itemNm" },
        { Header: "수량", accessor: "qty" },
        { Header: "금액", accessor: "unitPrice" },
        { Header: "총금액", accessor: "totalPrice" },
    ];

    const [checked, setChecked] = useState([]);
    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState({ data: [], pageInfo: {} });
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [data, setData] = useState([]);

    const transformData = useCallback((ordersData) => {
        return ordersData.flatMap(order =>
            order.orderItems.map(item => ({
                employeeId: order.employeeId,
                orderId: order.orderId,
                status: order.status,
                createdAt: order.createdAt,
                requestDate: order.requestDate,
                buyerNm: order.buyerNm,
                buyerCd: order.buyerCd,
                itemNm: item.itemCd,
                qty: item.qty,
                unitPrice: item.unitPrice,
                totalPrice: item.qty * item.unitPrice,
                startDate: item.startDate,
                endDate: item.endDate
            }))
        );
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            await getOrderAllRequest(
                state,
                null,
                null,
                'CANCELLED',
                null,
                null,
                null,
                page,
                10,
                (response) => {
                    setOrders(response);
                    const transformedData = transformData(response.data);
                    setData(transformedData);
                },
                setIsLoading
            );
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    }, [state, page, transformData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

  
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            await getOrderAllRequest(
                state,
                null,
                null,
                null,
                keyword,
                startDate,
                endDate,
                1, // 검색 시 첫 페이지부터 시작
                10,
                (response) => {
                    setOrders(response);
                    const transformedData = transformData(response.data);
                    setData(transformedData);
                    setPage(1); // 페이지를 1로 리셋
                },
                setIsLoading
            );
        } catch (error) {
            console.error("Error searching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };

    const DateRangePicker = () => (
        <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            dateFormat="yyyy/MM/dd"
            placeholderText="기간 선택"
        />
    );

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='date'>
                        <DateRangePicker />
                        <label>주문 번호</label>
                        <input type='text' id='productName' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        <button id='searchProduct' className='search-button' onClick={handleSearch}>
                            <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                        </button>
                    </div>
                    <div className='actions-container'>
                        <button className='miscBtn' onClick={handleSearch}>조회</button>
                        <button className='load-btn' onClick={handleExportToExcel}>엑셀 다운</button>
                        <button className='load-btn' onClick={handlePrint}>인쇄</button>
                    </div>
                    <h2>취소된 주문</h2>
                    {isLoading ? (
                        <div></div>
                    ) : (
                        <ReactTableWithCheckbox 
                            columns={columns} 
                            data={data} 
                            checked={checked} 
                            setChecked={setChecked} 
                        />
                    )}
                </div>
            </div>
            {!isLoading && orders.pageInfo && (
                <PageContainer
                    currentPage={page}
                    setPage={setPage}
                    pageInfo={orders.pageInfo}
                    getPage={fetchData}
                />
            )}
        </div>
    );
}

export default CancelledOrdersPage;