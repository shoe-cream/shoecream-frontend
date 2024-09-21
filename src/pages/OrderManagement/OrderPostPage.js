import React, { useState } from 'react';
import './OrderPostPage.css';
import OrderActions from '../../components/OrderPost/OrderActions';
import OrderSheet from '../../components/OrderPost/OrderSheet';
import ProductSearch from '../../components/OrderPost/ProductSearch';
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import PageContainer from '../../components/page_container/PageContainer';
import sendPostOrder from '../../requests/PostOrder';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrderPostPage = () => {
    const [orderData, setOrderData] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [editedOrders, setEditedOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();
    const navigate = useNavigate();
    const handleAddOrder = (newOrder) => {
        setOrderData(prevData => {
            
            const existingOrderIndex = prevData.findIndex(order => order.buyerCd === newOrder.buyerCd);
            
            if (existingOrderIndex !== -1) {
                // 기존 주문이 있다면, 사용자에게 알림
                Swal.fire({text : `이미 ${newOrder.buyerCd} 고객의 주문이 존재합니다. 새로운 주문으로 처리됩니다.`})
            }
            
            // 항상 새로운 주문으로 추가
            return [...prevData, {
                ...newOrder,
                orderItems: newOrder.items,
            }];
        });
    };


    const handleRegisterOrder = () => {
        const ordersToRegister = orderData.filter((_, index) => selectedOrders.includes(index));
        
        const sendOrderRequests = (order) => {
            if (!order.requestDate) {
                console.warn(`납기일이 없는 주문이 있습니다: ${order.buyerCd}. 이 주문은 건너뜁니다.`);
                return Promise.resolve(null); // null을 반환하여 이 주문을 건너뜁니다.
            }
    
            const orderItemDtoList = order.orderItems.map(item => ({
                itemCd: item.itemCd,
                unitPrice: item.unitPrice,
                qty: item.qty,
                startDate: `${item.startDate}T00:00:00.000`,
                endDate: `${item.endDate}T00:00:00.000`,
                unit: item.unit
            }));
            console.log("dkfjsdkfjsd", order)
            return sendPostOrder(state, order.buyerCd, `${order.requestDate}T00:00:00.000`, orderItemDtoList);
        };
    
        Promise.all(ordersToRegister.map(sendOrderRequests))
            .then(results => {
                const successfulOrders = results.filter(result => result !== null);
                console.log("성공적으로 등록된 주문 수:", successfulOrders.length);
                
                if (successfulOrders.length > 0) {
                    // alert(`${successfulOrders.length}개의 주문이 성공적으로 등록되었습니다.`);
                    // 등록된 주문 제거
                    setOrderData(prevData => prevData.filter((_, index) => !selectedOrders.includes(index)));
                    setSelectedOrders([]); // 선택 초기화
                } else {
                    Swal.fire({text : '납기일 입력이 비어있거나 주문이 선택되지 않았습니다.'})
                }
            })
            .catch(error => {
                console.error("주문 등록 중 오류 발생:", error);
                Swal.fire({text: `주문 등록 중 오류가 발생했습니다: ${error.message}`});
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
                        <OrderActions 
                        onRegisterOrder={handleRegisterOrder} 
                        selectedOrders={selectedOrders}
                        />
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