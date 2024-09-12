import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome 아이콘을 사용하기 위한 CSS

const OrderActions = ({ onRegisterOrder }) => {
    return (
        <div className="order-actions">
            <button onClick={onRegisterOrder} className="load-btn">
                <i className="fas fa-file-alt"></i> 주문 등록
            </button>
            <button className="load-btn">
                <i className="fas fa-file-invoice"></i> 견적서 발행
            </button>
            <button className="load-btn">
                <i className="fas fa-file-excel"></i> 엑셀 다운
            </button>
            <button className="load-btn">
                <i className="fas fa-print"></i> 인쇄
            </button>
        </div>
    );
};

export default OrderActions;
