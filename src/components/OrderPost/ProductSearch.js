import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const ProductSearch = ({ onAddOrder }) => {
    const [searchParams, setSearchParams] = useState({
        buyerNm: '',
        buyerCd: '',
        requestDate: '',
        itemNm: '',
        size: '',
        itemCd: '',
        contractPeriod: '', // Initialize contractPeriod as an empty string
        unit: '',
        unitPrice: '',
        quantity: '',
        qty: '',
        tel: '',
        category: ''
    });

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevState => ({ ...prevState, [id]: value }));
    };

    const handleFetch = () => {
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
        const contractPeriod = formattedStartDate && formattedEndDate
            ? `${formattedStartDate} to ${formattedEndDate}`
            : '';

        console.log('Fetching with contractPeriod:', contractPeriod); // For debugging

        onAddOrder({
            ...searchParams,
            registrationDate: new Date().toISOString().split('T')[0],
            deliveryDate: '',
            contractPeriod // Add contractPeriod to the payload
        });

        // Reset form fields
        setSearchParams({
            buyerNm: '',
            buyerCd: '',
            requestDate: '',
            itemNm: '',
            size: '',
            itemCd: '',
            contractPeriod: '',
            unit: '',
            unitPrice: '',
            quantity: '',
            qty: '',
            tel: '',
            category: ''
        });

        // Reset date range
        setDateRange([null, null]);
    };

    const DateRangePicker = () => {
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

    const getBuyer = async () => {
        try {
            console.log(searchParams.buyerCd);
            const response = await axios.get(`http://localhost:8080/buyers/search?buyerCd=${searchParams.buyerCd}`, 
                {
            });
            console.log(response.data);
            // 응답 데이터를 활용하여 필요한 작업을 수행합니다.
        } catch (error) {
            console.error('Error fetching buyer data:', error);
        }
    };

    return (
        <div className='product-search'>
            <table>
                <tbody>
                    <tr>
                        <td className='title'>고객사</td>
                        <td>
                            <div className='divSearch'>
                                <input type='text' id='buyerNm' className='orderPostInput' value={searchParams.buyerNm} onChange={handleChange} />
                                <button id='searchBuyer' className='search-button' onClick={getBuyer}>
                                    <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                                </button>
                            </div>
                        </td>
                        <td className='title'>제품코드</td>
                        <td>
                            <div className='divSearch'>
                                <input type='text' id='itemCd' className='orderPostInput' value={searchParams.itemCd} onChange={handleChange} />
                                <button id='searchItem' className='search-button'>
                                    <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                                </button>
                            </div>
                        </td>
                        <td className='title'>사이즈</td>
                        <td><input type='text' id='size' className='orderPostInput' value={searchParams.size} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>계약 기간</td>
                        <td className='order-date'><DateRangePicker /></td>
                        <td className='title'>제품명</td>
                        <td><input type='text' id='itemNm' className='orderPostInput' value={searchParams.itemNm} onChange={handleChange} /></td>
                        <td className='title'>재고량</td>
                        <td><input type='text' id='qty' className='orderPostInput' value={searchParams.qty} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>고객코드</td>
                        <td><input type='text' id='buyerCd' className='orderPostInput' value={searchParams.buyerCd} onChange={handleChange} /></td>
                        <td className='title'>품목</td>
                        <td><input type='text' id='category' className='orderPostInput' value={searchParams.category} onChange={handleChange} /></td>
                        <td className='title'>제품 단가</td>
                        <td><input type='text' id='unitPrice' className='orderPostInput' value={searchParams.unitPrice} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>고객사 연락처</td>
                        <td><input type='text' id='tel' className='orderPostInput' value={searchParams.tel} onChange={handleChange} /></td>
                        <td className='title'>색상</td>
                        <td><input type='text' id='color' className='orderPostInput' value={searchParams.color} onChange={handleChange} /></td>
                        <td className='title'>수량 단위</td>
                        <td><input type='text' id='unit' className='orderPostInput' value={searchParams.unit} onChange={handleChange} /></td>
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
