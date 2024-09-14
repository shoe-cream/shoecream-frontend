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
    const [edited, setEdited] = useState([]);
    const [status, setStatus] = useState('');
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [originalData, setOriginalData] = useState({data: []});
    const [modifiedData, setModifiedData] = useState({data : []});
  

    useEffect(() => {
        setTimeout(() => {
            setIsPageLoaded(true);
        }, 100);
    }, []);

    const transOrderData = ({data}) => {
        if (!Array.isArray(data)) {
            return []; // data가 배열이 아니면 빈 배열 반환
        }
        let result = [];
        console.log("datadata",data);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].orderItems.length; j++) {
                let obj = {};
                obj["employeeId"] = data[i].employeeId;
                obj["orderId"] = data[i].orderId;
                obj["orderCd"] = data[i].orderCd;
                obj["status"] = data[i].status;
                obj["createdAt"] = data[i].createdAt.split('T')[0];
                obj["requestDate"] = data[i].requestDate;
                obj["buyerNm"] = data[i].buyerNm;
                obj["buyerCd"] = data[i].buyerCd;
                obj["itemId"] = data[i].orderItems[j].orderItemId;
                obj["itemCd"] = data[i].orderItems[j].itemCd;
                obj["qty"] = data[i].orderItems[j].qty;
                obj["unitPrice"] = data[i].orderItems[j].unitPrice;
                obj["startDate"] = data[i].orderItems[j].startDate;
                result.push(obj);
            }
        }
        console.log("Result::::" , result);
        return result;
    };
    
    const fetchOrders = useCallback(() => {
        setIsLoading(true);
        getOrderAllRequest(state, null, null, status, keyword, null, null, page, 10, (data) => {
            setOrders(data);
            console.log("orderData", data);
            const transformed = transOrderData(data);
            setOriginalData({data:transformed});
            setModifiedData({data: transformed});
            // console.log("setOrders", orders);
            // console.log("originalData", originalData)
            // console.log("modifiedData", modifiedData)
            setIsLoading(false);
        }, setIsLoading);
    }, [state, status, keyword, page]); // transOrderData는 useCallback을 사용하지 않으므로 의존성에서 제외
    
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };

    // const handlePatchOrder = () => {
    //     // 수정된 항목을 찾기 위해 edited 배열의 인덱스를 확인
    //     const ordersPatch= modifiedData.filter((_, index) => checkedItems.includes(index));
    
    //     if (ordersPatch.length === 0) {
    //         console.log("수정된 항목이 없습니다.");
    //         return;
    //     }
    
    //     // 항목을 업데이트하기 위한 배열을 생성
    //     const sendOrderPatch = (order) => {
    //         const requestBody = {
    //             orderId : order.orderId,

    //         }
    //     }
    
    //     // 업데이트 요청을 보내는 함수 호출
    //     sendPatchMultiItemRequest(state, itemsToSend, () => {
    //         // 요청 성공 후 데이터 다시 가져오기
    //         fetchOrders();
    //         // 수정 상태 초기화
    //         setEdited([]);
    //     });
    // };

    const handlePatchOrder = () => {
        // modifiedData.data 배열에서 수정된 항목만 필터링
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));
    
        if (ordersPatch.length === 0) {
            console.log("수정된 항목이 없습니다.");
            return;
        }
    
        // 항목을 업데이트하기 위한 배열을 생성
        const itemsToSend = ordersPatch.map(item => ({
            orderId: item.orderId,
            itemId: item.itemId,
            unitPrice: item.unitPrice,
            qty: item.qty,
            startDate: item.startDate,
            endDate: item.endDate
        }));
    
        // 업데이트 요청을 보내는 함수 호출
        sendPatchMultiItemRequest(state, itemsToSend, () => {
            // 요청 성공 후 데이터 다시 가져오기
            fetchOrders();
            // 수정 상태 초기화
            setCheckedItems([]);
        });
    };

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
        { Header: "시작일", accessor: "startDate", type:"date"} 
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
                                                ogData={originalData}
                                                data={modifiedData}
                                                setData={setModifiedData}
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
