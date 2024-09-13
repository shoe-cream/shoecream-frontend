import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Header from '../../components/header/Header'; 
import Sidebar from '../../components/sidebar/Sidebar';
import '../../App.css'; // 공통 스타일 적용
import './OrderDetail.css'; // OrderDetail 전용 스타일 적용

const OrderDetail = () => {
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        // 임시 데이터 설정
        const tempData = {
            orderId: 1,
            createdAt: '2024-09-12 16:22:48.745814',
            orderCd: 'SHO97D1A00F1BE3',
            orderStatus: 'REQUEST_TEMP',
            requestDate: '2024-09-10 10:00:00',
            buyerId: 1,
            memberId: 1,
            orderItems: [
                { orderItemId: 1, itemCd: '이광희', quantity: 10, unitPrice: 100.50 },
                { orderItemId: 2, itemCd: '안경 돌려줘', quantity: 5, unitPrice: 200.00 }
            ]
        };
        setOrderData(tempData);
    }, []);

    if (!orderData) {
        return <div>로딩 중...</div>;
    }

    const totalAmount = orderData.orderItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    const tax = totalAmount * 0.1;

    const handleDownloadPDF = () => {
        const element = document.getElementById('quotation-content');
        html2pdf().from(element).save('quotation.pdf');
    };

    const handleSendEmail = () => {
        // 이메일 전송 로직
        alert('메일이 전송되었습니다.');
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='quotation-content' id='quotation-content'>
                        <h1>견적서</h1>
                        <div className='quotation-info'>
                            <p><strong>Invoice No.</strong> #002121</p>
                            <p><strong>견적일</strong> 2024-09-04</p>
                            <p><strong>견적서 만료일</strong> 2024-09-11</p>
                        </div>

                        <h2>주문 상세 내역</h2>
                        {orderData ? (
                            <table className='order-table'>
                                <thead>
                                    <tr>
                                        <th>제품 코드</th>
                                        <th>수량</th>
                                        <th>단가</th>
                                        <th>총액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.orderItems.map(item => (
                                        <tr key={item.orderItemId}>
                                            <td>{item.itemCd}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unitPrice.toFixed(2)}</td>
                                            <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>로딩 중...</p>
                        )}

                        <div className='quotation-total'>
                            <p><strong>소계</strong>: ${totalAmount.toFixed(2)}</p>
                            <p><strong>세금</strong>: ${tax.toFixed(2)}</p>
                            <p><strong>총합계</strong>: ${(totalAmount + tax).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='button-container'>
                        <button onClick={handleDownloadPDF}>PDF 다운로드</button>
                        <button onClick={handleSendEmail}>메일로 보내기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
