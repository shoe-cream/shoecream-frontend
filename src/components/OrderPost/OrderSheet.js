import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import '../Table/ReactTable.css';


const EditableTableWithCheckbox = ({ ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  const [tableData, setTableData] = useState(data.data);

  useEffect(() => {
    setTableData(data.data);
  }, [ogData]);

  useEffect(() => {
    const updatedEdited = tableData.map((row, index) => {
      const ogRow = ogData.data[index];
      if (ogRow) {
        for (const key in ogRow) {
          if (ogRow.hasOwnProperty(key) && row.hasOwnProperty(key)) {
            if (ogRow[key] !== row[key]) {
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
      accessor: 'quantity',
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
      Cell: ({ value }) => <span>{value}</span>
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
