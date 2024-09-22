import Swal from "sweetalert2";
import sendPatchMyInfoRequest from "../../requests/PatchMyInfoRequest";
import { useEffect } from "react";

const ProfileEditModal = ({ initialize, setOpened, inputs, onModify }) => {
    useEffect(() => {
        if(initialize !== undefined){
            console.log('초기화!');
            initialize();
        }
    },[]);
    return (
        <div className="modal-overlay">
            <div className='modal-content'>
                <h2 className="modal-title">프로필 수정</h2>
                <form className="profile-form">
                    {inputs.map((input, index) => (
                        <div key={index} className="form-group">
                            <label htmlFor={`input-${index}`}>{input.placeholder}</label>
                            <input
                                id={`input-${index}`}
                                className={`form-input ${input.input ? 'form-input-filled' : ''}`}
                                placeholder={`${input.placeholder} 입력`}
                                onBlur={(e) => input.setInput(e.target.value)}
                                type="text"
                            />
                        </div>
                    ))}
                </form>
                <div className='modal-actions'>
                    <button className="modal-button modal-button-primary" onClick={() => {
                        const requestBody = inputs.reduce((acc, item) => {
                            if (item.input !== '') {
                                acc[item.accessor] = item.input;
                            }
                            return acc;
                        }, {});
                        console.log('requestBody: ', requestBody);
                        if(Object.keys(requestBody).length === 0){
                            Swal.fire({text: '수정할 항목을 하나 이상 입력해주세요'});
                            return;
                        }
                        onModify(requestBody);
                    }}>수정</button>
                    <button className="modal-button" onClick={() => {
                        inputs.forEach(input => {
                            input.setInput('');
                        });
                        setOpened(false)
                    }}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileEditModal;