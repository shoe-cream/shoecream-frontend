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
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
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
    const [ogData, setOgData] = useState({});
    const [status, setStatus] = useState('');
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsPageLoaded(true);
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
            { Header: "제품 코드", accessor: "itemCd" },
            { Header: "수량", accessor: "qty" },
            { Header: "제품 단가", accessor: "unitPrice" },
        ];

        return <EditableTableWithCheckbox 
            columns={columns} 
            ogData={ogData} 
            data={data} 
            checked={checkedItems} 
            setChecked={setCheckedItems} 
            edited={edited} 
            setEdited={setEdited} 
        />;
    };

    useEffect(() => {
        setIsLoading(true);
        getOrderAllRequest(state, null, null, null, null, null, null, page, 10, setOrders, setIsLoading);
    }, [page, state]);

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
            default: currentStatus = null;
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
                <div className={`app-content-container ${isPageLoaded ? 'fade-in' : ''}`}>
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
                                    <button className='btn btn-secondary' onClick={handleExportToExcel}>

                                        <i className="fas fa-file-excel"></i> 엑셀 다운로드
                                    </button>
                                    <button className='btn btn-secondary' onClick={handlePrint}>
                                        <i className="fas fa-print"></i> 인쇄
                                    </button>
                                </div>
                            </div>
                            <div className='tab-content'>
                                <TabPanel>
                                    <h2>전체주문조회</h2>
                                    {/* 검색창과 주문코드 유지 */}
                                    <div className="flex space-x-2 items-center">
                                        <OrderDatepickerSelect 
                                            GetOrdersAll={handleGetOrdersAll}
                                            optionSelect={optionSelect} 
                                            setOptionSelect={setOptionSelect}
                                            keyword={keyword} 
                                            setKeyword={setKeyword}
                                        />
                                       
                                    </div>

                                    {/* 조회기간과 견적서 발행, 수정 버튼을 컨테이너에 넣기 */}
                                    <div className="flex flex-col space-y-4 mt-4 border p-4 rounded-lg shadow">
                                        <div className="flex space-x-4 items-center">
                                            <span>조회기간:</span>
                                            <input type="date" className="input w-40" />
                                            <span>~</span>
                                            <input type="date" className="input w-40" />
                                        </div>
                                        <div className="flex space-x-4 items-center">
                                            <button className='btn btn-primary' onClick={handlePatchOrder}>견적서 발행</button>
                                            <button className='btn btn-primary' onClick={handlePatchOrder}>수정</button>
                                        </div>
                                    </div>

                                    {isLoading ? (
                                        <div>로딩 중...</div>
                                    ) : (
                                        <>
                                            <BaseTable data={orders} />
                                        </>
                                    )}
                                </TabPanel>
                                {/* 다른 TabPanel 내용 */}
                            </div>
                        </Tabs>
                    </div>
                    {!isLoading && (
                        <PageContainer
                            currentPage={page}
                            setPage={setPage}
                            pageInfo={orders.pageInfo}
                            getPage={handleGetOrdersAll}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderApprovalPage;
