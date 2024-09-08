import { useTable, useRowSelect } from 'react-table';
import './ReactTable.css';

// 기본적으로 체크박스를 렌더링하는 셀 컴포넌트
const CheckboxCell = ({ row }) => (
  <input type="checkbox" {...row.getToggleRowSelectedProps()} />
);

const ReactTableWithCheckbox = ({ columns, data }) => {
  // useTable 훅에 useRowSelect 훅을 포함
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state: { selectedRowIds } } = useTable(
    { columns, data },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <CheckboxCell row={row} />
        },
        ...columns
      ]);
    }
  );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReactTableWithCheckbox;
