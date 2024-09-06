import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

const RegistrationPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>회원가입 페이지~</div>
                </div>
            </div>
        </div>
    );
}
export default RegistrationPage;