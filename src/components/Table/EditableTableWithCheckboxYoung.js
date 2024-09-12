import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithCheckboxYoung = ({ columns, ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  console.log('ogData in table: ', ogData);
  console.log('data in table: ', data);

  useEffect(() => {
    if (ogData && data && Array.isArray(ogData.data) && Array.isArray(data.data)) {
      const updatedEdited = data.data.map((row, index) => {
        const ogRow = ogData.data[index];
        if (ogRow) {
          // 데이터 필드별로 원본 데이터와 비교
          return Object.keys(ogRow).some(key => ogRow[key] !== row[key]) ? index : null;
        }
        return null;
      }).filter(index => index !== null);
  
      // 만약 변경된 사항이 있을 때만 setEdited 호출
      if (JSON.stringify(edited) !== JSON.stringify(updatedEdited)) {
        setEdited(updatedEdited);
      }
    }
  }, [data, ogData, edited, setEdited]);

  const CheckboxCell = ({ row }) => (
    <input
      type="checkbox"
      checked={checked.includes(row.index)}
      onChange={() => {
        const rowIndex = row.index;
        setChecked(prev => 
          prev.includes(rowIndex)
            ? prev.filter(id => id !== rowIndex)
            : [...prev, rowIndex]
        );
      }}
    />
  );

  const EditableCell = React.memo(({ value: initialValue, row: { index }, column: { id } }) => {
    const [value, setValue] = React.useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
    };

    const onBlur = () => {
      const newData = Array.isArray(data.data) ? [...data.data] : [];
      if (!newData[index]) {
        newData[index] = {};
      }

      // 수량 값이 숫자인지 확인 후 업데이트
      newData[index] = {
        ...newData[index],
        [id]: id === "quantity" ? parseInt(value, 10) || 0 : value,
      };

      setData({ ...data, data: newData });
    };

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        className='cell-input'
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  });

  const allColumns = useMemo(() => [
    {
      id: 'selection',
      Header: () => (
        <input
          type="checkbox"
          checked={Array.isArray(data.data) && data.data.length > 0 && checked.length === data.data.length}
          onChange={() => {
            if (Array.isArray(data.data)) {
              if (checked.length === data.data.length) {
                setChecked([]);
              } else {
                setChecked(data.data.map((_, index) => index));
              }
            }
          }}
        />
      ),
      Cell: ({ row }) => <CheckboxCell row={row} />
    },
    ...columns.map(column => ({
        ...column,
        Cell: ({ value, row }) => (
          column.editable ? (
            <EditableCell
              value={value}
              row={row}
              column={column}
            />
          ) : (<span>{value}</span>)
        ),
      }))
  ], [columns, data.data, checked, setChecked]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: allColumns, data: Array.isArray(data.data) ? data.data : [] });

  const getRowClassName = (row) => {
    const rowIndex = row.index;
    const ogRow = Array.isArray(ogData.data) ? ogData.data[rowIndex] : null;
    const tableRow = Array.isArray(data.data) ? data.data[rowIndex] : null;

    if (!ogRow || !tableRow) {
      return 'body-r';
    }

    for (const key in ogRow) {
      if (ogRow.hasOwnProperty(key) && tableRow.hasOwnProperty(key)) {
        if (ogRow[key] !== tableRow[key]) {
          return 'body-r-edited'; // 데이터가 다를 때 -edited 클래스 붙임
        }
      }
    }

    return 'body-r'; // 값이 모두 동일하면 기본 클래스
  };

  return (
    <table {...getTableProps()} className="editable-table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr className='header-r' {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className='header-h' {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr className={getRowClassName(row)} {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td className='body-d' {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default EditableTableWithCheckboxYoung;
