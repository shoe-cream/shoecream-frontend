import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './RegistrationPage.css';
import Input from '../../components/input/Input';

const RegistrationPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='registration-container'>
                        <img className='registration-logo' src='logo/logo-shoeCream.png'></img>
                        <Input placeholder='아이디' errorMessage='올바른 형식으로 입력해주세요'></Input>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegistrationPage;