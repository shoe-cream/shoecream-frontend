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

        const handleRegisterOrder = () => {
            if (!registrationDate) {
                alert('등록일자를 선택해주세요.');
                return;
            }

            const orderItemDtoList = orderData.map(order => {
                const [startDateStr, endDateStr] = order.contractPeriod.split(' ~ ');
        
                return {
                    itemCD: order.itemCd,
                    unitPrice: order.unitPrice,
                    quantity: order.quantity,
                    startDate: convertToLocalDateTime(startDateStr.trim()),
                    endDate: convertToLocalDateTime(endDateStr.trim()),
                    unit: order.unit
                };
            });

            const buyerCd = orderData.length > 0 ? orderData[0].buyerCd : ''; 
            sendPostOrder(state, buyerCd, requestDate+"T00:00:00.000", orderItemDtoList);
        
        };

        return (
            <div>
                <Header />
                <div className='app-container'>
                <Sidebar></Sidebar>
                    <div className='app-content-container'>
                        <div className='order-registration'>
                            {/* <OrderFilter onDateChange={handleDateChange} /> */}
                            <ProductSearch onAddOrder={handleAddOrder} registrationDate={registrationDate} />
                            <OrderActions onRegisterOrder={handleRegisterOrder} />
                            <OrderTable 
                                data={orderData} 
                                setOrderData={setOrderData} 
                                setRequestDate={setRequestDate}  // requestDate 설정 함수 전달
                            />
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
