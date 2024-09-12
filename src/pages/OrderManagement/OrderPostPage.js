import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderTable from '../../components/OrderPost/OrderTable';
import ProductSearch from "../../components/OrderPost/ProductSearch";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import PageContainer from '../../components/page_container/PageContainer';
import sendPostOrder from '../../requests/PostOrder';
import { useAuth } from '../../auth/AuthContext';

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
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
        return date.toISOString().replace('Z', '');
    };

    const handleRegisterOrder = () => {
        const checkedOrders = orderData.filter((_, index) => checkedItems.includes(index));
        
        const orderItemDtoList = checkedOrders.map(order => {
            const [startDateStr, endDateStr] = order.contractPeriod.split(' ~ ');
            
            return {
                itemCd: order.itemCd,
                unitPrice: order.unitPrice,
                qty: order.quantity,
                startDate: convertToLocalDateTime(startDateStr.trim()),
                endDate: convertToLocalDateTime(endDateStr.trim()),
                unit: order.unit
            };
        });

        const buyerCd = checkedOrders.length > 0 ? checkedOrders[0].buyerCd : '';
        
        sendPostOrder(state, buyerCd, requestDate+"T00:00:00.000", orderItemDtoList);
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='order-registration'>
                        <ProductSearch onAddOrder={handleAddOrder} registrationDate={registrationDate} />
                        <OrderActions onRegisterOrder={handleRegisterOrder} />
                        <OrderTable
                            data={orderData}
                            setOrderData={setOrderData}
                            setRequestDate={setRequestDate}
                            checkedItems={checkedItems}
                            setCheckedItems={setCheckedItems}
                        />
                    </div>
                    {isLoading ? <div /> : <PageContainer
                        currentPage={page}
                        setPage={setPage}
                        pageInfo={orderData.pageInfo}
                        getPage={() => {}}
                    />}
                </div>
            </div>
        </div>
    );
}

export default OrderPostPage;