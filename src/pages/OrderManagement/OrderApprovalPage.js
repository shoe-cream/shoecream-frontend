import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import './OrderApprovalPage.css';
import 'react-tabs/style/react-tabs.css';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import OrderDatepickerSelect from '../../components/OrderPost/OrderDatepickerSelect';
import PageContainer from '../../components/page_container/PageContainer';
import getOrderAllRequest from '../../requests/GetOrders';
import { useAuth } from '../../auth/AuthContext';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox'
import '@fortawesome/fontawesome-free/css/all.min.css';



const OrderApprovalPage = () => {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();
    const [optionSelect, setOptionSelect] = useState('orderId');
    const [keyword, setKeyword] = useState('');
    const [orders, setOrders] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [edited, setEdited] = useState([]);
    const [ogData, setOgData] = useState({ data: [] });
    const [status, setStatus] = useState('');
    const [isPageLoaded, setIsPageLoaded] = useState(false); // 페이지 로드 상태 추가

    // 페이지가 로드될 때 애니메이션 적용을 위해 상태 변경
    useEffect(() => {
        setTimeout(() => {
            setIsPageLoaded(true); // 0.1초 후 애니메이션 실행
        }, 100);
    }, []);

    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };

    const handlePatchOrder = () => {
        console.log("Patch order functionality will go here.");
        // 여기에서 주문 수정 로직을 추가하면 됩니다.
    };

    const transformData = (orders) => {
        return orders.flatMap(order =>
            order.orderItems.map(item => ({
                orderCd: order.orderCd,
                employeeId: order.employeeId,
                status: order.status,
                createdAt: order.createdAt,
                buyerNm: order.buyerNm,
                buyerCd: order.buyerCd,
                requestDate: order.requestDate,
                itemCd: item.itemCd,
                qty: item.qty,
                unitPrice: item.unitPrice,
                totalPrice: (item.unitPrice || 0) * (item.qty || 0)  // totalPrice 계산
            }))
        );
    };

    const BaseTable = ({ data }) => {
        const columns = [
            { Header: "담당자", accessor: "employeeId" },
            { Header: "주문코드", accessor: "orderCd" },
            { Header: "주문상태", accessor: "status" },
            { Header: "등록일", accessor: "createdAt" },
            { Header: "납기일", accessor: "requestDate", editable: true },
            { Header: "고객사 명", accessor: "buyerNm" },
            { Header: "고객 코드", accessor: "buyerCd" },
            { Header: "제품 코드", accessor: "itemCd", editable: true },
            { Header: "수량", accessor: "qty", editable: true },
            { Header: "제품 단가", accessor: "unitPrice" },
            { Header: "총금액", accessor: "totalPrice" },
        ];

        return <EditableTableWithCheckbox columns={columns} ogData={ogData} data={data} checked={checkedItems} setChecked={setCheckedItems} edited={edited} setEdited={setEdited} />;
    };

    useEffect(() => {
        setIsLoading(true);
        getOrderAllRequest(state, null, null, null, null, null, null, page, 10, setOrders, setIsLoading);
    }, [page]);

    const handleGetOrdersAll = () => {
        setIsLoading(true);
        getOrderAllRequest(state, null, null, null, keyword, null, null, page, 10, setOrders, setIsLoading);
    };

    const handleTabSelect = (index) => {
        let currentStatus;
        switch (index) {
            case 0: currentStatus = null; break;
            case 1: currentStatus = 'REQUEST_TEMP'; break;
            case 2: currentStatus = 'PURCHASE_REQUEST'; break;
            case 3: currentStatus = 'APPROVED'; break;
            case 4: currentStatus = 'CANCELLED'; break;
            case 5: currentStatus = 'REJECTED'; break;
        }
        setStatus(currentStatus);
        setIsLoading(true);
        getOrderAllRequest(state, null, null, currentStatus, null, null, null, page, 10, setOrders, setIsLoading);
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container fade-in'> {/* 애니메이션 클래스 추가 */}
                    <div className='tab-container'>
                        <Tabs onSelect={handleTabSelect}>
                            <div className='tab-list-container'>
                                <TabList>
                                    <Tab>전체주문조회</Tab>
                                    <Tab>견적요청</Tab>
                                    <Tab>발주요청</Tab>
                                    <Tab>Completed Orders</Tab>
                                    <Tab>취소된 주문</Tab>
                                    <Tab>Returned Orders</Tab>
                                </TabList>
                                <div className='tab-actions'>
                                    <button className='load-btn' onClick={handleExportToExcel}>
                                        <i className="fas fa-file-excel"></i> 엑셀 다운로드
                                    </button>
                                    <button className='load-btn' onClick={handlePrint}>
                                        <i className="fas fa-print"></i> 인쇄
                                    </button>
                                </div>
                            </div>
                            <div className='tab-content'>
                                <TabPanel>
                                    <h2>전체주문조회</h2>
                                    <OrderDatepickerSelect GetOrdersAll={handleGetOrdersAll}
                                        optionSelect={optionSelect} setOptionSelect={setOptionSelect}
                                        keyword={keyword} setKeyword={setKeyword}>
                                    </OrderDatepickerSelect>
                                    <button id='Approve_Purchase' onClick={handlePatchOrder}>수정</button>
                                    {isLoading ? (
                                        <div />
                                    ) : (
                                        <BaseTable data={{ data: orders?.data ? transformData(orders.data) : [] }} />
                                    )}
                                </TabPanel>
                                {/* 다른 TabPanel 내용 */}
                            </div>
                        </Tabs>
                    </div>
                    {isLoading ? <div /> : <PageContainer
                        currentPage={page}
                        setPage={setPage}
                        pageInfo={orders.pageInfo}
                        getPage={() => { handleGetOrdersAll() }}
                    ></PageContainer>}
                </div>
            </div>
        </div>
    );
}

export default OrderApprovalPage;
