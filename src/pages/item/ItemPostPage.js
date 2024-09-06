import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

const ItemPostPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>물품 정보 등록 페이지~</div>
                </div>
            </div>
        </div>
    );
}
export default ItemPostPage;