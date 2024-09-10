import React, { useState } from 'react';

const OrderFilters = ({ onDateChange }) => {
    const [registrationDate, setRegistrationDate] = useState('');

    const handleDateChange = (e) => {
        const date = e.target.value;
        setRegistrationDate(date);
        onDateChange(date);  // 상위 컴포넌트로 날짜 값을 전달
    };

    return (
        <div className='order-filters'>
            <label htmlFor='order-date'>등록일자:</label>
            <input
                type='date'
                id='order-date'
                name='order-date'
                value={registrationDate}
                onChange={handleDateChange}
            />

            <label htmlFor='order-id'>오더번호:</label>
            <input type='text' id='order-id' name='order-id' />

            <label htmlFor='responsible-person'>담당자:</label>
            <input type='text' id='responsible-person' name='responsible-person' />
        </div>
    );
}

export default OrderFilters;
