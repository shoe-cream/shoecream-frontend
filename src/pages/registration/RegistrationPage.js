import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './RegistrationPage.css';
import Input from '../../components/input/Input';
import { useState } from 'react';
import sendRegistrationRequest from '../../requests/RegistrationRequest';

const RegistrationPage = () => {
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordCheckInput, setPasswordCheckInput] = useState('');
    const [employeeIdInput, setEmployeeIdInput] = useState('');
    const [isEmailErrorShown, setIsEmailErrorShown] = useState(false);
    const [isPasswordErrorShown, setIsPasswordErrorShown] = useState(false);
    const [isPasswordCheckErrorShown, setIspasswordCheckErrorShown] = useState(false);
    const [isEmployeeIdErrorShown, setIsEmployeeIdErrorShown] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isEmployeeIdChecked, setIsEmployeeIdChecked] = useState(false);

    const onRegister = () => {
        if(isEmailErrorShown){
            alert('이메일을 올바르게 입력해주세요.');
            return;
        }
        if(!isEmailChecked){
            alert('이메일 중복 확인을 진행해주세요.');
            return;
        }
        if(isPasswordErrorShown){
            alert('비밀번호를 올바르게 입력해주세요.');
            return;
        }
        if(isPasswordCheckErrorShown){
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if(isEmployeeIdErrorShown){
            alert('사원번호를 올바르게 입력해주세요.');
            return;
        }
        if(!isEmployeeIdChecked){
            alert('사원번호를 인증해주세요.');
            return;
        }
        sendRegistrationRequest(emailInput, passwordInput, employeeIdInput);
    }

    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='registration-container'>
                        <img className='registration-logo' src='logo/logo-shoeCream.png'></img>
                        <Input placeholder='아이디' errorMessage='올바른 형식으로 입력해주세요' setInput={(value) => setEmailInput(value)}
                            regex='^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
                            buttonContent='중복 확인'buttonChecked={isEmailChecked} setButtonChecked={setIsEmailChecked}
                            isErrorShown={isEmailErrorShown} setIsErrorShown={(valid) => setIsEmailErrorShown(valid)}
                        ></Input>
                        <Input placeholder='비밀번호' errorMessage='영문 대/소문자,숫자,특수문자 포함 총 10자 이상 입력해주세요' setInput={(value) => setPasswordInput(value)}
                            regex='(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{10,20}'
                            isErrorShown={isPasswordErrorShown} setIsErrorShown={(valid) => setIsPasswordErrorShown(valid)}
                            opponentInput={passwordCheckInput} setIsOpponentErrorShown={(valid) => setIspasswordCheckErrorShown(valid)}
                        ></Input>
                        <Input placeholder='비밀번호 확인' errorMessage='비밀번호가 일치하지 않습니다' setInput={(value) => setPasswordCheckInput(value)}
                            isErrorShown={isPasswordCheckErrorShown} setIsErrorShown={(valid) => setIspasswordCheckErrorShown(valid)}
                            opponentInput={passwordInput}
                        ></Input>
                        <Input placeholder='사원번호' errorMessage='사원번호가 유효하지 않습니다' setInput={(value) => setEmployeeIdInput(value)}
                            buttonContent='인증' buttonChecked={isEmployeeIdChecked} setButtonChecked={setIsEmployeeIdChecked}
                            isErrorShown={isEmployeeIdErrorShown} setIsErrorShown={(valid) => setIsEmployeeIdErrorShown(valid)}
                        ></Input>
                        <button className='registration-button' onClick={() => onRegister()}>회원 가입</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegistrationPage;