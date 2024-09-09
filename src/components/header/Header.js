import { useNavigate } from "react-router-dom";
import './Header.css';
import { useAuth } from "../../auth/AuthContext";

const Header = ()=> {
    const { state } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate("/")}></img>
            <div className="header-userinfo-container">
                {state.isAuthenticated ? <div className="header-welcome-text">반갑습니다. Unknown 님</div> : 
                <button className="header-login-button" onClick={() => navigate('/login')}>로그인</button>}
                {state.isAuthenticated ? <img src="icons/profile-icon.png" className="header-profile-icon"
                onClick={() => navigate('/mypage')}></img> : <div></div>}
                {state.isAuthenticated ? <img src="icons/logout-icon.png" className="header-logout-icon"></img> : <div></div>}
            </div>
        </div>
    );
}
export default Header;