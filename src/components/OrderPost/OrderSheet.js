import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import '../Table/ReactTable.css';

const EditableTableWithCheckbox = ({ ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  const [tableData, setTableData] = useState(data.data);
  console.log(checked);
  useEffect(() => {
    setTableData(data.data);
  }, [ogData]);

  useEffect(() => {
    if (ogData && data && ogData.data && data.data) {
      const updatedEdited = data.data.reduce((acc, row, index) => {
        const ogRow = ogData.data[index];
        if (ogRow) {
          const changedCells = Object.keys(row).reduce((cellAcc, key) => {
            if (row[key] !== ogRow[key]) {
              cellAcc[key] = row[key];
            }
            return cellAcc;
          }, {});

          if (Object.keys(changedCells).length > 0) {
            acc[index] = changedCells;
          }
        } else {
          // 새로 추가된 행
          acc[index] = { ...row };
        }
        return acc;
      }, {});

      // 변경 사항이 있을 때만 setEdited 호출
      if (JSON.stringify(edited) !== JSON.stringify(updatedEdited)) {
        setEdited(updatedEdited);
      }
    }
  }, [data, ogData, setEdited]);


  // 현재 날짜와 시간으로 초기화하는 함수
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

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
      newData[index] = {
        ...newData[index],
        [id]: value
      };
      setTableData(newData);
      setData({ ...data, data: newData });
    };

    React.useEffect(() => {
      if (id === 'registrationDate' && !value) {
        setValue(getCurrentDate()); // 초기값 설정
      } else {
        setValue(initialValue);
      }
    }, [initialValue, id]);

    return (
      <input
        className='cell-input'
        type={id === 'requestDate' ? 'date' : 'text'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  });

  const columns = React.useMemo(() => [
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
    {
      Header: '고객사',
      accessor: 'buyerNm',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '고객코드',
      accessor: 'buyerCd',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '등록일',
      accessor: 'registrationDate',
      Cell: ({ value }) => <span>{value}</span>
    },
    {
      Header: '납기일',
      accessor: 'requestDate',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '제품명',
      accessor: 'itemNm',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '제품코드',
      accessor: 'itemCd',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '제품 단가',
      accessor: 'unitPrice',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '색상',
      accessor: 'color',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '사이즈',
      accessor: 'size',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '수량',
      accessor: 'qty',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '단위',
      accessor: 'unit',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    },
    {
      Header: '금액',
      accessor: 'price',
      Cell: ({ row }) => {
        const unitPrice = row.original.unitPrice || 0;
        const qty = row.original.qty || 0;
        const price = unitPrice * qty;
        return <span>{price}</span>;
      }
    },
    {
      Header: '계약 기간',
      accessor: 'contractPeriod',
      Cell: ({ value, row, column }) => (
        <EditableCell
          value={value}
          row={row}
          column={column}
        />
      )
    }
  ], [tableData, checked, setChecked]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData });

  const getRowClassName = (row) => {
    const rowIndex = row.index;

    const ogRow = ogData.data[rowIndex];
    const tableRow = tableData[rowIndex];

    if (!ogRow || !tableRow) {
        return 'body-r';
    }

    for (const key in ogRow) {
        if (ogRow.hasOwnProperty(key) && tableRow.hasOwnProperty(key)) {
            if (ogRow[key] !== tableRow[key]) {
              return 'body-r-edited';
            }
        }
    }

    return 'body-r';
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
