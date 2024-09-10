import React from "react";

const OrderActions = ({ onRegisterOrder }) => {
    return (
        <div className='order-actions'>
            <button onClick={onRegisterOrder}>주문 등록</button>
            <button>견적서 발행</button>
            <button>엑셀 다운</button>
            <button>인쇄</button>
        </div>
    );
}

export default OrderActions;
