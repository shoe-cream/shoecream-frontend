import { useState } from "react";
import sendPatchPasswordRequest from "../../requests/PatchPasswordRequest";
import Swal from "sweetalert2";

const PasswordEditModal = ({ setOpened, state, memberId, onModify }) => {
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordCheckInput, setPasswordCheckInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordCheckError, setPasswordCheckError] = useState(false);

    const onChangePassword = (value) => {
        setPasswordInput(value);
        const regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};":\\|,.<>\\/?]).{10,20}');
        const passed = !regex.test(value);
        setPasswordError(passed);
        if (passwordCheckInput !== '') {
            setPasswordCheckError(value !== passwordCheckInput);
        }
    }

    const onChangePasswordCheck = (value) => {
        setPasswordCheckInput(value);
        setPasswordCheckError(passwordInput !== value);
    }

    return (
        <div className="modal-overlay">
            <div className='modal-content'>
                <h2 className="modal-title">비밀번호 변경</h2>
                <form className="password-form">
                    <div className="form-group">
                        <label htmlFor="current-password">현재 비밀번호</label>
                        <input
                            id="current-password"
                            className={`form-input ${currentPasswordInput ? 'form-input-filled' : ''}`}
                            placeholder="현재 비밀번호 입력"
                            onChange={(e) => setCurrentPasswordInput(e.target.value)}
                            type="password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password">새 비밀번호</label>
                        <input
                            id="new-password"
                            className={`form-input ${passwordInput ? 'form-input-filled' : ''}`}
                            placeholder="새 비밀번호 입력"
                            onChange={(e) => onChangePassword(e.target.value)}
                            type="password"
                        />
                        {passwordError && <div className="input-error-message">영문 대/소문자, 숫자, 특수문자 포함 총 10자 이상 입력해주세요</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">새 비밀번호 확인</label>
                        <input
                            id="confirm-password"
                            className={`form-input ${passwordCheckInput ? 'form-input-filled' : ''}`}
                            placeholder="새 비밀번호 확인"
                            onChange={(e) => onChangePasswordCheck(e.target.value)}
                            type="password"
                        />
                        {passwordCheckError && <div className="input-error-message">비밀번호가 일치하지 않습니다</div>}
                    </div>
                </form>
                <div className='modal-actions'>
                    <button className="modal-button modal-button-primary" onClick={() => {
                        const requestBody = {
                            password: currentPasswordInput,
                            newPassword: passwordInput,
                        }
                        if(currentPasswordInput === ''){
                            Swal.fire({text: '현재 비밀번호를 입력해주세요'});
                            return;
                        }
                        if(passwordInput === ''){
                            Swal.fire({text: '새 비밀번호를 입력해주세요'});
                            setPasswordError(true);
                            return;
                        }
                        if(passwordCheckInput === ''){
                            Swal.fire({text: '새 비밀번호를 확인해주세요'});
                            setPasswordCheckError(true);
                            return;
                        }
                        if(passwordError){
                            Swal.fire({text: '비밀번호를 올바른 형태로 입력해주세요'});
                            return;
                        }
                        if(passwordCheckError){
                            Swal.fire({text: '비밀번호가 일치하지 않습니다.'});
                            return;
                        }
                        if(passwordInput === currentPasswordInput){
                            Swal.fire({text: '현재 비밀번호와 새 비밀번호가 달라야 합니다.'});
                            return;
                        }
                        sendPatchPasswordRequest(state, memberId, requestBody, () => setOpened(false))

                    }}>변경</button>
                    <button className="modal-button" onClick={() => setOpened(false)}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default PasswordEditModal;