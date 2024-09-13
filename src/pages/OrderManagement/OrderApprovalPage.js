import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import './OrderApprovalPage.css';
import 'react-tabs/style/react-tabs.css';
import OrderDatepickerSelect from '../../components/OrderPost/OrderDatepickerSelect';
import PageContainer from '../../components/page_container/PageContainer';
import getOrderAllRequest from '../../requests/GetOrders';
import { useAuth } from '../../auth/AuthContext';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import '@fortawesome/fontawesome-free/css/all.min.css';
import sendPatchMultiItemRequest from '../../requests/PatchOrders';

const OrderApprovalPage = () => {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();
    const [optionSelect, setOptionSelect] = useState('orderId');
    const [keyword, setKeyword] = useState('');
    const [orders, setOrders] = useState({ data: [] });
    const [checkedItems, setCheckedItems] = useState([]);
    const [edited, setEdited] = useState({});
    const [status, setStatus] = useState('');
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [originalData, setOriginalData] = useState([]);
    const [modifiedData, setModifiedData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setIsPageLoaded(true);
        }, 100);
    }, []);

    const transOrderData = useCallback(({data}) => {
        if (!Array.isArray(data)) {
            return [];
        }
        return data.flatMap(order => 
            order.orderItems.map(item => ({
                employeeId: order.employeeId,
                orderCd: order.orderCd,
                status: order.status,
                createdAt: order.createdAt,
                requestDate: order.requestDate,
                buyerNm: order.buyerNm,
                buyerCd: order.buyerCd,
                itemCd: item.itemCd,
                qty: item.qty,
                unitPrice: item.unitPrice,
            }))
        );
    }, []);

    const fetchOrders = useCallback(() => {
        setIsLoading(true);
        getOrderAllRequest(state, null, null, status, keyword, null, null, page, 10, (data) => {
            setOrders(data);
            const transformed = transOrderData(data);
            setOriginalData(transformed);
            setModifiedData(transformed);
            setIsLoading(false);
        }, setIsLoading);
    }, [state, status, keyword, page, transOrderData]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };


    const handlePatchOrder = useCallback(() => {
        const itemsToUpdate = modifiedData.map((item, index) => {
            if (edited[index]) {
                return {
                    orderId: item.orderCd,
                    itemId: item.itemCd,
                    unitPrice: item.unitPrice,
                    qty: item.qty,
                    startDate: item.requestDate,
                    endDate: item.requestDate
                };
            }
            return null;
        }).filter(item => item !== null);

        if (itemsToUpdate.length === 0) {
            console.log("수정된 항목이 없습니다.");
            return;
        }

        sendPatchMultiItemRequest(state, itemsToUpdate, () => {
            fetchOrders();
            setEdited({});
        });
    }, [modifiedData, edited, state, fetchOrders]);

    const handleGetOrdersAll = useCallback(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleTabSelect = useCallback((index) => {
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
    }, []);

    const handleDataChange = useCallback((newData) => {
        // newData와 newData.data가 존재하는지 확인
        if (newData && Array.isArray(newData.data)) {
            setModifiedData(newData.data);
            
            // 원본 데이터와 비교하여 변경된 항목 추적
            const updatedEdited = newData.data.reduce((acc, row, index) => {
                const originalRow = originalData[index];
                if (originalRow) {
                    const changedCells = Object.keys(row).reduce((cellAcc, key) => {
                        if (row[key] !== originalRow[key]) {
                            cellAcc[key] = row[key];
                        }
                        return cellAcc;
                    }, {});
                    if (Object.keys(changedCells).length > 0) {
                        acc[index] = changedCells;
                    }
                }
                return acc;
            }, {});
            setEdited(updatedEdited);
        } else {
            console.error('Invalid data structure received in handleDataChange');
        }
    }, [originalData]);

    const columns = useMemo(() => [
        { Header: "담당자", accessor: "employeeId" },
        { Header: "주문코드", accessor: "orderCd" },
        { Header: "주문상태", accessor: "status" },
        { Header: "등록일", accessor: "createdAt" },
        { Header: "납기일", accessor: "requestDate", type:"date" },
        { Header: "고객사 명", accessor: "buyerNm" },
        { Header: "고객 코드", accessor: "buyerCd" },
        { Header: "제품 코드", accessor: "itemCd" },
        { Header: "수량", accessor: "qty", type:"number" },
        { Header: "제품 단가", accessor: "unitPrice", type:"number" },
    ], []);

    
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
                                        <div>Loading...</div>
                                    ) : (
                                        <>
                                            <EditableTableWithCheckbox 
                                                columns={columns} 
                                                ogData={{ data: originalData }}
                                                data={{ data: modifiedData }}
                                                setData={handleDataChange}
                                                checked={checkedItems} 
                                                setChecked={setCheckedItems}
                                                edited={edited} 
                                                setEdited={setEdited} 
                                            />
                                            <button onClick={handlePatchOrder} disabled={Object.keys(edited).length === 0}>
                                                변경사항 저장
                                            </button>
                                        </>
                                    )}
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                    {!isLoading && orders.pageInfo && (
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
