import React from "react";
import DateRangePicker from "../datepicker/DateRangePicker";

const OrderDatepickerSelect = () => {
    return (
        <div className='order-date-select'>
            <DateRangePicker></DateRangePicker>
            <select className="search-list">
                <option value="orderId">주문번호</option>
                <option value="customerName">고객사 명</option>
                <option value="customerCd">고객 코드</option>
                <option value="productName">제품 명</option>
                <option value="productCd">제품 코드</option>
            </select>
            <input type='text' id='productName' />
            <button id='searchProduct' className='search-button'>
                <img src='/icons/zoom.png' alt='Search' className='search-icon' />
            </button>
        </div>
    );
}

export default OrderDatepickerSelect;