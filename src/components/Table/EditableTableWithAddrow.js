import React from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithAddrow = ({ columns, data, setData, checked, setChecked }) => {
  const [tableData, setTableData] = React.useState(data);

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
      setData(newData);
      /* console.log('tableData: ', tableData);
      console.log('newData: ', newData); */
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

  // 행 추가하는 함수
  const addEmptyRow = () => {
    const emptyRow = columns.reduce((acc, column) => {
      acc[column.accessor] = ''; // 열마다 빈 값을 초기화
      return acc;
    }, {});
    setTableData([...tableData, emptyRow]); // 새로운 빈 행 추가
  };

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
            <button onClick={() =>
                {
                    addEmptyRow();
                    console.log(tableData);
                }
                
        } className="add-row-button">+ 추가</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
export default EditableTableWithAddrow;
