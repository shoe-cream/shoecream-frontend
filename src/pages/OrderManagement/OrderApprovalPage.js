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
import sendPatchStatusRequest from '../../requests/PatchOrdersStatus';
import { FileDown, Printer, FileText, Edit } from 'lucide-react';

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
    const [originalData, setOriginalData] = useState({ data: [] });
    const [modifiedData, setModifiedData] = useState({ data: [] });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchParams, setSearchParams] = useState({});



    useEffect(() => {
        setTimeout(() => {
            setIsPageLoaded(true);
        }, 100);
    }, []);

    const transOrderData = ({ data }) => {
        if (!Array.isArray(data)) {
            return []; // data가 배열이 아니면 빈 배열 반환
        }
        let result = [];
        console.log("datadata", data);
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
                obj["endDate"] = data[i].orderItems[j].endDate;
                result.push(obj);
            }
        }
        console.log("Result::::", result);
        return result;
    };

    const fetchOrders = useCallback(() => {
        setIsLoading(true);
        getOrderAllRequest(
            state,
            searchParams,
            page,
            10,
            (data) => {
                setOrders(data);
                const transformed = transOrderData(data);
                setOriginalData({ data: transformed });
                setModifiedData({ data: transformed });
                setIsLoading(false);
            },
            setIsLoading
        );
    }, [state, searchParams, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, status]);


    const handleSearch = (params) => {
        setSearchParams(params);
        setPage(1);
    };

    const handleApprove = () => {
        if (checkedItems.length === 0) {
            alert("승인할 항목을 선택해주세요.");
            return;
        }

        let newStatus;
        switch (status) {
            case 'REQUEST_TEMP':
                newStatus = 'PURCHASE_REQUEST';
                break;
            case 'PURCHASE_REQUEST':
                newStatus = 'APPROVED';
                break;
            // case 'CANCELLED':
            // case 'REJECTED':
            //     newStatus = 'REQUEST_TEMP';
            //     break;
            default:
                alert("현재 상태에서는 승인 작업을 수행할 수 없습니다.");
                return;
        }
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));
        
        const itemsToSend = ordersPatch.map(item => ({
            orderId: item.orderId,
            requestDate: item.requestDate,
            orderStatus : newStatus
        }));
        sendPatchStatusRequest(state, itemsToSend, () => {
            // 요청 성공 후 데이터 다시 가져오기
            fetchOrders();
            // 수정 상태 초기화
            setCheckedItems([]);
        });

    }


    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };


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
        setPage(1);
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
        setSearchParams(prev => ({ ...prev, status: currentStatus }));
    }, []);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const columns = useMemo(() => [
        { Header: "담당자", accessor: "employeeId" },
        { Header: "주문코드", accessor: "orderCd" },
        { Header: "주문상태", accessor: "status" },
        { Header: "등록일", accessor: "createdAt" },
        { Header: "납기일", accessor: "requestDate", type: "date" },
        { Header: "고객사 명", accessor: "buyerNm" },
        { Header: "고객 코드", accessor: "buyerCd" },
        { Header: "제품 코드", accessor: "itemCd" },
        { Header: "수량", accessor: "qty", type: "number" },
        { Header: "제품 단가", accessor: "unitPrice", type: "number" },
        { Header: "시작일", accessor: "startDate", type: "date" },
        { Header: "만기일", accessor: "endDate", type: "date" }
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
                                <TabList className="centered-tabs">
                                    <Tab>전체주문조회</Tab>
                                    <Tab>견적요청</Tab>
                                    <Tab>발주요청</Tab>
                                    <Tab>승인된 주문</Tab>
                                    <Tab>취소된 주문</Tab>
                                    <Tab>반려된 주문</Tab>
                                </TabList>
                            </div>
                            <div className='tab-content'>
                                {[0, 1, 2, 3, 4, 5].map((tabIndex) => (
                                    <TabPanel key={tabIndex}>
                                        <div className="search-container">
                                            <OrderDatepickerSelect
                                                handleSearch={handleSearch}
                                                startDate={startDate}
                                                endDate={endDate}
                                                setStartDate={setStartDate}
                                                setEndDate={setEndDate}
                                            />
                                        </div>
                                        <div className="date-range-container">
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
                                            <div className="action-buttons-container"></div>
                                            <div className="right-aligned-buttons">
                                                <button className='btn btn-secondary' onClick={handlePatchOrder}>
                                                    <Edit className="btn-icon" size={14} /> 수정
                                                </button>
                                                {tabIndex === 1 && (
                                                    <button className='btn btn-secondary' onClick={handlePatchOrder}>
                                                        <FileText className="btn-icon" size={14} /> 견적서 발행
                                                    </button>
                                                )}
                                                 <button className='btn btn-secondary' onClick={handleApprove}>
                                                    <Edit className='"btn-icon' size={14} /> 승인
                                                </button>
                                                <button className='btn btn-secondary' onClick={handleExportToExcel}>
                                                    <FileDown className="btn-icon" size={14} /> 엑셀 다운로드
                                                </button>
                                                <button className='btn btn-secondary' onClick={handlePrint}>
                                                    <Printer className="btn-icon" size={14} /> 인쇄
                                                </button>
                                            </div>
                                        </div>
                                        {isLoading ? (
                                            <div></div>
                                        ) : (
                                            <>
                                                {modifiedData.data.length > 0 ? (
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
                                                ) : (
                                                    <div>검색 결과가 없습니다.</div>
                                                )}
                                                {modifiedData.data.length > 0 && (
                                                    <button onClick={handlePatchOrder} className='save-btn' disabled={Object.keys(edited).length === 0}>
                                                        변경사항 저장
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </TabPanel>
                                ))}
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