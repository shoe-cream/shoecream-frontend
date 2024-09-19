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
import { FileDown, Printer, FileText, Edit, Check } from 'lucide-react';
import sendGetMyInfoRequest from '../../requests/GetMyInfoRequest';
import sendPatchApproveRequest from '../../requests/PatchOrdersApprove';
import sendPatchRejectRequest from '../../requests/PatchOrdersReject';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import TableModal from '../../components/modal/TableModal';
import sendGetSaleHistoryRequest from '../../requests/GetSaleHistoryRequest';
import MessageModal from '../../components/modal/MessageModal';
import Swal from 'sweetalert2';

const OrderApprovalPage = () => {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();
    const [optionSelect, setOptionSelect] = useState('orderCd');
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
    const [member, setMember] = useState({ data: [] });
    const [selectedOrders, setSelectedOrders] = useState([]);
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState({ data: [{ orderCd: 'Loading' }] });
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [rejectedOrderType, setRejectedOrderType] = useState('REJECTED');


    useEffect(() => {
        sendGetMyInfoRequest(state, setMember, setIsLoading);
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
                obj["requestDate"] = data[i].requestDate.split('T')[0];
                obj["buyerNm"] = data[i].buyerNm;
                obj["buyerCd"] = data[i].buyerCd;
                obj["itemId"] = data[i].orderItems[j].orderItemId;
                obj["itemCd"] = data[i].orderItems[j].itemCd;
                obj["qty"] = data[i].orderItems[j].qty;
                obj["unitPrice"] = data[i].orderItems[j].unitPrice;
                obj["startDate"] = data[i].orderItems[j].startDate.split('T')[0];
                obj["endDate"] = data[i].orderItems[j].endDate.split('T')[0];
                result.push(obj);
            }
        }
        console.log("Result::::", result);
        return result;
    };
    const handleCheckboxChange = (order) => {
        setSelectedOrders(prevSelectedOrders => {
            const exists = prevSelectedOrders.find(o => o.orderCd === order.orderCd);
            if (exists) {
                return prevSelectedOrders.filter(o => o.orderCd !== order.orderCd);
            } else {
                return [...prevSelectedOrders, order];
            }
        });
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
        console.log("State : ", state);
    }, [fetchOrders, status]);


    // const handleSearch = (params) => {
    //     setSearchParams(params);
    //     setPage(1);
    // };

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
            case 'APPROVED':
                newStatus = 'APPROVED';
                break;
            case 'REJECTED':
                newStatus = 'CANCELLED';
                break;
            default:
                alert("현재 상태에서는 승인 작업을 수행할 수 없습니다.");
                return;
        }

        // checkedItems에 해당하는 항목 필터링
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));

        // 중복된 orderId를 제거한 배열 생성
        const uniqueItems = ordersPatch.reduce((acc, item) => {
            if (!acc.some(existingItem => existingItem.orderId === item.orderId)) {
                acc.push(item);
            }
            return acc;
        }, []);

        const itemsToSend = uniqueItems.map(item => ({
            orderId: item.orderId,
            requestDate: item.requestDate,
            orderStatus: newStatus
        }));

        sendPatchStatusRequest(state, itemsToSend, () => {
            // 요청 성공 후 데이터 다시 가져오기
            fetchOrders();
            // 수정 상태 초기화
            setCheckedItems([]);
        });
    };

    const handleProductFail = () => {
        if (checkedItems.length === 0) {
            alert("승인할 항목을 선택해주세요.");
            return;
        }

        let newStatus = 'PRODUCT_FAIL';


        // checkedItems에 해당하는 항목 필터링
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));

        // 중복된 orderId를 제거한 배열 생성
        const uniqueItems = ordersPatch.reduce((acc, item) => {
            if (!acc.some(existingItem => existingItem.orderId === item.orderId)) {
                acc.push(item);
            }
            return acc;
        }, []);

        const itemsToSend = uniqueItems.map(item => ({
            orderId: item.orderId,
            requestDate: item.requestDate,
            orderStatus: newStatus
        }));

        sendPatchStatusRequest(state, itemsToSend, () => {
            // 요청 성공 후 데이터 다시 가져오기
            fetchOrders();
            // 수정 상태 초기화
            setCheckedItems([]);
        });
    };


    const handleAdminPurchase = () => {
        // checkedItems에 해당하는 항목 필터링
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));

        if (ordersPatch.length === 0) {
            Swal.fire({ text: '수정된 항목이 없습니다' })
            return;
        }

        // 중복된 orderId를 제거한 배열 생성
        const uniqueItems = ordersPatch.reduce((acc, item) => {
            if (!acc.some(existingItem => existingItem.orderId === item.orderId)) {
                acc.push(item);
            }
            return acc;
        }, []);

        const itemsToSend = uniqueItems.map(item => ({
            orderId: item.orderId,
            requestDate: item.requestDate,
            orderStatus: 'PURCHASE_REQUEST'
        }));

        sendPatchStatusRequest(state, itemsToSend, () => {
            // 요청 성공 후 데이터 다시 가져오기
            fetchOrders();
            // 수정 상태 초기화
            setCheckedItems([]);
        });
    }

    const handleAdminApprove = () => {
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));

        if (ordersPatch.length === 0) {
            console.log("수정된 항목이 없습니다.");
            return;
        }

        setModalAction('approve');
        setIsMessageModalOpen(true);
    }

    const handleAdminReject = () => {
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));

        if (ordersPatch.length === 0) {
            console.log("수정된 항목이 없습니다.");
            return;
        }

        setModalAction('reject');
        setIsMessageModalOpen(true);
    }

    const handleMessageSubmit = (message) => {
        const ordersPatch = modifiedData.data.filter((_, index) => checkedItems.includes(index));
        const itemsToSend = ordersPatch.map(item => ({
            orderCd: item.orderCd,
            rejectReason: message
        }));

        if (modalAction === 'approve') {
            sendPatchApproveRequest(state, itemsToSend, () => {
                fetchOrders();
                setCheckedItems([]);
            });
        } else if (modalAction === 'reject') {
            sendPatchRejectRequest(state, itemsToSend, () => {
                fetchOrders();
                setCheckedItems([]);
            });
        }

        setIsMessageModalOpen(false);
    }


    const handleExportToExcel = () => {
        if (checkedItems.length === 0) {
            alert("엑셀로 내보낼 항목을 선택해주세요.");
            return;
        }

        // 체크된 항목을 필터링
        const ordersToExport = modifiedData.data.filter((_, index) => checkedItems.includes(index));

        // 데이터를 엑셀로 변환하기 위한 배열 생성
        const exportData = ordersToExport.map(order => ({
            '담당자': order.employeeId,
            '주문코드': order.orderCd,
            '주문상태': order.status,
            '등록일': order.createdAt,
            '납기일': order.requestDate,
            '고객사명': order.buyerNm,
            '고객코드': order.buyerCd,
            '제품코드': order.itemCd,
            '수량': order.qty,
            '단가': order.unitPrice,
            '시작일': order.startDate,
            '만기일': order.endDate,
        }));

        // 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "주문내역");

        // 엑셀 파일 다운로드
        XLSX.writeFile(workbook, '주문내역.xlsx');
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
            case 2: currentStatus = 'APPROVED'; break;
            case 3: currentStatus = 'PRODUCT_PASS'; break;
            case 4: currentStatus = 'REJECTED'; break;
            default: currentStatus = null;
        }
        setStatus(currentStatus);
        setSearchParams(prev => ({ ...prev, status: currentStatus }));
    }, []);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        updateSearchParams('searchStartDate', e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        updateSearchParams('searchEndDate', e.target.value);
    };

    const updateSearchParams = useCallback((key, value) => {
        setSearchParams(prevParams => ({
            ...prevParams,
            [key]: value
        }));
    }, []);

    const handleSearch = useCallback((params) => {
        setSearchParams(prevParams => ({
            ...prevParams,
            ...params,
        }));
        setPage(1);
    }, []);

    const handleRejectedOrderTypeChange = (e) => {
        setRejectedOrderType(e.target.value);
        updateSearchParams('status', e.target.value);
    };

    useEffect(() => {
        if (Object.keys(searchParams).length > 0) {
            fetchOrders();
        }
    }, [searchParams, page, rejectedOrderType]);


    // 견적서 발행 함수
    const handleIssueQuotation = () => {
        if (selectedOrders.length === 1) {  // 주문이 하나만 선택되었을 때
            const orderCd = selectedOrders[0].orderCd;
            console.log('Selected Order:', selectedOrders[0]);
            navigate(`/order-detail/${orderCd}`, { state: { token: state.token } });  // OrderDetail 페이지로 이동
        } else {
            alert("하나의 주문만 선택해주세요.");
        }
    };

    const columns = useMemo(() => {
        const commonColumns = [
            { Header: "담당자", accessor: "employeeId" },
            { Header: "주문코드", accessor: "orderCd" },
            { Header: "주문상태", accessor: "status" },
            { Header: "등록일", accessor: "createdAt" },
            { Header: "고객사 명", accessor: "buyerNm" },
            { Header: "고객 코드", accessor: "buyerCd" },
            { Header: "제품 코드", accessor: "itemCd" },
            { Header: "시작일", accessor: "startDate" },
            { Header: "만기일", accessor: "endDate" },
        ];

        // 조건부로 컬럼 추가
        if (status === 'REQUEST_TEMP' || status === null) {
            commonColumns.splice(4, 0, { Header: "납기일", accessor: "requestDate", type: "date" });
            commonColumns.splice(7, 0, { Header: "수량", accessor: "qty", type: "number" });
            commonColumns.splice(8, 0, { Header: "제품 단가", accessor: "unitPrice", type: "number" });
        } else {
            commonColumns.splice(4, 0, { Header: "납기일", accessor: "requestDate" });
            commonColumns.splice(7, 0, { Header: "수량", accessor: "qty" });
            commonColumns.splice(8, 0, { Header: "제품 단가", accessor: "unitPrice" });
        }

        return commonColumns;
    }, [status]);

    const historyColumns = [
        { accessor: 'orderCd', Header: '주문코드', },
        { accessor: 'orderStatus', Header: '주문 상태', },
        { accessor: 'buyerCd', Header: '고객사 코드', },
        { accessor: 'saleHistoryItems', Header: '품목', },
        { accessor: 'requestDate', Header: '납기일', },
        { accessor: 'orderDate', Header: '주문일', },
        { accessor: 'createdAt', Header: '등록일', },
        { accessor: 'employeeId', Header: '영업사원번호', },
    ]

    const handleRowClick = useCallback((value) => {
        sendGetSaleHistoryRequest(
            {
                state: state,
                rowData: value,
                page: 1,
                size: 10,
                setData: setHistoryData,
                setIsModalOpen: setIsHistoryModalOpen,
            }
        );
        setIsHistoryModalOpen(true);
    }, [state, setHistoryData, setIsHistoryModalOpen]);

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
                                    <Tab>주문대기</Tab>
                                    <Tab>승인된 주문</Tab>
                                    <Tab>합격 주문</Tab>
                                    <Tab>반려된 주문</Tab>
                                </TabList>
                            </div>
                            <div className='tab-content'>
                                {[0, 1, 2, 3, 4].map((tabIndex) => (
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
                                            <div className='rejectOption'>
                                            {tabIndex === 4 && (
                                                    <>
                                                        <select
                                                            className="form-select"
                                                            value={rejectedOrderType}
                                                            onChange={handleRejectedOrderTypeChange}
                                                        >
                                                            <option value="REJECTED">반려 주문</option>
                                                            <option value="CANCELLED">취소된 주문</option>
                                                            <option value="PRODUCT_FAIL">불합격 주문</option>
                                                        </select>
                                                    </>
                                                )}
                                            </div>
                                            <div className="action-buttons-container"></div>
                                            <div className="right-aligned-buttons">
                                                {tabIndex <= 1 && (
                                                    <button className='btn btn-secondary' onClick={handlePatchOrder}>
                                                        <Edit className="btn-icon" size={14} /> 수정
                                                    </button>
                                                )}
                                                {tabIndex === 1 && (
                                                    <button className='btn btn-secondary' onClick={handleIssueQuotation}>
                                                        <FileText className="btn-icon" size={14} /> 견적서 발행
                                                    </button>
                                                )}

                                                {tabIndex === 1 && member?.data?.roles?.includes('ROLE_ADMIN') && (
                                                    <button className='btn btn-secondary' onClick={handleAdminApprove}>
                                                        <Check className='"btn-icon' size={14} /> 주문 승인
                                                    </button>
                                                )}
                                                {tabIndex === 1 && member?.data?.roles?.includes('ROLE_ADMIN') && (
                                                    <button className='btn btn-secondary' onClick={handleAdminReject}>
                                                        <Check className='"btn-icon' size={14} /> 주문 반려
                                                    </button>
                                                )}
                                                {tabIndex === 2 && (
                                                    <button className='btn btn-secondary' onClick={handleApprove}>
                                                        <Check className='"btn-icon' size={14} /> 주문 합격
                                                    </button>
                                                )}
                                                {tabIndex === 2 && (
                                                    <button className='btn btn-secondary' onClick={handleProductFail}>
                                                        <Check className='"btn-icon' size={14} /> 주문 불합격
                                                    </button>
                                                )}
                                                {tabIndex === 4 && rejectedOrderType === 'REJECTED' && member?.data?.roles?.includes('ROLE_ADMIN') && (
                                                    <button className='btn btn-secondary' onClick={handleApprove}>
                                                        <Check className="btn-icon" size={14} /> 주문 취소
                                                    </button>
                                                )}
                                                {tabIndex === 4 && rejectedOrderType === 'REJECTED' && member?.data?.roles?.includes('ROLE_ADMIN') && (
                                                    <button className='btn btn-secondary' onClick={handleAdminPurchase}>
                                                        <Check className="btn-icon" size={14} /> 주문 재요청
                                                    </button>
                                                )}
                                                {tabIndex === 4 && (
                                                    <button className='btn btn-secondary' onClick={handlePatchOrder}>
                                                        <Edit className="btn-icon" size={14} /> 수정
                                                    </button>
                                                )}
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
                                                        onCheckboxChange={handleCheckboxChange}
                                                        onRowClick={handleRowClick}
                                                    />
                                                ) : (
                                                    <div>검색 결과가 없습니다.</div>
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
                    {isHistoryModalOpen ?
                        <TableModal
                            setOpened={setIsHistoryModalOpen}
                            columnData={historyColumns}
                            label={('주문 상태 히스토리 - ' + historyData.data[0].orderCd)}
                            data={historyData}
                        ></TableModal> : <div />}
                    <MessageModal
                        isOpen={isMessageModalOpen}
                        onClose={() => setIsMessageModalOpen(false)}
                        onSubmit={handleMessageSubmit}
                        title={modalAction === 'approve' ? '승인 메시지' : '반려 메시지'}
                        type={modalAction === 'approve' ? 'approve' : 'reject'}
                    />
                </div>
            </div>
        </div>
    );
}

export default OrderApprovalPage;