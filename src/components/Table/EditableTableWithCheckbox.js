import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithCheckbox = ({ columns, ogData, data, setData, checked, setChecked, edited, setEdited, onRowClick ,onCheckboxChange}) => {

  useEffect(() => {
    console.log('data in editableTable: ', data);
    
    if (ogData && data && ogData.data && data.data) {
      const updatedEdited = data.data.reduce((acc, row, index) => {
        const ogRow = ogData.data[index];
        if (ogRow) {
          const changedCells = Object.keys(row).reduce((cellAcc, key) => {
            const rowValue = (typeof row[key] === 'number' ? row[key] : String(row[key]));
            const ogValue = (typeof ogRow[key] === 'number' ? ogRow[key] : String(ogRow[key]));

            if (rowValue !== ogValue) {
              cellAcc[key] = row[key];
            }
            return cellAcc;
          }, {});

          if (Object.keys(changedCells).length > 0) {
            acc[index] = changedCells;
          }
        } else {
          acc[index] = { ...row };
        }
        return acc;
      }, {});

      if (JSON.stringify(edited) !== JSON.stringify(updatedEdited)) {
        setEdited(updatedEdited);
      }
    }
  }, [data, ogData, setEdited]);

  const CheckboxCell = React.memo(({ row }) => (
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
        if (typeof onCheckboxChange === 'function') {
          onCheckboxChange(row.original);
        } else {
          console.warn('onCheckboxChange는 함수가 아닙니다.');
        }
      }}
    />
  ));

  const EditableCell = React.memo(({ value: initialValue, row: { index }, column: { id, ...column } }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.value = column.type === 'date' ? initialValue.slice(0, 10) : initialValue;
      }
    }, [initialValue, column.type]);

    const onChange = useCallback((e) => {
      const newValue = e.target.value;

      if (column.type === 'date') {
        setData(prevData => {
          const newData = [...prevData.data];
          newData[index] = {
            ...newData[index],
            [id]: newValue + "T00:00:00"
          };
          return { ...prevData, data: newData };
        });
      } 
    }, [column.type, id, index, setData]);

    const onBlur = useCallback(() => {
      if (column.type !== 'date') {
        setData(prevData => {
          const newData = [...prevData.data];
          newData[index] = {
            ...newData[index],
            [id]: column.type === 'number' ? Number(inputRef.current.value) : inputRef.current.value
          };
          return { ...prevData, data: newData };
        });
      }
    }, [column.type, id, index, setData]);

    if(column.type === undefined || column.type === 'cell'){
      return <span>{initialValue}</span>;
    }

    return (
      <input
        ref={inputRef}
        className={`cell-input ${id === 'qty' || id === '수량' ? 'qty-input' : ''}`}
        type={column.type}
        defaultValue={column.type === 'date' ? initialValue.slice(0, 10) : initialValue}
        onChange={onChange}
        onBlur={onBlur}
        style={id === 'qty' || id === '수량' ? { textAlign: 'right', paddingRight: '5px' } : {}}
      />
    );
  });

  const allColumns = useMemo(() => [
    {
      id: 'selection',
      Header: () => (
        <input
          type="checkbox"
          checked={data.data.length > 0 && checked.length === data.data.length}
          onChange={() => {
            if (checked.length === data.data.length) {
              setChecked([]);
            } else {
              setChecked(data.data.map((_, index) => index));
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
  ], [columns, data.data, checked, setChecked]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: allColumns, data: data.data });

  const getRowClassName = useCallback((row) => {
    const rowIndex = row.index;
    return edited.hasOwnProperty(rowIndex) ? 'body-r-edited' : 'body-r';
  }, [edited]);

  const handleRowClick = useCallback((e, row) => {
    // 클릭한 요소가 input이면 onRowClick 이벤트 무시
    if (e.target.tagName === 'INPUT') {
      return;
    }
    onRowClick && onRowClick(row.original);
  }, [onRowClick]);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr className='header-r' {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th 
                className='header-h' 
                {...column.getHeaderProps()}
                style={column.id === 'qty' || column.id === '수량' ? { width: '60px', minWidth: '60px', maxWidth: '60px' } : {}}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr className={getRowClassName(row)} {...row.getRowProps()}
                onClick={(e) => handleRowClick(e, row)}
            >
              {row.cells.map(cell => (
                <td 
                  className='body-d' 
                  {...cell.getCellProps()}
                  style={cell.column.id === 'qty' || cell.column.id === '수량' ? { textAlign: 'right', paddingRight: '10px' } : {}}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default React.memo(EditableTableWithCheckbox);