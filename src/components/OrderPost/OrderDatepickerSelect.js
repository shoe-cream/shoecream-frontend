import React, { useState } from "react";
import DateRangePicker from "../datepicker/DateRangePicker";
import "../OrderPost/OrderDatepickerSelect.css";


const OrderDatepickerSelect = ({ GetOrdersAll, optionSelect, setOptionSelect, keyword, setKeyword }) => {

    const handleOptionChange = (e) => {
        setOptionSelect(e.target.value);
    };

    const getKeyword = (e) => {
        setKeyword(e.target.value)
    }
    const handlePatchOrder = () => {
        console.log("Patch order functionality will go here.");
        // 여기에서 주문 수정 로직을 추가하면 됩니다.
    };
    return (
        <div className='order-search-list'>
            <select className="search-list" onChange={handleOptionChange} value={optionSelect}>
                <option value="orderCd">주문코드</option>
                <option value="buyerCd">고객코드</option>
                <option value="itemCd">제품코드</option>
            </select>
            {
            optionSelect !== 'date' ? 
            <input type='text' id='productName' className='product-name' value={keyword} onChange={getKeyword} /> :
            <input type='date' id= 'dateSelect' value ={keyword} onChange= {getKeyword}></input>
            }
            <button id='searchProduct' className='search-button' onClick={() => GetOrdersAll(optionSelect, keyword)}>
                <img src='/icons/zoom.png' alt='Search' className='search-icon' />
            </button>
        </div>
    );
}

export default OrderDatepickerSelect;