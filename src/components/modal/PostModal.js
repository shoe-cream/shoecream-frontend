import './Modal.css';
import './PostModal.css';
import { useState } from 'react';
import EditableTableWithAddrow from '../Table/EditableTableWithAddrow.js';
import EditableTableWithCheckbox from '../Table/EditableTableWithCheckbox';
import sendPostMultiItemRequest from '../../requests/PostMultiItemRequest.js';
import sendGetItemsRequest from '../../requests/GetItemsRequest.js';

const PostModal = ({ state, setOpened, columnData, postRequest, page, setPage, setParentData }) => {
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState([]);

    const isDataValid = (dataItem)=> {
        let result = {};
        // 개별 항목이 객체임을 보장 (itemNm: 'shoes' 형태)
        if (typeof dataItem !== 'object' || dataItem === null) {
            return undefined;
        }

        // Loop through each column to ensure all required fields are present and not empty
        for (const column of columnData) {
            const { accessor } = column;
            const value = dataItem[accessor];

            // Check if the value is empty or undefined
            if (value === undefined || value === null || value.trim() === '') {
                return undefined;
            }
            
            if(accessor === 'size' || accessor === 'unitPrice'){
                // 문자열 대신 숫자가 들어가야 하는 항목
                result[accessor] = parseInt(value, 10);
            }else{
                result[accessor] = value;
            }
        }

        // All checks passed
        return result;
    }
    return (
        <div className="modal-background">
            <div className='modal-container'>
                <EditableTableWithAddrow columns={columnData} data={data} setData={(value) => setData(value)} checked={checked} setChecked={setChecked}></EditableTableWithAddrow>
                <div className='post-modal-button-container'>
                    <button className="post-modal-button" onClick={() => {
                                /* console.log('checked: ', checked); */
                                let checkedData = [];
                                if(checked.length===0){
                                    alert('하나 이상의 데이터를 체크해주세요');
                                    return;
                                }
                                for(let i = 0; i< checked.length; i++){
                                    const indivisualData = data[checked.sort()[i]];
                                    const validatedData = isDataValid(indivisualData);
                                    if(validatedData !== undefined){
                                        checkedData.push(validatedData);
                                    }else{
                                        alert('모든 필드를 정확하게 입력해주세요');
                                        return;
                                    }
                                }
                                console.log('checkedData: ', checkedData);
                                sendPostMultiItemRequest(state, checkedData, () => {
                                setOpened(false);
                                sendGetItemsRequest(state, page, setPage, 10, (value) => setParentData(value));
                                });
                                }}>등록</button>
                    <button className="post-modal-button" onClick={() => setOpened(false)}>취소</button>
                </div>
            </div>
        </div>
    );
}
export default PostModal;