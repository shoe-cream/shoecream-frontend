import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';
import Swal from 'sweetalert2';
import { ChevronRight } from 'lucide-react';

const EditableTableWithCheckbox = ({ columns, ogData, data, setData, checked, setChecked, edited, setEdited, onRowClick ,onCheckboxChange}) => {

  useEffect(() => {
    if (ogData && data && ogData.data && data.data) {
      const updatedEdited = data.data.reduce((acc, row, index) => {
        const ogRow = ogData.data[index];
        if (ogRow) {
          const changedCells = Object.keys(row).reduce((cellAcc, key) => {
            // 마진율('margin')을 비교 대상에서 제외
            if (key !== 'margin') {
              const rowValue = typeof row[key] === 'number' ? row[key] : String(row[key]);
              const ogValue = typeof ogRow[key] === 'number' ? ogRow[key] : String(ogRow[key]);

              if (rowValue !== ogValue) {
                cellAcc[key] = row[key];
              }
            }
            return cellAcc;
          }, {});

          if (Object.keys(changedCells).length > 0) {
            acc[index] = changedCells;
          }
        }
        return acc;
      }, {});

      if (JSON.stringify(edited) !== JSON.stringify(updatedEdited)) {
        setEdited(updatedEdited);
      }
    }
  }, [data, ogData, setEdited]);

  const CheckboxCell = React.memo(({ row }) => (
    <div className="checkbox-column">
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
    </div>
  ));

  const EditableCell = React.memo(({ value: initialValue, row ,row: { index }, column: { id, ...column } }) => {
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
      const currentValue = inputRef.current.value
      console.log('value in onBlur: ', currentValue);
      if(column.type === 'number'){
        const max = column.max || 2147483647;
        if(currentValue > max){
          inputRef.current.value = '';
          Swal.fire({text: `허용된 값(${max})을 초과하였습니다.`});
          return;
        }
        const min = column.min || 0;
        if(currentValue < min){
          inputRef.current.value = '';
          Swal.fire({text: `최소값(${min}) 미만입니다.`});
          return;
        }
      }
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

    if (id === '불용재고') {
      return <div className="unused-stock">{initialValue}</div>;
    }

    if(column.type === undefined || column.type === 'cell'){
      return <span>{initialValue}</span>;
    }
    const getCurrentDate = () => {
      const now = new Date();
      return now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    };
    const minDate = getCurrentDate();

    if(column.type === 'clickable'){
      return(
        <div
          className='cell-clickable'
          onClick={() => onRowClick(row.original)}
        >
        {initialValue}  
        </div>
      )
    }

    if (column.type === 'button') {
      return (
        <button
          className='cell-button'
          onClick={() => {
            if (column.onClick) {
              column.onClick(row.original); // row.original을 전달
            }
          }}
          title="상세 정보 보기"
        >
          {column.buttonTitle} <ChevronRight size={16} />
        </button>
      );
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
        min={column.type === 'date' ? minDate : column.type === 'number' ? '0' : undefined}
        onKeyDown={(e) => {
          if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
          }
        }}
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
          onRowClick={onRowClick}
        />
      ),
    }))
  ], [columns, data.data, checked, setChecked, onRowClick]);

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
                /* onClick={(e) => handleRowClick(e, row)} */
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