import { useNavigate } from "react-router-dom";
import '../components/Header.css';

const Header = ()=> {
    const navigate = useNavigate();
    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate("/")}></img>
            <div className="header-userinfo-container">
                <div className="header-welcome-text">반갑습니다. Unknown 님</div>
                <img src="icons/profile-icon.png" className="header-profile-icon"></img>
                <img src="icons/logout-icon.png" className="header-logout-icon"></img>
            </div>
        </div>
    );
}
export default Header;