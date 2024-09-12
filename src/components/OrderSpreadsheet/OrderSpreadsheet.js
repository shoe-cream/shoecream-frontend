import React, { useState } from 'react';
import DataGrid from 'react-data-grid';
import './OrderSpreadsheet.css';
import 'react-data-grid/lib/styles.css';

// 라이브러리를 사용한 테이블 지금 사용 x
//==============================
const initialRows = [
  // 임의의 데이터 (더 많은 데이터 추가)
  { id: 0, buyerNm: 'Buyer 1', buyerCd: 'B001', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Adidas Ultraboost', itemCd: 'AD001', unitPrice: 175, color: 'Black', size: 42, quantity: 10, unit: 'Pair', price: 1750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 1, buyerNm: 'Buyer 2', buyerCd: 'B002', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Nike Air Max', itemCd: 'NM002', unitPrice: 150, color: 'White', size: 43, quantity: 5, unit: 'Pair', price: 750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 2, buyerNm: 'Buyer 1', buyerCd: 'B001', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Adidas Ultraboost', itemCd: 'AD001', unitPrice: 175, color: 'Black', size: 42, quantity: 10, unit: 'Pair', price: 1750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 3, buyerNm: 'Buyer 2', buyerCd: 'B002', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Nike Air Max', itemCd: 'NM002', unitPrice: 150, color: 'White', size: 43, quantity: 5, unit: 'Pair', price: 750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 4, buyerNm: 'Buyer 1', buyerCd: 'B001', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Adidas Ultraboost', itemCd: 'AD001', unitPrice: 175, color: 'Black', size: 42, quantity: 10, unit: 'Pair', price: 1750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 5, buyerNm: 'Buyer 2', buyerCd: 'B002', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Nike Air Max', itemCd: 'NM002', unitPrice: 150, color: 'White', size: 43, quantity: 5, unit: 'Pair', price: 750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 6, buyerNm: 'Buyer 1', buyerCd: 'B001', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Adidas Ultraboost', itemCd: 'AD001', unitPrice: 175, color: 'Black', size: 42, quantity: 10, unit: 'Pair', price: 1750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 7, buyerNm: 'Buyer 2', buyerCd: 'B002', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Nike Air Max', itemCd: 'NM002', unitPrice: 150, color: 'White', size: 43, quantity: 5, unit: 'Pair', price: 750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 8, buyerNm: 'Buyer 1', buyerCd: 'B001', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Adidas Ultraboost', itemCd: 'AD001', unitPrice: 175, color: 'Black', size: 42, quantity: 10, unit: 'Pair', price: 1750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  { id: 9, buyerNm: 'Buyer 2', buyerCd: 'B002', registrationDate: '2024-09-11', requestDate: '2024-09-18', itemNm: 'Nike Air Max', itemCd: 'NM002', unitPrice: 150, color: 'White', size: 43, quantity: 5, unit: 'Pair', price: 750, contractPeriod: '2024-09-11 ~ 2024-09-18' },
  // 더 많은 행 추가...
];

// 기본 컬럼 설정
const columns = [
  { key: 'buyerNm', name: '고객사', editable: true },
  { key: 'buyerCd', name: '고객코드', editable: true },
  { key: 'registrationDate', name: '등록일', editable: false },
  { key: 'requestDate', name: '납기일', editable: true },
  { key: 'itemNm', name: '제품명', editable: true },
  { key: 'itemCd', name: '제품코드', editable: true },
  { key: 'unitPrice', name: '제품 단가', editable: true },
  { key: 'color', name: '색상', editable: true },
  { key: 'size', name: '사이즈', editable: true },
  { key: 'quantity', name: '수량', editable: true },
  { key: 'unit', name: '단위', editable: true },
  { key: 'price', name: '금액', editable: false },
  { key: 'contractPeriod', name: '계약 기간', editable: true }
];

const OrderSpreadsheet = () => {
  const [rows, setRows] = useState(initialRows);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);  // 페이지당 행 수

  const paginatedRows = rows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const handleNextPage = () => {
    if ((currentPage + 1) * rowsPerPage < rows.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onRowsChange = (updatedRows) => {
    const transformedRows = updatedRows.map(row => ({
      ...row,
      price: row.unitPrice * row.quantity
    }));
    setRows(transformedRows);
  };

  return (
    <div className="order-spreadsheet">
      <h2>주문 등록 스프레드시트</h2>
      <DataGrid
        columns={columns}
        rows={paginatedRows}  // 페이지당 행 데이터 전달
        onRowsChange={onRowsChange}
        rowKeyGetter={(row) => row.id}
      />
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>이전</button>
        <button onClick={handleNextPage} disabled={(currentPage + 1) * rowsPerPage >= rows.length}>다음</button>
      </div>
    </div>
  );
};

export default OrderSpreadsheet;
