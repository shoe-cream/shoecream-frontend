import { useTable } from "react-table";
import './ReactTable.css';

const ReactTable = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    console.log('data: ', data);
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr className="header-r" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th className="header-d" {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                <tr className="body-r" {...row.getRowProps()}>
                    {row.cells.map(cell => (
                    <td className="body-d" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default ReactTable;