import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

const BuyerItemPostPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>바이어 아이템 등록 페이지~</div>
                </div>
            </div>
        </div>
    );
}
export default BuyerItemPostPage;