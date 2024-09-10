import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import './OrderApprovalPage.css';
import 'react-tabs/style/react-tabs.css';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import OrderDatepickerSelect from '../../components/OrderPost/OrderDatepickerSelect';
import PageContainer from '../../components/page_container/PageContainer';

const BaseTable = ({ data }) => {
    const columns = React.useMemo(
        () => [
            { Header: "담당자", accessor: "member" },
            { Header: "주문번호", accessor: "orderId" },
            { Header: "주문상태", accessor: "orderStatus" },
            { Header: "등록일", accessor: "registerDate" },
            { Header: "납기일", accessor: "dueDate" },
            { Header: "고객사 명", accessor: "customerName" },
            { Header: "고객 코드", accessor: "customerCode" },
            { Header: "제품 명", accessor: "productName" },
            { Header: "수량", accessor: "quantity" },
            { Header: "금액", accessor: "price" },
            { Header: "총금액", accessor: "totalPrice" },
        ],
        []
    );

    return <ReactTableWithCheckbox columns={columns} data={data} />;
}

const OrderApprovalPage = () => {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const data = [
        { selection: false, member: "홍길동", orderId: "12345", orderStatus: "처리중", registerDate: "2024-09-01", dueDate: "2024-09-15", customerName: "고객사A", customerCode: "C001", productName: "제품A", quantity: 10, price: 50000, totalPrice: 500000 },
        // 추가 데이터...
    ];

    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='tab-container'>
                        <Tabs>
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
                                    <button className='excel' onClick={handleExportToExcel}>엑셀 다운로드</button>
                                    <button onClick={handlePrint}>인쇄</button>
                                </div>
                            </div>

                            <div className='tab-content'>
                                <TabPanel>
                                    <h2>전체주문조회</h2>
                                    <OrderDatepickerSelect></OrderDatepickerSelect>
                                    <BaseTable data={data} />
                                </TabPanel>
                                <TabPanel>
                                    <h2>견적요청</h2>
                                    <BaseTable data={data} />
                                </TabPanel>
                                <TabPanel>
                                    <h2>발주요청</h2>
                                    <BaseTable data={data} />
                                </TabPanel>
                                <TabPanel>
                                    <h2>Completed Orders</h2>
                                    <BaseTable data={data} />
                                </TabPanel>
                                <TabPanel>
                                    <h2>취소된 주문</h2>
                                    <BaseTable data={data} />
                                </TabPanel>
                                <TabPanel>
                                    <h2>Returned Orders</h2>
                                    <BaseTable data={data} />
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                    {isLoading ? <div/> : <PageContainer
                        currentPage={page}
                        setPage={setPage}
                        pageInfo={data.pageInfo}
                        getPage={() => {}}
                    ></PageContainer>}
                </div>
            </div>
        </div>
    );
}

export default OrderApprovalPage;
