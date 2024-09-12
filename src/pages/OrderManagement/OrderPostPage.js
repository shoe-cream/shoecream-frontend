import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderSheet from '../../components/OrderPost/OrderSheet'; // 새로 추가한 컴포넌트
import ProductSearch from "../../components/OrderPost/ProductSearch";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import PageContainer from '../../components/page_container/PageContainer';
import sendPostOrder from '../../requests/PostOrder';
import { useAuth } from '../../auth/AuthContext';

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);  // 주문 데이터를 관리하는 상태
    const [selectedOrders, setSelectedOrders] = useState([]); // 선택된 주문 항목
    const [editedOrders, setEditedOrders] = useState([]); // 수정된 주문 항목
    const [registrationDate, setRegistrationDate] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();

    const handleAddOrder = (newOrder) => {
        setOrderData(prevData => [...prevData, newOrder]);
    };

    const handleDateChange = (date) => {
        setRegistrationDate(date);
    };

    const convertToLocalDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().replace('Z', '');  // 밀리초 포함
    };

    // const handleRegisterOrder = () => {
    //     // 선택된 주문 항목만 전송
    //     const ordersToRegister = orderData.filter((_, index) => selectedOrders.includes(index));

    //     const orderItemDtoList = ordersToRegister.map(order => {
    //         const [startDateStr, endDateStr] = order.contractPeriod.split(' ~ ');
    //         return {
    //             itemCd: order.itemCd,
    //             unitPrice: order.unitPrice,
    //             qty: order.qty,
    //             startDate: convertToLocalDateTime(startDateStr.trim()),
    //             endDate: convertToLocalDateTime(endDateStr.trim()),
    //             unit: order.unit
    //         };
    //     });

    //     console.log("dsfsdfsdf",ordersToRegister);
    //     const buyerCd = orderData.length > 0 ? orderData[0].buyerCd : ''; 
    //     sendPostOrder(state, buyerCd, `${ordersToRegister[0].requestDate}T00:00:00.000`, orderItemDtoList);
    // };

    const handleRegisterOrder = () => {
        // 선택된 주문 항목만 필터링
        const ordersToRegister = orderData.filter((_, index) => selectedOrders.includes(index));
    
        // 주문 항목별로 POST 요청을 보내는 함수
        const sendOrderRequests = (order) => {
            const [startDateStr, endDateStr] = order.contractPeriod.split(' ~ ');
            const orderItemDto = {
                itemCd: order.itemCd,
                unitPrice: order.unitPrice,
                qty: order.qty,
                startDate: convertToLocalDateTime(startDateStr.trim()),
                endDate: convertToLocalDateTime(endDateStr.trim()),
                unit: order.unit
            };
    
            return sendPostOrder(state, order.buyerCd, `${order.requestDate}T00:00:00.000`, [orderItemDto]);
        };
    
        // 모든 주문에 대해 POST 요청을 보냅니다.
        Promise.all(ordersToRegister.map(sendOrderRequests))
            .then(results => {
                console.log("All orders registered successfully:", results);
            })
            .catch(error => {
                console.error("Error registering orders:", error);
            });
    };

    // 주문 등록 테이블의 컬럼 정의
    const columns = [
        { Header: '고객사', accessor: 'buyerNm' },
        { Header: '고객코드', accessor: 'buyerCd' },
        { Header: '등록일', accessor: 'registrationDate' },
        { Header: '납기일', accessor: 'requestDate' },
        { Header: '제품명', accessor: 'itemNm' },
        { Header: '제품코드', accessor: 'itemCd' },
        { Header: '제품 단가', accessor: 'unitPrice' },
        { Header: '색상', accessor: 'color' },
        { Header: '사이즈', accessor: 'size' },
        { Header: '수량', accessor: 'quantity' },
        { Header: '단위', accessor: 'unit' },
        { Header: '금액', accessor: 'price' },
        { Header: '계약 기간', accessor: 'contractPeriod' },
    ];

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='order-registration'>
                        {/* 검색 및 필터 컴포넌트 */}
                        <ProductSearch onAddOrder={handleAddOrder}/>
                        <OrderActions onRegisterOrder={handleRegisterOrder} />

                        {/* 새로 만든 EditableTableWithCheckbox 추가 */}
                        <OrderSheet
                            columns={columns}
                            ogData={{ data: orderData }} // 원본 데이터로 orderData를 전달
                            data={{ data: orderData }}   // 테이블의 데이터
                            setData={(updatedData) => setOrderData(updatedData.data)} // 데이터 업데이트
                            checked={selectedOrders} // 선택된 행
                            setChecked={setSelectedOrders} // 선택된 주문 항목 업데이트
                            edited={editedOrders} // 수정된 행 정보
                            setEdited={setEditedOrders} // 수정된 주문 항목 업데이트
                        />
                    </div>
                    
                    {!isLoading && (
                        <PageContainer
                            currentPage={page}
                            setPage={setPage}
                            pageInfo={orderData.pageInfo}
                            getPage={() => {}}
                        />
                    )}

                </div>
            </div>
        </div>
    );
};

export default OrderPostPage;

