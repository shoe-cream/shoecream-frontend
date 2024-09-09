import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './ManufacturerItemPostPage.css';
import { columnData, data } from '../../data/ManufacturerData';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';

const ManufacturerItemPostPage = () => {
    const ManufacturerItemContainer = ({ leftContent, rightContent, leftSearch, rightSearch }) => {
        return (
            <div className='manufacturer-content-container'>
            <div className='manufacturer-content'>
                <div className='manufacturer-content-name'>{leftContent}</div>
                <input className='manufacturer-content-input'></input>
                {leftSearch === undefined ? <div></div> : <img className = 'item-search-button' src='icons/zoom.png'></img>}
            </div>
            <div className='manufacturer-content'>
                <div className='manufacturer-content-name'>{rightContent}</div>
                <input className='manufacturer-content-input'></input>
                {rightSearch === undefined ? <div></div> : <img className = 'item-search-button' src='icons/zoom.png'></img>}
            </div>
        </div>
        );
    }
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <div className='manufacturer-input-container'>
                            <div className='manufacturer-input-header'>
                                <div className='manufacturer-input-text'>제조사 제품 등록</div>
                                <button className='manufacturer-input-button'>등록</button>
                            </div>
                            <ManufacturerItemContainer leftContent='제조사' rightContent='공급량'></ManufacturerItemContainer>
                            <ManufacturerItemContainer leftContent='제품명' leftSearch = {true} rightContent='사이즈'></ManufacturerItemContainer>
                            <ManufacturerItemContainer leftContent='제품 코드' rightContent='색상'></ManufacturerItemContainer>
                            <ManufacturerItemContainer leftContent='카테고리' rightContent='공급가'></ManufacturerItemContainer>
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
export default ManufacturerItemPostPage;