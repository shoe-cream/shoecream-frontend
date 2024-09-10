import React, { useState, useEffect, useCallback } from 'react';
import ReactTableWithCheckbox from '../Table/ReactTableWithCheckbox';

const OrderTable = ({ data, onRegisterOrder }) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleQuantityChange = useCallback((index, newQuantity) => {
        setTableData(prevData => {
            const updatedData = [...prevData];
            const item = updatedData[index];
            
            const quantity = Number(newQuantity) || 0;
            const price = item.unitPrice * quantity;
            
            updatedData[index] = {
                ...item,
                quantity,
                price
            };
            
            return updatedData;
        });
    }, []);

    const columns = React.useMemo(() => [
        { Header: "고객사", accessor: "buyerNm" },
        { Header: "고객코드", accessor: "buyerCd" },
        { Header: "등록일", accessor: "registrationDate" },
        { Header: "납기일", accessor: "deliveryDate", Cell: ({ row }) => <input type='date'/> },
        { Header: "제품명", accessor: "itemNm" },
        { Header: "제품코드", accessor: "itemCd" },
        { Header: "제품 단가", accessor: "unitPrice" },
        { Header: "색상", accessor: "color" },
        { Header: "사이즈", accessor: "size" },
        { 
            Header: "수량", 
            accessor: "quantity",
            Cell: ({ row }) => (
                <input
                    type='number'
                    value={row.original.quantity || ''}
                    onChange={(e) => handleQuantityChange(row.index, e.target.value)}
                    min="0"
                />
            )
        },
        { Header: "단위", accessor: "unit" },
        { Header: "금액", accessor: "price" },
        { Header: "계약 기간", accessor: "contractPeriod" }
    ], [handleQuantityChange]);

    return <ReactTableWithCheckbox columns={columns} data={tableData} />;
}

export default OrderTable;
