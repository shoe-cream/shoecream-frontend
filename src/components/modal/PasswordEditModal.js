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
        <div className="modal-background">
            <div className='modal-container-narrow'>
                <h2 className="modal-label">비밀번호 변경</h2>
                <div className="profile-modify-input-container">
                    <input
                        className={passwordInput === '' ? 'profile-modify-input-empty' : 'profile-modify-input'}
                        placeholder="현재 비밀번호"
                        onChange={(e) => {
                            setCurrentPasswordInput(e.target.value);
                        }}
                        type="password"
                    ></input>
                    <input
                        className={passwordInput === '' ? 'profile-modify-input-empty' : 'profile-modify-input'}
                        placeholder="새 비밀번호"
                        onChange={(e) => {
                            onChangePassword(e.target.value);
                        }}
                        type="password"
                    ></input>
                    {passwordError ? <div className="input-error-message">영문 대/소문자,숫자,특수문자 포함 총 10자 이상 입력해주세요</div> : <div />}
                    <input
                        className={passwordCheckInput === '' ? 'profile-modify-input-empty' : 'profile-modify-input'}
                        placeholder="새 비밀번호 확인"
                        onChange={(e) => {
                            onChangePasswordCheck(e.target.value);
                        }}
                        type="password"
                    ></input>
                    {passwordCheckError ? <div className="input-error-message">비밀번호가 일치하지 않습니다</div> : <div />}
                </div>
                <div className='post-modal-button-container'>
                    <button className="post-modal-button" onClick={() => {
                        const requestBody = {
                            password: currentPasswordInput,
                            newPassword: passwordInput,
                        }
                        if(currentPasswordInput === ''){
                            Swal.fire({text: '현재 비밀번호를 입력해주세요'});
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
                        sendPatchPasswordRequest(state, memberId, requestBody, () => setOpened(false))
                    }
                    }>확인</button>
                    <button className="post-modal-button" onClick={() => {
                        setOpened(false)
                    }}>취소</button>
                </div>
            </div>
        </div>
    );
}
export default PasswordEditModal;