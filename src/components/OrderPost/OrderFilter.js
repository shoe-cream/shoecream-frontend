import React from "react";

const OrderFilters = () => {
    return (
        <div className='order-filters'>
            <label htmlFor='order-date'>등록일자:</label>
            <input type='date' id='order-date' name='order-date' />

            <label htmlFor='order-id'>오더번호:</label>
            <input type='text' id='order-id' name='order-id' />

            <label htmlFor='responsible-person'>담당자:</label>
            <input type='text' id='responsible-person' name='responsible-person' />
        </div>
    );
}

export default OrderFilters;
