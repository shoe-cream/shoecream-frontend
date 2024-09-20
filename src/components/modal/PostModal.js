import './Modal.css';
import './PostModal.css';
import { useState } from 'react';
import EditableTableWithAddrow from '../Table/EditableTableWithAddrow.js';
import Swal from 'sweetalert2';

const PostModal = ({ setOpened, columnData, postRequest, sortBy, setParentData, requestArr }) => {
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState([]);
    const [searchInputs, setSearchInputs] = useState(Array(requestArr.length).fill({accessor:'', value: ''}));

    const isDataValid = (dataItem) => {
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
            if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
                return undefined;
            }
            result[accessor] = value;
        }

        // All checks passed
        return result;
    }
    return (
        <div className="modal-background">
            <div className='modal-container'>
                <EditableTableWithAddrow
                    columns={columnData}
                    data={data}
                    setData={(value) => setData(value)}
                    checked={checked}
                    setChecked={setChecked}
                    requestArr={requestArr}
                    setSearchInputs
                ></EditableTableWithAddrow>
                <div className='post-modal-button-container'>
                    <button className="post-modal-button" onClick={() => {
                        /* console.log('checked: ', checked); */
                        let checkedData = [];
                        if (checked.length === 0) {
                            Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                            return;
                        }
                        for (let i = 0; i < checked.length; i++) {
                            const indivisualData = data[checked.sort()[i]];
                            console.log('indivisualData: ', indivisualData);
                            const validatedData = isDataValid(indivisualData);
                            if (validatedData !== undefined) {
                                checkedData.push(validatedData);
                            } else {
                                Swal.fire({ text: '모든 필드를 정확하게 입력해주세요' });
                                return;
                            }
                        }
                        console.log('checkedData: ', checkedData);
                        console.log('sortBy: ', sortBy);

                        checkedData.forEach(obj => {
                            Object.keys(obj).forEach(key => {
                                if (key.includes('Date')) {
                                    obj[key] = `${obj[key]}T00:00:00`;
                                }
                            });
                        });                        

                        console.log('changedCheckedData: ', checkedData);
                        
                        let areDatesValid = true;
                        checkedData.forEach((data, index) => {
                            if('startDate' in data && 'endDate' in data){
                                console.log('시작일 & 종료일 발견!');
                                const startDate = new Date(data.startDate);
                                const endDate = new Date(data.endDate);
                                if(startDate > endDate){
                                    Swal.fire({text: `${index + 1}번 행 기간 설정 오류: 종료일이 시작일보다 앞설 수 없습니다.`});
                                    areDatesValid = false;
                                    return;
                                }
                            }
                        })
                        if(!areDatesValid) return;
                        
                        postRequest(checkedData, setOpened, setParentData);
                    }}>등록</button>
                    <button className="post-modal-button" onClick={() => setOpened(false)}>취소</button>
                </div>
            </div>
        </div>
    );
}
export default PostModal;