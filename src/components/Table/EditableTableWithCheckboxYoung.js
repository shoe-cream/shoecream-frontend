import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const EditableTableWithCheckboxYoung = ({ columns, ogData, data, setData, checked, setChecked, edited, setEdited }) => {
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
        setData(prevData => {
          const newData = [...prevData.data];
          if (!newData[index]) {
            newData[index] = {};
          }
          newData[index] = {
            ...newData[index],
            [id]: value
          };
          return { ...prevData, data: newData };
        });
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
          column.editable ? (
            <EditableCell
              value={value}
              row={row}
              column={column}
            />
          ) : (<span>{value}</span>)
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

  const getRowClassName = (row) => {
    const rowIndex = row.index;
    return edited.hasOwnProperty(rowIndex) ? 'body-r-edited' : 'body-r';
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

export default EditableTableWithCheckboxYoung;