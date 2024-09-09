import Header from "../../components/header/Header";
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from "../../components/Table/ReactTableWithCheckbox";
import { columnData, data } from "../../data/ManufacturerData";

const BuyerContent = ({ leftContent, rightContent }) => {
    return (
        <div className='manufacturer-content-container'>
            <div className='manufacturer-content'>
                <div className='manufacturer-content-name'>{leftContent}</div>
                <input className='manufacturer-content-input'></input>
            </div>
            <div className='manufacturer-content'>
                <div className='manufacturer-content-name'>{rightContent}</div>
                <input className='manufacturer-content-input'></input>
            </div>
        </div>
    );
}
const BuyerPostPage = () => {
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className="app-content-container">
                    <div className="app-background">
                        <div className='manufacturer-input-container'>
                            <div className='manufacturer-input-header'>
                                <div className='manufacturer-input-text'>바이어 정보 등록</div>
                                <button className='manufacturer-input-button'>등록</button>
                            </div>
                            <BuyerContent leftContent='바이어 명' rightContent='담당자 연락처'></BuyerContent>
                            <BuyerContent leftContent='바이어 코드' rightContent='담당자 이메일'></BuyerContent>
                            <BuyerContent leftContent='사업자 구분' rightContent='주소'></BuyerContent>
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
export default BuyerPostPage;