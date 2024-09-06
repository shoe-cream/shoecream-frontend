import React from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './LoginPage.css';

const LoginPage = () => {
    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='login-container'>
                        <img src='/logo/logo-shoeCream.png' alt='Logo' className='login-logo' />
                        <form className='login-form'>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    placeholder='아이디'
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    placeholder='패스워드'
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='checkbox'
                                    id='remember'
                                    name='remember'
                                />
                                <label htmlFor='remember' className='checkbox-label'>아이디 저장</label>
                            </div>
                            <button type='submit' className='login-button'>로그인</button>
                        </form>
                        <div className='login-options'>
                            <button type='button' className='option-button'>ID/PW 찾기</button>
                            <button type='button' className='option-button'>회원가입</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
