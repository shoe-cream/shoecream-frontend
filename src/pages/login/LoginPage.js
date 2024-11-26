import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import sendLoginRequest from '../../requests/LoginRequest';
import { useAuth } from '../../auth/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const { login } = useAuth();

    const handleLogin = () => {
        if(emailInput === ''){
            alert('이메일을 입력해주세요');
            return;
        }
        if(passwordInput === ''){
            alert('비밀번호를 입력해주세요');
            return;
        }
        sendLoginRequest(emailInput, passwordInput, navigate, login);
        }

    const onPressKey = (e) => {
        if(e.key === 'Enter'){
            handleLogin();
        }
    }

    return (
        <div>
            <div className='app-container'>
                <div className='app-content-container'>
                    <div className='login-container'>
                        <img src='/logo/logo-shoeCream.png' alt='Logo' className='login-logo' />
                        <div className='form-group'>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                placeholder='사원번호'
                                required
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={(e) => onPressKey(e)}
                            />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    placeholder='패스워드'
                                    required
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    onKeyDown={(e) => onPressKey(e)}
                                />
                            </div>
                            {/* <div className='form-group'>
                                <input
                                    type='checkbox'
                                    id='remember'
                                    name='remember'
                                />
                                <label htmlFor='remember' className='checkbox-label'>아이디 저장</label>
                            </div> */}
                            <button className='login-button'
                                onClick={handleLogin}
                            >로그인</button>
                            <div>ID: "TL001"</div>
                            <div>PW: "password"</div>
                        {/* <div className='login-options'>
                            <button type='button' className='option-button'>ID/PW 찾기</button>
                            <button type='button' className='option-button'
                            onClick={() => navigate('/registration')}>회원가입</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
