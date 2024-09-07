import React, { useState } from 'react';


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

    const handleAdd = () => {
        // 부모 컴포넌트로 새로운 주문 데이터 전달
        onAddOrder(searchParams);
        // 입력 필드 초기화
        setSearchParams({
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
    };

    return (
        <div className='product-search'>
            <table>
                <tbody>
                    <tr>
                        <td>고객사</td>
                        <td><input type='text' id='customer' value={searchParams.customer} onChange={handleChange} /></td>
                        <td>제품명</td>
                        <td><input type='text' id='productName' value={searchParams.productName} onChange={handleChange} /></td>
                        <td>사이즈</td>
                        <td><input type='text' id='size' value={searchParams.size} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td>고객코드</td>
                        <td><input type='text' id='customerCode' value={searchParams.customerCode} onChange={handleChange} /></td>
                        <td>제품코드</td>
                        <td><input type='text' id='productCode' value={searchParams.productCode} onChange={handleChange} /></td>
                        <td>재고량</td>
                        <td><input type='text' id='stock' value={searchParams.stock} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td>고객사 연락처</td>
                        <td><input type='text' id='contact' value={searchParams.contact} onChange={handleChange} /></td>
                        <td>제품 단가</td>
                        <td><input type='text' id='unitPrice' value={searchParams.unitPrice} onChange={handleChange} /></td>
                        <td>수량 단위</td>
                        <td><input type='text' id='quantityUnit' value={searchParams.quantityUnit} onChange={handleChange} /></td>
                    </tr>
                </tbody>
            </table>
            <div className='button-container'>
                <button className='load-btn' onClick={handleAdd}>등록</button>
            </div>
        </div>
    );
}

export default ProductSearch;
