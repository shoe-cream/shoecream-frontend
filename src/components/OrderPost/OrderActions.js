import React from 'react';

const OrderActions = ({ onRegisterOrder }) => {
    return (
        <div className="order-actions">
            <button onClick={onRegisterOrder} className="load-btn">주문 등록</button>
            <button className="load-btn">견적서 발행</button>
            <button className="load-btn">엑셀 다운</button>
            <button className="load-btn">인쇄</button>
        </div>
    );
};

export default OrderActions;
