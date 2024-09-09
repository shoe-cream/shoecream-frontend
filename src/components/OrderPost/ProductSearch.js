import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const ProductSearch = ({ onAddOrder }) => {
    const [searchParams, setSearchParams] = useState({
        customer: '',
        productName: '',
        size: '',
        customerCode: '',
        productCode: '',
        stock: '',
        contact: '',
        unitPrice: '',
        quantityUnit: '',
        contractPeriod: '' // 계약 기간 추가
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevState => ({ ...prevState, [id]: value }));
    };

    const handleFetch = () => {
        onAddOrder({
            ...searchParams,
            registrationDate: new Date().toISOString().split('T')[0],
            deliveryDate: ''
        });
        setSearchParams({
            customer: '',
            productName: '',
            size: '',
            customerCode: '',
            productCode: '',
            stock: '',
            contact: '',
            unitPrice: '',
            quantityUnit: '',
            tel: '',
            item: '',
            contractPeriod: '' // 계약 기간 초기화
        });
    };

    const DateRangePicker = () => {
        const [dateRange, setDateRange] = useState([null, null]);
        const [startDate, endDate] = dateRange;
      
        return (
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable
                dateFormat="yyyy/MM/dd"
                placeholderText="기간 선택"
            />
        );
    };

    return (
        <div className='product-search'>
            <table>
                <tbody>
                    <tr>
                        <td className='title'>고객사</td>
                        <td>
                            <div className='divSearch'>
                                <input type='text' id='customer' className = 'orderPostInput' value={searchParams.customer} onChange={handleChange} />
                                <button id='searchCustomer' className='search-button'>
                                    <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                                </button>
                            </div>
                        </td>
                        <td className='title'>제품명</td>
                        <td>
                            <div className='divSearch'>
                                <input type='text' id='productName' className = 'orderPostInput' value={searchParams.productName} onChange={handleChange} />
                                <button id='searchProduct' className='search-button'>
                                    <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                                </button>
                            </div>
                        </td>
                        <td className='title'>사이즈</td>
                        <td><input type='text' id='size' className = 'orderPostInput' value={searchParams.size} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>계약 기간</td>
                        <td className='order-date'><DateRangePicker /></td>
                        <td className='title'>제품코드</td>
                        <td><input type='text' id='productCode' className = 'orderPostInput' value={searchParams.productCode} onChange={handleChange} /></td>
                        <td className='title'>재고량</td>
                        <td><input type='text' id='stock' className = 'orderPostInput' value={searchParams.stock} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>고객코드</td>
                        <td><input type='text' id='customerCode' className = 'orderPostInput' value={searchParams.customerCode} onChange={handleChange} /></td>
                        <td className='title'>품목</td>
                        <td><input type='text' id='item' className = 'orderPostInput' value={searchParams.item} onChange={handleChange} /></td>
                        <td className='title'>제품 단가</td>
                        <td><input type='text' id='unitPrice' className = 'orderPostInput' value={searchParams.unitPrice} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>고객사 연락처</td>
                        <td><input type='text' id='tel' className = 'orderPostInput' value={searchParams.tel} onChange={handleChange} /></td>
                        <td className='title'>색상</td>
                        <td><input type='text' id='color' className = 'orderPostInput' value={searchParams.color} onChange={handleChange} /></td>
                        <td className='title'>수량 단위</td>
                        <td><input type='text' id='quantityUnit' className = 'orderPostInput' value={searchParams.quantityUnit} onChange={handleChange} /></td>
                    </tr>
                </tbody>
            </table>
            <div className='button-container'>
                <button className='load-btn' onClick={handleFetch}>불러오기</button>
            </div>
        </div>
    );
}

export default ProductSearch;
