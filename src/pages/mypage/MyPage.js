import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './MyPage.css';
import ProfileEditModal from '../../components/modal/ProfileEditModal';
import sendPatchMyInfoRequest from '../../requests/PatchMyInfoRequest';
import sendGetMyInfoRequest from '../../requests/GetMyInfoRequest';
import PasswordEditModal from '../../components/modal/PasswordEditModal';
import { useAuth } from '../../auth/AuthContext';

const EmployeeInfoCard = ({ columns, employeeData, setIsEditModalOpen, setIsPasswordEditModalOpen }) => {
    /* const keys = Object.keys(employeeData);
    const values = Object.values(employeeData); */

    // 배열을 생성하여 각 항목을 가로로 나열
    const rows = [];
    for (let i = 0; i < columns.length - 1; i += 3) {
        rows.push(
            <tr key={i}>
                <td className="mypage-column">{columns[i]}</td>
                <td className="mypage-cell">{employeeData[i]}</td>
                {columns[i + 1] && <td className="mypage-column">{columns[i + 1]}</td>}
                {employeeData[i + 1] && <td className="mypage-cell">{employeeData[i + 1]}</td>}
                {columns[i + 2] && <td className="mypage-column">{columns[i + 2]}</td>}
                {employeeData[i + 2] && <td className="mypage-cell">{employeeData[i + 2]}</td>}
            </tr>
        );
    }
    if (columns.length % 3 !== 0) {
        rows.push(
            <tr key="last-row">
                <td className="mypage-column">{columns[columns.length - 1]}</td>
                <td colSpan="5" className="mypage-cell">{employeeData[employeeData.length - 1]}</td>
            </tr>
        );
    }

    return (
        <div className="employee-info-card">
            {columns.map((column, index) => (
                <div key={index} className="info-item">
                    <div className="info-label">{column}</div>
                    <div className="info-value">{employeeData[index]}</div>
                </div>
            ))}
            <div className="button-container">
                <button className='edit-button' onClick={() => setIsEditModalOpen(true)}>수정</button>
                <button className='edit-button' onClick={() => setIsPasswordEditModalOpen(true)}>비밀번호 변경</button>
            </div>
        </div>
    );
};

const MyPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordEditModalOpen, setIsPasswordEditModalOpen] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [telInput, setTelInput] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordCheckInput, setPasswordCheckInput] = useState('');
    const [myData, setMydata] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAuth();
    const [employeeInfo, setEmployeeInfo] = useState([
        '로딩중...',
        '로딩중...',
        '로딩중...',
        '로딩중...',
        '로딩중...',
        '로딩중...',
        '로딩중...',
    ])

    useEffect(() => {
        sendGetMyInfoRequest(state, setMydata, setIsLoading, 
            (data) => setEmployeeInfo([
                data.employeeId || '데이터 없음', 
                data.name || '데이터 없음',
                data.roles[0] || '데이터 없음',
                data.tel || '데이터 없음',
                '데이터 없음',
                data.address || '데이터 없음',
            ]));
    }, []);

    const columns = [
        "사원번호",
        "성명",
        "직책",
        "휴대전화",
        "전화번호",
        "비고",
        "주소",
    ];
    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='mypage-container'>
                        <h1 className="page-title">마이 페이지</h1>
                        <EmployeeInfoCard 
                            columns={columns} 
                            employeeData={employeeInfo} 
                            setIsEditModalOpen={setIsEditModalOpen}
                            setIsPasswordEditModalOpen={setIsPasswordEditModalOpen}
                        />
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <ProfileEditModal
                    setOpened={setIsEditModalOpen}
                    inputs={[
                        { input: nameInput, setInput: setNameInput, placeholder: '성명', accessor: 'name' },
                        { input: telInput, setInput: setTelInput, placeholder: '전화번호', accessor: 'tel' },
                        { input: addressInput, setInput: setAddressInput, placeholder: '주소', accessor: 'address' },
                    ]}
                    onModify={(requestBody) => sendPatchMyInfoRequest(state, myData.data.memberId, requestBody, () => {
                        setIsEditModalOpen(false);
                        sendGetMyInfoRequest(state, setMydata, setIsLoading, 
                            (data) => setEmployeeInfo([
                                data.employeeId || '데이터 없음', 
                                data.name || '데이터 없음',
                                data.roles[0] || '데이터 없음',
                                data.tel || '데이터 없음',
                                '데이터 없음',
                                data.address || '데이터 없음',
                            ]));
                    })}
                />
            )}
            {isPasswordEditModalOpen && (
                <PasswordEditModal
                    setOpened={setIsPasswordEditModalOpen}
                    state={state}
                    memberId={myData.data.memberId}
                    onModify={(requestBody) => sendPatchMyInfoRequest(state, myData.data.memberId, requestBody, () => {
                        setIsPasswordEditModalOpen(false);
                    })}
                />
            )}
        </div>
    );
}

export default MyPage;