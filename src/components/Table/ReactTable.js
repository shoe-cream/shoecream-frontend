import { useTable } from "react-table";
import './ReactTable.css';

const ReactTable = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    const renderCellContent = (cell) => {
        const cellValue = cell.value;
        
        // 객체 배열인 경우, 각 객체의 속성을 추출해서 표시
        if (Array.isArray(cellValue)) {
            return (
                <div>
                    {cellValue.map((item, index) => (
                        <div key={index}>
                            {/* 객체의 속성을 표시 */}
                            {item.itemCd} - {item.itemNm} ({item.qty} {item.unit})
                        </div>
                    ))}
                </div>
            );
        } 
        // 객체 자체인 경우, 그 객체의 특정 속성들만 표시하도록 처리
        else if (typeof cellValue === 'object' && cellValue !== null) {
            return (
                <div>
                    {Object.keys(cellValue).map((key, index) => (
                        <div key={index}>
                            {key}: {JSON.stringify(cellValue[key])}
                        </div>
                    ))}
                </div>
            );
        } 
        else {
            // 배열이 아닌 경우, 기본 값을 표시
            return cell.render('Cell');
        }
    };
    console.log('data in reactTable: ', data);
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
                                <td className="body-d" {...cell.getCellProps()}>
                                    {renderCellContent(cell)}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default ReactTable;