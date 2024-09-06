import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

const OrderPostPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>판매등록 페이지~</div>
                </div>
            </div>
        </div>
    );
}
export default OrderPostPage;