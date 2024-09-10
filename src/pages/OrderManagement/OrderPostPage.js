import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderFilter from '../../components/OrderPost/OrderFilter';
import OrderTable from '../../components/OrderPost/OrderTable';
import ProductSearch from "../../components/OrderPost/ProductSearch";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import PageContainer from '../../components/page_container/PageContainer';
import sendPostOrder from '../../requests/PostOrder';
import { useAuth } from '../../auth/AuthContext';

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);
    const [registrationDate, setRegistrationDate] = useState('');  // 등록일자 상태 추가
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth(); // 인증 상태를 가져옴

    const handleAddOrder = (newOrder) => {
        setOrderData(prevData => [...prevData, newOrder]);
    };

    const handleDateChange = (date) => {
        setRegistrationDate(date);
    };

    const convertToLocalDateTime = (dateStr) => {
        const date = new Date(dateStr);
        let isoString = date.toISOString();  // ISO 형식으로 변환 (밀리초 포함)
        return isoString.replace('Z', '');  // 'Z'를 제거
    };

    const handleRegisterOrder = () => {
        if (!registrationDate) {
            alert('등록일자를 선택해주세요.');
            return;
        }

        



        const orderItemDtoList = orderData.map(order => {
            const [startDateStr, endDateStr] = order.contractPeriod.split(' ~ ');
    
            return {
                itemCd: order.itemCd,
                unitPrice: order.unitPrice,
                quantity: order.quantity,
                startDate: convertToLocalDateTime(startDateStr.trim()),
                endDate: convertToLocalDateTime(endDateStr.trim()),
                unit: order.unit
            };
        });

        const buyerCd = orderData[0];

        sendPostOrder(state, buyerCd, registrationDate, orderItemDtoList);
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='order-registration'>
                        <OrderFilter onDateChange={handleDateChange} />
                        <ProductSearch onAddOrder={handleAddOrder} registrationDate={registrationDate} />
                        <OrderActions onRegisterOrder={handleRegisterOrder} />
                        <OrderTable data={orderData} setOrderData={setOrderData} />
                    </div>
                    {isLoading ? <div /> : <PageContainer
                        currentPage={page}
                        setPage={setPage}
                        pageInfo={orderData.pageInfo}
                        getPage={() => { }}
                    ></PageContainer>}
                </div>
            </div>
        </div>
    );
}

export default OrderPostPage;
