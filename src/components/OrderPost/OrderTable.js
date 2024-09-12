import React, { useState, useEffect, useCallback } from 'react';
import ReactTableWithCheckbox from '../Table/ReactTableWithCheckbox';

const OrderTable = ({ data, setOrderData, setRequestDate, checkedItems, setCheckedItems }) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(data || []);
    }, [data]);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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
            
            setOrderData(updatedData);
            return updatedData;
        });
    }, [setOrderData]);

    const handleRequestDateChange = useCallback((index, newDate) => {
        setTableData(prevData => {
            const updatedData = [...prevData];
            updatedData[index] = {
                ...updatedData[index],
                requestDate: newDate
            };
            
            setOrderData(updatedData);
            setRequestDate(newDate);
            return updatedData;
        });
    }, [setOrderData, setRequestDate]);

    const columns = React.useMemo(() => [
        { Header: "고객사", accessor: "buyerNm" },
        { Header: "고객코드", accessor: "buyerCd" },
        { Header: "등록일", accessor: "registrationDate", 
            Cell: ({ row }) => (
                <span>
                    {getCurrentDate()}
                </span>
            )},
        { 
            Header: "납기일", 
            accessor: "requestDate", 
            Cell: ({ row }) => (
                <input 
                    type='date' 
                    value={row.original.requestDate || ''} 
                    onChange={(e) => handleRequestDateChange(row.index, e.target.value)} 
                />
            )
        },
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
    ], [handleQuantityChange, handleRequestDateChange]);

    return <ReactTableWithCheckbox columns={columns} data={tableData} checked={checkedItems} setChecked={setCheckedItems}/>;
}

export default OrderTable;
