import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import { columnData, data } from '../../data/ManufacturerData';
import PostContainer from '../../components/postcontainer/PostContainer';

const BuyerItemPostPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                    <div className='manufacturer-input-container'>
                        <div className='manufacturer-input-header'>
                            <div className='manufacturer-input-text'>바이어 제품 등록</div>
                            <button className='manufacturer-input-button'>등록</button>
                        </div>
                        <PostContainer leftContent='바이어' rightContent='공급량'></PostContainer>
                        <PostContainer leftContent='제품명' leftSearch = {true} rightContent='사이즈'></PostContainer>
                        <PostContainer leftContent='제품 코드' rightContent='색상'></PostContainer>
                        <PostContainer leftContent='카테고리' rightContent='공급가'></PostContainer>
                    </div>
                    <div className='manufacturer-list-container'>
                        <div className='manufacturer-tool-container'>
                            <select>
                                <option disabled='true'>Filter By</option>
                                <option>최신순</option>
                                <option>무슨순</option>
                                <option>무슨순2</option>
                            </select>
                            <div className='manufacturer-button-container'>
                                <button className='manufacturer-button'>수정</button>
                                <button className='manufacturer-button'>삭제</button>
                            </div>
                        </div>
                        <ReactTableWithCheckbox columns={columnData} data={data}></ReactTableWithCheckbox>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
export default BuyerItemPostPage;