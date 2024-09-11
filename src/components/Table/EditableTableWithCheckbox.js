import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithCheckbox = ({ columns, ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  const [tableData, setTableData] = useState(data.data);

  /* console.log('ogData: ', ogData); */

  useEffect(() => {
    setTableData(data.data);
  }, [ogData]);

  useEffect(() => {
    // Update edited state whenever tableData or ogData changes
    const updatedEdited = tableData.map((row, index) => {
      const ogRow = ogData.data[index];
      if (ogRow) {
        for (const key in ogRow) {
          if (ogRow.hasOwnProperty(key) && row.hasOwnProperty(key)) {
            if (ogRow[key] != row[key]) {
              return index; // Return index of edited row
            }
          }
        }
      }
      return null;
    }).filter(index => index !== null);

    setEdited(updatedEdited);
  }, [tableData, ogData]);

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
          column.editable ? (
            <EditableCell
              value={value}
              row={row}
              column={column}
            />
          ) : (<span>{value}</span>)
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
    if(ogRow.length > 0){
      for (const key in ogRow) {
          if (ogRow.hasOwnProperty(key) && tableRow.hasOwnProperty(key)) {
              if (ogRow[key] != tableRow[key]) {
                return 'body-r-edited'; // 데이터가 다를 때 -edited 클래스 붙임
              }
          }
      }
    }

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
