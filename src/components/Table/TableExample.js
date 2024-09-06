// src/components/Table/Table.js
import React, { useState, useEffect } from 'react';
import './TableExample.css';

const Table = ({ columns, data, onSendData }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    // 선택된 항목이 있을 때만 버튼 활성화
    onSendData(selectedRows);
  }, [selectedRows, onSendData]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (rowIndex) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === data.length}
                />
              </th>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={() => handleSelectRow(rowIndex)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 버튼을 Table 컴포넌트의 밖으로 이동 */}
      <button onClick={() => onSendData(selectedRows)} style={{ marginTop: '20px' }}>
        선택된 데이터 보내기
      </button>
    </>
  );
};

export default Table;
