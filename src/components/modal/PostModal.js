import './Modal.css';
import './PostModal.css';
import { useState } from 'react';
import EditableTableWithAddrow from '../Table/EditableTableWithAddrow.js';
import EditableTableWithCheckbox from '../Table/EditableTableWithCheckbox';

const PostModal = ({ setOpened, columnData, postRequest }) => {
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState([]);

    const isDataValid = (dataItem)=> {
        // Check if dataItem is an object
        if (typeof dataItem !== 'object' || dataItem === null) {
            return false;
        }

        // Loop through each column to ensure all required fields are present and not empty
        for (const column of columnData) {
            const { accessor } = column;
            const value = dataItem[accessor];

            // Check if the value is empty or undefined
            if (value === undefined || value === null || value.trim() === '') {
                return false;
            }
        }

        // All checks passed
        return true;
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
                            if(isDataValid(indivisualData)){
                                checkedData.push(indivisualData);
                            }else{
                                alert('모든 필드를 정확하게 입력해주세요');
                                return;
                            }
                        }
                        console.log('checkedData: ', checkedData);
                        postRequest();
                        setOpened(false);
                        }}>등록</button>
                    <button className="post-modal-button" onClick={() => setOpened(false)}>취소</button>
                </div>
            </div>
        </div>
    );
}
export default PostModal;