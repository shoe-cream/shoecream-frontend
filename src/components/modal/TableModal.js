import './Modal.css';
import './PostModal.css';
import { useEffect, useState } from 'react';
import ReactTable from '../../components/Table/ReactTable';

const TableModal = ({ setOpened, columnData, label, data }) => {
    return (
        <div className="modal-background">
            <div className='modal-container'>
                <h2 className="app-label">{label}</h2>
                <ReactTable
                    columns={columnData}
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