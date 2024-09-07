import React from 'react';


const OrderTable = ({ data }) => {
    return (
        <div className='order-table'>
            <table>
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>고객사</th>
                        <th>고객코드</th>
                        <th>등록일</th>
                        <th>납기일</th>
                        <th>제품명</th>
                        <th>제품코드</th>
                        <th>제품 단가</th>
                        <th>색상</th>
                        <th>사이즈</th>
                        <th>수량</th>
                        <th>단위</th>
                        <th>금액</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(order => (
                        <tr key={order.id}>
                            <td><input type='checkbox' /></td>
                            <td>{order.customer}</td>
                            <td>{order.customerCode}</td>
                            <td>{order.registrationDate}</td>
                            <td>{order.deliveryDate}</td>
                            <td>{order.productName}</td>
                            <td>{order.productCode}</td>
                            <td>{order.unitPrice}</td>
                            <td>{order.color}</td>
                            <td>{order.size}</td>
                            <td>{order.quantity}</td>
                            <td>{order.unit}</td>
                            <td>{order.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderTable;
