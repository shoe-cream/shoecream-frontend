import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderSheet from '../../components/OrderPost/OrderSheet';
import ProductSearch from "../../components/OrderPost/ProductSearch";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import PageContainer from '../../components/page_container/PageContainer';
import sendPostOrder from '../../requests/PostOrder';
import { useAuth } from '../../auth/AuthContext';

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [editedOrders, setEditedOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();

    const handleAddOrder = (newOrder) => {
        setOrderData(prevData => {
            // Check if an order with the same buyerCd already exists
            const existingOrderIndex = prevData.findIndex(order => order.buyerCd === newOrder.buyerCd);
            
            if (existingOrderIndex !== -1) {
                // If the order exists, update its orderItems
                const updatedData = [...prevData];
                updatedData[existingOrderIndex] = {
                    ...updatedData[existingOrderIndex],
                    orderItems: [
                        ...updatedData[existingOrderIndex].orderItems,
                        ...newOrder.items
                    ]
                };
                return updatedData;
            } else {
                // If it's a new order, add it to the array
                return [...prevData, {
                    ...newOrder,
                    orderItems: newOrder.items
                }];
            }
        });
    };

    const convertToLocalDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().replace('Z', '');
    };

    const handleRegisterOrder = () => {
        
        const ordersToRegister = orderData.filter((_, index) => selectedOrders.includes(index));
    
        const sendOrderRequests = (order) => {
            const [startDateStr, endDateStr] = order.contractPeriod.split(' ~ ');
            const orderItemDtoList = order.orderItems.map(item => ({
                itemCd: item.itemCd,
                unitPrice: item.unitPrice,
                qty: item.qty,
                startDate: convertToLocalDateTime(startDateStr.trim()),
                endDate: convertToLocalDateTime(endDateStr.trim()),
                unit: item.unit
            }));
            if(!order.requestDate){
                alert("납기일을 넣어주세요");
                return;
            }
            return sendPostOrder(state, order.buyerCd, `${order.requestDate}T00:00:00.000`, orderItemDtoList);
        };
    
        Promise.all(ordersToRegister.map(sendOrderRequests))
            .then(results => {
                console.log("All orders registered successfully:", results);
            })
            .catch(error => {
                console.error("Error registering orders:", error);
            });
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='order-registration'>
                        <ProductSearch onAddOrder={handleAddOrder}/>
                        <OrderActions onRegisterOrder={handleRegisterOrder} />

                        <OrderSheet
                            ogData={{ data: orderData }}
                            data={{ data: orderData }}
                            setData={(updatedData) => setOrderData(updatedData.data)}
                            checked={selectedOrders}
                            setChecked={setSelectedOrders}
                            edited={editedOrders}
                            setEdited={setEditedOrders}
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