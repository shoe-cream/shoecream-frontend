import { useNavigate } from "react-router-dom";
import './Header.css';
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import sendGetMyInfoRequest from "../../requests/GetMyInfoRequest";
import sendLogoutRequest from '../../requests/LogoutRequest';

const Header = ()=> {
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [myData, setMyData] = useState({data:{}});

    useEffect(() => {
        sendGetMyInfoRequest(state, setMyData, setIsLoading);
    }, []);
    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate("/")}></img>
            <div className="header-userinfo-container">
                {state.isAuthenticated ? <div className="header-welcome-text">반갑습니다. {myData.data.name} 님</div> : 
                <button className="header-login-button" onClick={() => navigate('/login')}>로그인</button>}
                {state.isAuthenticated ? <img src="icons/profile-icon.png" className="header-profile-icon"
                onClick={() => navigate('/mypage')}></img> : <div></div>}
                {state.isAuthenticated ? 
                <img src="icons/logout-icon.png" className="header-logout-icon"
                onClick={() => sendLogoutRequest(state, logout, navigate)}
                ></img> : <div></div>}
            </div>
        </div>
    );
}
export default Header;