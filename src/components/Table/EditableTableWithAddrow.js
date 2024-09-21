import React, { useEffect, useState, useRef } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';
import SearchInput from '../search/SearchInput';
import SearchWindow from '../search/SearchWindow';
import SearchModal from '../../components/modal/SearchModal';
import Swal from 'sweetalert2';

const EditableTableWithAddrow = ({ columns, data, setData, checked, setChecked, requestArr }) => {
  // 빈 객체를 n개 가진 배열로 초기화
  const [masterDataArr, setMasterDataArr] = useState(
    requestArr && Array.isArray(requestArr) ? Array(requestArr.length).fill({ key: '', data: [] }) : []
  );

  const [openedSearchModal, setOpenedSearchModal] = useState(0);
  const [searchInputs, setSearchInputs] = useState(
    requestArr && Array.isArray(requestArr) ? Array(requestArr.length).fill('') : []
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

  const tableRef = useRef(null);

  // 행 추가하는 함수
  const addEmptyRow = React.useCallback(() => {
    setTableData(prevData => {
      const newData = [...prevData, createEmptyRow()];

      // 새 행이 추가된 후 스크롤 조정
      setTimeout(() => {
        if (tableRef.current) {
          const tableHeight = tableRef.current.scrollHeight;
          const currentScroll = tableRef.current.scrollTop;
          const viewportHeight = tableRef.current.clientHeight;

          // 새로운 행이 뷰포트 밖에 있는 경우에만 스크롤 조정
          if (tableHeight - currentScroll > viewportHeight) {
            tableRef.current.scrollTop = tableHeight - viewportHeight;
          }
        }
      }, 0);

      return newData;
    });
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

  const EditableCell = React.memo(({ value: initialValue, row: { index }, column: { id, type, masterDataIndex, options, placeholder }, masterDataArr }) => {
    const [value, setValue] = React.useState(initialValue);
    const [dropdownOptions, setDropdownOptions] = useState([]);

    const onChange = (e) => {
      const newValue = type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
      setValue(newValue);
    };

    const onBlur = () => {
      console.log('value in onBlur', value);
      if(type === 'number' && value < 0){
        setValue('');
        Swal.fire({text: '음수는 허용되지 않습니다.'});
        return;
      }
      const newData = [...tableData];
      if (!newData[index]) {
        newData[index] = {};
      }
      newData[index] = {
        ...newData[index],
        [id]: value
      };
      console.log('onBlur data: ', newData);
      setTableData(newData);
      setData(newData);
    };

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
      if (type === 'dropdown' || 'search-input') {
        if (options) {
          // 고정 옵션 사용
          setDropdownOptions(options);
        } else if (masterDataArr && masterDataArr.length > masterDataIndex) {
          // 동적 옵션 사용
          setDropdownOptions(masterDataArr[masterDataIndex]?.data || []);
        }
      }
    }, [masterDataArr, type, id, masterDataIndex, options]);

    const inputType = type || 'text';

    if (type === 'dropdown') {
      return (
        <select value={value} onChange={onChange} onBlur={onBlur}>
          <option value="" hidden></option>
          {dropdownOptions.map((option, index) => (
            <option key={index} value={typeof option === 'object' ? option[id] : option}>
              {typeof option === 'object' ? option[id] : option}
            </option>
          ))}
        </select>
      );
    }
    if (type === 'search-input') {
      const suggestions = dropdownOptions.map(option => ({
        key: typeof option === 'object' ? option[id] : option,
        onSearch: () => {
          if (typeof option === 'object' && option.path) {
            // navigate(option.path);
          }
        }
      }));

      return (
        <SearchInput
          placeholder={placeholder || '검색어를 입력하세요'}
          suggestions={suggestions}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          searchInputs={searchInputs[masterDataIndex]}
          setSearchInputs={(value) => {
            const newInputs = searchInputs.map((input, index) => index === masterDataIndex ? value : input);
            setSearchInputs(newInputs)}}
        />
      );
    }
    if (type === 'search-modal') {
      return (
        <button
          className='search-modal-open-button'
          onClick={() => setOpenedSearchModal(masterDataIndex + 1)}
        >{placeholder}</button>
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
          column={{ ...column, masterDataIndex: index }}
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
    <div ref={tableRef} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
          <tr className="body-r">
            <td colSpan={allColumns.length} className="body-d" style={{ textAlign: 'center' }}>
              <button onClick={addEmptyRow} className="add-row-button">+ 추가</button>
            </td>
          </tr>
        </tbody>
      </table>
      {requestArr && requestArr.map((request, index) => (
        openedSearchModal === index + 1 ? <SearchModal setOpenedModal = {setOpenedSearchModal}/> : <div />
      ))}
    </div>
  );
};

export default EditableTableWithAddrow;