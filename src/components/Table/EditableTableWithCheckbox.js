import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithCheckbox = ({ columns, ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  const [tableData, setTableData] = useState(data.data);

  useEffect(() => {
    setTableData(data.data);
  },[ogData]);

  /* console.log('ogData: ', ogData);
  console.log('tableData: ', tableData); */

  // 체크박스를 렌더링하는 셀 컴포넌트
  const CheckboxCell = ({ row }) => (
    <input
      type="checkbox"
      checked={checked.includes(parseInt(row.id, 10))}
      onChange={() => {
        const rowId = parseInt(row.id, 10);
        setChecked(prev => 
          prev.includes(rowId)
            ? prev.filter(id => id !== rowId)
            : [...prev, rowId]
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
      const newData = [...tableData];
      if (!newData[index]) {
        newData[index] = {};
      }
      newData[index] = {
        ...newData[index],
        [id]: value
      };
      setTableData(newData);
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

  // 컬럼에 체크박스 컬럼 추가 및 모든 셀을 input으로 변경
  const allColumns = React.useMemo(() => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <input
          type="checkbox"
          checked={tableData.length > 0 && checked.length === tableData.length}
          onChange={() => {
            if (checked.length === tableData.length) {
              setChecked([]);
            } else {
              setChecked(tableData.map((_, index) => index));
            }
          }}
        />
      ),
      Cell: ({ row }) => <CheckboxCell row={row} />
    },
    ...columns.map(column => ({
        ...column,
        Cell: ({ value, row, column }) => (
          <EditableCell
            value={value}
            row={row}
            column={column}
          />
        ),
      }))
  ], [columns, tableData, checked, setChecked]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: allColumns, data: tableData });

  // 행의 클래스 이름을 결정하는 함수
  const getRowClassName = (row) => {
    const rowIndex = row.index;

    // 원본 데이터와 테이블 데이터를 필드별로 비교
    const ogRow = ogData.data[rowIndex];
    const tableRow = tableData[rowIndex];

    // 원본 데이터나 테이블 데이터가 존재하지 않으면 기본 클래스 반환
    if (!ogRow || !tableRow) {
        return 'body-r';
    }

    // 필드별 비교를 수행하여, 값이 다른 경우에만 'body-r-edited'를 반환
    for (const key in ogRow) {
        if (ogRow.hasOwnProperty(key) && tableRow.hasOwnProperty(key)) {
            if (ogRow[key] != tableRow[key]) {
              console.log('edited in component: ', edited);
              if(Array.isArray(edited) && !edited.includes(row)){
                const newArray = [...edited, row];
                setEdited(newArray);
              }
              return 'body-r-edited'; // 데이터가 다를 때 -edited 클래스 붙임
            }
        }
    }
    /* const newArray = edited.filter(item => item != row);
    setEdited(newArray); */
    return 'body-r'; // 값이 모두 동일하면 기본 클래스
};


  return (
    <table {...getTableProps()}>
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

export default EditableTableWithCheckbox;
