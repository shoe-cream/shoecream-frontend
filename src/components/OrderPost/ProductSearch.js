import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';

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
        quantityUnit: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevState => ({ ...prevState, [id]: value }));
    };

    const DateRangePicker = () => {
        const [dateRange, setDateRange] = useState([null, null]);
        const [startDate, endDate] = dateRange;
      
        return (
            <DatePicker className='date-range-picker'
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              dateFormat="yyyy/MM/dd"
              placeholderText="기간 선택"
            />
        );
      };
    // const handleFetch = async () => {
    //     try {
    //         // 예시 URL, 실제 API 엔드포인트로 대체 필요
    //         const response = await axios.get('/api/orders', {
    //             params: {
    //                 customer: searchParams.customer,
    //                 customerCode: searchParams.customerCode,
    //             }
    //         });

    //         // 응답 받은 데이터를 state에 설정
    //         const fetchedData = response.data;
    //         setSearchParams(prevState => ({
    //             ...prevState,
    //             productName: fetchedData.productName || '',
    //             size: fetchedData.size || '',
    //             productCode: fetchedData.productCode || '',
    //             stock: fetchedData.stock || '',
    //             contact: fetchedData.contact || '',
    //             unitPrice: fetchedData.unitPrice || '',
    //             quantityUnit: fetchedData.quantityUnit || ''
    //         }));
    //     } catch (error) {
    //         console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    //     }
    // };

    return (
        <div className='product-search'>
            <table>
                <tbody>
                    <tr>
                        <td className='title'>고객사</td>
                        <td>
                            <div className='divSearch'>
                            <input type='text' id='customer' value={searchParams.customer} onChange={handleChange} />
                            <button id='searchCustomer' className='search-button'>
                                <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                            </button>
                            </div>
                                {/* <button className='searchCustomer' onClick={handleFetch}></button> */}
                        </td>
                        <td className='title'>제품명</td>
                        <td>
                        <div className='divSearch'>
                            <input type='text' id='productName' value={searchParams.productName} onChange={handleChange} />
                            <button id='searchProduct' className='search-button'>
                                <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                            </button>
                        </div>
                        </td>
                        <td className='title'>사이즈</td>
                        <td><input type='text' id='size' value={searchParams.size} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>계약 기간</td>
                        <td>
                        <DateRangePicker></DateRangePicker>
                        </td>            
                        <td className='title'>제품코드</td>
                        <td><input type='text' id='productCode' value={searchParams.productCode} onChange={handleChange} /></td>
                        <td className='title'>재고량</td>
                        <td><input type='text' id='stock' value={searchParams.stock} onChange={handleChange} /></td>
                    </tr>

                    <tr>
                        <td className='title'>고객코드</td>
                        <td><input type='text' id='customerCode' value={searchParams.customerCode} onChange={handleChange} /></td>
                        <td className='title'>품목</td>
                        <td><input type='text' id='productCode' value={searchParams.productCode} onChange={handleChange} /></td>
                        <td className='title'>제품 단가</td>
                        <td><input type='text' id='stock' value={searchParams.stock} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title'>고객사 연락처</td>
                        <td><input type='text' id='contact' value={searchParams.contact} onChange={handleChange} /></td>
                        <td className='title'>색상</td>
                        <td><input type='text' id='unitPrice' value={searchParams.unitPrice} onChange={handleChange} /></td>
                        <td className='title'>수량 단위</td>
                        <td><input type='text' id='quantityUnit' value={searchParams.quantityUnit} onChange={handleChange} /></td>
                    </tr>
                </tbody>
            </table>
            <div className='button-container'>
            <button className='load-btn'>불러오기</button>
                {/* <button className='load-btn' onClick={handleFetch}>불러오기</button> */}
            </div>
        </div>
    );
}

export default ProductSearch;
