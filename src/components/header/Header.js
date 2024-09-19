import { useNavigate } from "react-router-dom";
import './Header.css';
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import sendGetMyInfoRequest from "../../requests/GetMyInfoRequest";
import sendLogoutRequest from '../../requests/LogoutRequest';
import { Search, User, LogOut } from 'lucide-react';  // Lucide 아이콘 import
import SearchWindow from "../search/SearchWindow";

const Header = () => {
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const [myData, setMyData] = useState({ data: {} });

    useEffect(() => {
        sendGetMyInfoRequest(state, setMyData);
    }, [state]);

    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate((state.isAuthenticated ? "/dashboard" : '/'))}></img>
            <SearchWindow
                suggestions={[
                    { key: '제조사', onSearch: () => navigate('/manufactureres') },
                    { key: '고객사', onSearch: () => navigate('/buyers') },
                    { key: '주문', onSearch: () => navigate('/orders') },
                    { key: '주문 승인', onSearch: () => navigate('/order-approval') },
                    { key: '제품', onSearch: () => navigate('/items') },
                    { key: '고객사 단가', onSearch: () => navigate('/buyer-items') },
                    { key: '제조사 단가', onSearch: () => navigate('/manufacturer-items') },
                    { key: '판매 기록', onSearch: () => navigate('/sales-history') },
                ]}
            />

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
