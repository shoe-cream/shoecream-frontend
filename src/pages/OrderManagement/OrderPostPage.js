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
        setOrderData(prevData => [...prevData, newOrder]);
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