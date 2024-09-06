import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

const ManufactureHistoryPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>제품 공급 내역 페이지~</div>
                </div>
            </div>
        </div>
    );
}
export default ManufactureHistoryPage;