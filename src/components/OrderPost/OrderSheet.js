import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import '../Table/ReactTable.css';

const OrderSheet = ({ ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  const [tableData, setTableData] = useState(data.data);

  useEffect(() => {
    setTableData(data.data);
  }, [data]);

  useEffect(() => {
    if (ogData && data && ogData.data && data.data) {
      const updatedEdited = data.data.reduce((acc, row, index) => {
        const ogRow = ogData.data[index];
        if (ogRow) {
          const changedCells = Object.keys(row).reduce((cellAcc, key) => {
            if (JSON.stringify(row[key]) !== JSON.stringify(ogRow[key])) {
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

      if (JSON.stringify(edited) !== JSON.stringify(updatedEdited)) {
        setEdited(updatedEdited);
      }
    }
  }, [data, ogData, setEdited]);

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
        setValue(getCurrentDate());
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

  const ItemsCell = ({ items }) => (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {item.itemCd} - {item.itemNm} ({item.qty} {item.unit})
        </div>
      ))}
    </div>
  );

 
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
      Cell: EditableCell
    },
    {
      Header: '고객코드',
      accessor: 'buyerCd',
      Cell: EditableCell
    },
    {
      Header: '등록일',
      accessor: 'registrationDate',
      Cell: ({ value }) => <span>{value}</span>
    },
    {
      Header: '납기일',
      accessor: 'requestDate',
      Cell: EditableCell
    },
    {
      Header: '주문 아이템',
      accessor: 'orderItems',
      Cell: ({ value }) => <ItemsCell items={value} />
    },
    {
      Header: '계약 기간',
      accessor: 'contractPeriod',
      Cell: EditableCell
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
            if (JSON.stringify(ogRow[key]) !== JSON.stringify(tableRow[key])) {
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

export default OrderSheet;