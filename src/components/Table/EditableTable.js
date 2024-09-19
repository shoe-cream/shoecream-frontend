import { useTable } from "react-table";
import { useState } from "react";
import './ReactTable.css';

const EditableTable = ({ columns, data }) => {
    const [tableData, setTableData] = useState(data);
    
    // Update cell data when input changes
    const handleInputChange = (value, rowIndex, columnId) => {
        const updatedData = [...tableData];
        updatedData[rowIndex][columnId] = value;
        setTableData(updatedData);
    };

    // Add an empty row to the table
    const addEmptyRow = () => {
        const emptyRow = columns.reduce((acc, column) => {
            acc[column.accessor] = ''; // Initialize empty value for each column
            return acc;
        }, {});
        setTableData([...tableData, emptyRow]); // Add the empty row to the table data
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: tableData,
    });

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
                                    <input 
                                        className="cell-input"
                                        type="text" 
                                        value={cell.value} 
                                        onChange={(e) => handleInputChange(e.target.value, row.index, cell.column.id)}
                                    />
                                </td>
                            ))}
                        </tr>
                    );
                })}

                {/* Add a blank row at the bottom with a + button */}
                <tr className="body-r">
                    <td colSpan={columns.length} className="body-d" style={{ textAlign: 'left' }}>
                        <button onClick={addEmptyRow} className="add-row-button">+ 추가</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default EditableTable;