import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderFilters from '../../components/OrderPost/OrderFilter';
import OrderTable from '../../components/OrderPost/OrderTable';
import ProductSearch from "../../components/OrderPost/ProductSearch";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);

    const handleAddOrder = (newOrder) => {
        // 새로운 주문 데이터를 기존 데이터에 추가
        const orderWithId = {
            ...newOrder,
            id: Date.now(), // 고유한 ID 생성 (실제 앱에서는 서버에서 제공)
            registrationDate: new Date().toISOString().split('T')[0], // 현재 날짜를 등록일자로 설정
            deliveryDate: '' // 납기일은 빈 문자열로 초기화
        };
        setOrderData(prevData => [...prevData, orderWithId]);
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='order-registration'>
                        <OrderFilters />
                        <ProductSearch onAddOrder={handleAddOrder} />
                        <OrderActions />
                        <OrderTable data={orderData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPostPage;
