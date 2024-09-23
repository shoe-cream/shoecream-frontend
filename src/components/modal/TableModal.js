import './Modal.css';
import './PostModal.css';
import './StatusBadge.css';  // 새로운 CSS 파일을 import
import { useEffect, useState } from 'react';
import ReactTable from '../../components/Table/ReactTable';

const TableModal = ({ setOpened, columnData, label, data }) => {
    const getStatusBadge = (status) => {
        let badgeClass = 'status-badge ';
        let displayText = status;
        switch (status) {
            case 'REQUEST_TEMP':
                badgeClass += 'waiting';
                displayText = '대기';
                break;
            case 'APPROVED':
                badgeClass += 'approved';
                displayText = '승인';
                break;
            case 'REJECTED':
                badgeClass += 'rejected';
                displayText = '반려';
                break;
            case 'CANCELLED':
                badgeClass += 'cancelled';
                displayText = '취소';
                break;
            case 'PRODUCT_PASS':
                badgeClass += 'passed';
                displayText = '합격';
                break;
            case 'PRODUCT_FAIL':
                badgeClass += 'failed';
                displayText = '불합격';
                break;
            default:
                badgeClass += 'unknown';
                displayText = '알 수 없음';
        }
        return <span className={badgeClass}>{displayText}</span>;
    };

    const modifiedColumnData = columnData.map(column => {
        if (column.accessor === 'orderStatus') {
            return {
                ...column,
                Cell: ({ value }) => getStatusBadge(value)
            };
        }
        return column;
    });

    return (
        <div className="modal-background">
            <div className='modal-container'>
                <h2 className="app-label">{label}</h2>
                <ReactTable
                    columns={modifiedColumnData}
                    data={data.data}
                >                    
                </ReactTable>
                <div className='post-modal-button-container'>
                    <button className="post-modal-button" onClick={() => setOpened(false)}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default TableModal;