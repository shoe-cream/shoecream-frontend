import React, { useState } from "react";
import DateRangePicker from "../datepicker/DateRangePicker";

const OrderDatepickerSelect = ({ GetOrdersAll, optionSelect, setOptionSelect, keyword, setKeyword }) => {

    const handleOptionChange = (e) => {
        setOptionSelect(e.target.value);
    };

    const getKeyword = (e) => {
        setKeyword(e.target.value)
    }

    return (
        <div className='order-date-select'>
            <DateRangePicker></DateRangePicker>
            <select className="search-list" onChange={handleOptionChange} value={optionSelect}>
                <option value="orderCd">주문코드</option>
                <option value="buyerCd">고객 코드</option>
                <option value="itemCd">제품 코드</option>
            </select>
            {
            optionSelect !== 'date' ? 
            <input type='text' id='productName' value={keyword} onChange={getKeyword} /> :
            <input type = 'date' id= 'dateSelect' value ={keyword} onChange= {getKeyword}></input>
            }
            <button id='searchProduct' className='search-button' onClick={() => GetOrdersAll(optionSelect, keyword)}>
                <img src='/icons/zoom.png' alt='Search' className='search-icon' />
            </button>
        </div>
    );
}

export default OrderDatepickerSelect;