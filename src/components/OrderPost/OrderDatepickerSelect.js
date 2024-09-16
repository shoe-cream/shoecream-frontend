import React, { useState } from "react";
import "../OrderPost/OrderDatepickerSelect.css";

const OrderDatepickerSelect = ({ handleSearch }) => {
    const [optionSelect, setOptionSelect] = useState('orderCd');
    const [keyword, setKeyword] = useState('');

    const handleOptionChange = (e) => {
        setOptionSelect(e.target.value);
    };

    const getKeyword = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchClick = () => {
        const params = {};
        if (keyword.trim() !== '') {
            params[optionSelect] = keyword;
        }
        handleSearch(params);
    };

    return (
        <div className='order-date-select'>
            <select className="search-list" onChange={handleOptionChange} value={optionSelect}>
                <option value="orderCd">주문코드</option>
                <option value="buyerCd">고객코드</option>
                <option value="itemCd">제품코드</option>
            </select>
            <input 
                type='text' 
                id='productName' 
                className='product-name' 
                value={keyword} 
                onChange={getKeyword} 
            />
            <button id='searchProduct' className='search-button' onClick={handleSearchClick}>
                <img src='/icons/zoom.png' alt='Search' className='search-icon' />
            </button>
        </div>
    );
};

export default OrderDatepickerSelect;