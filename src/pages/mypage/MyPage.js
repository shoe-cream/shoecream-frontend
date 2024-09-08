import React from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './MyPage.css';

const EmployeeInfoTable = ({ employeeData }) => {
    const keys = Object.keys(employeeData);
    const values = Object.values(employeeData);

    // 배열을 생성하여 각 항목을 가로로 나열합니다.
    const rows = [];
    for (let i = 0; i < keys.length - 1; i += 3) {
        rows.push(
            <tr key={i}>
                <td className="mypage-column">{keys[i]}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{values[i]}</td>
                {keys[i + 1] && <td className="mypage-column">{keys[i + 1]}</td>}
                {values[i + 1] && <td className="py-3 px-4 text-sm text-gray-500">{values[i + 1]}</td>}
                {keys[i + 2] && <td className="mypage-column">{keys[i + 2]}</td>}
                {values[i + 2] && <td className="py-3 px-4 text-sm text-gray-500">{values[i + 2]}</td>}
            </tr>
        );
    }
    if (keys.length % 3 !== 0) {
        rows.push(
            <tr key="last-row">
                <td className="mypage-column">{keys[keys.length - 1]}</td>
                <td colSpan="6" className="py-3 px-4 text-sm text-gray-500">{values[values.length - 1]}</td>
            </tr>
        );
    }

    return (
        <div className="mypage-chart">
            <table className="w-full border-collapse">
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button className='chart-modify-button' onClick={() => alert('수정 버튼 공사중~')}>수정</button>
        </div>
    );
};

const MyPage = () => {
    const employeeInfo = {
        "사원번호": "EMP001",
        "성명": "홍길동",
        "직책": "영업사원",
        "휴대전화": "010-1234-5678",
        "전화번호": "010-1234-5678",
        "비고": '-',
        "주소": "대한민국"
      };
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>       
                <div className='app-content-container'>
                    <div className='mypage-container'>
                        <div className='profile-image-container'>
                            <img className = 'profile-image' src='picture/employee_profile.png'></img>
                            <button className='profile-upload-button' onClick={() => alert('업로드 버튼 공사중~')}>사진 업로드</button>
                        </div>
                        <EmployeeInfoTable employeeData={employeeInfo}></EmployeeInfoTable>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MyPage;