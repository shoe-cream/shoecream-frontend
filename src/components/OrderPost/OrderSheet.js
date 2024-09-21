import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import '../Table/ReactTable.css';
import OrderItemsModal from '../modal/OrderItemsModal';

const OrderSheet = ({ ogData, data, setData, checked, setChecked, edited, setEdited }) => {
  const [tableData, setTableData] = useState(data.data);
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

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

  const EditableCell = React.memo(({ value: initialValue, row: { index }, column: { id }, row }) => {
    const [value, setValue] = React.useState(initialValue || '연도-월-일');
  
    const onChange = (e) => {
      setValue(e.target.value);
    };
  
    const onBlur = () => {
      updateData(index, id, value);
    };
  
    const updateData = (index, id, value) => {
      const newData = [...data.data];
      newData[index] = {
        ...newData[index],
        [id]: value,
      };
      setData({ ...data, data: newData });
    };
  
    const getCurrentDate = () => {
      const now = new Date();
      return now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    };
  
    // 현재 행의 orderItems에서 가장 빠른 endDate를 구함
    const minEndDate = React.useMemo(() => {
      if (id === 'requestDate') {
        return row.original.orderItems.reduce((earliest, item) => {
          return item.endDate < earliest ? item.endDate : earliest;
        }, row.original.orderItems[0]?.endDate || getCurrentDate());
      }
      return undefined;
    }, [id, row.original.orderItems]);
  
    // 현재 날짜 기준으로 최소값 설정
    // 현재 날짜 기준으로 최소값 설정
const minDate = id === 'requestDate' ? (() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // 하루 더하기
  return tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
})() : '';
    return (
        <input
          className='cell-input'
          type={id === 'requestDate' ? 'date' : 'text'}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          min={minDate} 
          max={minEndDate}
        />
    );
  });
  
  const ItemsCell = ({ items }) => (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ fontSize: '15px' }}>
          {item.itemNm} ({item.qty} {item.unit}) {item.endDate}
        </div>
      ))}
    </div>
  );
 
  const ItemsCell2 = ({ items }) => (
    <div>
      <button
        onClick={() => {
          setSelectedItems(items); // 클릭한 아이템을 저장
          setIsModalOpen(true); // 모달 열기
        }}
      >
        아이템 보기
      </button>
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
      accessor: 'buyerNm'
    },
    {
      Header: '고객코드',
      accessor: 'buyerCd'
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
      Cell: ({ value }) => <ItemsCell2 items={value} />
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
    <>
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
        </tbody>
      </table>

      {/* 모달 컴포넌트 */}
      <OrderItemsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={selectedItems}
      />
    </>
  );
};

export default OrderSheet;