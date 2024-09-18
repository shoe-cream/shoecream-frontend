import { useNavigate } from "react-router-dom";
import './Header.css';
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import sendGetMyInfoRequest from "../../requests/GetMyInfoRequest";
import sendLogoutRequest from '../../requests/LogoutRequest';
import { Search, User, LogOut } from 'lucide-react';  // Lucide 아이콘 import

const Header = ()=> {
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [myData, setMyData] = useState({data:{}});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        sendGetMyInfoRequest(state, setMyData, setIsLoading);
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // 검색어에 따라 해당 페이지로 이동
        if (searchTerm === '제조사') {
            navigate('/manufacturers');
        } else if (searchTerm === '고객사') {
            navigate('/buyers');
        } else if (searchTerm === '주문 승인') {
            navigate('/order-approval');
        } else {
            alert('검색 결과가 없습니다.');
        }
    };
    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate((state.isAuthenticated ? "/dashboard" : '/'))}></img>
            
            {/* ============검색창 추가 ============*/}
            <form onSubmit={handleSearchSubmit} className="header-search-form">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="header-search-input"
                />
                <button type="submit" className="header-search-button">
                <Search size={15} /> 
                </button>
            </form>

            <div className="header-userinfo-container">
                {state.isAuthenticated ? <div className="header-welcome-text">{myData.data.name} 님</div> : 
                <button className="header-login-button" onClick={() => navigate('/login')}>로그인</button>}
                {state.isAuthenticated ? 
                    <User 
                        size={20} 
                        className="header-profile-icon"
                        onClick={() => navigate('/mypage')}
                    /> : <div></div>}
                {state.isAuthenticated ? 
                    <LogOut 
                        size={20} 
                        className="header-logout-icon"
                        onClick={() => sendLogoutRequest(state, logout, navigate)}
                    /> : <div></div>}
            </div>
        </div>
    );
}

export default Header;
