import Header from "../../components/header/Header";
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from "../../components/Table/ReactTableWithCheckbox";
import { columnData, data } from "../../data/ManufacturerData";
import PostContainer from "../../components/postcontainer/PostContainer";
import { useState } from "react";

const BuyerPostPage = () => {
    const [isLoading, setIsLoading] = useState(true);
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
                            <PostContainer leftContent='바이어 명' rightContent='담당자 연락처'></PostContainer>
                            <PostContainer leftContent='바이어 코드' rightContent='담당자 이메일'></PostContainer>
                            <PostContainer leftContent='사업자 구분' rightContent='주소'></PostContainer>
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
                            {isLoading ? <div/> : <ReactTableWithCheckbox columns={columnData} data={data}></ReactTableWithCheckbox>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BuyerPostPage;