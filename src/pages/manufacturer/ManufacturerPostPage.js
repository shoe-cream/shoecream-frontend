import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

const ManufacturerPostPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>공급사 정보 등록 페이지~</div>
                </div>
            </div>
        </div>
    );
}
export default ManufacturerPostPage;