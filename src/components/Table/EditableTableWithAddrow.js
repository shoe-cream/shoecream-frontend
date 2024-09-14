import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithAddrow = ({ columns, data, setData, checked, setChecked, requestArr }) => {
  // 빈 객체를 n개 가진 배열로 초기화
  const [masterDataArr, setMasterDataArr] = useState(
    requestArr && Array.isArray(requestArr) ? Array(requestArr.length).fill({ key: '', data: [] }) : []
  );

  useEffect(() => {
    if (requestArr !== undefined) {
      setMasterDataArr(Array.from({ length: requestArr.length }, () => ({}))); 
      requestArr.forEach((request, index) => {
        request.function((value) => {
          console.log('value: ', value);
          console.log('request key: ', request.key);
          setMasterDataArr(prevArr => {
            const newArr = [...prevArr];
            /* value.key =  */
            /* console.log() */
            newArr[index] = value; 
            console.log('newMasterData: ', newArr);
            return newArr;
          });
        });
      });
    }
  }, []);

  // 빈 행을 생성하는 함수
  const createEmptyRow = React.useCallback(() => {
    return columns.reduce((acc, column) => {
      acc[column.accessor] = ''; // 열마다 빈 값을 초기화
      return acc;
    }, {});
  }, [columns]);

  // 초기 데이터 설정
  const initialData = React.useMemo(() => {
    if (data.length === 0) {
      return [createEmptyRow()];
    }
    return data;
  }, [data, createEmptyRow]);

  const [tableData, setTableData] = React.useState(initialData);

  // 행 추가하는 함수
  const addEmptyRow = React.useCallback(() => {
    setTableData(prevData => [...prevData, createEmptyRow()]);
  }, [createEmptyRow]);

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

  const EditableCell = React.memo(({ value: initialValue, row: { index }, column: { id, type, masterDataIndex }, masterDataArr }) => {
    const [value, setValue] = React.useState(initialValue);
    const [options, setOptions] = React.useState({key:'', data: []});
  
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
      setData(newData);
    };
  
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    React.useEffect(() => {
      if (type === 'dropdown' && masterDataArr && masterDataArr.length > masterDataIndex) {
        setOptions({key:id, data: masterDataArr[masterDataIndex]?.data || []});
      }
    }, [masterDataArr, type, id, masterDataIndex]);
  
    const inputType = type || 'text';
  
    if (type === 'dropdown') {
      return (
        <select value={value} onChange={onChange} onBlur={onBlur}>
          <option value="" hidden></option>
          {options.data && options.data.length > 0 && options.data.map((option, index) => (
            <option key={index} value={option[options.key]}>{option[options.key]}</option>
          ))}
        </select>
      );
    }
  
    return (
      <input
        className='cell-input'
        type={inputType}
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
      Header: () => (
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
    ...columns.map((column, index) => ({
      ...column,
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={{...column, masterDataIndex: index}}
          masterDataArr={masterDataArr}
        />
      ),
    }))
  ], [columns, tableData, checked, setChecked, masterDataArr]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: allColumns, data: tableData });

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
            <tr className='body-r' {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td className='body-d' {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}

        {/* 마지막 줄에 + 버튼 추가 */}
        <tr className="body-r">
          <td colSpan={allColumns.length} className="body-d" style={{ textAlign: 'center' }}>
            <button onClick={() => {
              addEmptyRow();
            }} className="add-row-button">+ 추가</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default EditableTableWithAddrow;
